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

require('./controllers/events')(app, models);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('App listening on port 3000!')
})
