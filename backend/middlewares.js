

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be signed in first!');
  return res.redirect('/login'); // or wherever your login page is
}

function isPatient(req, res, next) {
  if (req.isAuthenticated() && req.user.constructor.modelName === 'Patient') {
    return next();
  }
  req.flash('error', 'Access denied: Patients only');
  return res.redirect('/');
}

function isFamily(req, res, next) {
  if (req.isAuthenticated() && req.user.constructor.modelName === 'Family') {
    return next();
  }
  req.flash('error', 'Access denied: Family only');
  return res.redirect('/');
}

function isDoctor(req, res, next) {
  if (req.isAuthenticated() && req.user.constructor.modelName === 'Doctor') {
    return next();
  }
  req.flash('error', 'Access denied: Doctors only');
  return res.redirect('/');
}




module.exports = {
  isLoggedIn,
  isPatient,
  isDoctor,
  isFamily,
};
