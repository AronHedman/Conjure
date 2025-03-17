const express = require('express');
const app = express();
const port = 3000;

// Serverar statiska filer från en "public"-mapp
app.use(express.static('public'));

// Starta servern
app.listen(port, () => {
    console.log(`Servern körs på http://localhost:${port}`);
});
