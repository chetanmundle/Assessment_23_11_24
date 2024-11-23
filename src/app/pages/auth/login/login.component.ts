import { Component, inject } from '@angular/core';
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
import { CreateUserDto } from '../../../core/models/Interfaces/User/CreateUserDto.model';
import { UserLoginResponseDto } from '../../../core/models/Interfaces/User/UserLoginResponseDto.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginUserForm: FormGroup;

  private userService = inject(UserService);
  private router = inject(Router);
  // private tostr = inject(MyToastServiceService);

  isLoader: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.loginUserForm = this.formBuilder.group({
      email: ['@gmail.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
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

    this.userService.loginUser$(payload).subscribe({
      next: (res: AppResponse<UserLoginResponseDto>) => {
        if (!res.isSuccess) {
          console.log('Unble to Login : ', res.message);
          return;
        }

        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('email', res.data.email);
        localStorage.setItem('role', res.data.role);

        this.resetUserForm();
        this.router.navigateByUrl('/org/Home');
      },
      error: (err) => {
        console.log('Error to LoginIn : ', err);
      },
    });

    this.isLoader = false;
  }
}
