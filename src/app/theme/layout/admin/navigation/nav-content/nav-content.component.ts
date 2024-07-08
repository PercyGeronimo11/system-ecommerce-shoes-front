// angular import
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { AuthService } from '../../../../../components/auth/service/auth.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // public pops
  navigations: NavigationItem[];
  wrapperWidth!: number;
  windowWidth: number;

  @Output() NavMobCollapse = new EventEmitter();
  // constructor
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private authService: AuthService
  ) {
    this.windowWidth = window.innerWidth;
    this.navigations = NavigationItems;
  }

  // life cycle event
  ngOnInit() {
    const role = this.authService.getRole();
    this.navigations = NavigationItems.map(group => ({
      ...group,
      children: group.children?.filter(item => this.shouldShowItem(item, role))
    }));
    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
    }
  }

  shouldShowItem(item: NavigationItem, role: string | null): boolean {
    if (item.id === 'user' && role !== 'Administrador') {
      return false;
    }
    return true;
  }

  // public method

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.NavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }


}
