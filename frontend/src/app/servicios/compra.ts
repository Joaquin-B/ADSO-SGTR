import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Compra {

  url = "http://localhost/sgtr/Backend/controladores/compra.php";

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

  obtenerDetalleCompra(id: number) {
    return this.http.get(`${this.url}?control=obtenerDetalleCompra&id=${id}`);
  }

  consultaPorUsuario(id_usuario: number) {
    return this.http.get(`${this.url}?control=consultaPorUsuario&id_usuario=${id_usuario}`);
  }

  cancelar(id: number) {
    return this.http.get(`${this.url}?control=cancelar&id=${id}`);
  }

  comprasPorCategoria(fecha_inicio?: string, fecha_fin?: string) {
    let url = `${this.url}?control=comprasPorCategoria`;
    if (fecha_inicio && fecha_fin) {
      url += `&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
    }
    return this.http.get(url);
  }

  tendenciaCompras(fecha_inicio?: string, fecha_fin?: string) {
    let url = `${this.url}?control=tendenciaCompras`;
    if (fecha_inicio && fecha_fin) {
      url += `&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
    }
    return this.http.get(url);
  }

  productosMasComprados(limite: number = 5, fecha_inicio?: string, fecha_fin?: string) {
    let url = `${this.url}?control=productosMasComprados&limite=${limite}`;
    if (fecha_inicio && fecha_fin) {
      url += `&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
    }
    return this.http.get(url);
  }
}
