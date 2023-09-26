INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Prick", "Nice", 1, null),
       ("Tyler", "Yeswak", 2, 1),
       ("Drew", "Dombro", 3, 1),
       ("Chuck", "Nawblock", 4, 1),
       ("Randy", "Pepper", 5, 1),
       ("Mickey", "Gold", 6, 1),
       ("Cali" "Moore", 7, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Head-Programmer", "260000",1),
       ("CMO", "150000",2),
       ("Sales Manager","150000",2),
       ("Delivery Coord", "120000", 3),
       ("Product Manager", "140000", 4),
       ("COO", "160000", 4),
       ("CTO", "175000", 5);

INSERT INTO department (name)
VALUES ("Engineering"),
       ("Sales"),
       ("Production"),
       ("Operations"),
       ("Management")