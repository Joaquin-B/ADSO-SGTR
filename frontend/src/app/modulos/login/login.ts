import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Loginservicio } from '../../servicios/login';
import { Dashboard } from '../dashboard/dashboard';


@Component({
  selector: 'app-login',
  imports: [ RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: any;
  contrasena: any;
  error = false;
  usuario:any;
  
  user ={
    nombres: "",
    apellidos: "",
    tipo_documento: "",
    numero_documento: "",
    telefono: "",
    email: "",
    contraseña: "",
    rol: ""

  };


  constructor(private slogin: Loginservicio, private router: Router){}

  ngOnInit(): void{
    sessionStorage.setItem("id","");
    sessionStorage.setItem("email","");
    sessionStorage.setItem("nombres","");
    sessionStorage.setItem("apellidos","");
    sessionStorage.setItem("rol","");

  }

  consulta(tecla: any){
    if(tecla == 13 || tecla == ""){
      this.slogin.consulta(this.email, this.contrasena).subscribe((resultado:any) =>{
        this.usuario = resultado;
      

        if(this.usuario[0].validar=="valida"){
          sessionStorage.setItem("id", this.usuario[0]['id_usuario'])
          sessionStorage.setItem("email", this.usuario[0]['email'])
          sessionStorage.setItem("nombres", this.usuario[0]['nombres'])
          sessionStorage.setItem("apellidos", this.usuario[0]['apellidos'])
          sessionStorage.setItem("rol", this.usuario[0]['rol'])

          this.router.navigate(['dashboard']);


        }else{
          console.log("No entro")
          this.error = true;
        }


      })
    }
  }



}
