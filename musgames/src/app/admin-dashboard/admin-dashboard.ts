import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';

interface User {
  uid: string;
  displayName?: string;
  name?: string;
  email: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  users: User[] = [];
  admins: User[] = [];
  regularUsers: User[] = [];
  searchQuery: string = '';
  isLoading = true;

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers(): Promise<void> {
    this.isLoading = true;

    try {
      const users = await this.firebaseService.getAllUsers();

      this.ngZone.run(() => {
        this.users = users;

        let list = [...this.users];

        if (this.searchQuery) {
          const queryLower = this.searchQuery.toLowerCase();

          list = list.filter((user) =>
            user.email?.toLowerCase().includes(queryLower)
          );
        }

        this.admins = list.filter((u) => u.isAdmin === true);
        this.regularUsers = list.filter((u) => u.isAdmin !== true);

        this.isLoading = false;
        this.cdr.detectChanges();
      });
    } catch (error) {
      console.error('Error loading users:', error);

      this.ngZone.run(() => {
        this.users = [];
        this.admins = [];
        this.regularUsers = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.fetchUsers();
  }

  async toggleAdminRights(user: User): Promise<void> {
    if (user.isAdmin) {
      await this.firebaseService.revokeAdminRights(user.uid);
    } else {
      await this.firebaseService.createAdminRights(user.uid);
    }

    await this.fetchUsers();
  }

  async deleteUser(userId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this user?')) {
      await this.firebaseService.deleteUser(userId);
      await this.fetchUsers();
    }
  }
}