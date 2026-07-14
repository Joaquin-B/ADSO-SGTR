import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Venta } from '../../servicios/venta';
import { Cliente } from '../../servicios/cliente';
import { Usuario } from '../../servicios/usuario';
import { Producto } from '../../servicios/producto';

@Component({
  selector: 'app-ventas',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas implements OnInit {
  venta: any;
  cliente: any = [];
  usuario: any = [];
  producto: any = [];

  formularioVisible: boolean = false;

  obj_venta: any = {
    
    id_cliente: '',
    id_usuario: '',
    metodo_pago: '',
    descuento: 0,
    detalle: []
  };

  
  validar_cliente = true;
  validar_usuario = true;
  validar_metodo_pago = true;
  validar_detalle = true;

  // Propiedades para las tarjetas KPI
  ventasHoyTotal: number = 0;
  ventasHoyCount: number = 0;
  ventasMesTotal: number = 0;
  ticketPromedio: number = 0;
  ventasCanceladas: number = 0;

  constructor(
    private sventa: Venta,
    private scliente: Cliente,
    private susuario: Usuario,
    private sproducto: Producto,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consulta();
    this.cargarClientes();
    this.cargarUsuarios();
    this.cargarProductos();
  }

  consulta() {
    this.sventa.consulta().subscribe({
      next: (resultado: any) => {
        this.venta = resultado;
        this.calcularKPIs(resultado);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar ventas:', err)
    });
  }

  calcularKPIs(ventas: any[]) {
    const hoy = new Date().toISOString().split('T')[0];
    const mesActual = hoy.substring(0, 7);

    const ventasCompletadas = ventas.filter((v: any) => v.estado === 'Completada');

    const ventasDeHoy = ventasCompletadas.filter((v: any) => v.fecha && v.fecha.startsWith(hoy));
    this.ventasHoyTotal = ventasDeHoy.reduce((acum: number, v: any) => acum + Number(v.total), 0);
    this.ventasHoyCount = ventasDeHoy.length;

    const ventasDelMes = ventasCompletadas.filter((v: any) => v.fecha && v.fecha.startsWith(mesActual));
    this.ventasMesTotal = ventasDelMes.reduce((acum: number, v: any) => acum + Number(v.total), 0);

    this.ticketPromedio = ventasCompletadas.length > 0
      ? ventasCompletadas.reduce((acum: number, v: any) => acum + Number(v.total), 0) / ventasCompletadas.length
      : 0;

    this.ventasCanceladas = ventas.filter((v: any) => v.estado === 'Cancelada').length;
  }

  cargarClientes() {
    this.scliente.consulta().subscribe({
      next: (resultado: any) => {
        this.cliente = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar clientes:', err)
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
    this.obj_venta = {
      numero_venta: '',
      id_cliente: '',
      id_usuario: '',
      metodo_pago: '',
      descuento: 0,
      detalle: [
        { id_producto: '', cantidad: null, precio_unitario: null }
      ]
    };
  }

  agregarLinea() {
    this.obj_venta.detalle.push({ id_producto: '', cantidad: null, precio_unitario: null });
  }

  quitarLinea(index: number) {
    this.obj_venta.detalle.splice(index, 1);
    if (this.obj_venta.detalle.length === 0) {
      this.agregarLinea();
    }
  }

  autocompletarPrecio(linea: any) {
    const productoSeleccionado = this.producto.find(
      (p: any) => p.id_producto == linea.id_producto
    );
    if (productoSeleccionado) {
      linea.precio_unitario = Number(productoSeleccionado.precio_venta);
    }
  }

  calcularSubtotalLinea(linea: any): number {
    const cantidad = Number(linea.cantidad) || 0;
    const precio = Number(linea.precio_unitario) || 0;
    return cantidad * precio;
  }

  calcularSubtotalTotal(): number {
    return this.obj_venta.detalle.reduce(
      (acum: number, linea: any) => acum + this.calcularSubtotalLinea(linea), 0
    );
  }

  validar() {
   

    if (this.obj_venta.id_cliente == "") {
      this.validar_cliente = false;
    } else {
      this.validar_cliente = true;
    }

    if (this.obj_venta.id_usuario == "") {
      this.validar_usuario = false;
    } else {
      this.validar_usuario = true;
    }

    if (this.obj_venta.metodo_pago == "") {
      this.validar_metodo_pago = false;
    } else {
      this.validar_metodo_pago = true;
    }

    const detalleValido = this.obj_venta.detalle.some(
      (linea: any) => linea.id_producto != "" && linea.cantidad > 0
    );

    if (!detalleValido) {
      this.validar_detalle = false;
    } else {
      this.validar_detalle = true;
    }

    if ( this.validar_cliente == true && this.validar_usuario == true
      && this.validar_metodo_pago == true && this.validar_detalle == true) {
      this.guardar();
    }
  }

  guardar() {
    const detalleFiltrado = this.obj_venta.detalle.filter(
      (linea: any) => linea.id_producto != "" && linea.cantidad > 0
    );

    const paramsEnviar = {
      numero_venta: this.obj_venta.numero_venta,
      id_cliente: this.obj_venta.id_cliente,
      id_usuario: this.obj_venta.id_usuario,
      metodo_pago: this.obj_venta.metodo_pago,
      descuento: this.obj_venta.descuento || 0,
      detalle: detalleFiltrado
    };

    this.sventa.insertar(paramsEnviar).subscribe((datos: any) => {
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