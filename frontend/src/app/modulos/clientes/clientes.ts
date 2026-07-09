import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../servicios/cliente';

@Component({
  selector: 'app-clientes',
  imports: [RouterLink, CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  cliente: any;

  constructor(private scliente: Cliente, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.scliente.consulta().subscribe({
      next: (resultado: any) => {
        this.cliente = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar clientes:', err);
      }
    });
  }
}