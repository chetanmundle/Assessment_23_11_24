import { Component, inject, OnDestroy } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserService } from '../../../core/services/UserService/user.service';
import { RoleServiceService } from '../../../core/services/RoleService/role-service.service';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { AppResponse } from '../../../core/models/Interfaces/AppResponse.model';
import { updateUserDto } from '../../../core/models/Interfaces/User/UpdateUsetDto';
import { UserLoginResponseDto } from '../../../core/models/Interfaces/User/UserLoginResponseDto.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [LoaderComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnDestroy {
  isLoader: boolean = false;
  loggedUser?: UserWithoutPassDto;
  private subscriptions: Subscription = new Subscription();
  userList: UserWithoutPassDto[] = [];
  userUpdateForm: FormGroup;

  private tostr = inject(MyToastServiceService);
  private userService = inject(UserService);
  private roleService = inject(RoleServiceService);

  constructor(private formBuilder: FormBuilder) {
    const sub = this.roleService.loggedUser$.subscribe({
      next: (user) => {
        this.loggedUser = user;
      },
      error: (err) => {
        console.error('No User Logged In', err);
      },
    });
    this.subscriptions.add(sub);
    this.userUpdateForm = this.formBuilder.group({
      userId: [0, Validators.required],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClickEdit() {
    // set the value to form when the click edit
    this.userUpdateForm.get('userId')?.setValue(this.loggedUser?.userId);
    this.userUpdateForm.get('name')?.setValue(this.loggedUser?.name);
    this.userUpdateForm.get('email')?.setValue(this.loggedUser?.email);
    this.userUpdateForm.get('role')?.setValue(this.loggedUser?.role);
  }

  //   Update fuction
  onClickSaveChanges() {
    this.isLoader = true;
    const payload: updateUserDto = {
      userId: this.userUpdateForm.get('userId')?.value,
      name: this.userUpdateForm.get('name')?.value,
      email: this.userUpdateForm.get('email')?.value,
      role: this.userUpdateForm.get('role')?.value,
    };

    const sub = this.userService.updateUser$(payload).subscribe({
      next: (res: AppResponse<UserWithoutPassDto>) => {
        if (res.isSuccess) {
          //   this.getAllUsers();
          this.isLoader = false;

          // This Fuction refresh the token and reset the Behavior Subject
          this.getRefreshToken();
          this.tostr.showSuccess('User Updated Successfully');

          return;
        }
        this.isLoader = false;
        console.log('Unable to Update the User ', res.message);
        this.tostr.showError(res.message);
      },
      error: (err: any) => {
        this.isLoader = false;
        console.error('Error to update the user', err);
        this.tostr.showError(err.message);
      },
    });

    this.subscriptions.add(sub);
  }

  getRefreshToken() {
    this.userService
      .getRefreshToken$(this.userUpdateForm.get('userId')?.value)
      .subscribe({
        next: (res: AppResponse<UserLoginResponseDto>) => {
          if (res.isSuccess) {
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken', res.data.accessToken);
            this.roleService.resetLoggedUser();
            return;
          }
          console.log('Unble to genereate access token');
        },
        error: (err: any) => {
          console.log('Error to genereate Refresh token ', err);
        },
      });
  }
}
