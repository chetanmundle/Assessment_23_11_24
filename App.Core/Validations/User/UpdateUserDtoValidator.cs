using App.Core.Models.User;
using FluentValidation;


namespace App.Core.Validations.User
{
    public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().NotNull();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Role)
                .NotEmpty()
                .Must(role => role == "Admin" || role == "Provider");
        }
    }
}
