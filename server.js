const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const notes = JSON.parse(data);
    const newNote = { id: notes.length + 1, title: req.body.title, text: req.body.text };

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
      if (err) return res.status(500).json({ error: 'Internal Server Error' });

      res.json(notes);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    let notes = JSON.parse(data);
    const index = notes.findIndex(note => note.id === parseInt(req.params.id));

    if (index !== -1) {
      notes.splice(index, 1);

      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error' });

        res.json(notes);
      });
    } else {
      return res.status(404).json({ error: 'Note not found' });
    }
  });
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Internal Server Error' });

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
