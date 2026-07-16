import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../../servicios/proveedor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores implements OnInit {
  proveedor: any;
  id_proveedor: any;


  formularioVisible = false;


  obj_proveedor: any = {
    nombre: '',
    nit: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: ''
  };

  validar_nombre = true;
  validar_nit = true;
  validar_telefono = true;
  terminoBusqueda: string = '';
  proveedorFiltrado: any = [];
  botones_form = false;

  constructor(private sproveedor: Proveedor, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.sproveedor.consulta().subscribe({
      next: (resultado: any) => {
        this.proveedor = resultado;
        this.proveedorFiltrado = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar proveedores:', err);
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
    this.obj_proveedor = {
      nombre: '',
      nit: '',
      telefono: '',
      email: '',
      direccion: '',
      ciudad: ''
    };
  }

  validar(funcion: any) {
    if (this.obj_proveedor.nombre == "") {
      this.validar_nombre = false;
    } else {
      this.validar_nombre = true;
    }

    if (this.obj_proveedor.nit == "") {
      this.validar_nit = false;
    } else {
      this.validar_nit = true;
    }

    if (this.obj_proveedor.telefono == "") {
      this.validar_telefono = false;
    } else {
      this.validar_telefono = true;
    }

    if (this.validar_nombre == true && this.validar_nit == true && this.validar_telefono == true && funcion == "guardar") {
      this.guardar();
    }

    if (this.validar_nombre == true && this.validar_nit == true && this.validar_telefono == true && funcion == "editar") {
      this.editar();
    }
  }

  guardar() {
    this.sproveedor.insertar(this.obj_proveedor).subscribe((datos: any) => {
      if (datos['resultado'] = "Ok") {
        this.consulta();
      } else if (datos['resultado'] == 'Error') {
        alert(datos['mensaje']);
      }
    });

    this.formularioVisible = false;
    this.limpiarFormulario();
  }

  buscarProveedor() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino == '') {
      this.proveedorFiltrado = this.proveedor;
    } else {
      this.proveedorFiltrado = this.proveedor.filter((p: any) =>
        p.nombre.toLowerCase().includes(termino)
      );
    }
  }

  cargar_datos(items: any, id: number) {
    this.obj_proveedor = {
      nombre: items.nombre,
      nit: items.nit,
      telefono: items.telefono,
      email: items.email,
      direccion: items.direccion,
      ciudad: items.ciudad
    };

    this.id_proveedor = id;

    this.botones_form = true;
    this.formularioVisible = true;
  }

  eliminar(id: number) {
    Swal.fire({
      title: "¿Está seguro de eliminar el proveedor?",
      text: "El proceso no podrá ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.sproveedor.eliminar(id).subscribe((datos: any) => {
          if (datos['resultado'] == 'Ok') {
            this.consulta();
          }
        });

        Swal.fire({
          title: "Proveedor eliminado!",
          text: "El proveedor ha sido eliminado.",
          icon: "success"
        });
      }
    });
  }

  editar() {
    this.sproveedor.editar(this.id_proveedor, this.obj_proveedor).subscribe((datos: any) => {
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