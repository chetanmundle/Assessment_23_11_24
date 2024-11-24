import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { UserWithoutPassDto } from '../../models/classes/UserWithoutPassDto';

@Injectable({
  providedIn: 'root',
})
export class RoleServiceService {
  loggedUser$: BehaviorSubject<UserWithoutPassDto> =
    new BehaviorSubject<UserWithoutPassDto>(this.getLoggedUser());

  private getLoggedUser(): UserWithoutPassDto {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const userWithoutPass: UserWithoutPassDto = {
        userId: decodedToken.UserId,
        name: decodedToken.Name,
        email: decodedToken.Email,
        role: decodedToken.role,
      };
      return userWithoutPass;
    }
    return new UserWithoutPassDto();
  }
}
