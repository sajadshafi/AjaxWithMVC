using DragulaJS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace DragulaJS.Controllers {
    public class HomeController : Controller {
        private readonly ILogger<HomeController> _logger;


        static IList<Employee> employeeList = new List<Employee>{
                new Employee() { EmployeeId = 1, Name = "John Von", Details = "Software Developer since 2009." } ,
                new Employee() { EmployeeId = 2, Name = "Steve",  Details = "System Engineer since 2017." } ,
                new Employee() { EmployeeId = 3, Name = "Bill",  Details = "Sales person since 2019." }
        };

        public HomeController(ILogger<HomeController> logger) {
            _logger = logger;
        }

        public IActionResult Index() {
            return View();
        }
        
        public JsonResult GetById(int id) {
            Employee emp = employeeList[id];
            return Json(emp);
        }



        public IActionResult Privacy() {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
