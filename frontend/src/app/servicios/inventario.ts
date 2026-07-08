import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Inventario {

  url = "http://localhost/sgtr/Backend/controladores/inventario.php";

  constructor(private http: HttpClient) { };

  consulta(){
    return this.http.get(`${this.url}?control=consulta`);
  }

  consultaPorProducto(id_producto: number){
    return this.http.get(`${this.url}?control=consultaPorProducto&id_producto=${id_producto}`);
  }

  consultaPorFecha(fecha_inicio: string, fecha_fin: string){
    return this.http.get(`${this.url}?control=consultaPorFecha&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`);
  }
}