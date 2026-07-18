import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  totalProductos: number = 0;
  totalClientes: number = 0;
  ventasDelMes: number = 0;
  ordenesHoy: number = 0;
  productosStockBajo: any = [];

  ventasMensuales: any = [];
  ventasPorCategoria: any = [];

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
      const hoy = new Date().toISOString().split('T')[0];
      const mesActual = hoy.substring(0, 7);

      // Solo contamos ventas completadas, no las canceladas
      const ventasCompletadas = resultado.filter((v: any) => v.estado === 'Completada');

      this.ventasDelMes = ventasCompletadas
        .filter((v: any) => v.fecha && v.fecha.startsWith(mesActual))
        .reduce((acum: number, v: any) => acum + Number(v.total), 0);

      this.ordenesHoy = ventasCompletadas
        .filter((v: any) => v.fecha && v.fecha.startsWith(hoy)).length;

      const totalesPorMes: { [mes: string]: number } = {};
      ventasCompletadas.forEach((v: any) => {
        if (!v.fecha) return;
        const mes = v.fecha.substring(0, 7);
        totalesPorMes[mes] = (totalesPorMes[mes] || 0) + Number(v.total);
      });

      this.ventasMensuales = Object.keys(totalesPorMes).sort().map(mes => ({ mes, total: totalesPorMes[mes] }));

      this.cdr.detectChanges();
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

  cargarVentasPorCategoria() {
    this.sventa.ventasPorCategoria().subscribe({
      next: (resultado: any) => {
        this.ventasPorCategoria = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar ventas por categoria:', err)
    });
  }
}