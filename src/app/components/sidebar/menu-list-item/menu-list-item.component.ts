import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavItem } from '../../interfaces/nav-item';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Globals } from '../../../global';
import { tick } from '@angular/core/testing';
import { NavService } from '../nav-service';
@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {

  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService,
    public router: Router, private globals: Globals) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {
    this.item.selected = false;
    this.navService.currentUrl.subscribe((url: string) => {
      if (this.item.path && url) {
        url = decodeURIComponent(url);
        if (this.item.route != undefined) {
          this.expanded = url.indexOf(`${this.item.route}`) === 1;
          this.item.selected = url == `/${this.item.route}/home` || url == `/${this.item.route}`;
        }
        else {
          if (url.indexOf(`${this.item.category}`) > 0 && url.indexOf(`${this.item.path}`) > 0) {
            this.expanded = true;
            var tempUrl = url.replace(`/${this.item.category}/`, '');
            this.item.selected = tempUrl == this.item.path;
          }
          else {
            this.expanded = false;
          }
        }
        this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });
  }

  onItemSelected(item: NavItem) {
    //item.selected = true;
    if (item.category == "all") {
      this.router.navigateByUrl('/total');
      return;
    }
    if (item.category == "deleted") {
      this.router.navigateByUrl('/trash');
      return;
    }
    this.globals.gl_currentPath = item.path;
    localStorage.setItem('current_album_title', item.displayName);
    this.router.navigate([item.category, item.path]);
    // if (!item.children || !item.children.length) {
    //   this.router.navigate([item.route]);
    //   this.navService.closeNav();
    // }
  }

  onIconSelected(item: NavItem) {
    // if (!item.children || !item.children.length) {
    //   this.router.navigate([item.route]);
    //   this.navService.closeNav();
    // }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
