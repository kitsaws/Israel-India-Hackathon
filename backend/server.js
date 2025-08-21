require('dotenv').config()

const path = require('path')
const app = require(path.join(__dirname,'app'));
const colors = require('colors');
const mongoose = require('mongoose');

const PORT = 3000;


mongoose.connect('mongodb://localhost:27017/loadout')
    .then(() => console.log('Connected to the DB'.bgWhite.black))
    .catch(() => console.log('DB not connected'.red));

app.listen(PORT, () => {
    console.log(`Server live on http://localhost:${PORT}`.bgWhite.black);
});
