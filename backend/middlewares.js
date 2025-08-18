

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


function mergedLogger (req, res, next) {

  const model = req.params.role.toLowerCase()

  console.log(req.body)

  // Ensure model exists and is valid
  if (!model || !['doctor', 'patient', 'family', 'nurse'].includes(model)) {
    req.flash('error', 'Invalid role selected');
    return res.redirect('/login');
  }

  // Dynamically authenticate using the selected model's strategy
  passport.authenticate(`${model}-local`, { failureRedirect: '/login', failureFlash: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash('error', 'Invalid username or password or role');
      return res.redirect('/login');
    }

    // Log the user in and proceed to next logic
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // Redirect to the user's dashboard based on the model
      if (model === 'doctor') {
        return res.send('Doctor logged in')
      } else if (model === 'patient') {
        return res.send('Patient logged in')
      } else if (model === 'family') {
        return res.send('Family logged in')
      } else if (model === 'nurse') {
        return res.send('Nurse logged in')
      }
    });
  })(req, res, next);
};




module.exports = {
  isLoggedIn,
  isPatient,
  isDoctor,
  isFamily,
  mergedLogger
};
