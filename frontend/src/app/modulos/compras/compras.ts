import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Compra } from '../../servicios/compra';
import { Proveedor } from '../../servicios/proveedor';
import { Usuario } from '../../servicios/usuario';
import { Producto } from '../../servicios/producto';

@Component({
  selector: 'app-compras',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras implements OnInit {
  compra: any;
  proveedor: any = [];
  usuario: any = [];
  producto: any = [];

  formularioVisible: boolean = false;

  terminoBusqueda: string = '';
  compraFiltrada: any = [];

  obj_compra: any = {
   
    id_proveedor: '',
    id_usuario: '',
    detalle: []
  };

 
  validar_proveedor = true;
  validar_usuario = true;
  validar_detalle = true;

  constructor(
    private scompra: Compra,
    private sproveedor: Proveedor,
    private susuario: Usuario,
    private sproducto: Producto,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consulta();
    this.cargarProveedores();
    this.cargarUsuarios();
    this.cargarProductos();
  }

  consulta() {
    this.scompra.consulta().subscribe({
      next: (resultado: any) => {
        this.compra = resultado;
        this.compraFiltrada = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar compras:', err)
    });
  }

  buscarCompra() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino == '') {
      this.compraFiltrada = this.compra;
    } else {
      this.compraFiltrada = this.compra.filter((c: any) =>
        c.numero_compra.toLowerCase().includes(termino) ||
        c.nombre_proveedor.toLowerCase().includes(termino)
      );
    }
  }

  cargarProveedores() {
    this.sproveedor.consulta().subscribe({
      next: (resultado: any) => {
        this.proveedor = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar proveedores:', err)
    });
  }

  cargarUsuarios() {
    this.susuario.consulta().subscribe({
      next: (resultado: any) => {
        this.usuario = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar usuarios:', err)
    });
  }

  cargarProductos() {
    this.sproducto.consulta().subscribe({
      next: (resultado: any) => {
        this.producto = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar productos:', err)
    });
  }

  mostrarFormulario() {
    this.limpiarFormulario();
    this.formularioVisible = true;
  }

  cancelar() {
    this.formularioVisible = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.obj_compra = {
     
      id_proveedor: '',
      id_usuario: '',
      detalle: [
        { id_producto: '', cantidad: null, precio_unitario: null }
      ]
    };
  }

  agregarLinea() {
    this.obj_compra.detalle.push({ id_producto: '', cantidad: null, precio_unitario: null });
  }

  quitarLinea(index: number) {
    this.obj_compra.detalle.splice(index, 1);
    if (this.obj_compra.detalle.length === 0) {
      this.agregarLinea();
    }
  }

  // Autocompleta con el precio de COMPRA del producto (no el de venta)
  autocompletarPrecio(linea: any) {
    const productoSeleccionado = this.producto.find(
      (p: any) => p.id_producto == linea.id_producto
    );
    if (productoSeleccionado) {
      linea.precio_unitario = Number(productoSeleccionado.precio_compra);
    }
  }

  calcularSubtotalLinea(linea: any): number {
    const cantidad = Number(linea.cantidad) || 0;
    const precio = Number(linea.precio_unitario) || 0;
    return cantidad * precio;
  }

  calcularTotal(): number {
    return this.obj_compra.detalle.reduce(
      (acum: number, linea: any) => acum + this.calcularSubtotalLinea(linea), 0
    );
  }

  validar() {
   

    if (this.obj_compra.id_proveedor == "") {
      this.validar_proveedor = false;
    } else {
      this.validar_proveedor = true;
    }

    if (this.obj_compra.id_usuario == "") {
      this.validar_usuario = false;
    } else {
      this.validar_usuario = true;
    }

    const detalleValido = this.obj_compra.detalle.some(
      (linea: any) => linea.id_producto != "" && linea.cantidad > 0
    );

    if (!detalleValido) {
      this.validar_detalle = false;
    } else {
      this.validar_detalle = true;
    }

    if (this.validar_proveedor == true
      && this.validar_usuario == true && this.validar_detalle == true) {
      this.guardar();
    }
  }

  guardar() {
    const detalleFiltrado = this.obj_compra.detalle.filter(
      (linea: any) => linea.id_producto != "" && linea.cantidad > 0
    );

    const paramsEnviar = {
      numero_compra: this.obj_compra.numero_compra,
      id_proveedor: this.obj_compra.id_proveedor,
      id_usuario: this.obj_compra.id_usuario,
      total: this.calcularTotal(),
      detalle: detalleFiltrado
    };

    this.scompra.insertar(paramsEnviar).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        this.consulta();
      } else if (datos['resultado'] == 'Error') {
        alert(datos['mensaje']);
      }
    });

    this.formularioVisible = false;
    this.limpiarFormulario();
  }
}