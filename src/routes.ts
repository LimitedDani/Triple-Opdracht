import { Express, Request, Response } from "express";
import { AddressController } from "./controller/address.controller";
import { CampaignController } from "./controller/campaign.controller";
import { CouponController } from "./controller/coupon.controller";
import { WinnerLoserController } from "./controller/winnerloser.controller";
import { send404 } from "./util/http";
import { MySql } from "./util/mysql-connector";

function routes(app: Express, mysql: MySql) {
  
  //This is the page where you'll find all campaigns
  app.get("/", (req, res) => {
    CampaignController.renderCampaignIndexPage(req, res, mysql);
  });
  console.info("renderCampaignIndexPage Initialized (GET)");

  //Page to enter your coupon code, if this is a correct coupon code,
  //you will go to the page where you have to enter your credentials
  app.get("/campaign/:campaignID", (req, res) => {
    CampaignController.renderCampaignPage(req, res, mysql);
  });
  console.info("renderCampaignPage Initialized (GET)");

  //Page to enter your credentials, if your coupon is a winning coupon
  //you will go to the page that says your item is on its way
  //if you dont have a winning coupon the page says next time better
  app.get("/campaign/:campaignID/:couponID", (req, res) => {
    AddressController.createAddressPage(req, res, mysql);
  });
  console.info("createAddressPage Initialized (GET)");

  //Winner page where it says that the item is on its way
  app.get("/winner/:campaignID", (req, res) => {
    WinnerLoserController.renderWinnerPage(req, res, mysql);
  });
  console.info("renderWinnerPage Initialized (GET)");

  //Loser page, when you didn't won a item
  app.get("/loser/:campaignID", (req, res) => {
    WinnerLoserController.renderLoserPage(req, res, mysql);
  });
  console.info("renderLoserPage Initialized (GET)");


  app.get("/createCampaign/:campaign/:password", (req, res) => {
    CampaignController.createCampaign(req, res, mysql);
  });

  app.get("/createWinningCoupon/:campaign/:coupon/:password", (req, res) => {
    CouponController.createWinningCoupon(req, res, mysql);
  });

  //If you're going to a path that doesn't exist, you'll get a 404 error
  app.get("*", function (req, res) {
    send404(res);
  });
  console.info("404 Page Initialized (GET)");

  app.post("/validateCoupon", (req, res) => {
    CouponController.validateCouponCall(req, res, mysql);
  });
  console.info("validateCouponCall Initialized (POST)");

  app.post("/validateAddress", (req, res) => {
    AddressController.validateAddressCall(req, res, mysql);
  });
  console.info("validateAddressCall Initialized (POST)");
}
export default routes;
