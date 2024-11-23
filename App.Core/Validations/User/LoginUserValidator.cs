using App.Core.Models.User;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Validations.User
{
    public class LoginUserValidator : AbstractValidator<UserLoginDto>
    {

        public LoginUserValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }
}
