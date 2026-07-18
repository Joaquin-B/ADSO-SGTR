import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Venta } from '../../servicios/venta';
import { Compra } from '../../servicios/compra';

@Component({
  selector: 'app-reportes',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {

  tipoReporte: string = 'ventas';
  periodoSeleccionado: string = 'mes';

  ventasPorCategoria: any = [];
  tendenciaVentasCostos: any = [];
  productosMasVendidos: any = [];
  totalIngresosTop: number = 0;

  comprasPorCategoria: any = [];
  tendenciaCompras: any = [];
  productosMasComprados: any = [];
  totalGastosTop: number = 0;

  // Guardamos la suscripcion activa de cada consulta para poder cancelarla
  private subVentasCategoria?: Subscription;
  private subTendenciaVentas?: Subscription;
  private subProductosVendidos?: Subscription;
  private subComprasCategoria?: Subscription;
  private subTendenciaCompras?: Subscription;
  private subProductosComprados?: Subscription;

  constructor(private sventa: Venta, private scompra: Compra, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarTodo();
  }

  cambiarTipoReporte(tipo: string) {
    this.tipoReporte = tipo;
    this.cargarTodo();
  }

  cambiarPeriodo(valor: string) {
    this.periodoSeleccionado = valor;
    this.cargarTodo();
  }

  cargarTodo() {
    const { inicio, fin } = this.calcularRangoFechas(this.periodoSeleccionado);

    if (this.tipoReporte == 'ventas') {
      this.cargarVentasPorCategoria(inicio, fin);
      this.cargarTendenciaVentas(inicio, fin);
      this.cargarProductosMasVendidos(inicio, fin);
    } else if (this.tipoReporte == 'compras') {
      this.cargarComprasPorCategoria(inicio, fin);
      this.cargarTendenciaCompras(inicio, fin);
      this.cargarProductosMasComprados(inicio, fin);
    }
  }

  calcularRangoFechas(periodo: string): { inicio: string, fin: string } {
    const ahora = new Date();
    let inicio = new Date();

    switch (periodo) {
      case 'hoy':
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        break;
      case 'semana':
        inicio = new Date(ahora);
        inicio.setDate(ahora.getDate() - 7);
        break;
      case 'mes':
        inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        break;
      case 'anio':
        inicio = new Date(ahora.getFullYear(), 0, 1);
        break;
    }

    const fin = new Date(ahora);
    fin.setHours(23, 59, 59);

    return {
      inicio: this.formatearFecha(inicio) + ' 00:00:00',
      fin: this.formatearFecha(fin) + ' 23:59:59'
    };
  }

  formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // ---------- VENTAS ----------

  cargarVentasPorCategoria(inicio: string, fin: string) {
    this.subVentasCategoria?.unsubscribe(); // cancela la peticion anterior si seguia pendiente
    this.subVentasCategoria = this.sventa.ventasPorCategoria(inicio, fin).subscribe({
      next: (resultado: any) => {
        this.ventasPorCategoria = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar ventas por categoria:', err)
    });
  }

  cargarTendenciaVentas(inicio: string, fin: string) {
    this.subTendenciaVentas?.unsubscribe();
    this.subTendenciaVentas = this.sventa.tendenciaVentasCostos(inicio, fin).subscribe({
      next: (resultado: any) => {
        this.tendenciaVentasCostos = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar la tendencia:', err)
    });
  }

  cargarProductosMasVendidos(inicio: string, fin: string) {
    this.subProductosVendidos?.unsubscribe();
    this.subProductosVendidos = this.sventa.productosMasVendidos(5, inicio, fin).subscribe({
      next: (resultado: any) => {
        this.totalIngresosTop = resultado.reduce((acum: number, p: any) => acum + Number(p.ingresos), 0);

        this.productosMasVendidos = resultado.map((p: any) => ({
          ...p,
          participacion: this.totalIngresosTop > 0 ? (Number(p.ingresos) / this.totalIngresosTop) * 100 : 0
        }));

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar productos mas vendidos:', err)
    });
  }

  // ---------- COMPRAS ----------

  cargarComprasPorCategoria(inicio: string, fin: string) {
    this.subComprasCategoria?.unsubscribe();
    this.subComprasCategoria = this.scompra.comprasPorCategoria(inicio, fin).subscribe({
      next: (resultado: any) => {
        this.comprasPorCategoria = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar compras por categoria:', err)
    });
  }

  cargarTendenciaCompras(inicio: string, fin: string) {
    this.subTendenciaCompras?.unsubscribe();
    this.subTendenciaCompras = this.scompra.tendenciaCompras(inicio, fin).subscribe({
      next: (resultado: any) => {
        this.tendenciaCompras = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar la tendencia de compras:', err)
    });
  }

  cargarProductosMasComprados(inicio: string, fin: string) {
    this.subProductosComprados?.unsubscribe();
    this.subProductosComprados = this.scompra.productosMasComprados(5, inicio, fin).subscribe({
      next: (resultado: any) => {
        this.totalGastosTop = resultado.reduce((acum: number, p: any) => acum + Number(p.gastos), 0);

        this.productosMasComprados = resultado.map((p: any) => ({
          ...p,
          participacion: this.totalGastosTop > 0 ? (Number(p.gastos) / this.totalGastosTop) * 100 : 0
        }));

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar productos mas comprados:', err)
    });
  }
}