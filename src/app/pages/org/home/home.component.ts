import { Component } from '@angular/core';
import { RoleServiceService } from '../../../core/services/RoleService/role-service.service';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  loggedUser?: UserWithoutPassDto;
  subscription: Subscription;

  constructor(private roleService: RoleServiceService) {
    this.subscription = roleService.loggedUser$.subscribe({
      next: (user: UserWithoutPassDto) => {
        this.loggedUser = user;
      },
      error: (err) => {
        console.error('No User Logged In');
      },
    });
  }
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    console.log('Unsubscriobe from home');
  }
}
