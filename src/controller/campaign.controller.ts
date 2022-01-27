import { MySql } from "../util/mysql-connector";
import { CampaignObject } from "../objects/campaign";
import { Request, Response } from "express";
import { Util } from "../util/util";
import { send404 } from "../util/http";
import { Regex } from "../util/regex";
export class CampaignController {

  /**
   * @param { MySql } mysql
   * @param { string } id
   */
  static getCampaign(mysql: MySql, id: string): Promise<CampaignObject> {
    const campaignPromise = new Promise<CampaignObject>((resolve, reject) => {
      mysql.getConnection().then((connection) => {
        connection.query(
          'SELECT * FROM campaigns WHERE id = "' + id + '";',
          function (error, results, fields) {
            if (results.length == 1) {
              resolve({
                id: results[0].id,
                name: results[0].name,
              });
            } else {
              reject(error);
            }
          }
        );
      });
    });
    return campaignPromise;
  }

  /**
   * @param { MySql } mysql
   */
  static getCampaigns(mysql: MySql): Promise<string[]> {
    const campaignPromise = new Promise<string[]>((resolve, reject) => {
      let campaigns: string[] = [];
      mysql.getConnection().then((connection) => {
        connection.query(
          "SELECT * FROM campaigns;",
          function (error, results, fields) {
            if (error) return reject(error);

            results.forEach((row) => {
              campaigns.push(row);
            });
            resolve(campaigns);
          }
        );
      });
    });
    return campaignPromise;
  }

  /**
   * @param { Request } req
   * @param { Response } res
   * @param { MySql } mysql
   */
  static renderCampaignIndexPage(req: Request, res: Response, mysql: MySql) {
    this.getCampaigns(mysql)
      .then((campaigns) => {
        res.render(__dirname + "../../html/index.html", {
          locals: { campaigns: campaigns },
        });
      })
      .catch((err) => {
        send404(res);
      });
  }

  /**
   * @param { Request } req
   * @param { Response } res
   * @param { MySql } mysql
   */
  static renderCampaignPage(req: Request, res: Response, mysql: MySql) {
    if (!Util.isStringEmpty(req.params.campaignID)) {
      if (Regex.validateCampaign(req.params.campaignID)) {
        this.getCampaign(mysql, req.params.campaignID)
          .then((campaign) => {
            res.render(__dirname + "../../html/campaign.html", {
              locals: { campaign: campaign.id },
              root: __dirname,
            });
          })
          .catch((error) => {
            send404(res);
          });
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
  static createCampaign(req: Request, res: Response, mysql: MySql) {
    if(Regex.validateOnlyLettersAndSpaces(req.params.campaign)) {
        if(req.params.password === process.env.ADMIN_PASSWORD) {
            mysql.getConnection().then((connection) => {
                connection.query(
                "INSERT INTO campaigns (name) VALUES ('" + req.params.campaign + "');",
                function (error, results, fields) {
                    if (error) return res.send(error);
                    res.send(results);
                });
            });
        } else {
            send404(res);
        }
    } else {
        send404(res);
    }
  }
}
