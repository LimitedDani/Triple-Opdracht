
# Triple Opdracht

  

A REST API where customers can redeem vouchers, to be able to win prices.

  

## Installation

  

Use the package manager [npm](https://nodejs.org/en/) to install the dependencies.

  

```bash

npm install

```

  

Create a database.

Import the sql file into your database

```file

tripleopdracht.sql

```

  

Copy and rename the .env.example to .env and fill in the config

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_TABLE=
SERVER_PORT=
ADMIN_PASSWORD=
ETHEREAL_EMAIL=
ETHEREAL_PASSWORD=
```

For the ETHEREAL inputs you need to create a account here: [ethereal](http://ethereal.email/create). After creating a acount put the credentials in the .env.
This is when a winning coupon is being registered you'll receive a email with the winner credentials to send the item to the winner

## Basic Info
A coupon is string of at least 6 numbers: '123456' is a valid example,
'12345' is an incorrect example.

## Usage

To run tests run the following command:

```bash

npm run test

```

  

To start a dev server

```bash

npm run start:dev

```

  

To build the application

```bash

npm run build

```

  

To run the builded application

```bash

npm run start

```
## GET Routes

 - '/': is the index page
 - '/campaign/:campaignID' is a campaign coupon fill-in page
 - '/campaign/:campaignID/:couponID' is a campaign address credentials
   fill-in page
 - '/winner/:campaignID' is the winner page
 - '/loser/:campaignID' is the loser page
 - '/createCampaign/:campaign/:password' is to create a campaign
 - '/createWinningCoupon/:campaign/:coupon/:password' is to create a
   winning coupon

## POST Routes

 - '/validateCoupon' is to check if the coupon is a valid string
 - '/validateAddress' is to check if all the address credentials are
   filled in correct

 

## Security measurements embedded in this application
**RegExp**
All incoming data is going thru a Regex, if the regex fails, a 400 will return with the status that the data that is been delivered, is incorrect.

**express-rate-limit**
The dependency express-rate-limit will help with spam protection, you can call any path 20 times per 1 minute, after this 20 times there will be a page with the following message: "Too many requests, please try again later.". After 1 minute you can access the page again