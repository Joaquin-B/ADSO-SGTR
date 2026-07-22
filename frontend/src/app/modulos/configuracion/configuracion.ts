import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionServicio } from '../../servicios/configuracion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {

  obj_config: any = {
    nombre_tienda: '',
    nit: '',
    email: '',
    telefono: '',
    direccion: '',
    moneda: 'COP',
    iva: 19
  };

  constructor(private sconfig: ConfiguracionServicio, private cdr: ChangeDetectorRef) { }

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
}