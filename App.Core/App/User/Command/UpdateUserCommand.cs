using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Command
{
    public class UpdateUserCommand : IRequest<AppResponse<UserWithoutPassDto>>
    {
        public UpdateUserDto UserDto { get; set; }
    }

    internal class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, AppResponse<UserWithoutPassDto>>
    {
        private readonly IAppDbContext _appDbContext;

        public UpdateUserCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;      
        }

        public async Task<AppResponse<UserWithoutPassDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var userModel = request.UserDto;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                                          .FirstOrDefaultAsync(x => x.UserId == userModel.UserId, cancellationToken);

            if(user is null) return new AppResponse<UserWithoutPassDto>()
            {
                IsSuccess = false,
                Message = "Data with this id not found",
                StatusCode = 404
            };

            var isExist = await _appDbContext.Set<Domain.Entities.User>()
                                          .FirstOrDefaultAsync(x => x.Email == userModel.Email, cancellationToken);

            if(isExist is not null && !string.Equals(user.Email, userModel.Email))
                return new AppResponse<UserWithoutPassDto>()
            {
                IsSuccess = false,
                Message = "User with this Email is Already Exist",
                StatusCode = 400
            };

            user.Role = userModel.Role;
            user.Email = userModel.Email;
            user.Name = userModel.Name;

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return new AppResponse<UserWithoutPassDto>()
            {
                IsSuccess = true,
                Message = "User Updated Successfully",
                StatusCode = 200,
                Data = user.Adapt<UserWithoutPassDto>()
            };


        }
    }
}
