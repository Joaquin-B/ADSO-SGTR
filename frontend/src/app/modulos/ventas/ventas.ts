import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Venta } from '../../servicios/venta';

@Component({
  selector: 'app-ventas',
  imports: [RouterLink, CommonModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas implements OnInit {
  venta: any;

  constructor(private sventa: Venta, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.sventa.consulta().subscribe({
      next: (resultado: any) => {
        this.venta = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar ventas:', err);
      }
    });
  }
}