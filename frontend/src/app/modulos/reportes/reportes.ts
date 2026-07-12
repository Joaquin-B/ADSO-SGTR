import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Venta } from '../../servicios/venta';

@Component({
  selector: 'app-reportes',
  imports: [RouterLink, CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {

  productosMasVendidos: any = [];
  totalIngresosTop: number = 0;

  ventasPorCategoria: any = [];
  tendenciaVentasCostos: any = [];

  periodoSeleccionado: string = 'mes';

  constructor(private sventa: Venta, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarTodo();
  }

  cambiarPeriodo(valor: string) {
    this.periodoSeleccionado = valor;
    this.cargarTodo();
  }

  cargarTodo() {
    const { inicio, fin } = this.calcularRangoFechas(this.periodoSeleccionado);
    this.cargarVentasPorCategoria(inicio, fin);
    this.cargarTendencia(inicio, fin);
    this.cargarProductosMasVendidos(inicio, fin);
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

  cargarVentasPorCategoria(inicio: string, fin: string) {
    this.sventa.ventasPorCategoria(inicio, fin).subscribe({
      next: (resultado: any) => {
        this.ventasPorCategoria = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar ventas por categoria:', err)
    });
  }

  cargarTendencia(inicio: string, fin: string) {
    this.sventa.tendenciaVentasCostos(inicio, fin).subscribe({
      next: (resultado: any) => {
        this.tendenciaVentasCostos = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar la tendencia:', err)
    });
  }

  cargarProductosMasVendidos(inicio: string, fin: string) {
    this.sventa.productosMasVendidos(5, inicio, fin).subscribe({
      next: (resultado: any) => {
        this.totalIngresosTop = resultado.reduce((acum: number, p: any) => acum + Number(p.ingresos), 0);

        this.productosMasVendidos = resultado.map((p: any) => ({
          ...p,
          participacion: this.totalIngresosTop > 0
            ? (Number(p.ingresos) / this.totalIngresosTop) * 100
            : 0
        }));

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar productos mas vendidos:', err)
    });
  }
}