// routes/index.js
// Routes for the StudyHuddle pages:
//   GET  /        -> landing page with the list of upcoming study sessions
//   GET  /create  -> form to host a new study session
//   POST /create  -> validates the form and saves the session to MongoDB

var express = require('express');
var router = express.Router();
var StudySession = require('../models/StudySession');

// Friendly names for each schema field, used in validation messages
const fieldLabels = {
  courseCode: 'Course code',
  topic: 'Topic',
  date: 'Date',
  time: 'Time',
  location: 'Location',
  spotsAvailable: 'Open spots',
  createdBy: 'Your name'
};

// Returns today's date (in Toronto time) as a Date at midnight UTC.
// Dates from <input type="date"> are saved as midnight UTC, so comparing
// against this value correctly includes sessions happening later today.
function startOfToday() {
  const todayString = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' }); // "YYYY-MM-DD"
  return new Date(todayString);
}

/* GET landing page: show upcoming sessions, soonest first. */
router.get('/', async function (req, res, next) {
  try {
    const sessions = await StudySession.find({ date: { $gte: startOfToday() } })
      .sort({ date: 1, time: 1 });

    res.render('index', {
      title: 'Home',
      sessions: sessions,
      created: req.query.created === '1' // true right after a session is created
    });
  } catch (err) {
    next(err); // hands database errors to the error handler in app.js
  }
});

/* GET create page: empty form. */
router.get('/create', function (req, res, next) {
  res.render('create', { title: 'Host a Study Session', errors: [], form: {} });
});

/* POST create page: validate, save, then go back to the landing page. */
router.post('/create', async function (req, res, next) {
  const form = req.body; // fields from the form (parsed by express.urlencoded in app.js)
  const errors = [];

  // Build the document from the form (not saved yet)
  const session = new StudySession({
    courseCode: (form.courseCode || '').trim().toUpperCase(),
    topic: (form.topic || '').trim(),
    date: form.date,
    time: form.time,
    location: (form.location || '').trim(),
    spotsAvailable: form.spotsAvailable,
    createdBy: (form.createdBy || '').trim()
  });

  // 1. Mongoose checks the "required" and "min" rules defined in models/StudySession.js
  try {
    await session.validate();
  } catch (err) {
    if (err.name !== 'ValidationError') return next(err);
    // Turn each Mongoose validation error into a readable message
    Object.values(err.errors).forEach(function (e) {
      const label = fieldLabels[e.path] || e.path;
      if (e.kind === 'required') errors.push(label + ' is required.');
      else if (e.kind === 'min') errors.push(label + ' must be at least ' + e.properties.min + '.');
      else errors.push(label + ' is not valid.');
    });
  }

  // 2. Extra check the schema can't do: the session can't be in the past
  if (session.date && session.date < startOfToday()) {
    errors.push('The date can\'t be in the past.');
  }

  // Something was wrong: show the form again with the messages and the user's input
  if (errors.length > 0) {
    return res.status(400).render('create', { title: 'Host a Study Session', errors: errors, form: form });
  }

  // 3. Everything is valid: save to MongoDB and go back to the landing page
  try {
    await session.save();
    res.redirect('/?created=1');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
