import express from 'express';
import { isUser, isAdmin } from '../middlewares/auth.js';

export const authRouter = express.Router();

authRouter.get('/perfil', isUser, (req, res) => {
  const user = req.session.user;
  return res.render('/perfil', { user: user });
});

authRouter.get('/admin', isUser, isAdmin, (req, res) => {
  return res.render('Datos clasificados');
});
