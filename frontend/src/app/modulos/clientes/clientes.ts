import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../servicios/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  cliente: any;
  id_cliente: any;

  formularioVisible: boolean = false;


  obj_cliente: any = {
    identificacion: '',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: ''
  };

  validar_identificacion = true;
  validar_nombre = true;
  validar_telefono = true;
  terminoBusqueda: string = '';
  clienteFiltrado: any = [];
  botones_form = false;

  constructor(private scliente: Cliente, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.scliente.consulta().subscribe({
      next: (resultado: any) => {
        this.cliente = resultado;
        this.clienteFiltrado = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar clientes:', err);
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
    this.obj_cliente = {
      identificacion: '',
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      ciudad: ''
    };
  }

  validar(funcion: any) {
    if (this.obj_cliente.identificacion == "") {
      this.validar_identificacion = false;
    } else {
      this.validar_identificacion = true;
    }

    if (this.obj_cliente.nombre == "") {
      this.validar_nombre = false;
    } else {
      this.validar_nombre = true;
    }

    if (this.validar_identificacion == true && this.validar_nombre == true && funcion == "guardar") {
      this.guardar();
    }

    if (this.validar_identificacion == true && this.validar_nombre == true && funcion == "editar") {
      this.editar();
    }
  }

  guardar() {
    this.scliente.insertar(this.obj_cliente).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        this.consulta();
      } else if (datos['resultado'] == 'Error') {
        alert(datos['mensaje']);
      }
    });

    this.formularioVisible = false;
    this.limpiarFormulario();
  }

  buscarCliente() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino == '') {
      this.clienteFiltrado = this.cliente;
    } else {
      this.clienteFiltrado = this.cliente.filter((c: any) =>
        c.nombre.toLowerCase().includes(termino)
      );
    }
  }

  eliminar(id: number) {
    Swal.fire({
      title: "¿Está seguro de eliminar el cliente?",
      text: "El proceso no podrá ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.scliente.eliminar(id).subscribe((datos: any) => {
          if (datos['resultado'] = "Ok") {
            this.consulta();
          }
        });

        Swal.fire({
          title: "Cliente eliminado!",
          text: "El cliente ha sido eliminado.",
          icon: "success"
        });
      }
    });
  }


  cargar_datos(items: any, id: number) {
    this.obj_cliente = {
      identificacion: items.identificacion,
      nombre: items.nombre,
      telefono: items.telefono,
      email: items.email,
      direccion: items.direccion,
      ciudad: items.ciudad
    };

    this.id_cliente = id;

    this.botones_form = true;
    this.formularioVisible = true;
  }

  editar() {
    this.scliente.editar(this.id_cliente, this.obj_cliente).subscribe((datos: any) => {
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