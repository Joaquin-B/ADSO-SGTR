import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  nombre: any;
  apellido: any;
  rol: any;

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem("nombres");
    this.apellido = sessionStorage.getItem("apellidos")
    this.rol = sessionStorage.getItem("rol");
  }

}
