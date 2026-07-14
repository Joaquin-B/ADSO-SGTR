import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../../servicios/proveedor';

@Component({
  selector: 'app-proveedores',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores implements OnInit {
  proveedor: any;

  formularioVisible: boolean = false;
  modoEdicion: boolean = false;

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
    this.modoEdicion = false;
    this.limpiarFormulario();
    this.formularioVisible = true;
  }

  cancelar() {
    this.formularioVisible = false;
    this.limpiarFormulario();
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

  validar() {
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

    if (this.validar_nombre == true && this.validar_nit == true && this.validar_telefono == true) {
      this.guardar();
    }
  }

  guardar() {
    this.sproveedor.insertar(this.obj_proveedor).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        this.consulta();
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
}