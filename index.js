// Import and require mysql2
import mysql from 'mysql2';
import inquirer from 'inquirer';

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
  await inquirer
    .prompt(initQuestions)
    .then(async (res) => {
      if (res.choice != 'Quit') {
        print(res.choice);
      } else {
        print('Quitting!');
      }
    })
}