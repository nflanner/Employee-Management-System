SELECT employee_table.id, employee_table.first_name, employee_table.last_name, employee_role.title, department.dept_name AS department, employee_role.salary, manager_table.first_name AS manager
FROM employee_role 
JOIN department 
ON employee_role.department_id = department.id 
JOIN employee AS employee_table
ON employee_role.id = employee_table.role_id
LEFT JOIN employee AS manager_table
ON employee_table.manager = manager_table.id;