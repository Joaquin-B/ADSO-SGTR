import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Usuario {

  url = "http://localhost/sgtr/Backend/controladores/usuario.php";
 
  constructor(private http: HttpClient) { };

  consulta() {
    return this.http.get(`${this.url}?control=consulta`);
  }

  buscarPorId(id: number) {
    return this.http.get(`${this.url}?control=buscarPorId&id=${id}`);
  }

  insertar(params: any) {
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params));
  }

  editar(id: number, params: any) {
    return this.http.post(`${this.url}?control=editar&id=${id}`, JSON.stringify(params));
  }

  eliminar(id: number) {
    return this.http.get(`${this.url}?control=eliminar&id=${id}`);
  }

  cambiarPassword(id: number, params: any) {
    return this.http.post(`${this.url}?control=cambiarPassword&id=${id}`, JSON.stringify(params));
  }

  recuperarPassword(email: string, nueva_contrasena: string) {
    return this.http.post(`${this.url}?control=recuperarPassword`, JSON.stringify({ email, nueva_contrasena }));
  }
}
