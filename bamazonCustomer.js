var mysql = require("mysql");
const inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "bamazon_db"
});
// connects to database
connection.connect(err => {
  if (err) throw err;
  start();
});
// starts Bamazon
function start() {
  inquirer
    .prompt([
      {
        type: "list",
        message: `Hello do you want to enter Bamazon`,
        name: "data",
        choices: ["yes", "no"]
      }
    ])
    .then(res => {
      console.log(res.data);
      if (res.data === "yes") {
        print();
      } else {
        console.log("bye bye");
        connection.end();
      }
    });
}
// prints Bamazon inventory
function print() {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) {
      console.log(err);
      connection.end();
    } else {
      res.forEach(test => {
        console.log(`
|ID: ${test.item_id}|Product: ${test.product_name}| Department: ${
          test.department_name
        } | $${test.price} | Quantity: ${test.stock_quantity}|
            `);
      });
      selectProduct();
    }
  });
}
// user picks product prompt
function selectProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        message: `Enter ID of item you want to buy. If you don't want to buy anything enter q`,
        name: "product_Id"
      }
    ])
    .then(res => {
      if (res.product_Id === "") {
        console.log(`You didn't select anything!`);
        select();
      } else if (res.product_Id === "q") {
        console.log("bye bye");
        connection.end();
      } else {
        selectItem(res);
      }
    });
}

function selectItem(ans) {
  let query =
    "SELECT product_name, department_name, price, stock_quantity FROM products WHERE ?";
  connection.query(query, { item_id: ans.product_Id }, (err, res) => {
    if (err) throw err;
    res.forEach(ans => {
      console.log(`
|Product: ${ans.product_name}| $${ans.price} | Quantity: ${ans.stock_quantity}|
                        `);
      buyPrompt(ans.stock_quantity, ans.product_name);
    });
  });
}
// prompts user how many they want
function buyPrompt(quantity, product) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "How many do you want?",
        name: "amount"
      }
    ])
    .then(res => {
      updateProductAmount(res.amount, quantity, product);
    });
}
// updates product quantity amount
function updateProductAmount(amount, quantity, product) {
  if (quantity < amount) {
    console.log("Insufficient quantity!");
    buyPrompt(quantity, product);
  } else {
    let query = `UPDATE products SET stock_quantity=${quantity -
      amount} where ?`;
    connection.query(query, { product_name: product }, (err, res) => {
      if (err) throw err;
      connection.query(
        `SELECT price FROM products WHERE ?`,
        { product_name: product },
        (err, res) => {
          if (err) throw err;
          res.forEach(price => {
            let total = price.price * amount;
            console.log(`Your total was: $${total.toFixed(2)}`);
            again();
          });
        }
      );
    });
  }
}

function again() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "again",
        message: "Order something else? (y/n)"
      }
    ])
    .then(res => {
      if (res.again === "y") {
        print();
      } else {
        console.log("Come Again, bye bye!");
        connection.end();
      }
    });
}
