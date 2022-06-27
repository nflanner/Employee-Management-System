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
    db.query('SELECT * FROM employee_role', function(err, results) {
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
    console.log('get employee role list!!')
    const employeeQuestions = await getEmployeeQuestions();
    await inquirer
      .prompt(employeeQuestions)
      .then(async (res) => {
        console.log(`ADDING ${res.choice}`);
        // db.query(`INSERT INTO employee (first_name, last_name, role_id, manager) VALUES ?`, (res.first, res.last, roleId, res.manager), (err, results) => {
        //   console.table(results);
        // })
      });
  } else if (choice.includes('Role')) {
    db.query('SELECT * FROM employee_role', function(err, results) {
      console.table(results);
    })
  } else {
    await inquirer
      .prompt(deptQuestions)
      .then(async (res) => {
        db.query(`INSERT INTO department (dept_name) VALUES ?`, res.department, (err, results) => {
          console.table(results);
        })
      });
  }
}

async function getEmployeeQuestions() {
  console.log('QUERYING');
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
          message: 'What is the employee\'s role',
          name: 'choice',
          choices: roleList,
        },
      ];
      resolve(employeeQuestions);
    })
  });
}

init();