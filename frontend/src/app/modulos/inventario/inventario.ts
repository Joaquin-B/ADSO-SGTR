import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventario as InventarioServicio } from '../../servicios/inventario';
import { Producto } from '../../servicios/producto';

@Component({
  selector: 'app-inventario',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {
  movimiento: any = [];
  producto: any = [];

  filtroProducto: string = '';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';

  constructor(
    private sinventario: InventarioServicio,
    private sproducto: Producto,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consulta();
    this.cargarProductos();
  }

  consulta() {
    this.sinventario.consulta().subscribe({
      next: (resultado: any) => {
        this.movimiento = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar movimientos:', err)
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

  filtrarPorProducto() {
    if (this.filtroProducto == '') {
      this.consulta();
      return;
    }
    this.sinventario.consultaPorProducto(Number(this.filtroProducto)).subscribe({
      next: (resultado: any) => {
        this.movimiento = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al filtrar por producto:', err)
    });
  }

  filtrarPorFecha() {
    if (this.filtroFechaInicio == '' || this.filtroFechaFin == '') {
      alert('Selecciona ambas fechas para filtrar');
      return;
    }
    const inicio = this.filtroFechaInicio + ' 00:00:00';
    const fin = this.filtroFechaFin + ' 23:59:59';

    this.sinventario.consultaPorFecha(inicio, fin).subscribe({
      next: (resultado: any) => {
        this.movimiento = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al filtrar por fecha:', err)
    });
  }

  limpiarFiltros() {
    this.filtroProducto = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.consulta();
  }
}