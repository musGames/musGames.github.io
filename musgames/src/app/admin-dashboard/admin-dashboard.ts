import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';

/**
 * 
 User model
 This tells typescript how a user object looks
 */
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
//all users
  users: User[] = [];

  //admins 
  admins: User[] = [];

  //normal users
  regularUsers: User[] = [];

  //value from search input
  searchQuery: string = '';

  //loading spinner control
  isLoading = true;

  constructor(
    private firebaseService: FirebaseService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

    /**
   * runs when page opens
   */
  ngOnInit(): void {
    this.fetchUsers();
  }

  /**
   * gets all users from firebase
   */
  async fetchUsers(): Promise<void> {
    //show loading
    this.isLoading = true;

    try {
      // get users from firebase service
      const users = await this.firebaseService.getAllUsers();

            /**
       * ngZone makes sure Angular updates UI correctly
       * after async firebase operations
       */
      this.ngZone.run(() => {
        // save users
        this.users = users;

        // copy user list
        let list = [...this.users];


        /**
         * search filter
         * filters users by email
         */
        if (this.searchQuery) {
          // lowercase search for easier matching
          const queryLower = this.searchQuery.toLowerCase();

        // filter matching emails
          list = list.filter((user) =>
            user.email?.toLowerCase().includes(queryLower)
          );
        }

        // separate admins and normal users
        this.admins = list.filter((u) => u.isAdmin === true);
        this.regularUsers = list.filter((u) => u.isAdmin !== true);

        //stops loading and refreshes the ui
        this.isLoading = false;
        this.cdr.detectChanges();
      });
      //if something breaks
    } catch (error) {
      console.error('Error loading users:', error);

      //reset everything
      this.ngZone.run(() => {
        this.users = [];
        this.admins = [];
        this.regularUsers = [];
        this.isLoading = false;
        //refresh screen
        this.cdr.detectChanges();
      });
    }
  }

   /**
   * runs when typing in search input
   */
  onSearchInput(event: Event): void {
   // get input value
    const input = event.target as HTMLInputElement;
    
    // save search text
    this.searchQuery = input.value;

    //shows filtered users
    this.fetchUsers();
  }

   /**
   * gives or removes admin role
   */
  async toggleAdminRights(user: User): Promise<void> {
     // if already admin -> remove admin
    if (user.isAdmin) {
      await this.firebaseService.revokeAdminRights(user.uid);
    } else {
      // make user admin
      await this.firebaseService.createAdminRights(user.uid);
    }

      // refresh users
    await this.fetchUsers();
  }
//deletes selected users
  async deleteUser(userId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this user?')) {
      
      // deletes from firebase
      await this.firebaseService.deleteUser(userId);

      //refresh users
      await this.fetchUsers();
    }
  }
}