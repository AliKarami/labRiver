module.exports = function ( req, res, next ) {
  if ( req.isAuthenticated () && req.user.nickname=="admin") {
    return next ();
  }
  else {
    return res.redirect ( '/' );
  }
};
