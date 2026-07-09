import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Proveedor } from '../../servicios/proveedor';

@Component({
  selector: 'app-proveedores',
  imports: [RouterLink, CommonModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores implements OnInit {
  proveedor: any;

  constructor(private sproveedor: Proveedor, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.sproveedor.consulta().subscribe({
      next: (resultado: any) => {
        this.proveedor = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar proveedores:', err);
      }
    });
  }
}