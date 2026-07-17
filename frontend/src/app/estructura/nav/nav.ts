import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  nombre: any;
  apellido: any;
  rol: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem("nombres");
    this.apellido = sessionStorage.getItem("apellidos");
    this.rol = sessionStorage.getItem("rol");
  }

  cerrar() {
    Swal.fire({
      title: "¿Desea cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem("id", "");
        sessionStorage.setItem("email", "");
        sessionStorage.setItem("nombres", "");
        sessionStorage.removeItem("apellidos");
        sessionStorage.setItem("rol", "");

        this.router.navigate(['login']);
      }
    });
  }
}