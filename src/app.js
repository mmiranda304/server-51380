import express from 'express'
import handlebars from "express-handlebars";
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import path from "path";
import config from "./config/config.js";

import { productsRouter } from './routes/products.router.js';
import { cartRouter } from './routes/cart.router.js';
import { usersRouter } from './routes/users.router.js';
import { authRouter } from './routes/auth.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { viewsRouter } from './routes/views.router.js';
import { __dirname, connectMongo } from "./utils.js";
import { iniPassport } from './config/passport.config.js';
import { mockRouter } from './routes/mock.router.js';
import errorHandler from './middlewares/error.js';
import { addLogger } from './utils/logger.js';

const app = express();
const port = process.env.port;

connectMongo();

export const httpServer = app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});

app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//--------------------- SESSION ---------------------//
app.use(
  session({
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URL, 
      ttl: 5000 
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
//-------------------- PASSPORT ---------------------//
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
///---------------- Routes ----------------///
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api', mockRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter);;

// Error handler
app.use(errorHandler);

app.get("*", (req, res) => {    // Catch all
    return res.status(400).json({
        status: "error", 
        msg: 'Route not found',
        data: {},
    });
});