﻿using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.User;
using Dapper;
using Domain.Entities;
using Mapster;
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


        // Get all live User
        public async Task<IEnumerable<UserWithoutPassDto>> GetAllUserAsync()
        {
            var query = @"Select * from Users Where isDeleted = 0";

            var conn = _appDbContext.GetConnection();
            //var users = await conn.QueryAsync(query);
            var users = await conn.QueryAsync<User>(query);

            return users.Adapt<IEnumerable<UserWithoutPassDto>>();
        }

        // Get User By Email and Password
        public async Task<User> GetUserByEmailAndPasswordAsync(UserLoginDto loginDto)
        {
            var query = "SELECT * FROM Users WHERE Email = @Email AND [Role] = @Role";

            var conn = _appDbContext.GetConnection();
            var user = await conn.QueryFirstOrDefaultAsync<User>(query, 
                new { Email = loginDto.Email, Role = loginDto.Role });

            return user;
        }

        // Delete User (Soft Delete)
        public async Task<bool> DeleteUserByIdAsync(int UserId)
        {
            var query = @"Update Users 
                          Set    isDeleted = 1
                          Where  UserId = @UserId";

            var conn = _appDbContext.GetConnection();
            var affectedRow = await conn.ExecuteAsync(query, new { UserId = UserId});

            if(affectedRow > 0)
            {
                return true;
            }
            return false;
        }

    }
}
