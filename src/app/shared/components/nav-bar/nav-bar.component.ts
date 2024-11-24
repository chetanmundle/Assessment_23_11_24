import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { RoleServiceService } from '../../../core/services/RoleService/role-service.service';
import { CommonModule } from '@angular/common';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';
import { Subscription } from 'rxjs';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnDestroy {
  loggedUser?: UserWithoutPassDto;
  private subscriptions: Subscription = new Subscription();
  private tostr = inject(MyToastServiceService);

  constructor(private roleService: RoleServiceService, private router: Router) {
    const sub = this.roleService.loggedUser$.subscribe({
      next: (user) => {
        this.loggedUser = user;
      },
      error: (err) => {
        console.error('No User Logged In');
      },
    });
    this.subscriptions.add(sub);
  }
  ngOnDestroy(): void {
    // this.roleService.loggedUser$.unsubscribe();
  }

  onClickLogOut() {
    this.subscriptions.unsubscribe();
    localStorage.clear();
    this.tostr.showSuccess('Loggout Successfully');
    this.router.navigate(['/auth/Login']);
  }
}
