import express from 'express'
import handlebars from "express-handlebars";
import { productsRouter } from './routes/products.router.js';
import { cartRouter } from './routes/cart.router.js';
import { viewsRouter } from './routes/views.router.js';
import path from "path";
import { __dirname, connectMongo } from "./utils.js";

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

///---------------- Routes ----------------///
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/', viewsRouter);

connectMongo();

app.get("*", (req, res) => {    // Catch all
    return res.status(400).json({
        status: "error", 
        msg: 'Route not found',
        data: {},
    });
});