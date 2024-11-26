import { Component, inject, input, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/UserService/user.service';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { updateUserDto } from '../../../core/models/Interfaces/User/UpdateUsetDto';
import { UserWithoutPassDto } from '../../../core/models/classes/UserWithoutPassDto';
import { AppResponse } from '../../../core/models/Interfaces/AppResponse.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent {
  private subscriptions: Subscription = new Subscription();
  @Input() PreviousUserData?: UserWithoutPassDto;
  userUpdateForm: FormGroup;

  private tostr = inject(MyToastServiceService);

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    //   this.getAllUsers();
console.log(this.PreviousUserData);

    this.userUpdateForm = this.formBuilder.group({
      userId: [this.PreviousUserData?.userId, Validators.required],
      name: [this.PreviousUserData?.name, [Validators.required]],
      email: [this.PreviousUserData?.email, [Validators.required]],
      role: [this.PreviousUserData?.role, [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.subscriptions.unsubscribe();
  }

  onClickSaveChanges() {
    // this.isLoader = true;
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
          //   this.isLoader = false;
          this.tostr.showSuccess('User Updated Successfully');
          return;
        }
        // this.isLoader = false;
        console.log('Unable to Update the User ', res.message);
        this.tostr.showError(res.message);
      },
      error: (err) => {
        // this.isLoader = false;
        console.error('Error to update the user', err);
        this.tostr.showError(err.message);
      },
    });

    this.subscriptions.add(sub);
  }
}
