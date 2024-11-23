import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUserDto } from '../../models/Interfaces/User/CreateUserDto.model';
import { Observable } from 'rxjs';
import { AppResponse } from '../../models/Interfaces/AppResponse.model';
import { UserDto } from '../../models/Interfaces/User/UserDto.model';
import { UserLoginDto } from '../../models/Interfaces/User/userLoginDto.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private Url = 'https://localhost:7035/api/User';

  registerUser$(user: CreateUserDto): Observable<AppResponse<UserDto>> {
    return this.http.post<AppResponse<UserDto>>(`${this.Url}/CreateUser`, user);
  }

  loginUser$(userDto: UserLoginDto): Observable<AppResponse<CreateUserDto>> {
    return this.http.post<AppResponse<CreateUserDto>>(
      `${this.Url}/LoginUser`,
      userDto
    );
  }
}
