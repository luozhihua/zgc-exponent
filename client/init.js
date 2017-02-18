const path = require('path')
const low = require('lowdb')
const db = low(path.join(__dirname, './data/db.json'));

db.defaults({
    posts: []
})
.write();


db.get('posts')
  .push({ name: process.argv[2] })
  .write();

