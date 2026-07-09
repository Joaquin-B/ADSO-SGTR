import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Producto } from '../../servicios/producto';
import { Cliente } from '../../servicios/cliente';
import { Venta } from '../../servicios/venta';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  @ViewChild('ventasMensualesChart') ventasMensualesRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ventasCategoriaChart') ventasCategoriaRef!: ElementRef<HTMLCanvasElement>;

  totalProductos: number = 0;
  totalClientes: number = 0;
  ventasDelMes: number = 0;
  ordenesHoy: number = 0;
  productosStockBajo: any = [];

  listaVentas: any = [];
  

  constructor(
    private sproducto: Producto,
    private scliente: Cliente,
    private sventa: Venta,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  this.cargarProductos();
  this.cargarClientes();
  this.cargarVentas();
  this.cargarStockBajo();
  this.cargarVentasPorCategoria(); 
}

  cargarProductos() {
    this.sproducto.consulta().subscribe({
      next: (resultado: any) => {
        this.totalProductos = resultado.length;
       
        this.cdr.detectChanges();
        this.cargarVentasPorCategoria();
      },
      error: (err) => console.error('Error al consultar productos:', err)
    });
  }

  cargarClientes() {
    this.scliente.consulta().subscribe({
      next: (resultado: any) => {
        this.totalClientes = resultado.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar clientes:', err)
    });
  }

  cargarVentas() {
    this.sventa.consulta().subscribe({
      next: (resultado: any) => {
        this.listaVentas = resultado;

        const hoy = new Date().toISOString().split('T')[0];
        const mesActual = hoy.substring(0, 7);

        this.ventasDelMes = resultado
          .filter((v: any) => v.fecha && v.fecha.startsWith(mesActual))
          .reduce((acum: number, v: any) => acum + Number(v.total), 0);

        this.ordenesHoy = resultado
          .filter((v: any) => v.fecha && v.fecha.startsWith(hoy)).length;

        this.cdr.detectChanges();
        this.graficarVentasMensuales();
      },
      error: (err) => console.error('Error al consultar ventas:', err)
    });
  }

  cargarStockBajo() {
    this.sproducto.productosStockBajo(10).subscribe({
      next: (resultado: any) => {
        this.productosStockBajo = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar stock bajo:', err)
    });
  }

  graficarVentasMensuales() {
    // Agrupamos el total vendido por mes (formato 'YYYY-MM')
    const totalesPorMes: { [mes: string]: number } = {};

    this.listaVentas.forEach((v: any) => {
      if (!v.fecha) return;
      const mes = v.fecha.substring(0, 7); // 'YYYY-MM'
      totalesPorMes[mes] = (totalesPorMes[mes] || 0) + Number(v.total);
    });

    const meses = Object.keys(totalesPorMes).sort();
    const totales = meses.map(m => totalesPorMes[m]);

    new Chart(this.ventasMensualesRef.nativeElement, {
      type: 'line',
      data: {
        labels: meses,
        datasets: [{
          label: 'Ventas',
          data: totales,
          borderColor: '#4f7df9',
          backgroundColor: 'rgba(79, 125, 249, 0.15)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

  cargarVentasPorCategoria() {
    this.sventa.ventasPorCategoria().subscribe({
      next: (resultado: any) => {
        const categorias = resultado.map((r: any) => r.categoria);
        const totales = resultado.map((r: any) => Number(r.total));

        new Chart(this.ventasCategoriaRef.nativeElement, {
          type: 'doughnut',
          data: {
            labels: categorias,
            datasets: [{
              data: totales,
              backgroundColor: ['#4f7df9', '#22c55e', '#a855f7', '#f97316', '#ef4444', '#14b8a6']
            }]
          },
          options: {
            responsive: true
          }
        });
      },
      error: (err) => console.error('Error al consultar ventas por categoria:', err)
    });
  }
}