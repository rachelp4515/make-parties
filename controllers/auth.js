const jwt = require('jsonwebtoken');

function generateJWT(user) {
  const mpJWT = jwt.sign({ id: user.id }, 'AUTH-SECRET', {
    expiresIn: 60 * 60 * 24 * 60,
  });

  return mpJWT;
}

module.exports = function (app, models) {
  app.get('/sign-up', (req, res) => {
    res.render('sign-up', {});
  });
  app.get('/login', (req, res) => {
    res.render('login', {});
  });

  app.post('/sign-up', (req, res) => {
    models.User.create(req.body)
      .then((user) => {
        const mpJWT = generateJWT(user);
        res.cookie('mpJWT', mpJWT);
        req.session.sessionFlash = {
          type: 'success',
          message: 'You have successfully created an account!',
        };
        res.redirect('/');
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.post('/login', (req, res, next) => {
    models.User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (!isMatch) {
            req.session.sessionFlash = {
              type: 'warning',
              message:
                'No account exists associated with that email. Please try again.',
            };
            return res.redirect('/login');
          }
          const mpJWT = generateJWT(user);
          res.cookie('mpJWT', mpJWT);
          res.redirect('/');
        });
      })
      .catch((err) => {
        console.log(err);
        req.session.sessionFlash = {
          type: 'warning',
          message:
            'No account exists associated with that email. Please try again.',
        };
        return res.redirect('/login');
      });
  });

  app.get('/logout', (req, res, next) => {
    res.clearCookie('mpJWT');

    return res.redirect('/');
  });

  app.get('/me', (req, res) => {
    console.log(req.user);
    models.User.findByPk(req.user.id)
      .then((user) => {
        res.render('myprofile', { user: user });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};