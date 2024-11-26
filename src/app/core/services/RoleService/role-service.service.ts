import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { UserWithoutPassDto } from '../../models/classes/UserWithoutPassDto';

@Injectable({
  providedIn: 'root',
})
export class RoleServiceService {
  // Subject behav....
  loggedUser$: BehaviorSubject<UserWithoutPassDto> =
    new BehaviorSubject<UserWithoutPassDto>(this.getLoggedUser());

  // this fuction decode the token and set in BehaviorSubject
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

  // This fuction is Used tp reset the Behaviour Subject whhen login is change at that senario or refresh token scenario
  public resetLoggedUser(): void {
    const newLoggedUser = this.getLoggedUser();
    this.loggedUser$.next(newLoggedUser);
  }
}
