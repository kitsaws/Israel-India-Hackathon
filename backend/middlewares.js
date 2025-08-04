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

module.exports = {
  isLoggedIn,
  isPatient
};
