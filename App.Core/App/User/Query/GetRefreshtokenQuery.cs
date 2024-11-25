using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.User;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Query
{
    public class GetRefreshtokenQuery : IRequest<AppResponse<UserLoginResponseDto>>
    {
        public int userId { get; set; }
    }

    internal class GetRefreshtokenQueryHandler : IRequestHandler<GetRefreshtokenQuery, AppResponse<UserLoginResponseDto>>
    {
        private readonly IJwtService _jwtService;
        private readonly IAppDbContext _appDbContext;

        public GetRefreshtokenQueryHandler(IAppDbContext appDbContext,IJwtService jwtService)
        {
            _appDbContext = appDbContext;
            _jwtService = jwtService;
        }

        public async Task<AppResponse<UserLoginResponseDto>> Handle(GetRefreshtokenQuery request, CancellationToken cancellationToken)
        {
            var userId = request.userId;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                        .FirstOrDefaultAsync(u => u.UserId == userId,cancellationToken);

            if (user is null) return new AppResponse<UserLoginResponseDto>
            {
                IsSuccess = false,
                Message = "UserId Not Found",
                StatusCode = 404
            };

            var refreshtoken = await _jwtService.Authenticate(user.UserId, user.Name, user.Email, user.Role);

            return new AppResponse<UserLoginResponseDto>
            {
                IsSuccess = true,
                Message = "Refreshtoke Get Successfully",
                StatusCode = 200,
                Data = new UserLoginResponseDto
                {
                    Role = user.Role,
                    Email = user.Email,
                    Name = user.Name,
                    UserId = user.UserId,
                    accessToken = refreshtoken
                }
            };
        }
    }
}
