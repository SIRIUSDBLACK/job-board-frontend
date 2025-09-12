import { AdminService } from './../../services/admin/admin-service';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-users-table',
  imports: [CommonModule],
  templateUrl: './admin-users-table.html',
  styleUrl: './admin-users-table.scss',
})
export class AdminUsersTable {
  isConfirmingDelete: boolean = false;
  userToDelete: any = null;

  users = signal<User[]>([]);

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers().subscribe((data) => this.users.set(data));
  }

  // onChangeRole() {
  //   console.log('updated changes');
  // } we can do it but 

  onBan(user: User) {
    if (!user) {
      console.log('users is undefined');
      return;
    }
    console.log('banned');
    this.adminService.banUser(user!.id, !user.is_banned).subscribe((response) => {
      console.log(response);
      this.loadUsers();
    });
  }

  onDelete(user: User) {
    if (!user) {
      console.log('users is undefined');
      return;
    }
    console.log('deleted');
    console.log('Delete button clicked for job:', user);

    // Set the state to show the confirmation modal
    this.isConfirmingDelete = true;
    this.userToDelete = user;
  }

  confirmDelete() {
    if (this.userToDelete) {
      console.log('User confirmed deletion for job:', this.userToDelete);

      this.adminService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.isConfirmingDelete = false;
          this.userToDelete = null;
          this.loadUsers();
          console.log('Job deleted and UI updated successfully!');
        },
        error: (err) => {
          console.error('Failed to delete job:', err);
        },
      });
    }
  }
  cancelDelete() {
    console.log('CancelDeleted');
    this.isConfirmingDelete = false;
    this.userToDelete = null;
  }
}
