const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the "public" folder
app.use(express.static("public"));

// Route to serve the notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Default route to serve the index page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// GET route to retrieve all saved notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// POST route to add a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  // Read the current notes
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    newNote.id = notes.length ? notes[notes.length - 1].id + 1 : 1; // Assign a unique ID
    notes.push(newNote);

    // Write updated notes back to db.json
    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.json(newNote); // Send the new note back to the client
    });
  });
});
