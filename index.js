// Import and require mysql2
import mysql from 'mysql2';
import inquirer from 'inquirer';
import cTable from 'console.table';
import {Utils} from './utils.js';

const utils = new Utils();

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
            await utils.viewDB(res.choice);
          } else if (res.choice.includes('Add')) {
            await utils.addToDB(res.choice);
          } else {
            await utils.updateDB();
          }
        } else {
          console.log('Quitting!');
          quit = 1;
        }
      });
  }
}

init();