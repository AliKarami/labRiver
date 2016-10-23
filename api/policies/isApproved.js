module.exports = function ( req, res, next ) {
  if ( req.isAuthenticated () && req.user.approved==true) {
    return next ();
  }
  else {
    if (req.isAuthenticated())
      return res.send ( 'Your account needs admin approval to activate.' );
    else
      return res.redirect('/');
  }
};
