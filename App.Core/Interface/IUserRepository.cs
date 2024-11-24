using App.Core.Models.User;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IUserRepository
    {
        Task<User> GetUserByEmailAndPasswordAsync(UserLoginDto loginDto);

        Task<IEnumerable<UserWithoutPassDto>> GetAllUserAsync();

        Task<bool> DeleteUserByIdAsync(int UserId);
    }
}
