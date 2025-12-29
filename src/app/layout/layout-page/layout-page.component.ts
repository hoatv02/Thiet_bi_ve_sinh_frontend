import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgClass],
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {
  isHome = true;

  constructor(private router: Router) {
  }
}
