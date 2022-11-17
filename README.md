## Library API

### Assumptions

* User need to authenticate to make any reservations calls.
* Any user with someone userId, can make reservations on behalf of someone.
* Get reservations only get reservation for themselves.

### Requirements

* Node v16 or above
* Mongodb running locally, you find guide [here](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

### Start the server

The express runs on the port on 8080 by default if there is no port number provided as env variable.
You can provide port number by setting `PORT` to specific value in env variable.

To install the dependencies, you can run:
```
npm install
```
To start server, you can run:
```
npm run start
```

First User need to register and login to access reservation endpoints. Those are straight forward to register using username, password, first_name and last_name.

To user login use username, password. You will token on login to use as Bearer token authenticate reservations endpoint.

There are three endpoints for book reservation as per requirements:

To create a reservation, first endpoint is 
```
POST /reserve
```
This endpoint needs following payload:
```
{
    "title": string,
    "author": string,
    "username": string,
    "reserve_date": date,
}
```

### Run the test

In order to run the test and linter, you need to install all dependencies and run the following command:

To install the dependencies, you can run:
```
npm install
```
To run the linter, you can run
```
npm run lint
```
To run the test with coverage, you can run:
```
npm run test
```

### PS Postman collection is added a part of the code.

## React App

In order to run the react app. You need to go inside search-app

To install the dependencies, you can run:
```
cd search-app
npm install
```
To run the app, run
```
npm run start
```

This will start the app locally on port 3000.