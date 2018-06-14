require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");

var storeCompleteList;

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: process.env.password,
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    storeFront();

});


function storeFront() {
    connection.query("SELECT * FROM store", function (err, res) {
        if (err) throw err;

        var storeCompleteList = res;
        console.log("Welcome to bamazon! Products are listed below \n");
        for (var i = 0; i < res.length; i++) {
            console.log(`Item ID: ${res[i].id}`)
            console.log(`Item: ${res[i].item}`)
            console.log(`Price: ${res[i].price}\n`)
        };
        choosingItem(res);
        // connection.end();

    });
};

function choosingItem(res) {
    inquirer.prompt([
        {
            type: "input",
            name: "itemIDPrompt",
            message: "Enter the Item ID of the product you would like to buy."
        }
    ]).then(answers => {
        var validID = false;
        var selectedItemID;
        for (var i = 0; i < res.length; i++) {
            if (res[i].id == answers.itemIDPrompt) {
                validID = true;
                selectedItemID = res[i].id;
            };
        };
        if (validID !== true) {
            console.log("No such Item ID exist. Please try again");
            choosingItem(res);
        } else {
            console.log(`Great choice! You selected ${res[selectedItemID - 1].item}.`);
            inquirer.prompt([
                {
                    type: "input",
                    name: "quantityPrompt",
                    message: "Enter the quantity of the product you would like to buy."
                }
            ]).then(answers => {
                var remainingStock = res[selectedItemID - 1].quantity - answers.quantityPrompt;
                if (answers.quantityPrompt <= res[selectedItemID - 1].quantity) {
                    connection.query("UPDATE store SET ? WHERE ?",
                    [
                        {
                            quantity: remainingStock
                        },
                        {
                            id: selectedItemID
                        }
                    ],function (err2, res2) {
                        if (err2) throw err2;
                    });
                    console.log(`You have purchased ${answers.quantityPrompt} ${res[selectedItemID - 1].item} which costs a total of ${answers.quantityPrompt * res[selectedItemID - 1].price}`);
                    console.log(`There are ${remainingStock} left in stock`);
                    console.log(`Thank you for shopping with us\n`);
                    connection.end();
                } else {
                    console.log("We do not have that many in stock. Please try again.");
                    choosingItem(res);
                };

            });

        };

    });

}
