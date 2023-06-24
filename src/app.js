import express from 'express'
import handlebars from "express-handlebars";
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';

import path from "path";
import { productsRouter } from './routes/products.router.js';
import { cartRouter } from './routes/cart.router.js';
import { viewsRouter } from './routes/views.router.js';
import { authRouter } from './routes/auth.router.js';
import { sessionsRouter } from './routes/sessions.router.js';
import { __dirname, connectMongo } from "./utils.js";
import { iniPassport } from './config/passport.config.js';

const app = express();
const port = 8080;

export const httpServer = app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//--------------------- SESSION ---------------------//
app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://mmiranda:btdW2Ag*A-wEFRB@backendcoder.a9snl5i.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 1000 }),
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
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/auth', authRouter);;

connectMongo();

app.get("*", (req, res) => {    // Catch all
    return res.status(400).json({
        status: "error", 
        msg: 'Route not found',
        data: {},
    });
});