import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/UserService/user.service';
import { AppResponse } from '../../../core/models/Interfaces/AppResponse.model';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { updateUserDto } from '../../../core/models/Interfaces/User/UpdateUsetDto';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnDestroy {
  isLoader: boolean = false;
  private subscriptions: Subscription = new Subscription();
  userList: UserWithoutPassDto[] = [];
  userUpdateForm: FormGroup;

  private tostr = inject(MyToastServiceService);

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.getAllUsers();

    this.userUpdateForm = this.formBuilder.group({
      userId: [0, Validators.required],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.subscriptions.unsubscribe();
  }

  // ResetForm
  resetUserUpdateForm() {
    this.userUpdateForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  // get all users
  getAllUsers() {
    const sub = this.userService.getAllUsers$().subscribe({
      next: (res: AppResponse<UserWithoutPassDto[]>) => {
        this.userList = res.data;
        console.log(this.userList);
      },
      error: (err) => {
        console.error('Error to get the  all users', err);
      },
    });

    this.subscriptions.add(sub);
  }

  // Fuction for delete User
  onClickDelete(userId: number) {
    if (!confirm('Sure! You Want to Delete this User?')) {
      return;
    }
    const sub = this.userService.deleteUser$(userId).subscribe({
      next: (res: AppResponse<any>) => {
        if (res.isSuccess) {
          // alert('User Deleted Successfully');
          this.getAllUsers();
          this.tostr.showSuccess('User Deleted Successfully');
          return;
        }
        console.log('Unable to delte the user', res);
        this.tostr.showError(res.message);
      },
      error: (err) => {
        console.error('Error to delete the user', err);
        this.tostr.showError(err.message);
      },
    });

    this.subscriptions.add(sub);
  }

  onClickEdit(user: UserWithoutPassDto) {
    this.userUpdateForm.get('userId')?.setValue(user.userId);
    this.userUpdateForm.get('email')?.setValue(user.email);
    this.userUpdateForm.get('name')?.setValue(user.name);
    this.userUpdateForm.get('role')?.setValue(user.role);
  }

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
          this.getAllUsers();
          this.isLoader = false;
          this.tostr.showSuccess('User Updated Successfully');
          return;
        }
        this.isLoader = false;
        console.log('Unable to Update the User ', res.message);
        this.tostr.showError(res.message);
      },
      error: (err) => {
        this.isLoader = false;
        console.error('Error to update the user', err);
        this.tostr.showError(err.message);
      },
    });

    this.subscriptions.add(sub);
  }
}
