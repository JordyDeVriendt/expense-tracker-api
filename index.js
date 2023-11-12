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
  const accountId = "1";
  const date = faker.date.recent();

  return {
    id,
    name,
    amount,
    accountId,
    date,
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
const accounts = [
  {
    id: "1",
    username: "demo123",
    email: "demo123",
    password: "demo123",
  },
];

//api calls

//gets transactions
app.get("/transactions", (req, res) => {
  res.status(200).send(transactions);
});

//gets accounts
app.get("/accounts", (req, res) => {
  res.status(200).send(accounts);
});

// creates account
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

// checks login
app.post("/check-account", (req, res) => {
  const { email, password } = req.body;

  // Check if required parameters are present in the request body
  if (!email || !password) {
    res
      .status(400)
      .send({ message: "Missing required parameters in the request body." });
    return;
  }

  // Find the account with the provided email and password
  const existingAccount = accounts.find(
    (account) => account.email === email && account.password === password
  );

  if (existingAccount) {
    res.status(200).send({
      message: "Account exists.",
      data: {
        id: existingAccount.id,
        username: existingAccount.username,
        email: existingAccount.email,
        password: existingAccount.password,
      },
    });
  } else {
    res.status(404).send({ message: "Account not found." });
  }
});

// create Transaction
app.post("/transactions-create/:name/:amount/:accountId", (req, res) => {
  const id = faker.random.uuid();
  const date = new Date();
  const { name, amount, accountId } = req.params;

  // Check if required parameters are present
  if (!name || !amount || !accountId) {
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
    accountId,
    date,
  };

  // Add the new transaction to the existing list
  transactions.push(newTransaction);

  res.status(201).send({
    message: "Transaction added successfully.",
    transaction: newTransaction,
  });
});

// delete transaction
app.delete("/transactions-delete/:id", (req, res) => {
  const { id } = req.params;

  // Find the index of the transaction with the given id
  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id === id
  );

  // Check if the transaction with the given id exists
  if (transactionIndex === -1) {
    res.status(404).send({ message: "Transaction not found." });
    return;
  }

  // Remove the transaction from the array
  const deletedTransaction = transactions.splice(transactionIndex, 1)[0];

  res.status(200).send({
    message: "Transaction deleted succesfully.",
    transaction: deletedTransaction,
  });
});

// update transaction
app.put("/transactions-update/:id/:name/:amount", (req, res) => {
  const { id, name, amount } = req.params;

  // Find the index of the transaction with the given id
  const transactionIndex = transactions.findIndex(
    (transaction) => transaction.id === id
  );

  // Check if the transaction with the given id exists
  if (transactionIndex === -1) {
    res.status(404).send({ message: "Transaction not found." });
    $;
    return;
  }

  // Update the name and amount of the transaction
  transactions[transactionIndex].name =
    name || transactions[transactionIndex].name;
  transactions[transactionIndex].amount =
    amount || transactions[transactionIndex].amount;

  res.status(200).send({
    message: "Transaction updated succesfully.",
    transaction: transactions[transactionIndex],
  });
});

// get transaction by ID
app.get("/transactions/:id", (req, res) => {
  const { id } = req.params;

  // Check if the ID is provided
  if (!id) {
    res.status(400).send({ message: "Missing transaction ID in the URL." });
    return;
  }

  // Find the transaction with the provided ID
  const transaction = transactions.find((t) => t.id === id);

  if (transaction) {
    res.status(200).send({
      message: "Transaction found.",
      transaction: transaction,
    });
  } else {
    res.status(404).send({ message: "Transaction not found." });
  }
});

// get transactions by accountId
app.get("/transactions/account/:accountId", (req, res) => {
  const { accountId } = req.params;

  // Check if the accountId is provided
  if (!accountId) {
    res.status(400).send({ message: "Missing accountId in the URL." });
    return;
  }

  // Find all transactions with the provided accountId
  const accountTransactions = transactions.filter(
    (t) => t.accountId === accountId
  );

  res.status(200).send({
    message: "Transactions found.",
    transactions: accountTransactions,
  });
});
