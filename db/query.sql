-- View employees by manager
SELECT emp.id, emp.first_name, emp.last_name, mgr.first_name AS manager_first_name, manager.last_name 
FROM employee emp
JOIN employee mgr ON emp.manager_id = mgr.id
WHERE mgr.id = <manager_id>;

-- View employees by department
SELECT emp.id, emp.first_name, emp.last_name, dept.name AS department_name
FROM employee emp
JOIN role ON emp.role_id = role.id
JOIN department dept ON role.department_id = dept.id
WHERE dept.id = <department_id>;



-- Update employee role
UPDATE employee
SET role_id = <new_role_id>
WHERE id = <role_id>;

-- Delete department
DELETE FROM department WHERE id = <department_id>;

-- Delete role
DELETE FROM role WHERE id = <role_id>;

-- Delete employee
DELETE FROM employee WHERE id = <employee_id>;
