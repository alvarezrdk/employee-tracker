

INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales"),
       ("Operations");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", "100000",1),
       ("Salesperson","80000",2),
       ("Lead Engineer","150000",2),
       ("Software Engineer", "120000", 3),
       ("Account Manager", "160000", 4),
       ("Accountant", "125000", 4),
       ("Legal Team Lead", "250000", 4),
       ("Lawyer", "190000", 5);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriguez", 3, null),
       ("Kevin", "Tupik", 4, 1),
       ("Kunal", "Sing", 5, null),
       ("Malia", "Brown", 6, 1),
       ("Tom", "Allen", 7, 1),
       ("Sara", "Lourd", 8, null);

