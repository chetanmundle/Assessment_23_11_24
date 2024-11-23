using App.Common.Models;
using App.Core.App.User.Command;
using App.Core.Models.User;
using App.Core.Validations.User;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Assess_23_10_24_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator)
        {
            _mediator = mediator;   
        }

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

        [HttpGet("[action]")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> admin()
        {
            return Ok("Admin");
        }
    }
}
