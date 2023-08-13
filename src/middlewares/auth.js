export function isUser(req, res, next) {
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    return next();
  }
  if (req.session?.email) {
    return next();
  }
  return res.status(401).render('error', { error: 'Error de autenticacion.' });
};

export function isAdmin(req, res, next) {
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    return next();
  }
  if (req.session?.role === 'admin') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

export function isLogged(req, res, next) {
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/products');
};

export function redirectIfLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/products');
  }
  return next();
};

export function isNotAdmin(req, res, next) {
  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    return next();
  }

  if (req.session?.role !== 'admin') {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};

export function isCartOwner(req, res, next) {
   if ((process.env.NODE_ENV === 'DEVELOPMENT') && (!req.isAuthenticated()) ){
    return next();
  } 
  if (req.session?.cartID === req.params.cid) {
    return next();
  }
  return res.status(403).render('error', { error: 'Error de autorización.' });
};