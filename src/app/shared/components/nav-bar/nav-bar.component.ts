import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { RoleServiceService } from '../../../core/services/RoleService/role-service.service';
import { CommonModule } from '@angular/common';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnDestroy {
  loggedUser?: UserWithoutPassDto;

  constructor(private roleService: RoleServiceService, private router: Router) {
    roleService.loggedUser$.subscribe({
      next: (user) => {
        this.loggedUser = user;
      },
      error: (err) => {
        console.error('No User Logged In');
      },
    });
  }
  ngOnDestroy(): void {
    // this.roleService.loggedUser$.unsubscribe();
  }

  onClickLogOut() {
    localStorage.clear();
    this.router.navigate(['/auth/Login']);
  }
}
