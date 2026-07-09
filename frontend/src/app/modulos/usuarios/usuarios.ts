import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../servicios/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink, CommonModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
 usuario: any;


  constructor(private sUsuario: Usuario, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.sUsuario.consulta().subscribe({
      next: (resultado: any) => {
        this.usuario = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar usuarios:', err);
      }
    });


  }
}
