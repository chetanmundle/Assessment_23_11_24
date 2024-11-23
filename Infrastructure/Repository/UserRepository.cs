using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using Dapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IAppDbContext _appDbContext;

        public UserRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;

        }
 

        public async Task<User> GetUserByEmailAndPasswordAsync(UserLoginDto loginDto)
        {
            var query = "SELECT * FROM Users WHERE Email = @Email AND [Role] = @Role";

            var conn = _appDbContext.GetConnection();
            var user = await conn.QueryFirstOrDefaultAsync<User>(query, 
                new { Email = loginDto.Email, Role = loginDto.Role });

            return user;
        }
    }
}
