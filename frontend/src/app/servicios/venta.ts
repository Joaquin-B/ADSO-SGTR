import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Venta {

  url = "http://localhost/sgtr/Backend/controladores/venta.php";

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

  obtenerDetalleVenta(id: number) {
    return this.http.get(`${this.url}?control=obtenerDetalleVenta&id=${id}`);
  }

  productosMasVendidos(limite: number = 5, fecha_inicio?: string, fecha_fin?: string) {
    let url = `${this.url}?control=productosMasVendidos&limite=${limite}`;
    if (fecha_inicio && fecha_fin) {
      url += `&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
    }
    return this.http.get(url);
  }

  tendenciaVentasCostos(fecha_inicio?: string, fecha_fin?: string) {
    let url = `${this.url}?control=tendenciaVentasCostos`;
    if (fecha_inicio && fecha_fin) {
      url += `&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
    }
    return this.http.get(url);
  }

  ventasPorCategoria(fecha_inicio?: string, fecha_fin?: string) {
    let url = `${this.url}?control=ventasPorCategoria`;
    if (fecha_inicio && fecha_fin) {
      url += `&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
    }
    return this.http.get(url);
  }
}