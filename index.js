const express = require("express");
const res = require("express/lib/response");
const faker = require("faker");
const cors = require("cors");
const app = express();
const PORT = 8080;

//conver body to json
app.use(express.json());

//enable CORS
app.use(cors());

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));

//data

function generateTransaction() {
  const id = faker.random.uuid();
  const name = faker.name.findName();
  const amount = faker.finance.amount();

  return {
    id,
    name,
    amount,
  };
}

function generateTransactionList(count) {
  const transactionList = [];
  for (let i = 0; i < count; i++) {
    const transaction = generateTransaction();
    transactionList.push(transaction);
  }

  return transactionList;
}

const transactions = generateTransactionList(10);
const accounts = [];

//api calls

//gets transactions
app.get("/transactions", (req, res) => {
  res.status(200).send(transactions);
});

//gets accounts
app.get("/accounts", (req, res) => {
  res.status(200).send(accounts);
});

app.post("/accounts/:username/:email/:password", (req, res) => {
  const id = faker.random.uuid();
  const { username, email, password } = req.params;

  if (!username || !email || !password) {
    res
      .status(400)
      .send({ message: "Missing required parameters in the URL." });
    return;
  }

  const newAccount = {
    id,
    username,
    email,
    password,
  };

  accounts.push(newAccount);

  res.status(201).send({
    message: "Account added succesfully",
    data: {
      id: id,
      username: username,
      email: email,
      password: password,
    },
  });
});

app.post("/transactions/:id/:name/:amount", (req, res) => {
  const { id, name, amount } = req.params;

  // Check if required parameters are present
  if (!id || !name || !amount) {
    res
      .status(400)
      .send({ message: "Missing required parameters in the URL." });
    return;
  }

  // Create a new transaction object
  const newTransaction = {
    id,
    name,
    amount,
  };

  // Add the new transaction to the existing list
  transactions.push(newTransaction);

  res.status(201).send({
    message: "Transaction added successfully.",
    transaction: newTransaction,
  });
});
