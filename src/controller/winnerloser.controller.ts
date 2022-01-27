import { Util } from "../util/util";
import { MySql } from "../util/mysql-connector";
import { Request, Response } from "express";
import { send404 } from "../util/http";
import { CampaignController } from "./campaign.controller";
import { Regex } from "../util/regex";
export class WinnerLoserController {

    /**
     * @param { Request } req
     * @param { Response } res
     * @param { MySql } mysql
     */
    static renderWinnerPage(req: Request, res: Response, mysql: MySql) {
        if(!Util.isStringEmpty(req.params.campaignID)) {
            const campaignID = req.params.campaignID;
            if(Regex.validateCampaign(campaignID)) {
                CampaignController.getCampaign(mysql, campaignID).then(campaign => {
                    res.render(__dirname + "../../html/winner.html", {locals: {campaign: campaign}, root: __dirname});
                }).catch(error => {
                    send404(res);
                });
            } else {
                send404(res);
            }
        } else {
            send404(res);
        }
    }

    /**
     * @param { Request } req
     * @param { Response } res
     * @param { MySql } mysql
     */
    static renderLoserPage(req: Request, res: Response, mysql: MySql) {
        if(!Util.isStringEmpty(req.params.campaignID)) {
            const campaignID = req.params.campaignID;
            if(Regex.validateCampaign(campaignID)) {
                CampaignController.getCampaign(mysql, campaignID).then(campaign => {
                    res.render(__dirname + "../../html/loser.html", {locals: {campaign: campaign}, root: __dirname});
                }).catch(error => {
                    send404(res);
                });
            } else {
                send404(res);
            }
        } else {
            send404(res);
        }
    }
}