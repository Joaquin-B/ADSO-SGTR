import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Loginservicio {

   url = "http://localhost/sgtr/Backend/controladores/login.php";

  constructor(private http: HttpClient){};

   consulta(email: any, contraseña: any){
    
    return this.http.get(`${this.url}?email=${email}&contraseña=${contraseña}`);
  }

}