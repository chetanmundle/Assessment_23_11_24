using App.Common.Models;
using App.Core.Common.Exceptions;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Command
{
    public class UserLoginCommand : IRequest<AppResponse<UserLoginResponseDto>>
    {
        public UserLoginDto LoginDto { get; set; }
    }

    internal class UserLoginCommandHandler : IRequestHandler<UserLoginCommand, AppResponse<UserLoginResponseDto>>
    {
        private readonly IJwtService _jwtService;
        private readonly IUserRepository _userRepos;
        private readonly IEncryptionService _encryptionService;
        public UserLoginCommandHandler(IUserRepository userRepos, IJwtService jwtService, IEncryptionService encryptionService)
        {
            _jwtService = jwtService;
            _userRepos = userRepos;
            _encryptionService = encryptionService;
        }

        public async Task<AppResponse<UserLoginResponseDto>> Handle(UserLoginCommand request, CancellationToken cancellationToken)
        {
            var userLoginDto = request.LoginDto;

            var user = await _userRepos.GetUserByEmailAndPasswordAsync(userLoginDto);
            
            if(user is null)
            {
                return new AppResponse<UserLoginResponseDto>
                {
                    IsSuccess = false,
                    StatusCode = 404,
                    Message = "Invalid User Email Or Role",
                };
            }

            if (!string.Equals(userLoginDto.Password, _encryptionService.DecryptData(user.Password)))
            {
                return new AppResponse<UserLoginResponseDto>
                {
                    IsSuccess = false,
                    StatusCode = 404,
                    Message = "Invalid User Password",
                };
            }

            var token = await _jwtService.Authenticate(user.UserId, user.Name, user.Email, user.Role);

            return new AppResponse<UserLoginResponseDto>
            {
                IsSuccess = true,
                StatusCode = 200,
                Message = "Login Successfully",
                Data = new UserLoginResponseDto
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    Role = user.Role,
                    Name = user.Name,
                    accessToken = token
                }
            };
        }
    }

}
