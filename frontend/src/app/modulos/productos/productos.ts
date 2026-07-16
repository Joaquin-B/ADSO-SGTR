import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../servicios/producto';
import { Categoria } from '../../servicios/categoria';
import { Proveedor } from '../../servicios/proveedor';
import { Marca } from '../../servicios/marca';
import Swal from 'sweetalert2';

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
  id_producto: any;

  formularioVisible: boolean = false;
  modoEdicion: boolean = false;

  obj_producto = {
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
  terminoBusqueda: string = '';
  productoFiltrado: any = [];
  botones_form = false;

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
        this.productoFiltrado = resultado; // <- arranca igual al completo
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
    this.botones_form = false;
  }

  cancelar() {
    this.formularioVisible = false;
    this.limpiarFormulario();
    this.botones_form = false;
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


  validar(funcion: any) {
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

    if (this.validar_categoria == true && this.validar_codigo == true && this.validar_color == true && this.validar_genero == true && this.validar_marca == true && this.validar_nombre == true
      && this.validar_pcompra == true && this.validar_proveedor == true && this.validar_pventa == true && this.validar_pventa == true && this.validar_stock == true && funcion == "guardar") {
      this.guardar();
    }

    if (this.validar_categoria == true && this.validar_codigo == true && this.validar_color == true && this.validar_genero == true && this.validar_marca == true && this.validar_nombre == true
      && this.validar_pcompra == true && this.validar_proveedor == true && this.validar_pventa == true && this.validar_pventa == true && this.validar_stock == true && funcion == "editar") {
      this.editar();
    }

  }

  buscarProducto() {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    if (termino == '') {
      this.productoFiltrado = this.producto;
    } else {
      this.productoFiltrado = this.producto.filter((p: any) =>
        p.codigo.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
      );
    }
  }

  guardar() {
    this.sproductos.insertar(this.obj_producto).subscribe((datos: any) => {
      if (datos['resultado'] == 'Ok') {
        this.consulta();
      } else if (datos['resultado'] == 'Error') {
        alert(datos['mensaje']);
      }
    });

    this.formularioVisible = false;
    this.limpiarFormulario();
  }

  eliminar(id: number) {
    Swal.fire({
      title: "¿Esta seguro de eliminar el producto?",
      text: "El proceso no podra ser revertido!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        /////////////////////////////////
        this.sproductos.eliminar(id).subscribe((datos: any) => {
          if (datos['resultado'] == 'Ok') {
            this.consulta();
          }
        })
        ////////////////////////////////    

        Swal.fire({
          title: "Producto eliminado!",
          text: "El producto ha sido eliminado.",
          icon: "success"
        });
      }
    });






  }

  cargar_datos(items: any, id: number) {


    this.obj_producto = {
      codigo: items.codigo,
      nombre: items.nombre,
      id_categoria: items.id_categoria,
      precio_compra: items.precio_compra,
      precio_venta: items.precio_venta,
      stock: items.stock,
      id_proveedor: items.id_proveedor,
      id_marca: items.id_marca,
      genero: items.genero,
      color: items.color,
      material: items.material
    };

    this.id_producto = id;

    this.botones_form = true;
    this.formularioVisible = true;
  }

  editar() {
    this.sproductos.editar(this.id_producto, this.obj_producto).subscribe((datos: any) => {
      if (datos['resultado'] == "Ok") {
        this.consulta();
      }
    });

    this.formularioVisible = false;
    this.limpiarFormulario();
  }

}