import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Compra {

  url = "http://localhost/sgtr/Backend/controladores/compra.php";

  constructor(private http: HttpClient) { };

  consulta(){
    return this.http.get(`${this.url}?control=consulta`);
  }

  buscarPorId(id: number){
    return this.http.get(`${this.url}?control=buscarPorId&id=${id}`);
  }

  insertar(params: any){
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params));
  }

  editar(id: number, params: any){
    return this.http.post(`${this.url}?control=editar&id=${id}`, JSON.stringify(params));
  }

  eliminar(id: number){
    return this.http.get(`${this.url}?control=eliminar&id=${id}`);
  }

  obtenerDetalleCompra(id: number){
    return this.http.get(`${this.url}?control=obtenerDetalleCompra&id=${id}`);
  }

  consultaPorUsuario(id_usuario: number){
    return this.http.get(`${this.url}?control=consultaPorUsuario&id_usuario=${id_usuario}`);
  }
}
