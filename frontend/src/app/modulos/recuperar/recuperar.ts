import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../servicios/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css',
})
export class Recuperar {

  email: string = '';
  nueva_contrasena: string = '';
  confirmar_contrasena: string = '';

  validar_email = true;
  validar_contrasena = true;
  validar_confirmar = true;

  constructor(private susuario: Usuario, private router: Router) { }

  validar() {
    if (this.email == "") {
      this.validar_email = false;
    } else {
      this.validar_email = true;
    }

    if (this.nueva_contrasena == "") {
      this.validar_contrasena = false;
    } else {
      this.validar_contrasena = true;
    }

    if (this.confirmar_contrasena == "" || this.confirmar_contrasena != this.nueva_contrasena) {
      this.validar_confirmar = false;
    } else {
      this.validar_confirmar = true;
    }

    if (this.validar_email == true && this.validar_contrasena == true && this.validar_confirmar == true) {
      this.actualizar();
    }
  }

  actualizar() {
    this.susuario.recuperarPassword(this.email, this.nueva_contrasena).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        Swal.fire({
          title: "¡Contraseña actualizada!",
          text: "Ya puedes iniciar sesión con tu nueva contraseña.",
          icon: "success"
        }).then(() => {
          this.router.navigate(['login']);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: datos['mensaje'],
          icon: "error"
        });
      }
    });
  }
}