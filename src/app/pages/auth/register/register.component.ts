import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MustMatch } from './CustomeValidation/MustMatch';
import { CreateUserDto } from '../../../core/models/Interfaces/User/CreateUserDto.model';
import { UserService } from '../../../core/services/UserService/user.service';
import { AppResponse } from '../../../core/models/Interfaces/AppResponse.model';
import { UserDto } from '../../../core/models/Interfaces/User/UserDto.model';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, LoaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  StrongPasswordRegx: RegExp =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!?*.@#$]).{8,}$/;

  userFormData: FormGroup;

  //   private userService = inject(UserService);
  private router = inject(Router);
  private userService = inject(UserService);
  private tostr = inject(MyToastServiceService);

  passwordStrength: string = '';
  isFocucedonPass: boolean = false;
  isLoader: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.userFormData = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['@gmail.com', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern(this.StrongPasswordRegx)],
        ],
        role: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
        isChecked: [false, Validators.requiredTrue],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  resetUserForm() {
    this.userFormData = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: ['@gmail.com', [Validators.required, Validators.email]],
        role: ['', [Validators.required]],
        password: [
          '',
          [Validators.required, Validators.pattern(this.StrongPasswordRegx)],
        ],
        confirmPassword: ['', Validators.required],
        isChecked: [false, Validators.requiredTrue],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  // on click register for register the user
  onClickRegister() {
    this.isLoader = true;

    const user: CreateUserDto = {
      name: this.userFormData.get('name')?.value,
      email: this.userFormData.get('email')?.value,
      password: this.userFormData.get('password')?.value,
      role: this.userFormData.get('role')?.value,
    };

    this.userService.registerUser$(user).subscribe({
      next: (res: AppResponse<UserDto>) => {
        if (res.isSuccess) {
          console.log('Data saved Successfully', res);
          this.resetUserForm();
          this.tostr.showSuccess('User Registered Successfully');
          this.router.navigateByUrl('/auth/Login');
          this.isLoader = true;
          return;
        }
        console.log('Unble to Register : ', res.message);
        this.tostr.showError(res.message);
        this.isLoader = true;
      },
      error: (err) => {
        alert('Unable to Register');
        this.tostr.showError(err.message);
        this.isLoader = true;
      },
    });
  }

  PrintStrongNess(event: any) {
    let input_string = event.target.value;
    const n = input_string.length;
    // Checking lower alphabet in string
    let hasLower = false;
    let hasUpper = false;
    let hasDigit = false;
    let specialChar = false;
    const normalChars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890 ';

    for (let i = 0; i < n; i++) {
      if (input_string[i] >= 'a' && input_string[i] <= 'z') {
        hasLower = true;
      }
      if (input_string[i] >= 'A' && input_string[i] <= 'Z') {
        hasUpper = true;
      }
      if (input_string[i] >= '0' && input_string[i] <= '9') {
        hasDigit = true;
      }
      if (!normalChars.includes(input_string[i])) {
        specialChar = true;
      }
    }

    // Strength of password
    this.passwordStrength = 'Weak';

    if (hasLower && hasUpper && hasDigit && specialChar && n >= 8) {
      this.passwordStrength = 'Strong';
    } else if ((hasLower || hasUpper) && specialChar && n >= 6) {
      this.passwordStrength = 'Moderate';
    }

    // console.log(`Strength of password: ${this.passwordStrength}`);
  }

  onPasswordBlur() {
    this.isFocucedonPass = false;
  }

  onPasswordFocus() {
    this.isFocucedonPass = true;
  }
}
