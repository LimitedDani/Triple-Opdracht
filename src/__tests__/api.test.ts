import express, { Application } from "express";
import es6Renderer from "express-es6-template-engine";
import supertest from "supertest";
import routes from "../routes";
import { MySql } from "../util/mysql-connector";

const app: Application = express();

//Declare to use port from .ENV
const port = process.env.TEST_PORT;

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

//Connecting to MYSQL with the information from the .env file
const mysql: MySql = new MySql({
    database: process.env.DB_TABLE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

//Create Connection
mysql.createConnection();

//Register Routes
routes(app, mysql);

describe("FrontEnd", () => {
    it("Check if index page is available (gives a 200)", async () => {
  
        const { statusCode, body } = await supertest(app).get("/");
        expect(statusCode).toBe(200);
    });
});
describe("BackEnd", () => {
    it("Campaign not found", async () => {
  
        const { statusCode, body } = await supertest(app).post("/validateCoupon").send({
            campaign: 999999,
            coupon: "AAAAAAAAA"
        });
        expect(body).toStrictEqual({error: true, status: "CAMPAIGN_DOES_NOT_EXIST"});
        expect(statusCode).toBe(400);
    });
    it("ValidateCoupon Valid", async () => {
        const { statusCode, body } = await supertest(app).post("/validateCoupon").send({
            campaign: 0,
            coupon: "123456789"
        });
        expect(body).toStrictEqual({error: false, status: "COUPON_VALIDATED"});
        expect(statusCode).toBe(200);
    });
    it("ValidateCoupon Invalid", async () => {
  
        const { statusCode, body } = await supertest(app).post("/validateCoupon").send({
            campaign: 0,
            coupon: "AAAAAAAAA"
        });
        expect(body).toStrictEqual({error: true, status: "COUPON_INVALID"});
        expect(statusCode).toBe(400);
    });

    it("Address credentials empty", async () => {
        const address = {
            coupon: "", 
            campaign: "",
            first_name: "",
            last_name: "",
            address: "",
            city: "", 
            postal_code: ""
        };
        const { statusCode, body } = await supertest(app).post("/validateAddress").send(address);
        expect(body).toStrictEqual({error: true, status: "Not all fields are filled in!"});
        expect(statusCode).toBe(400);
    });

    it("Address credentials filled in", async () => {
        const address = {
            coupon: "123456789", 
            campaign: "0",
            first_name: "TestName",
            last_name: "TestLastName",
            address: "TestStreet 1",
            city: "TestCity", 
            postal_code: "1234AA"
        };
        const { statusCode, body } = await supertest(app).post("/validateAddress").send(address);
        expect(body).toStrictEqual({error: false, status: "LOSER"});
        expect(statusCode).toBe(200);
    });
});