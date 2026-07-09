import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Venta } from '../../servicios/venta';

@Component({
  selector: 'app-reportes',
  imports: [RouterLink, CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {

  @ViewChild('ventasPorCategoriaBarChart') categoriaRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tendenciaVentasCostosChart') tendenciaRef!: ElementRef<HTMLCanvasElement>;

  productosMasVendidos: any = [];
  totalIngresosTop: number = 0;

  constructor(private sventa: Venta, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarVentasPorCategoria();
    this.cargarTendencia();
    this.cargarProductosMasVendidos();
  }

  cargarVentasPorCategoria() {
    this.sventa.ventasPorCategoria().subscribe({
      next: (resultado: any) => {
        const categorias = resultado.map((r: any) => r.categoria);
        const totales = resultado.map((r: any) => Number(r.total));

        new Chart(this.categoriaRef.nativeElement, {
          type: 'bar',
          data: {
            labels: categorias,
            datasets: [{
              label: 'Ventas',
              data: totales,
              backgroundColor: '#4f7df9'
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } }
          }
        });
      },
      error: (err) => console.error('Error al consultar ventas por categoria:', err)
    });
  }

  cargarTendencia() {
    this.sventa.tendenciaVentasCostos().subscribe({
      next: (resultado: any) => {
        const meses = resultado.map((r: any) => r.mes);
        const ventas = resultado.map((r: any) => Number(r.ventas));
        const costos = resultado.map((r: any) => Number(r.costos));

        new Chart(this.tendenciaRef.nativeElement, {
          type: 'line',
          data: {
            labels: meses,
            datasets: [
              {
                label: 'Ventas',
                data: ventas,
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Costos',
                data: costos,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                fill: true,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true
          }
        });
      },
      error: (err) => console.error('Error al consultar la tendencia:', err)
    });
  }

  cargarProductosMasVendidos() {
    this.sventa.productosMasVendidos(5).subscribe({
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