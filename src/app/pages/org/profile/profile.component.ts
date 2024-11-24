import { Component, OnDestroy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserService } from '../../../core/services/UserService/user.service';
import { RoleServiceService } from '../../../core/services/RoleService/role-service.service';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnDestroy {
  isLoader: boolean = false;
  loggedUser?: UserWithoutPassDto;
  private subscriptions: Subscription = new Subscription();

  constructor(private roleService: RoleServiceService) {
    const sub = this.roleService.loggedUser$.subscribe({
      next: (user) => {
        this.loggedUser = user;
      },
      error: (err) => {
        console.error('No User Logged In', err);
      },
    });
    this.subscriptions.add(sub);
    // const sub = this.userService.getUserById$();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
