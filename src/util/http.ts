import { Response, Request } from "express"; 
    /**
     * @param { Response } res
     * @Description Sends the user to a 404 page
     */
    export function send404(res: Response) {
        res.render(__dirname + "../../html/404.html", {root: __dirname});
    }
    
    /**
     * @param { Request } req
     * @return { string } ip address of current request
     */
    export function getIPAdress(req: Request): string {
        return req.headers['x-forwarded-for'] || 
        req.connection.remoteAddress || 
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    }