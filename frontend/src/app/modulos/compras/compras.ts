import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Compra } from '../../servicios/compra';
import { Proveedor } from '../../servicios/proveedor';
import { Usuario } from '../../servicios/usuario';
import { Producto } from '../../servicios/producto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras implements OnInit {
  compra: any;
  proveedor: any = [];
  nombreUsuario: string = '';
  producto: any = [];

  formularioVisible: boolean = false;

  terminoBusqueda: string = '';
  filtroEstado: string = 'Todos';
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
    this.nombreUsuario = sessionStorage.getItem('nombres') + ' ' + sessionStorage.getItem('apellidos');
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

  cargarProveedores() {
    this.sproveedor.consulta().subscribe({
      next: (resultado: any) => {
        this.proveedor = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar proveedores:', err)
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
      id_usuario: sessionStorage.getItem('id'),
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

    const detalleValido = this.obj_compra.detalle.some(
      (linea: any) => linea.id_producto != "" && linea.cantidad > 0
    );

    if (!detalleValido) {
      this.validar_detalle = false;
    } else {
      this.validar_detalle = true;
    }

    if (this.validar_proveedor == true && this.validar_usuario == true && this.validar_detalle == true) {
      this.guardar();
    }
  }

  guardar() {
    const detalleFiltrado = this.obj_compra.detalle.filter(
      (linea: any) => linea.id_producto != "" && linea.cantidad > 0
    );

    const paramsEnviar = {
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

  buscarCompra() {
    this.aplicarFiltros();
  }

  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    this.compraFiltrada = this.compra.filter((c: any) => {
      const coincideTermino = termino == '' ||
        c.numero_compra.toLowerCase().includes(termino) ||
        c.nombre_proveedor.toLowerCase().includes(termino);

      const coincideEstado = this.filtroEstado == 'Todos' || c.estado == this.filtroEstado;

      return coincideTermino && coincideEstado;
    });
  }

  formatearMoneda(valor: any): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(valor));
  }

  verDetalle(item: any) {
    this.scompra.obtenerDetalleCompra(item.id_compra).subscribe((detalle: any) => {
      let filasHtml = '';
      detalle.forEach((linea: any) => {
        filasHtml += `
          <tr>
            <td style="text-align:left;">${linea.nombre_producto}</td>
            <td>${linea.cantidad}</td>
            <td>${this.formatearMoneda(linea.precio_unitario)}</td>
            <td>${this.formatearMoneda(linea.subtotal)}</td>
          </tr>`;
      });

      const html = `
        <div style="text-align:left; font-size:14px; margin-bottom:10px;">
          <strong>N° Compra:</strong> ${item.numero_compra}<br>
          <strong>Proveedor:</strong> ${item.nombre_proveedor}<br>
          <strong>Usuario:</strong> ${item.nombre_usuario}<br>
          <strong>Fecha:</strong> ${item.fecha}
        </div>
        <table style="width:100%; font-size:13px; border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #ccc;">
              <th style="text-align:left;">Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>${filasHtml}</tbody>
        </table>
        <div style="text-align:right; margin-top:10px; font-size:14px;">
          <div><strong>Total: ${this.formatearMoneda(item.total)}</strong></div>
        </div>
      `;

      Swal.fire({
        title: 'Detalle de la compra',
        html: html,
        width: 500,
        confirmButtonText: 'Cerrar'
      });
    });
  }

  cancelarCompra(id: number) {
    Swal.fire({
      title: "¿Está seguro de cancelar esta compra?",
      text: "Esto revertirá el stock que se había sumado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar compra",
      cancelButtonText: "Volver"
    }).then((result) => {
      if (result.isConfirmed) {
        this.scompra.cancelar(id).subscribe((datos: any) => {
          if (datos['resultado'] == 'Ok') {
            this.consulta();
            Swal.fire({ title: "Compra cancelada!", icon: "success" });
          } else if (datos['resultado'] == 'Error') {
            Swal.fire({ title: "Error", text: datos['mensaje'], icon: "error" });
          }
        });
      }
    });
  }
}