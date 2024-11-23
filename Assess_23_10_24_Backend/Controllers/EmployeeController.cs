using App.Common.Models;
using App.Core.App.Employee.Command;
using App.Core.Interface;
using App.Core.Models.Employee;
using App.Core.Validations.Employee;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Threading.Tasks;

namespace Assess_23_10_24_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeController(IMediator mediator, IEmployeeRepository employeeRepository)
        {
            _mediator = mediator;
            _employeeRepository = employeeRepository;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<AppResponse<EmpDto>>> CreateEmployee(CreateEmpDto emp)
        {
            var validator = new CreateEmpDtoValidator();
            var vaidate = validator.Validate(emp);
            if (!vaidate.IsValid)
            {
                var errorMessage = vaidate.Errors[0].ErrorMessage;
                return BadRequest(new AppResponse<EmpDto>
                {
                    IsSuccess = false,
                    Message = errorMessage,
                    StatusCode = 400
                });
            }
            var result = await _mediator.Send(new CreateEmpCommand { CreateEmpDto = emp });
            return Ok(result);
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<AppResponse<IEnumerable>>> GetAllEmployees()
        {
            var employee = await _employeeRepository.GetAllUserAsync();
            return Ok(employee);
        }

      
    }
}
