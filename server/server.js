const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000'
  // origin: 'http://34.68.219.73/'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database

const db = require('./app/models');

// const { sequelize } = db;

const Role = db.role;
const User = db.user;
const Topic = db.topic;

const { ROLES, TOPICS } = db;

// eslint-disable-next-line no-unused-vars
 async function initial() {
  // user roles initialize ...
  const countRole = await Role.count();
  if(countRole === 0)
    ROLES.forEach((role) => {
      Role.create({
        name: role
      });
    });

  const countUser = await Role.count();
  if(countRole === 0)
  // admin setting
  User.create({
    firstname: 'Zakwan',
    lastname: 'Jaroucheh',
    email: 'admin@researchary.com',
    photoURL: '/static/mock-images/avatars/avatar_1.png',
    roleId: 1,
    password: bcrypt.hashSync('root', 8),
    unHashedPassword: 'root'
  });
}
db.sequelize.sync().then(() => {
  initial();
});

// force: true will drop the table if it already exists

// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Researchary application.' });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
