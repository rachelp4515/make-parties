// Initialize express
require('dotenv').config();
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const jwt = require('jsonwebtoken');
const session = require('express-session');

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const models = require('./db/models');
// require handlebars
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const hbs = exphbs.create({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the cookie
  const token = req.cookies.mpJWT;

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      if (err) {
        console.log(err)
        // redirect to login if not logged in and trying to access a protected route
        res.redirect('/login')
      }
      req.user = user
      next(); // pass the execution off to whatever request the client intended
    })
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (req.user) {
      models.User.findByPk(req.user.id).then(currentUser => {
          res.locals.currentUser = currentUser;
          next()
      }).catch(err => {
          console.error(err)
      })
  } else {
      next();
  }
});

app.use(cookieParser("SECRET"));
const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60) // 60 days

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {expires: expiryDate },
  resave: false
}));

app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});


// Use "main" as our default layout
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);
// app.js

// OUR MOCK ARRAY OF PROJECTS
// var events = [
//   { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//   { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//   { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" }
// ]


// Choose a port to listen on
const port = process.env.PORT || 3000;

// Tell the app what port to listen on
app.listen(port, () => {
  console.log('App listening on port 3000!')
})