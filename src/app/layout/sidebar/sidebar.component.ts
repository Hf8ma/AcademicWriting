import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isDashboardRoute = true;
  constructor(private router: Router) {
    this.isDashboardRoute = this.router.url && this.router.url.includes('dashboard') ? true : false;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        this.isDashboardRoute = event.url && event.url.includes('dashboard') ? true : false;
      }
    });
  }

}
