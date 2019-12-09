# ELBHO API
This api is made for the ELBHO Erkenningsadviseurs apps. The apps are part of the mobile dev minor, I have to do at the final year of my study.

## About the API
The api will be used to create an appointment between a company and an advisor. The advisor will then visit the company ad check if it is a suitable place for interns. To make sure that an advisor will be able to be at the appointment, the advisor can set his/her availability in a mobile app. Then ELBHO can see if an advisor is available for an appointment.

The advisors also get an option to borrow a car from ELBHO and upload their invoices directly from this app.

There will also be a tracking option, which will share the coordinates of the advisor, so that the company that has a appointment with him will be able to check when he arrives.

## Running this repo
To run this project you will need an environment fil with the following items in it:
```ts
PORT=3000 // Portnumber for the server
DB='mongodb://localhost:27017/elbho' // Connection URL for Mongo
SALTROUNDS=10 // Number of rounds used to hash the password
JWTSECRET='VerySecure' // Secret used during signing and verifying the JWT
APIKEY='Alsosecure' // Used for saving invoices
```
