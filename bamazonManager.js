const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "bamazon_db"
});

connection.connect(err => {
  if (err) throw err;
  start();
});
function start() {
  inquirer
    .prompt([
      {
        message: "What would you like to do?",
        type: "list",
        name: "options",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      }
    ])
    .then(res => {
      if (res.options === "View Products for Sale") {
        viewProducts();
        setTimeout(()=>{
          again();
        },10)
      } else if (res.options === "View Low Inventory") {
        viewLowInven();
      } else if (res.options === "Add to Inventory") {
        addInven();
      } else if (res.options === "Add New Product") {
        addProductPrompt();
      } else {
        console.log("working!");
      }
    });
}

function viewProducts() {
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;
    res.forEach(test => {
      console.log(`
|ID: ${test.item_id}|Product: ${test.product_name}| Department: ${
        test.department_name
      } | $${test.price} | Quantity: ${test.stock_quantity}|
            `);
    });
  });
}

function anythingElse() {
  inquirer
    .prompt([
      {
        message: "anything else?",
        type: "input",
        name: "ans"
      }
    ])
    .then(res => {
      if (res.ans === "y") {
        start();
      } else {
        console.log("bye bye!");
        connection.end();
      }
    });
}

function viewLowInven() {
  let query =
    "SELECT product_name, stock_quantity FROM products WHERE stock_quantity <= 500";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log(`
====================
LOW INVENTORY
====================
`);
    res.forEach(ans => {
      console.log(`
|Product: ${ans.product_name} | Quantity: ${ans.stock_quantity}|
                          `);
    });
    again();
  });
}

function addInven() {
  setTimeout(() => {
    inquirer
      .prompt([
        {
          message: "What is the ID of product you want to add more inventory:",
          type: "input",
          name: "pId"
        },
        {
          message: "How much of the item do you want to add? (number)",
          type: "input",
          name: "pAmount"
        }
      ])
      .then(ans => {
        let theStock = 0;
        let query1 = `SELECT stock_quantity FROM products WHERE ?`;
        connection.query(query1, { item_id: ans.pId }, (err, res) => {
          if (err) throw err;
          res.forEach(stock => {
            theStock = stock.stock_quantity;
          });
          connection.query(
            `UPDATE products SET stock_quantity = ${theStock +
              parseInt(ans.pAmount)} WHERE ? `,
            { item_id: ans.pId },
            (err, resp) => {
              if (err) throw err;
              console.log("UPDATED!");
              anythingElse();
            }
          );
        });
      });
  }, 10);
  viewProducts();
}

function addProductPrompt() {
  inquirer
    .prompt([
      {
        message: "Do you want to add a new product? (y/n)",
        type: "input",
        name: "ans"
      }
    ])
    .then(res => {
      if (res.ans === "y") {
        addProduct();
      }
    });
}

function addProduct() {
  inquirer
    .prompt([
      {
        message: "product name:",
        type: "input",
        name: "pName"
      },
      {
        message: "department name:",
        type: "list",
        name: "pDepartment",
        choices: [
          "Electronics",
          "Sports and Outdoors",
          "Food and Grocery",
          "Movie, Music and Games"
        ]
      },
      {
        message: "price:",
        type: "input",
        name: "pPrice"
      },
      {
        message: "stock quantity:",
        type: "input",
        name: "pStock"
      }
    ])
    .then(res => {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: res.pName,
          department_name: res.pDepartment,
          price: res.pPrice,
          stock_quantity: res.pStock
        },
        (err, res) => {
          if (err) throw err;
          console.log(`Product Added!`);
          again();
        }
      );
    });
}

function again() {
  inquirer
    .prompt([
      {
        message: "Need to do something else? (y/n)",
        type: "input",
        name: "ans"
      }
    ])
    .then(res => {
      if (res.ans === "y") {
        start();
      } else {
        console.log("bye bye");
        connection.end();
      }
    });
}
