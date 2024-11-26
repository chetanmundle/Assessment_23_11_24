import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../core/services/UserService/user.service';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserLoginDto } from '../../../core/models/Interfaces/User/userLoginDto.model';
import { AppResponse } from '../../../core/models/Interfaces/AppResponse.model';
import { UserLoginResponseDto } from '../../../core/models/Interfaces/User/UserLoginResponseDto.model';
import { Subscription } from 'rxjs';
import { RoleServiceService } from '../../../core/services/RoleService/role-service.service';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoaderComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  loginUserForm: FormGroup;
  subscriptions?: Subscription;
  showPassword: boolean = false;

  private userService = inject(UserService);
  private router = inject(Router);
  private roleService = inject(RoleServiceService);
  private tostr = inject(MyToastServiceService);

  isLoader: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.loginUserForm = this.formBuilder.group({
      email: ['@gmail.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  resetUserForm() {
    this.loginUserForm = this.formBuilder.group({
      email: ['@gmail.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  onClickLogIn() {
    this.isLoader = true;
    const payload: UserLoginDto = {
      email: this.loginUserForm.get('email')?.value,
      password: this.loginUserForm.get('password')?.value,
      role: this.loginUserForm.get('role')?.value,
    };

    this.subscriptions = this.userService.loginUser$(payload).subscribe({
      next: (res: AppResponse<UserLoginResponseDto>) => {
        if (!res.isSuccess) {
          // console.log('Unble to Login : ', res.message);
          this.tostr.showError(res.message);
          this.isLoader = false;
          return;
        }

        localStorage.setItem('accessToken', res.data.accessToken);

        this.resetUserForm();
        // reset the Subject Behaviour
        this.roleService.resetLoggedUser();
        this.router.navigateByUrl('/org/Home');
        this.tostr.showSuccess(res.message);
        this.isLoader = false;
      },
      error: (err) => {
        console.log('Error to LoginIn : ', err);
        this.tostr.showError(err.message);
        this.isLoader = false;
      },
    });

    // this.isLoader = false;
  }

  onClickShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
