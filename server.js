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

// DELETE route to delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);  // Get the note ID from the request parameters

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    let notes = JSON.parse(data);  // Parse the current notes from db.json
    notes = notes.filter(note => note.id !== noteId);  // Filter out the note with the matching ID

    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {  // Write the updated notes back to db.json
      if (err) throw err;
      res.json({ message: "Note deleted" });  // Send a response indicating the note was deleted
    });
  });
});

// Route to serve the notes page (notes.html)
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// Default route to serve index.html (must be the last route)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
