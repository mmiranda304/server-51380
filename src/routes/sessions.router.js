import express from 'express';
import passport from 'passport';
import { sessionsController } from '../controllers/sessions.controller.js';

export const sessionsRouter = express.Router();

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionsController.UpdateUser);
sessionsRouter.get('/show', sessionsController.sendSession);