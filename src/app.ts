import { MySql } from "./util/mysql-connector";
import routes from "./routes";
import express, { Application } from "express";
import es6Renderer from "express-es6-template-engine";
import rateLimit from 'express-rate-limit'

export async function init() {
  //Connecting to MYSQL with the information from the .env file
  const mysql: MySql = new MySql({
    database: process.env.DB_TABLE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  //Initialize RateLimit
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 20, // Limit each IP to 20 requests per `window` (here, per 1 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  //Express Init
  const app: Application = express();

  //Declare to use port from .ENV
  const port = process.env.SERVER_PORT;

  //this is to use the inbuilt express method to recognize the incoming Request Object as a JSON Object
  app.use(express.json());

  //Frontend View Engine to render pages with backend values
  app.engine("html", es6Renderer);
  app.set("views", "views");
  app.set("view engine", "html");

  //Register the port to listen on
  app.listen(port, (): void => {
    console.log(`Now listening on port ${port}`);
  });

  //Create mysql connection
  await mysql.createConnection();

  //Insert RateLimit into express
  app.use(limiter);

  //Initialize the API post calls and Frontend GET calls
  routes(app, mysql);
}
init();
