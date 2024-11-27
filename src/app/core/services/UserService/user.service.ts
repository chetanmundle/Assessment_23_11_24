import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUserDto } from '../../models/Interfaces/User/CreateUserDto.model';
import { Observable, Subject } from 'rxjs';
import { AppResponse } from '../../models/Interfaces/AppResponse.model';
import { UserDto } from '../../models/Interfaces/User/UserDto.model';
import { UserLoginDto } from '../../models/Interfaces/User/userLoginDto.model';
import { UserLoginResponseDto } from '../../models/Interfaces/User/UserLoginResponseDto.model';
import { UserWithoutPassDto } from '../../models/classes/UserWithoutPassDto';
import { updateUserDto } from '../../models/Interfaces/User/UpdateUsetDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private Url = 'https://localhost:7035/api/User';

  //   Subject for Search Option
  searchSubject$: Subject<string> = new Subject<string>();

  // Service for register / create user
  registerUser$(user: CreateUserDto): Observable<AppResponse<UserDto>> {
    return this.http.post<AppResponse<UserDto>>(`${this.Url}/CreateUser`, user);
  }

  // Service for login user
  loginUser$(
    userDto: UserLoginDto
  ): Observable<AppResponse<UserLoginResponseDto>> {
    return this.http.post<AppResponse<UserLoginResponseDto>>(
      `${this.Url}/LoginUser`,
      userDto
    );
  }

  // Service for getting all users
  getAllUsers$(
    searchWord: string
  ): Observable<AppResponse<UserWithoutPassDto[]>> {
    console.log('Api Call ');

    return this.http.get<AppResponse<UserWithoutPassDto[]>>(
      `${this.Url}/GetAllUser/${searchWord}`
    );
  }

  getAllUsersWithDebouce$(
    searchWord: string
  ): Observable<AppResponse<UserWithoutPassDto[]>> {
    return this.http.get<AppResponse<UserWithoutPassDto[]>>(
      `${this.Url}/GetAllUser/${searchWord}`
    );
  }

  // Delete User by Id
  deleteUser$(userId: number): Observable<AppResponse<any>> {
    return this.http.delete<AppResponse<any>>(
      `${this.Url}/DeleteUserById/${userId}`
    );
  }

  // update user Obs$
  updateUser$(
    user: updateUserDto
  ): Observable<AppResponse<UserWithoutPassDto>> {
    return this.http.put<AppResponse<UserWithoutPassDto>>(
      `${this.Url}/UpdateUser`,
      user
    );
  }

  // Get One User By Id
  getUserById$(userId: number): Observable<AppResponse<UserWithoutPassDto>> {
    return this.http.get<AppResponse<UserWithoutPassDto>>(
      `${this.Url}/GetUserById/${userId}`
    );
  }

  // get refresh token
  getRefreshToken$(
    userId: number
  ): Observable<AppResponse<UserLoginResponseDto>> {
    return this.http.get<AppResponse<UserLoginResponseDto>>(
      `${this.Url}/GetRefreshToken/${userId}`
    );
  }
}
