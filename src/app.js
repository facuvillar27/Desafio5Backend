import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
// import FileStore from 'session-file-store';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import { __dirname } from './utils.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import loginRouter from './routes/login.routes.js';
import signupRouter from './routes/signup.routes.js';
import sessionRouter from './routes/session.routes.js';
import viewsRouter from './routes/views.routes.js';
import logoutRouter from './routes/logout.routes.js';

dotenv.config();

const app = express();
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/ecommerce';
const COOKIESECRET = process.env.COOKIESECRET 
app.use(cookieParser(COOKIESECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


app.use(session({
    store: MongoStore.create({ 
        mongoUrl: DB_URL,
        ttl: 15,
        mongoOptions: {
            useNewUrlParser: true,
        }
    }),
    secret: COOKIESECRET,
    resave: false,
    saveUninitialized: false,
})
);

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/views", viewsRouter);
app.use("/", sessionRouter);
app.use("/logout", logoutRouter);

const enviroment = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(error);
    }
}

enviroment();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));