import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../servicios/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  imports: [RouterLink, CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  producto: any;

  constructor(private sproductos: Producto, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.sproductos.consulta().subscribe({
      next: (resultado: any) => {
        this.producto = resultado;
        this.cdr.detectChanges(); // <- forzamos deteccion de cambios manualmente
      },
      error: (err) => {
        console.error('Error al consultar productos:', err);
      }
    });
  }
}