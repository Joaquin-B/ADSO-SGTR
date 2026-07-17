import { Routes } from '@angular/router';
import { Main } from './estructura/main';
import { Dashboard } from './modulos/dashboard/dashboard';
import { Productos } from './modulos/productos/productos';
import { Clientes } from './modulos/clientes/clientes';
import { Usuarios } from './modulos/usuarios/usuarios';
import { Proveedores } from './modulos/proveedores/proveedores';
import { Reportes } from './modulos/reportes/reportes';
import { Login } from './modulos/login/login';
import { Ventas } from './modulos/ventas/ventas';
import { Configuracion } from './modulos/configuracion/configuracion';
import { Inventario } from './modulos/inventario/inventario';
import { Compras } from './modulos/compras/compras';
import { NoEncontro } from './modulos/no-encontro/no-encontro';
import { validaruserGuard } from './guard/validaruser-guard';

export const routes: Routes = [
    {
        path: '', component: Main, 
        children: [
            { path: 'dashboard', component: Dashboard, canActivate:[validaruserGuard] },
            { path: 'productos', component: Productos, canActivate:[validaruserGuard] },
            { path: 'clientes', component: Clientes, canActivate:[validaruserGuard] },
            { path: 'usuarios', component: Usuarios, canActivate:[validaruserGuard] },
            { path: 'proveedores', component: Proveedores, canActivate:[validaruserGuard] },
            { path: 'reportes', component: Reportes, canActivate:[validaruserGuard] },
            { path: 'ventas', component: Ventas, canActivate:[validaruserGuard] },
            { path: 'configuracion', component: Configuracion, canActivate:[validaruserGuard] },
            { path: 'inventario', component: Inventario, canActivate:[validaruserGuard] },
            { path: 'compras', component: Compras, canActivate:[validaruserGuard] },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    {  path: 'login', component: Login  },
    { path: "**", component: NoEncontro}
];
