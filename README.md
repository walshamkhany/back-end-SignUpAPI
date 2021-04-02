#step 1
Make sure you have Rest client extention in VS code
to run server => run command on terminal: npm run devStart 

#step 2
open request.rest in VS code

#step 3
Create user by signing up request using "POST http://localhost:3000/signup"

#step 4
login user by requesting  "http://localhost:3000/login"
copy the accessToken reponse for later

To change user information:

#step 5

using the access token, replace with Autherization: Basic [your_AccessToken]

then send request using "PUT http://localhost:3000/user/account"

It should look like:

    PUT http://localhost:3000/user/account
    Autherization: Basic [your_AccessToken]
    Content-Type: application/json

    {
        "firstName": "name",
        "LastName": "last",
        "password": "yourpass"
    }


To post a ticket:<br/>

#step 6<br/>

using the access token, replace with Autherization: Basic [your_AccessToken]<br/>

then send request using "POST http://localhost:3000/user/tickets"\

It should look like:
    POST http://localhost:3000/user/tickets
    Autherization: Basic [your_AccessToken]
    Content-Type: application/json

    {
        "message": "your message",
    }


to view tickets:

you must redo step 3 and create user with role: "Admin"

then redo step 4 to get the accessToken for the admin

using the access token, replace with Autherization: Basic [your_AccessToken]

then send request using "GET http://localhost:3000/user/tickets"

the reponse will be based on the role of the user (user can only see his tickets)


