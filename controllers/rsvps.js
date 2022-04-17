module.exports = (app, models) => {
    // Create
    app.post('/events/:eventId/rsvps', (req, res) => {
        console.log('Hello')
        req.body.EventId = req.params.eventId;
        console.log(req.body);
        models.Rsvp.create(req.body).then(() => {
            res.redirect(`/events/${req.params.eventId}`);
        }).catch((err) => {
            console.error(err)
        });
    });

    // New
    app.get('/events/:eventId/rsvps/new', (req, res) => {
        models.Event.findByPk(req.params.eventId).then(event => {
            res.render('rsvps-new', { event: event });
        });
    });

    // Show
    app.get('/events/:id', (req, res) => {
        models.Event.findByPk(req.params.id, { include: [{ model: models.Rsvp }] }).then(event => {
            res.render('events-show', { event: event });
        }).catch((err) => {
            console.error(err);
        })
    });

    // DELETE
    app.delete('/events/:eventId/rsvps/:id', (req, res) => {
        models.Rsvp.findByPk(req.params.id).then(rsvp => {
            rsvp.destroy();
            res.redirect(`/events/${req.params.eventId}`);
        }).catch((err) => {
            console.log(err);
        });
    });
} 