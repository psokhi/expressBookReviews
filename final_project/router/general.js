const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  
// Task1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
});

// Task2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Task3 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  for (var key in books) {
    if (books[key]["author"] === author) {
        res.send(books[key])
    }
  } 
  res.send("Author not found");
});

// Task4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  for (var key in books) {
    if (books[key]["title"] === title) {
        res.send(books[key])
    }
  }
  res.send("Title not found");
});

// Task5 
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

// Task10-13
async function getBookListAsync(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error; // Re-throw the error for handling in the route
    }
  }
  
  // Task10 promise
  public_users.get('/promise', function (req, res) {
    try {
      getBookListWithPromise('http://localhost:5000/') 
        .then(bookList => {
          res.json(bookList);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book list" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });
  
  // Task10 async-await
  public_users.get('/async', async function (req, res) {
    try {
      const bookList = await getBookListAsync('http://localhost:5000/'); //
      res.json(bookList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book list" });
    }
  });
  
  // Task11 With Promise
  public_users.get('/promise/isbn/:isbn', function (req, res) {
    try {
      const requestedIsbn = req.params.isbn;
      getBookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });

  // Task11 async-await
  public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
      const requestedIsbn = req.params.isbn;
      const book = await getBookListAsync("http://localhost:5000/isbn/" + requestedIsbn);
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });
  
  // Task12 promise
  public_users.get('/promise/author/:author', function (req, res) {
    try {
      const requestedAuthor = req.params.author;
      getBookListWithPromise("http://localhost:5000/author/" + requestedAuthor) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });

  // Task12 async-await
  public_users.get('/async/author/:author', async function (req, res) {
    try {
      const requestedAuthor = req.params.author;
      const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });
  
  // Task13 promise
  public_users.get('/promise/title/:title', function (req, res) {
    try {
      const requestedTitle = req.params.title;
      getBookListWithPromise("http://localhost:5000/title/" + requestedTitle) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });

  // Task13 async-await
  public_users.get('/async/title/:title', async function (req, res) {
    try {
      const requestedTitle = req.params.title;
      const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });
  
module.exports.general = public_users;
