import { Coupon } from "../objects/coupon";
import { MySql } from "../util/mysql-connector";
import { Request, Response } from "express";
import { Util } from "../util/util";
import { CampaignController } from "./campaign.controller";
import { Regex } from "../util/regex";
export class CouponController {
    /**
     * @param { MySql } mysql
     * @param { string } coupon
     * @returns { Promise<boolean> } true if the coupon is a winning coupon, false otherwise
     */
    static checkIfIsWinningCoupon(
        mysql: MySql,
        coupon: string, campaign: string
        ): Promise<boolean> {
        const couponPromise = new Promise<boolean>((resolve, reject) => {
            mysql.getConnection().then((connection) => {
            connection.query(
                'UPDATE winningCoupons SET handedIn = 1  WHERE coupon = "' +
                coupon +
                '" AND handedIn = 0 AND campaign = "' + campaign + '";',
                function (error, results, fields) {
                if (!error) resolve(results.changedRows == 1);
                else reject(error);
                }
            );
            });
        });
        return couponPromise;
    }
    /**
     * @param { MySql } mysql
     * @param { Coupon } coupon
     */
    static registerCoupon(mysql: MySql, coupon: Coupon) {
    mysql.getConnection().then((connection) => {
        connection.query(
        "INSERT INTO submittedCoupons (campaign, coupon, firstName, lastName, address, city, postalCode, ipAddress, dateTimeCreated) VALUES " +
            "('" +
            coupon.campaign +
            "', '" +
            coupon.coupon +
            "', '" +
            coupon.firstName +
            "', '" +
            coupon.lastName +
            "', '" +
            coupon.address +
            "', '" +
            coupon.city +
            "', '" +
            coupon.postalCode +
            "', '" +
            coupon.ip +
            "', NOW());",
        function (error, results, fields) {
            if (error) console.warn(error);
        }
        );
    });
    }

    /**
     * @param { Request } req
     * @param { Response } res
     * @param { MySql } mysql
     */
    static validateCouponCall(req: Request, res: Response, mysql: MySql) {
        if(!Util.isStringEmpty(req.body.coupon)) {
            CampaignController.getCampaign(mysql, req.body.campaign).then(campaign => {
                if(Regex.validateCoupon(req.body.coupon)) {
                    this.couponAlreadyRedeemed(mysql, req.body.coupon, req.body.campaign).then((isAlreadyRedeemed) => {
                        if(!isAlreadyRedeemed) {
                            res.status(400).json({error: true, status: "COUPON_ALREADY_REDEEMED"});
                        } else {
                            res.status(200).json({error: false, status: "COUPON_VALIDATED"});
                        }
                    });
                } else {
                    res.status(400).json({error: true, status: "COUPON_INVALID"});
                }
            }).catch(error => {
                res.status(400).json({error: true, status: "CAMPAIGN_DOES_NOT_EXIST"});
            })
        } else {
            res.status(400).json({error: true, status: "COUPON_EMPTY"});
        }
    }

     /**
     * @param { MySql } mysql
     * @param { string } coupon
     * @param { string } campaign
     */
    static couponAlreadyRedeemed(mysql: MySql, coupon: string, campaign: string): Promise<boolean> {
        const couponPromise = new Promise<boolean>((resolve, reject) => {
            mysql.getConnection().then((connection) => {
            connection.query(
                'SELECT * FROM submittedCoupons WHERE campaign = "' + campaign + '" AND coupon = "' + coupon + '";',
                function (error, results, fields) {
                    if(error) return reject(error);
                    resolve(!(results.length > 0));
                });
            });
        });
        return couponPromise;
    }

      /**
   * @param { Request } req
   * @param { Response } res
   * @param { MySql } mysql
   */
    static createWinningCoupon(req: Request, res: Response, mysql: MySql) {
        if(req.params.password === process.env.ADMIN_PASSWORD) {
            if(Regex.validateCampaign(req.params.campaign) && Regex.validateCoupon(req.params.coupon)) {
                CampaignController.getCampaign(mysql, req.params.campaign).then(campaign => {
                    mysql.getConnection().then((connection) => {
                        connection.query(
                        "INSERT INTO winningCoupons (coupon, campaign) VALUES ('" + req.params.coupon +  "', '" + req.params.campaign + "');",
                        function (error, results, fields) {
                            if (error) return res.send(error);
                            res.send(results);
                        });
                    });
                }).catch(error => {
                    res.status(400).json({error: true, status: error})
                })
            } else {
                res.status(400).json({error: true, status: "Invalid Campaign or Coupon"})
            }
        }
    }
}