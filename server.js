const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3002;
const app = express();

const inquirer = require('inquirer');
const { resolve } = require('path');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'employee_db',
    port: 8889
  },
  console.log(`Connected to the employee_db database.`)
);

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  
  const mainMenu = async () => {
    let showmenu = true;
  
    while (showmenu) {
      const { choice } = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
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
        }
      ]);
  
      switch (choice) {
        case 'View all departments':
            console.log('List of All departments...');
            db.execute('SELECT name FROM department', function (err, data) { 
                if (err) throw err 
                console.table(data)} );
          break;
  
        case 'View all roles':
            console.log('Viewing all roles...');
            db.query('SELECT title, salary FROM roles', (err, data) => {
                if (err) throw err
                console.table(data)});
          break;
  
        case 'View all employees':
            console.log('Viewing all employees...');
            db.query('SELECT first_name, last_name, title, salary, name FROM employeedb.employee INNER JOIN role on employeedb.employee.role_id = employeedb.role.id INNER JOIN employeedb.department on role.department_id = department.id', (err, data) => {
                if (err) throw err
                console.table(data)});
          break;
  
        case 'Add a department':
          console.log('Adding a department...');
          inquirer.prompt([
            {
              type: 'input',
              name: 'department',
              message: 'Name of the department you want to add'
            }
          ]).then(inputs => {
            db.query('INSERT INTO department SET ?', {
              name: inputs.deptName
            })});
          break;
  
        case 'Add a role':
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
            const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            const values = [name, salary, id];
            db.query(sql, values, (error, results) => {
              if (error) {
                console.error('Failed to add role:', error);
                return;
              }
              console.log('Role saved');
            });
        });
          break;
  
        case 'Add an employee':
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
            const { firstname, lastname, roleId, manager } = inputs;
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [firstname, lastname, roleId, manager || null];
            db.query(sql, values, (error, results) => {
              if (error) {
                console.error('Error Adding New employee...', error);
                return;
              }
              console.log('Employee created correctly...');
            })
        })
          break;
  
        case 'Update an employee role':
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
            });
          });
          break;
  
        case 'Exit':
          console.log('Goodbye!');
          showmenu = false;
          break;
  
        default:
          console.log('Invalid choice. Please try again.');
      }
    }
  };
  
  const startApp = () => {
    console.log('Welcome to the Employee Management System!');
    mainMenu();
  };
  
  startApp();
  