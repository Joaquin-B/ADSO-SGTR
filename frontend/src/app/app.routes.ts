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

export const routes: Routes = [
    {
        path: '', component: Main, 
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'productos', component: Productos },
            { path: 'clientes', component: Clientes },
            { path: 'usuarios', component: Usuarios },
            { path: 'proveedores', component: Proveedores },
            { path: 'reportes', component: Reportes },
            { path: 'ventas', component: Ventas },
            { path: 'configuracion', component: Configuracion },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    {
        path: 'login', component: Login
    }
];
