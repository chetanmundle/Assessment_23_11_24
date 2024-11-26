using App.Common.Models;
using App.Core.Common.Exceptions;
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
    public class CreateUserCommand : IRequest<AppResponse<UserDto>>
    {
        public CreateUserDto CreateUser { get; set; }
    }

    internal class CreateUserCommandHandler: IRequestHandler<CreateUserCommand, AppResponse<UserDto>>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEncryptionService _encryptionService;

        public CreateUserCommandHandler(IAppDbContext appDbContext, IEncryptionService encryptionService)
        {
            _appDbContext = appDbContext;
            _encryptionService = encryptionService;
        }

        public async Task<AppResponse<UserDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var userModel = request.CreateUser;

            var isExist = await _appDbContext.Set<Domain.Entities.User>()
                               .AnyAsync(u => u.Email == userModel.Email, cancellationToken: cancellationToken);

            if (isExist) return new AppResponse<UserDto>
            {
                StatusCode = 409,
                IsSuccess = false,
                Message = "User Alread Exist"
            };

            var user = userModel.Adapt<Domain.Entities.User>();
            user.Email = user.Email.ToLower();  
            user.Password = _encryptionService.EncryptData(user.Password);
            user.IsDeleted = false;

            await _appDbContext.Set<Domain.Entities.User>()
                               .AddAsync(user, cancellationToken);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return new AppResponse<UserDto>
            {
                StatusCode = 200,
                IsSuccess = true,
                Message = "User Registed Successfully",
                Data = user.Adapt<UserDto>()
            };
        }
    }


}
