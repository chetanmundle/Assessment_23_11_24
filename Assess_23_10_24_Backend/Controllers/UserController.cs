using App.Common.Models;
using App.Core.App.User.Command;
using App.Core.Interface;
using App.Core.Models.User;
using App.Core.Validations.User;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Assess_23_10_24_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUserRepository _userRepos;

        public UserController(IMediator mediator,IUserRepository userRepos)
        {
            _mediator = mediator;   
            _userRepos = userRepos;
        }

        // Api for Register or Create the New User
        [HttpPost("[action]")]
        public async Task<ActionResult<AppResponse<UserDto>>> CreateUser(CreateUserDto user)
        {
            var validator = new CreateUserValidator();

            var validate = validator.Validate(user);

            if(!validate.IsValid)
            {
                var errorMessage = validate.Errors[0].ErrorMessage;
                return BadRequest(new AppResponse<UserDto>
                {
                    IsSuccess = false,
                    StatusCode = 400,
                    Message = errorMessage
                });
            }

            var result = await _mediator.Send(new CreateUserCommand { CreateUser = user });
            return Ok(result);
        }

        // Api for Login the Users
        [HttpPost("[action]")]
        public async Task<ActionResult<AppResponse<UserLoginResponseDto>>> LoginUser(UserLoginDto login)
        {
            var validator = new LoginUserValidator();
            var validate = validator.Validate(login);

            if (!validate.IsValid)
            {
                var errorMessage = validate.Errors[0].ErrorMessage;
                return BadRequest(new AppResponse<UserLoginResponseDto>
                {
                    IsSuccess = false,
                    StatusCode = 400,
                    Message = errorMessage
                });
            }

            var result = await _mediator.Send(new UserLoginCommand { LoginDto = login });
            return Ok(result);

        }

        // Api for getting all the Users
        [HttpGet("[action]")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserWithoutPassDto>>> GetAllUser()
        {
            var users = await _userRepos.GetAllUserAsync();

            var appResponse = new AppResponse<IEnumerable<UserWithoutPassDto>>
            {
                IsSuccess = true,
                StatusCode = 200,
                Message = "Data fetch Successfully",
                Data = users
            };

            return Ok(appResponse);
          
        }

        // Api for Delete on Employee
        [HttpDelete("[action]/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUserById(int userId)
        {
           var isDelete = await _userRepos.DeleteUserByIdAsync(userId);
            if (isDelete) return Ok(new AppResponse
            {
                IsSuccess = true,
                Message = "Deleted Successfully",
                StatusCode = 200
            });

            return StatusCode(500, new AppResponse
            {
                IsSuccess = false,
                Message = "Deletion failed due to an internal error.",
                StatusCode = 500
            });
        }


        // Api for Update user
        [HttpPut("[action]")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AppResponse<UserWithoutPassDto>>> UpdateUser(UpdateUserDto userDto)
        {
            var validator = new UpdateUserDtoValidator();
            var validate = validator.Validate(userDto);
            if (!validate.IsValid)
            {
                var errorMessage = validate.Errors[0].ErrorMessage;
                return BadRequest(new AppResponse
                {
                    IsSuccess = false,
                    StatusCode = 404,
                    Message = errorMessage
                });
            }

            var result = await _mediator.Send(new UpdateUserCommand { UserDto = userDto });
            return Ok(result);
        }

        // get user by id
        [HttpGet("[action]/{userId}")]
        public async Task<ActionResult<AppResponse<UserWithoutPassDto>>> GetUserById(int userId)
        {
            var user = await _userRepos.GetUserByIdAsync(userId);

            if(user is null) return new AppResponse<UserWithoutPassDto>()
            {
                IsSuccess = false,
                Message = "User Not Found",
                StatusCode = 404
            };

            return new AppResponse<UserWithoutPassDto>()
            {
                IsSuccess = true,
                Message = "User Get Successfully",
                StatusCode = 200,
                Data = user
            };
        }


    }
}
