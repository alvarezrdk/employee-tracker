const express = require('express');
const mysql = require('mysql2');
const app = express();
const inquirer = require('inquirer');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
    port: 8889
  })

  db.connect((err) => {
    if (err) throw err
    console.log('connected to database')
    mainMenu()
  })

  
  function mainMenu() {
      inquirer.prompt({
          name: 'choice',
          type: 'list',
          message: 'What would you like to do?',
          choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update Employee role',
            'Exit'
            ]}
          ) 
          .then((inputs) => {
  
        switch (inputs.choice) {
        case 'View all Departments':
            console.log('List of All departments...');
            db.execute('SELECT id, name FROM department', function (err, data) { 
                if (err) throw err 
                console.table(data);
                mainMenu();
              });
                
          break;
  
        case 'View all Roles':
            console.log('Viewing all roles...');
            db.query('SELECT id, title, salary FROM roles', (err, data) => {
                if (err) throw err
                console.table(data);
                mainMenu();
              });
          break;
  
        case 'View all Employees':
            console.log('Viewing all employees...');
            db.query('SELECT employee_db.employee.id, first_name, last_name, title, salary, name FROM employee_db.employee INNER JOIN roles on employee_db.employee.role_id = employee_db.roles.id INNER JOIN employee_db.department on roles.department_id = department.id', (err, data) => {
                if (err) throw err
                console.table(data)
                mainMenu();
              });
          break;
  
        case 'Add a Department':
          console.log('Adding a department...');
          inquirer.prompt([
            {
              type: 'input',
              name: 'department',
              message: 'Department you want to add'
            }
          ]).then(inputs => {
            db.query('INSERT INTO department SET ?', {
              name: inputs.department
            })
            mainMenu();});
          break;
  
        case 'Add a Role':
          console.log('Adding a role...');
            inquirer.prompt([
                {
                type: 'input',
                name: 'name',
                message: 'Title of the role you would like to add'
                },
                {
                type: 'input',
                name: 'salary',
                message: 'Salary for this role'
                },
                {
                type: 'input',
                name: 'id',
                message: 'Department ID for this role'
                }
          ]).then(inputs => {
            const { name, salary, id } = inputs;
            const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
            const values = [name, salary, id];
            db.query(sql, values, (error, results) => {
              if (error) {
                console.error('Failed to add role:', error);
                return;
              }
              console.log('Role saved');
              mainMenu();
            });
        });
          break;
  
        case 'Add an Employee':
          console.log('Adding an employee...');
          inquirer.prompt([
            {
              type: 'input',
              name: 'firstname',
              message: 'Enter First name of the Employee:'
            },
            {
              type: 'input',
              name: 'lastname',
              message: 'Enter Last name of the Employee:'
            },
            {
              type: 'input',
              name: 'roleid',
              message: 'Enter Role ID:'
            },
            {
              type: 'input',
              name: 'manager',
              message: 'Enter Manager ID:'
            }
          ]).then(inputs => {
            const { firstname, lastname, roleid, manager } = inputs;
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [firstname, lastname, roleid, manager || null];
            db.query(sql, values, (error, results) => {
              if (error) {
                console.error('Error Adding New employee...', error);
                return;
              }
              console.log('Employee created correctly...');
              mainMenu();
            })
        })
          break;
  
        case 'Update Employee role':
          console.log('Updating an employee role...');
          inquirer.prompt([
            {
              type: 'input',
              name: 'employeeId',
              message: 'Enter Employee ID:'
            },
            {
              type: 'input',
              name: 'roleId',
              message: 'Enter Role ID:'
            }
          ]).then(inputs => {
            const roleId = parseInt(inputs.roleId);
            db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, inputs.employeeId], (err, result) => {
              if (err) throw err;
              console.log('Employee role updated...');
              mainMenu();
            });
          });
          break;
  
        case 'Exit':
          console.log('Goodbye!');
          showmenu = false;
          db.end();
          break;
  
        default:
          console.log('Invalid choice. Please try again.');
          mainMenu();
      }
    })
    }
  
  module.exports = mainMenu