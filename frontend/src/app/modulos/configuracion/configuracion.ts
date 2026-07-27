import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionServicio } from '../../servicios/configuracion';
import { Usuario } from '../../servicios/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {

  contrasena_actual: string = '';
  contrasena_nueva: string = '';
  contrasena_confirmar: string = '';

  validar_contrasena_actual = true;
  validar_contrasena_nueva = true;
  validar_contrasena_confirmar = true;



  obj_config: any = {
    nombre_tienda: '',
    nit: '',
    email: '',
    telefono: '',
    direccion: '',
    moneda: 'COP',
    iva: 19
  };

  constructor(
    private sconfig: ConfiguracionServicio,
    private susuario: Usuario,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.sconfig.consulta().subscribe({
      next: (resultado: any) => {
        this.obj_config = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar la configuracion:', err)
    });
  }

  guardar() {
    this.sconfig.editar(this.obj_config).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        Swal.fire({ title: "Cambios guardados!", icon: "success" });
      }
    });
  }

  cancelar() {
    this.consulta(); // vuelve a traer los datos originales, descartando cambios no guardados
  }

  validarCambioPassword() {
    if (this.contrasena_actual == "") {
      this.validar_contrasena_actual = false;
    } else {
      this.validar_contrasena_actual = true;
    }

    if (this.contrasena_nueva == "") {
      this.validar_contrasena_nueva = false;
    } else {
      this.validar_contrasena_nueva = true;
    }

    if (this.contrasena_confirmar == "" || this.contrasena_confirmar != this.contrasena_nueva) {
      this.validar_contrasena_confirmar = false;
    } else {
      this.validar_contrasena_confirmar = true;
    }

    if (this.validar_contrasena_actual == true && this.validar_contrasena_nueva == true && this.validar_contrasena_confirmar == true) {
      this.cambiarPassword();
    }
  }


  cambiarPassword() {
    const id = Number(sessionStorage.getItem('id'));

    const params = {
      contrasena_actual: this.contrasena_actual,
      contrasena_nueva: this.contrasena_nueva
    };

    this.susuario.cambiarPassword(id, params).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        Swal.fire({ title: "¡Contraseña actualizada!", icon: "success" });
        this.contrasena_actual = '';
        this.contrasena_nueva = '';
        this.contrasena_confirmar = '';
      } else if (datos['resultado'] == 'Error') {
        Swal.fire({ title: "Error", text: datos['mensaje'], icon: "error" });
      }
    });
  }
}