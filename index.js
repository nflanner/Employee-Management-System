// Import and require mysql2
import mysql from 'mysql2';
import inquirer from 'inquirer';
import cTable from 'console.table';

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employee_tracker_db'
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

const initQuestions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit"
    ],
  },
];

async function init() {
  let quit = 0;
  while (quit === 0) {
    let selection = '';
    await inquirer
    .prompt(initQuestions)
    .then(async (res) => {
      if (res.choice != 'Quit') {
        if (res.choice.includes('View')) {
          await viewDB(res.choice);
        } else if (res.choice.includes('Add')) {
          await addToDB(res.choice);
          console.log('ADD FUNCTION')
        } else {
          console.log('UPDATE EMPLOYEE ROLE')
        }
      } else {
        console.log('Quitting!');
        quit = 1;
      }
    });
  }
}

async function viewDB(choice) {
  if (choice.includes('Employees')) {
    db.query('SELECT * FROM employee', function(err, results) {
      console.table(results);
    })
  } else if (choice.includes('Roles')) {
    db.query('SELECT employee_role.id, employee_role.title, department.dept_name AS department, employee_role.salary FROM employee_role JOIN department ON employee_role.department_id = department.id', function(err, results) {
      console.table(results);
    })
  } else {
    db.query('SELECT * FROM department', function(err, results) {
      console.table(results);
    })
  }
}

const deptQuestions = {
  type: 'input',
  message: 'What is the department name?',
  name: 'department',
}

async function addToDB(choice) {
  if (choice.includes('Employee')) {
    const employeeList = await getEmployeeList();
    const employeeQuestions = await getEmployeeQuestions(employeeList);
    await inquirer
      .prompt(employeeQuestions)
      .then(async (res) => {
        const roleId = await getRoleId(res.title);
        const splitManager = res.manager.split(' ');
        const managerId = await getManagerId(splitManager[0], splitManager[1]);
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager) VALUES (?,?,?,?)`, [res.first, res.last, roleId, managerId], (err, results) => {
          if (err) {
            console.log(err);
          }
        })
        console.log(`${res.first} ${res.last} added to the database.`);
      });
  } else if (choice.includes('Role')) {
    const roleQuestions = await getRoleQuestions();
    await inquirer
      .prompt(roleQuestions)
      .then(async (res) => {
        const deptId = await getDeptId(res.department)
        // console.log(`NEED TO ADD (${res.title}, ${res.salary}, ${deptId})`)
        db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES (?,?,?)`, [res.title, res.salary, deptId], (err, results) => {
          if (err) {
            console.log(err);
          }
        })
        console.log(`${res.role} added to the database.`);
      })
  } else {
    await inquirer
      .prompt(deptQuestions)
      .then(async (res) => {
        db.query(`INSERT INTO department (dept_name) VALUES (?)`, res.department, (err, results) => {
          if (err) {
            console.log(err);
          }
        })
        console.log(`${res.department} added to the database.`);
      });
  }
}

async function getEmployeeQuestions(employeeList) {
  return new Promise(function(resolve, reject) {
    db.query('SELECT title from employee_role', function (err, results) {
      if (err) {
        reject(err);
      }
      const roleList = results.map(obj => obj.title);
      const employeeQuestions = [
        {
          type: 'input',
          message: 'What is the employee\'s first name?',
          name: 'first'
        },
        {
          type: 'input',
          message: 'What is the employee\'s last name?',
          name: 'last'
        },
        {
          type: 'list',
          message: 'What is the employee\'s role?',
          name: 'title',
          choices: roleList,
        },
        {
          type: 'list',
          message: 'Who is the employee\'s manager?',
          name: 'manager',
          choices: employeeList,
        },
      ];
      resolve(employeeQuestions);
    })
  });
}

async function getRoleQuestions() {
  return new Promise(function(resolve, reject) {
    db.query('SELECT dept_name FROM department', function (err, results) {
      if (err) {
        reject(err);
      }
      const deptList = results.map(obj => obj.dept_name);
      const roleQuestions = [
        {
          type: 'input',
          message: 'What is the name of the role?',
          name: 'title'
        },
        {
          type: 'input',
          message: 'What is the salary of the role?',
          name: 'salary'
        },
        {
          type: 'list',
          message: 'Which department does the role belong to?',
          name: 'department',
          choices: deptList,
        },
      ];
      resolve(roleQuestions);
    })
  });
}

async function getRoleId(roleName) {
  return new Promise(function(resolve, reject) {
    db.query('SELECT id FROM employee_role WHERE title = ?', roleName,  function (err, results) {
      if (err) {
        reject(err);
      }
      const roleId = results[0].id;
      resolve(roleId);
    })
  });
}

async function getDeptId(deptName) {
  return new Promise(function(resolve, reject) {
    db.query('SELECT id FROM department WHERE dept_name = ?', deptName,  function (err, results) {
      if (err) {
        reject(err);
      }
      const roleId = results[0].id;
      resolve(roleId);
    })
  });
}

async function getManagerId(firstName, lastName) {
  return new Promise(function(resolve, reject) {
    db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [firstName, lastName],  function (err, results) {
      if (err) {
        reject(err);
      }
      console.log(results);
      const managerId = results[0].id;
      resolve(managerId);
    })
  });
}

async function getEmployeeList() {
  return new Promise(function(resolve, reject) {
    db.query('SELECT first_name, last_name FROM employee', function (err, results) {
      if (err) {
        reject(err);
      }
      const employeeList = results.map(object => object.first_name + ' ' + object.last_name);
      resolve(employeeList);
    })
  });
}

init();