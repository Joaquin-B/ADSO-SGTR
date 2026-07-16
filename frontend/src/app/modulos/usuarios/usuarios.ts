import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../servicios/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuario: any;

  formularioVisible: boolean = false;
  id_usuario: any;


  obj_usuario: any = {
    nombres: '',
    apellidos: '',
    tipo_documento: '',
    numero_documento: '',
    telefono: '',
    email: '',
    contrasena: '',
    rol: ''
  };

  botones_form = false;
  validar_nombres = true;
  validar_apellidos = true;
  validar_tipo_documento = true;
  validar_numero_documento = true;
  validar_email = true;
  validar_contrasena = true;
  validar_rol = true;
  terminoBusqueda: string = '';
  usuarioFiltrado: any = [];

  constructor(private susuario: Usuario, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.susuario.consulta().subscribe({
      next: (resultado: any) => {
        this.usuario = resultado;
        this.usuarioFiltrado = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar usuarios:', err);
      }
    });
  }

  mostrarFormulario() {

    this.limpiarFormulario();
    this.formularioVisible = true;
    this.botones_form = false;
  }

  cancelar() {
    this.formularioVisible = false;
    this.limpiarFormulario();
    this.botones_form = false;
  }

  limpiarFormulario() {
    this.obj_usuario = {
      nombres: '',
      apellidos: '',
      tipo_documento: '',
      numero_documento: '',
      telefono: '',
      email: '',
      contrasena: '',
      rol: ''
    };
  }

  validar(funcion: any) {
    if (this.obj_usuario.nombres == "") {
      this.validar_nombres = false;
    } else {
      this.validar_nombres = true;
    }

    if (this.obj_usuario.apellidos == "") {
      this.validar_apellidos = false;
    } else {
      this.validar_apellidos = true;
    }

    if (this.obj_usuario.tipo_documento == "") {
      this.validar_tipo_documento = false;
    } else {
      this.validar_tipo_documento = true;
    }

    if (this.obj_usuario.numero_documento == "") {
      this.validar_numero_documento = false;
    } else {
      this.validar_numero_documento = true;
    }

    if (this.obj_usuario.email == "") {
      this.validar_email = false;
    } else {
      this.validar_email = true;
    }

    // La contraseña solo es obligatoria al insertar, no al editar
    if (this.botones_form == false && this.obj_usuario.contrasena == "") {
      this.validar_contrasena = false;
    } else {
      this.validar_contrasena = true;
    }

    if (this.obj_usuario.rol == "") {
      this.validar_rol = false;
    } else {
      this.validar_rol = true;
    }

    if (this.validar_nombres == true && this.validar_apellidos == true && this.validar_tipo_documento == true
      && this.validar_numero_documento == true && this.validar_email == true && this.validar_contrasena == true
      && this.validar_rol == true && funcion == "guardar") {
      this.guardar();
    }

    if (this.validar_nombres == true && this.validar_apellidos == true && this.validar_tipo_documento == true
      && this.validar_numero_documento == true && this.validar_email == true && this.validar_contrasena == true
      && this.validar_rol == true && funcion == "editar") {
      this.editar();
    }
  }

  guardar() {
    this.susuario.insertar(this.obj_usuario).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        this.consulta();
      } else if (datos['resultado'] == 'Error') {
        alert(datos['mensaje']);
      }
    });

    this.formularioVisible = false;
    this.limpiarFormulario();
    
  }

  cargar_datos(items: any, id: number) {
    this.obj_usuario = {
      nombres: items.nombres,
      apellidos: items.apellidos,
      tipo_documento: items.tipo_documento,
      numero_documento: items.numero_documento,
      telefono: items.telefono,
      email: items.email,
      contrasena: '',
      rol: items.rol
    };

    this.id_usuario = id;

    this.botones_form = true;
    this.formularioVisible = true;
  }

  buscarUsuario() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino == '') {
      this.usuarioFiltrado = this.usuario;
    } else {
      this.usuarioFiltrado = this.usuario.filter((u: any) =>
        u.nombres.toLowerCase().includes(termino) ||
        u.rol.toLowerCase().includes(termino)
      );
    }
  }

  eliminar(id: number) {
    Swal.fire({
      title: "¿Está seguro de eliminar el usuario?",
      text: "El proceso no podrá ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.susuario.eliminar(id).subscribe((datos: any) => {
          if (datos['resultado'] == 'Ok') {
            this.consulta();
          }
        });

        Swal.fire({
          title: "Usuario eliminado!",
          text: "El usuario ha sido eliminado.",
          icon: "success"
        });
      }
    });
  }

  editar() {
    this.susuario.editar(this.id_usuario, this.obj_usuario).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        this.consulta();
      } else if (datos['resultado'] == 'Error') {
        alert(datos['mensaje']);
      }
    });

    this.formularioVisible = false;
    this.limpiarFormulario();
  }
}