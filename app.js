const express = require('express')
const methodOverride = require('method-override')
const {engine} = require('express-handlebars');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const models = require('./db/models');
const bodyParser = require('body-parser');
const app = express()


app.engine('handlebars', engine({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }));

// --------------------------- /

app.get('/', (req, res) => {
  models.Event.findAll({ order: [['createdAt', 'DESC']] }).then(events => {
    res.render('events', { events: events })
  })
})


// --------------------------- /CREATE

app.post('/events', (req, res) => {
  models.Event.create(req.body).then(event => {
    res.redirect(`/events/${event.id}`)
  }).catch((err) => {
    console.log(err)
  });
})


// --------------------------- /NEW
app.get('/events/new', (req, res) => {
  res.render('events-new', {})
})


// --------------------------- /SHOW 

app.get('/events/:id', (req, res) => {
  models.Event.findByPk(req.params.id).then((event) => {
    res.render('events-show', { event: event })
  }).catch((err) => {
    console.log(err.message)
  })
})
  

// --------------------------- /EDIT
app.get('/events/:id/edit', (req, res) => {
  models.Event.findByPk(req.params.id).then((event) => {
    res.render('events-edit', { event: event });
  }).catch((err) => {
    console.log(err.message);
  })
});


// --------------------------- /UPDATE
app.put('/events/:id', (req, res) => {
  models.Event.findByPk(req.params.id).then(event => {
    event.update(req.body).then(event => {
      res.redirect(`/events/${req.params.id}`);
    }).catch((err) => {
      console.log(err);
    });
  }).catch((err) => {
    console.log(err);
  });
});

// var events = [
//     { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//     { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" },
//     { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn" }
//   ]
  

  


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!')
})
