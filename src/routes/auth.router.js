import express from 'express';
import { isUser, isAdmin } from '../middlewares/auth.js';
import { UserModel } from '../DAO/models/users.model.js';

export const authRouter = express.Router();

authRouter.get('/logout', (req, res) => {               // Logout page
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', {error: 'no se pudo cerrar la sesión'});
      }
      res.redirect('/auth/login')
    });
  });
  authRouter.get('/perfil', isUser, (req, res) => {
      const user = {email: req.session.email, isAdmin: req.session.isAdmin }
      return res.render('/perfil', { user: user });
  
  });
  authRouter.get('/admin', isUser, isAdmin, (req, res) => {
      
      return res.render('Datos clasificados');
  
  });

  authRouter.get('/login', (req, res) => {              // Login Page
    return res.render('login', {});
  });
  
  authRouter.post('/login', async (req, res) => {       // Login POST
      // console.log(req.body.email);
      // console.log(req.body.password);
      const email = req.body.email;
      const password = req.body.password;
      const usuarioEncontrado = await UserModel.findOne({email: email});
      if(usuarioEncontrado && usuarioEncontrado.password === password) {
          req.session.email = usuarioEncontrado.email;
          req.session.isAdmin = usuarioEncontrado.isAdmin;
         
          return res.redirect("/auth/perfil");      // Acá redirigo a products y agrego mensaje de bienvenida con datos de usuario
      }
      else {
          return res.status(401).render("error", { error: 'Email o contraseña erróneos'});
      }
  });
  
  authRouter.get('/register', (req, res) => {           // Register Page
    return res.render('register', {});
  });
  
  authRouter.post('/register', async (req, res) => {    // Register POST
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).render("error", { error: 'Completar todos los campos correctamente'});
        }
        await UserModel.create({ email, password, firstName, lastName, isAdmin: false});
        
        console.log('email', email);
        console.log('req.session', req.session);
        if (req.session) {
            req.session.email = email;
            req.session.isAdmin = false;
            return res.redirect("/auth/perfil");
          } else {
            // Manejar el caso cuando req.session no está definido
            return res.status(500).render("error", { error: 'Error en la configuración de sesiones'});
          }

        // req.session.email = email;
        // req.session.isAdmin = false;
        
        // return res.redirect("/auth/perfil");        // Acá redirigo a products y agrego mensaje de bienvenida con datos de usuario
      } catch (error) {
          console.log(error);
          return res.status(400).render("error", { error: 'No se pudo crear el usuario. Intente con otro mail'});
      }
         
  });
  

