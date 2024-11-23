using App.Core.Models.Employee;
using FluentValidation;

namespace App.Core.Validations.Employee
{
    public class CreateEmpDtoValidator : AbstractValidator<CreateEmpDto>
    {
        public CreateEmpDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Salary).NotEmpty();
        }
    }
}
