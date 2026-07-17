import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loginservicio } from '../../servicios/login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: any;
  contrasena: any;
  error = false;
  usuario: any;

  validar_email = true;
  validar_contrasena = true;

  constructor(private slogin: Loginservicio, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    sessionStorage.setItem("id", "");
    sessionStorage.setItem("email", "");
    sessionStorage.setItem("nombres", "");
    sessionStorage.setItem("apellidos", "");
    sessionStorage.setItem("rol", "");
  }

  consulta(tecla: any) {
    if (tecla == 13 || tecla == "") {

      if (this.email == "" || this.email == undefined) {
        this.validar_email = false;
      } else {
        this.validar_email = true;
      }

      if (this.contrasena == "" || this.contrasena == undefined) {
        this.validar_contrasena = false;
      } else {
        this.validar_contrasena = true;
      }

      if (this.validar_email == false || this.validar_contrasena == false) {
        return;
      }

      this.error = false;

      this.slogin.consulta(this.email, this.contrasena).subscribe((resultado: any) => {
        this.usuario = resultado;

        if (this.usuario[0].validar == "valida") {
          sessionStorage.setItem("id", this.usuario[0]['id_usuario'])
          sessionStorage.setItem("email", this.usuario[0]['email'])
          sessionStorage.setItem("nombres", this.usuario[0]['nombres'])
          sessionStorage.setItem("apellidos", this.usuario[0]['apellidos'])
          sessionStorage.setItem("rol", this.usuario[0]['rol'])

          Swal.fire({
            title: `¡Bienvenido, ${this.usuario[0]['nombres']}!`,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['dashboard']);
          });

        } else {
          this.error = true;
        }

        this.cdr.detectChanges();
      });
    }
  }
}