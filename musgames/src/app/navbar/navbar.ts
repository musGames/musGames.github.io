import { Component, OnDestroy, OnInit, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Logout } from '../logout/logout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, Logout],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  displayName = '';
  isMinimized = false;
  isMobileOpen = false;
  isMobile = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkScreenWidth();

    const sub = this.firebaseService.currentDisplayName$.subscribe(name => {
      this.displayName = name;
      this.changeDetectorRef.detectChanges();
    });
    this.subscriptions.push(sub);

    this.firebaseService.getAuthStateListener(async user => {
      this.isLoggedIn = !!user;
      this.changeDetectorRef.detectChanges();

      if (user) {
        await this.firebaseService.refreshDisplayName(user.uid);
        this.changeDetectorRef.detectChanges();

        this.firebaseService.checkIfAdmin(user.uid)
          .then(adminStatus => {
            this.isAdmin = adminStatus;
            this.changeDetectorRef.detectChanges();
          })
          .catch(() => {
            this.isAdmin = false;
            this.changeDetectorRef.detectChanges();
          });

        try {
          const userData = await this.firebaseService.getUserbyUID(user.uid);

          if (userData?.theme) {
            const bg = userData.theme.backgroundColor;
            const nav = userData.theme.navbarColor;

            if (bg) {
              document.body.style.backgroundColor = bg;
            }

            if (nav) {
              const navEl = document.querySelector('.Navbar') as HTMLElement | null;

              if (navEl) {
                navEl.style.backgroundColor = nav;
              }
            }
          }

          this.changeDetectorRef.detectChanges();

        } catch (err) {
          console.error('Error applying theme:', err);
          this.changeDetectorRef.detectChanges();
        }

      } else {
        this.isAdmin = false;
        this.displayName = '';
        this.changeDetectorRef.detectChanges();
      }

      this.updateBodyPadding();
      this.changeDetectorRef.detectChanges();
    });

    const routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBodyPadding();
        this.isMobileOpen = false;
        this.changeDetectorRef.detectChanges();
      }
    });
    this.subscriptions.push(routerSub);

    window.addEventListener('resize', () => {
      this.checkScreenWidth();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  checkScreenWidth(): void {
    this.isMobile = window.innerWidth <= 768;
    this.updateBodyPadding();
    this.changeDetectorRef.detectChanges();
  }

  toggleSidebarDesktop(): void {
    this.isMinimized = !this.isMinimized;
    this.updateBodyPadding();
    this.changeDetectorRef.detectChanges();
  }

  toggleSidebarMobile(): void {
    this.isMobileOpen = !this.isMobileOpen;
    this.changeDetectorRef.detectChanges();
  }

  updateBodyPadding(): void {
    const hiddenRoutes = ['/login', '/home'];
    const currentRoute = this.router.url;

    if (hiddenRoutes.includes(currentRoute)) {
      this.renderer.removeStyle(document.body, 'padding-left');
      return;
    }

    if (window.innerWidth > 768) {
      const width = this.isMinimized ? '60px' : '200px';
      this.renderer.setStyle(document.body, 'padding-left', width);
    } else {
      this.renderer.removeStyle(document.body, 'padding-left');
    }
  }
}