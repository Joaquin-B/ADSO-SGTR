import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Venta } from '../../servicios/venta';
import { Cliente } from '../../servicios/cliente';
import { Usuario } from '../../servicios/usuario';
import { Producto } from '../../servicios/producto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas implements OnInit {
  venta: any;
  cliente: any = [];
  nombreVendedor: string = '';
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

  // Propiedades para las tarjetas
  ventasHoyTotal: number = 0;
  ventasHoyCount: number = 0;
  ventasMesTotal: number = 0;
  ticketPromedio: number = 0;
  ventasCanceladas: number = 0;
  terminoBusqueda: string = '';
  filtroEstado: string = 'Todos';
  ventaFiltrada: any = [];

  constructor(
    private sventa: Venta,
    private scliente: Cliente,
    private susuario: Usuario,
    private sproducto: Producto,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consulta();
    this.nombreVendedor = sessionStorage.getItem('nombres') + ' ' + sessionStorage.getItem('apellidos');
    this.cargarClientes();
    this.cargarProductos();
  }

  consulta() {
    this.sventa.consulta().subscribe({
      next: (resultado: any) => {
        this.venta = resultado;
        this.ventaFiltrada = resultado;
        this.calcularKPIs(resultado);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar ventas:', err)
    });
  }

  buscarVenta() {
    this.aplicarFiltros();
  }

  filtrarPorEstado(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    this.ventaFiltrada = this.venta.filter((v: any) => {
      const coincideTermino = termino == '' ||
        v.numero_venta.toLowerCase().includes(termino) ||
        v.nombre_cliente.toLowerCase().includes(termino);

      const coincideEstado = this.filtroEstado == 'Todos' || v.estado == this.filtroEstado;

      return coincideTermino && coincideEstado;
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

    this.ventasCanceladas = ventas.filter((v: any) =>
      v.estado === 'Cancelada' && v.fecha && v.fecha.startsWith(mesActual)
    ).length;
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
      id_usuario: sessionStorage.getItem('id'),
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

    if (this.validar_cliente == true && this.validar_usuario == true
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


  verDetalle(item: any) {
    this.sventa.obtenerDetalleVenta(item.id_venta).subscribe((detalle: any) => {
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
        <strong>N° Venta:</strong> ${item.numero_venta}<br>
        <strong>Cliente:</strong> ${item.nombre_cliente}<br>
        <strong>Vendedor:</strong> ${item.nombre_usuario}<br>
        <strong>Fecha:</strong> ${item.fecha}<br>
        <strong>Método de pago:</strong> ${item.metodo_pago}
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
        <div>Subtotal: ${this.formatearMoneda(item.subtotal)}</div>
        <div>Descuento: ${this.formatearMoneda(item.descuento)}</div>
        <div><strong>Total: ${this.formatearMoneda(item.total)}</strong></div>
      </div>
    `;

      Swal.fire({
        title: 'Detalle de la venta',
        html: html,
        width: 500,
        confirmButtonText: 'Cerrar'
      });
    });
  }

  formatearMoneda(valor: any): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(valor));
  }

  imprimirVenta(item: any) {
    this.sventa.obtenerDetalleVenta(item.id_venta).subscribe((detalle: any) => {
      let filasHtml = '';
      detalle.forEach((linea: any) => {
        filasHtml += `
        <tr>
          <td>${linea.nombre_producto}</td>
          <td style="text-align:center;">${linea.cantidad}</td>
          <td style="text-align:right;">${this.formatearMoneda(linea.precio_unitario)}</td>
          <td style="text-align:right;">${this.formatearMoneda(linea.subtotal)}</td>
        </tr>`;
      });

      const contenido = `
      <html>
      <head>
        <title>Recibo ${item.numero_venta}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 6px; border-bottom: 1px solid #ddd; font-size: 13px; }
          th { text-align: left; background: #f4f4f4; }
          .totales { text-align: right; margin-top: 15px; font-size: 14px; }
        </style>
      </head>
      <body>
        <h2>SGTR - Recibo de Venta</h2>
        <p><strong>N° Venta:</strong> ${item.numero_venta}</p>
        <p><strong>Cliente:</strong> ${item.nombre_cliente}</p>
        <p><strong>Vendedor:</strong> ${item.nombre_usuario}</p>
        <p><strong>Fecha:</strong> ${item.fecha}</p>
        <p><strong>Método de pago:</strong> ${item.metodo_pago}</p>

        <table>
          <thead>
            <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
          </thead>
          <tbody>${filasHtml}</tbody>
        </table>

        <div class="totales">
          <p>Subtotal: ${this.formatearMoneda(item.subtotal)}</p>
          <p>Descuento: ${this.formatearMoneda(item.descuento)}</p>
          <p><strong>Total: ${this.formatearMoneda(item.total)}</strong></p>
        </div>
      </body>
      </html>
    `;

      const ventana = window.open('', '_blank', 'width=600,height=700');
      if (ventana) {
        ventana.document.write(contenido);
        ventana.document.close();
        ventana.focus();
        ventana.print();
      }
    });
  }


  cancelarVenta(id: number) {
    Swal.fire({
      title: "¿Está seguro de cancelar esta venta?",
      text: "Esto devolverá el stock que se había descontado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar venta",
      cancelButtonText: "Volver"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sventa.cancelar(id).subscribe((datos: any) => {
          if (datos['resultado'] == 'Ok') {
            this.consulta();
            Swal.fire({ title: "Venta cancelada!", icon: "success" });
          } else if (datos['resultado'] == 'Error') {
            Swal.fire({ title: "Error", text: datos['mensaje'], icon: "error" });
          }
        });
      }
    });
  }
}