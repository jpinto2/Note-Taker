const express = require('express');
const path = require('path');
const fs = require('fs')
const uuid = require('uuid');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

//api routes
app.get('/api/notes' , (req , res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) console.error(err);
        else res.json(JSON.parse(data));
        })
  })
   
app.post('/api/notes', (req, res) => {
    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) console.error(err);
      else {
        // Convert string into JSON object
          const notes = JSON.parse(data);

          // create new note and add it to current ones
          const newNote = req.body;
          newNote.id = uuid();
          notes.push(newNote);


        // Write updated notes back to the file
        // this part seems to be a bit buggy in terms of displaying the updated notes
          fs.writeFile('./db/db.json',
          JSON.stringify(notes),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Note added')
        );
        res.json(notes);
      }
    });
});

// html routes
app.get('/', (req , res) => {
    res.sendFile(path.join(__dirname , './public/index.html'))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname , './public/notes.html'))
})

app.get('*' , (req , res) => {
    res.sendFile(path.join(__dirname , './public/index.html'))
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
