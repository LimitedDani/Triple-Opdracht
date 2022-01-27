import { Util } from "../util/util";
import { Request, Response } from "express";
import { MySql } from '../util/mysql-connector';
import { send404, getIPAdress } from "../util/http";
import { CampaignController } from "./campaign.controller";
import { CouponController } from "./coupon.controller";
import { Regex } from "../util/regex";
import { EmailController } from "./email.controller";
export class AddressController {

    /**
     * @param { Request } req
     * @param { Response } res
     * @param { MySql } mysql
     */
    static createAddressPage(req: Request, res: Response, mysql: MySql) {
        if (
            !Util.isStringEmpty(req.params.campaignID) &&
            !Util.isStringEmpty(req.params.couponID)
        ) {
            const campaignID = req.params.campaignID;
            const couponID = req.params.couponID;
            if (Regex.validateCampaign(campaignID)) {
                CampaignController.getCampaign(mysql, campaignID)
                .then((campaign) => {
                if (Regex.validateCoupon(couponID)) {
                    res.render(__dirname + "../../html/address.html", {
                    locals: { coupon: couponID, campaign: campaign },
                    root: __dirname,
                    });
                } else {
                    send404(res);
                }
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
    static validateAddressCall(req: Request, res: Response, mysql: MySql) {
        if(this.checkIfFieldsAreFilledIn(req)) {
            this.checkIfFieldsAreGoodFilledIn(req).then(() => {
                const campaignID = req.body.campaign;
                const couponID = req.body.coupon;
                const firstName = req.body.first_name;
                const lastName = req.body.last_name;
                const address = req.body.address;
                const city = req.body.city;
                const postalCode = req.body.postal_code;
                const ip = getIPAdress(req);

                if(Regex.validateCoupon(couponID)) {
                    CouponController.checkIfIsWinningCoupon(mysql, couponID).then((isWinner) => {
                        const coupon = {
                            coupon: couponID, 
                            campaign: campaignID,
                            firstName: firstName,
                            lastName: lastName,
                            address: address,
                            city: city, 
                            postalCode: postalCode,
                            ip: ip
                        };
                        CouponController.registerCoupon(mysql, coupon);
                        if(isWinner) {
                            EmailController.sendWinnerDeliveryEmail(coupon);
                            res.status(200).json({error: false, status: "WINNER"});
                        } else {
                            res.status(200).json({error: false, status: "LOSER"});
                        }
                    });
                } else {
                    res.status(400).json({error: true, status: "COUPON_INVALID"});
                }

            }).catch((err) => {
                res.status(400).json({error: true, status: "Not all fields are filled in correctly: " + err});
            })
        } else {
            res.status(400).json({error: true, status: "Not all fields are filled in!"});
        }
    }

    /**
     * @param { Request } req
     * @returns { boolean } true if the fields are filled in, false otherwise
     */
    static checkIfFieldsAreFilledIn(req: Request): boolean {
        return (
            !Util.isStringEmpty(req.body.coupon) &&
            !Util.isStringEmpty(req.body.campaign) &&
            !Util.isStringEmpty(req.body.first_name) &&
            !Util.isStringEmpty(req.body.last_name) &&
            !Util.isStringEmpty(req.body.address) &&
            !Util.isStringEmpty(req.body.city) &&
            !Util.isStringEmpty(req.body.postal_code)
        );
    }

        /**
     * @param { Request } req
     * @returns { boolean } true if the fields are filled in, false otherwise
     */
    static checkIfFieldsAreGoodFilledIn(req: Request): Promise<string> {
        const addressPromise = new Promise<string>((resolve, reject) => {

            let errors: string = "";

            if(!Regex.validateOnlyLettersAndSpaces(req.body.first_name)) {
                errors += "First name: " + req.body.first_name + ", ";
            }

            if(!Regex.validateOnlyLettersAndSpaces(req.body.last_name)) {
                errors += "Last name: " + req.body.last_name + ", ";
            }

            if(!Regex.validateOnlyLettersAndSpaces(req.body.city)) {
                errors += "City: " + req.body.city + ", ";
            }

            if(!Regex.validateAddress(req.body.address)) {
                errors += "Address: " + req.body.address + ", ";
            }

            if(!Regex.validatePostalCode(req.body.postal_code)) {
                errors += "Postal code: " + req.body.postal_code + ", ";
            }
            if(!Util.isStringEmpty(errors)) {
                reject(errors);
            } else {
                resolve(errors);
            }
        });
        return addressPromise;
    }
}