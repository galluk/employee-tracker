USE employees_db;

INSERT INTO department (name)
VALUES ('Engineering'), ('Finance'), ('Legal'), ('Sales');

-- add roles --
INSERT INTO role (title, salary, department_id)
VALUES 	('Lead Engineer', 150000, 1), 
		('Software Engineer', 120000, 1), 
        ('Accounts Manager', 140000, 2), 
        ('Accountant', 125000, 2), 
        ('Legal Team Lead', 250000, 3), 
        ('Lawyer', 190000, 3), 
        ('Sales Lead', 100000, 4), 
        ('Salesperson', 80000, 4);

-- add employees --
INSERT INTO employee (first_name, last_name, role_id)
VALUES 	('John', 'Doe', 7), 
		('Mike', 'Chan', 8), 
		('Ashley', 'Rodriguez', 1), 
		('Kevin', 'Tupik', 2),
		('Jenny', 'McHugh', 3),        
		('Malia', 'Brown', 4), 
		('Sarah', 'Lourd', 5), 
		('Tom', 'Allen', 6), 
		('Christian', 'Eckenrode', 1);
        
-- set Mike Chans manager to John Doe
UPDATE employee SET manager_id = 1 WHERE id = 2;
-- set John Doe and Kevin Tupiks manager to Ashley Rodriguez
UPDATE employee SET manager_id = 3 WHERE id IN (1, 4);
-- set Tom Allen manager to Sarah Lourd
UPDATE employee SET manager_id = 7 WHERE id = 8;


