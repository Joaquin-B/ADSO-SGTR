import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-nav',
  imports: [RouterModule], // 👈 sin esto, nav.html no puede usar routerLink
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav { }