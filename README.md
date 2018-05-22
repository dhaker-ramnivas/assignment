This code is solution of car parking system.
Node Env is test in which database  configured
Mysqllib file :-how to connect with database is shown.

first file is assignment.js

In this project only have 4 APIs.

APIs:
Get Parking availability
URI: /api/parking
Method: GET
Response:
{
	"available": true //If parking slot available
	"slot": 2,
	"level": 3
}


Reserve Parking lot
URI: /api/parking
Method: POST
Request Body:
{
	"registration": "KA-03-ZA-1111",
	"colour": "red",
	"slot": 2,
	"level": 3
}
Response:
{
	"status": true
}



Free Parking lot
URI: /api/parking
Method: DELETE
Request Body:
{
	"registration": "KA-03-ZA-1111"
}
Response:
{
	"status": true
}


Search Parking lot
URI: /api/parking/_search

Registration numbers of all cars of a particular colour.
Slot number in which a car with a given registration number is parked.
Slot numbers of all slots where a car of a particular colour is parked.

METHOD:POST
1.Request Body:
{
	"registration": "KA-03-ZA-1111",
}
Response:
{"book_id":2,"registration_no":"KA-03-ZA-1111","slot":2,"level":1}


2.Request Body
{
"colour": "Orange"
}

responce:
{"book_id":21,"registration_no":"KA-03-ZA-2342","slot":1,"level":3},
{"book_id":29,"registration_no":"KA-65-ZA-2342","slot":9,"level":3},
{"book_id":9,"registration_no":"KA-54-ZA-2342","slot":9,"level":1}


3.Request Body
{
	"registration": "KA-54-ZA-2342",
	"colour": "Orange"
}


Responce
{"book_id":9,"registration_no":"KA-54-ZA-2342","slot":9,"level":1}

4.Req Body
{
	"registration": "KA-54-ZA-2342",
	"colour": "Red"
}

responce
{"status":"No data found"}



Here book_id is a slot number starting from 1 to 30 (3*10 total slot all tree flor)


Database schema
https://drive.google.com/file/d/1b5_L1Zwk130b7syRWmcUZt629abCSOcP/view?usp=sharing
