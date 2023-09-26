const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employeedb',
    port: 8889
  },
);

db.connect((err) => {
  if (err) throw err
  console.log('connected to database')
  displayMainMenu()
})

// Function to display the main menu and handle user input
function displayMainMenu() {
    inquirer
      .prompt({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit'
        ]
      })
      .then((answer) => {
        switch (answer.choice) {
          case 'View all departments':
            viewAllDepartments();
            break;
          case 'View all roles':
            viewAllRoles();
            break;
          case 'View all employees':
            viewAllEmployees();
            break;
          case 'Add a department':
            addDepartment();
            break;
          case 'Add a role':
            addRole();
            break;
          case 'Add an employee':
            addEmployee();
            break;
          case 'Update an employee role':
            updateEmployeeRole();
            break;
          case 'Exit':
            connection.end();
            break;
        }
      });
  }

  function viewAllDepartments() {
    db.query('SELECT name FROM department', function (err, data) {
      if (err) throw err
      console.table(data)
      displayMainMenu()
    })
  }

  function viewAllRoles() {
    db.query('SELECT title, salary FROM role', (err, data) => {
      if (err) throw err
      console.table(data)
      displayMainMenu()
    })
  }

  function viewAllEmployees() {
    db.query('SELECT first_name, last_name, title, salary, name FROM employeedb.employee INNER JOIN role on employeedb.employee.role_id = employeedb.role.id INNER JOIN employeedb.department on role.department_id = department.id', (err, data) => {
      if (err) throw err
      console.table(data)
      displayMainMenu()
    })
  }

  function addDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the new department you want to add?'
      }
    ]).then(answer => {
      db.query('INSERT INTO department SET ?', {
        name: answer.deptName
      })
      console.log('Expanding the company!')
      viewAllDepartments()
      displayMainMenu()
    })
  }
  function addRole() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message: 'What is the title of the role you would like to add?'
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary for this role?'
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Enter the department ID for this role:'
      }
    ]).then(answers => {
      const { roleTitle, roleSalary, departmentId } = answers;
      const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      const values = [roleTitle, roleSalary, departmentId];
      db.query(sql, values, (error, results) => {
        if (error) {
          console.error('Failed to add role:', error);
          return;
        }
        console.log('Role added successfully!');
        viewAllRoles();
        displayMainMenu();
      });
    });
  }
  function addEmployee() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Enter the first name of the new employee:'
      },
      {
        type: 'input',
        name: 'employeeLastName',
        message: 'Enter the last name of the new employee:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the role ID for this employee:'
      },
      {
        type: 'input',
        name: 'managerId',
        message: 'Enter the manager ID for this employee (leave empty if none):'
      }
    ]).then(answers => {
      const { employeeFirstName, employeeLastName, roleId, managerId } = answers;

      const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      const values = [employeeFirstName, employeeLastName, roleId, managerId || null];
      db.query(sql, values, (error, results) => {
        if (error) {
          console.error('Failed to add employee:', error);
          return;
        }
        console.log('Employee added successfully!');
        viewAllEmployees();
        displayMainMenu();
      });
    });
  }
 
  function updateEmployeeRole() {
    // Prompt for employee ID and new role ID
    inquirer.prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: 'Enter the ID of the employee you want to update:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the new role ID for the employee:'
      }
    ]).then(answers => {
      // Convert the role ID to an integer
      const roleId = parseInt(answers.roleId);
  
      // Update the employee role in the database
      db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, answers.employeeId], (err, result) => {
        if (err) throw err;
        console.log('Employee role updated successfully!');
        viewAllEmployees();
        displayMainMenu();
      });
    });
  }
  

  module.exports = displayMainMenu