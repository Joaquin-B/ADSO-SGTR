import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../servicios/producto';
import { Categoria } from '../../servicios/categoria';
import { Proveedor } from '../../servicios/proveedor';
import { Marca } from '../../servicios/marca';

@Component({
  selector: 'app-productos',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  producto: any;
  categoria: any;
  proveedor: any;
  marca: any;

  formularioVisible: boolean = false;
  modoEdicion: boolean = false;

  obj_producto: any = {
    codigo: '',
    nombre: '',
    id_categoria: '',
    precio_compra: null,
    precio_venta: null,
    stock: null,
    id_proveedor: '',
    id_marca: '',
    genero: '',
    color: '',
    material: ''
  };

  validar_codigo = true;
  validar_nombre = true;
  validar_categoria = true;
  validar_pcompra = true;
  validar_pventa = true;
  validar_stock = true;
  validar_proveedor = true;
  validar_marca = true;
  validar_genero = true;
  validar_color = true;

  constructor(
    private sproductos: Producto,
    private scategoria: Categoria,
    private sproveedor: Proveedor,
    private smarca: Marca,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consulta();
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarMarcas();
  }

  consulta() {
    this.sproductos.consulta().subscribe({
      next: (resultado: any) => {
        this.producto = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al consultar productos:', err);
      }
    });
  }

  cargarCategorias() {
    this.scategoria.consulta().subscribe({
      next: (resultado: any) => {
        this.categoria = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar categorias:', err)
    });
  }
  cargarMarcas() {
    this.smarca.consulta().subscribe({
      next: (resultado: any) => {
        this.marca = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar marcas:', err)
    });
  }

  cargarProveedores() {
    this.sproveedor.consulta().subscribe({
      next: (resultado: any) => {
        this.proveedor = resultado;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al consultar proveedores:', err)
    });
  }

  mostrarFormulario() {
    this.modoEdicion = false;
    this.limpiarFormulario();
    this.formularioVisible = true;
  }

  cancelar() {
    this.formularioVisible = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.obj_producto = {
      codigo: '',
      nombre: '',
      id_categoria: '',
      precio_compra: null,
      precio_venta: null,
      stock: null,
      id_proveedor: '',
      id_marca: '',
      genero: '',
      color: '',
      material: ''
    };
  }


  validar() {
    if (this.obj_producto.codigo == "") {
      this.validar_codigo = false;
    } else {
      this.validar_codigo = true;
    }

    if (this.obj_producto.nombre == "") {
      this.validar_nombre = false;
    } else {
      this.validar_nombre = true;
    }

    if (this.obj_producto.id_categoria == "") {
      this.validar_categoria = false;
    } else {
      this.validar_categoria = true;
    }

    if (this.obj_producto.precio_compra == null) {
      this.validar_pcompra = false;
    } else {
      this.validar_pcompra = true;
    }

    if (this.obj_producto.precio_venta == null) {
      this.validar_pventa = false;
    } else {
      this.validar_pventa = true;
    }

    if (this.obj_producto.stock == null) {
      this.validar_stock = false;
    } else {
      this.validar_stock = true;
    }

    if (this.obj_producto.id_proveedor == "") {
      this.validar_proveedor = false;
    } else {
      this.validar_proveedor = true;
    }

    if (this.obj_producto.id_marca == "") {
      this.validar_marca = false;
    } else {
      this.validar_marca = true;
    }

    if (this.obj_producto.genero == "") {
      this.validar_genero = false;
    } else {
      this.validar_genero = true;
    }

    if (this.obj_producto.color == "") {
      this.validar_color = false;
    } else {
      this.validar_color = true;
    }

    if(this.validar_categoria==true && this.validar_codigo==true && this.validar_color==true && this.validar_genero==true && this.validar_marca==true && this.validar_nombre== true 
      && this.validar_pcompra==true && this.validar_proveedor==true && this.validar_pventa==true && this.validar_pventa==true && this.validar_stock==true)
      {
          this.guardar();
      }


  }

  guardar() {
    this.sproductos.insertar(this.obj_producto).subscribe((datos: any) => {
      if(datos[`resultado`]==`OK`){
        this.consulta();
      }
    });

     this.formularioVisible = false;
     this.limpiarFormulario();

  }
}