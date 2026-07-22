import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionServicio {

  url = "http://localhost/sgtr/Backend/controladores/configuracion.php";

  constructor(private http: HttpClient) { };

  consulta(){
    return this.http.get(`${this.url}?control=consulta`);
  }

  editar(params: any){
    return this.http.post(`${this.url}?control=editar`, JSON.stringify(params));
  }
}