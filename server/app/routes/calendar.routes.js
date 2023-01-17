const controller = require('../controllers/calendar.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  
  app.get('/api/calendar-event/getEvents', controller.getEvents);

  // -----------------------------------------------------------------------------------

  app.post('/api/calendar-event/create', controller.create);
  app.post('/api/calendar-event/update', controller.update);

};
