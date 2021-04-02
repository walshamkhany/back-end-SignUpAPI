require('dotenv').config()
const express = require('express');
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid');

// app.set('view-engine', 'ejs')

// app.get('/', (req, res) => {
//     res.render('index.ejs', {name: 'Kyle'})

// }) 


//root Admin user meant for creating other admin users
const admin = {
    UserID: uuid(),
    username: "Admin@domain.com",
    firstName: "Admin",
    LastName: "Admin",
    password: "$2b$10$OnwOtQ.AI9aAThfL399rQ.LVLmgvzI2nuUKjNCkITSF4GR5oHw.92",
    role: "Admin"
  }

app.use(express.json())


//users as if they were from database
var users = [

]

//trikets called as if they were from database

var tickets = [

]


//gets the current authenticated user
app.get('/users', AuthenticateToken, (req, res) => {
    res.json(users.filter(user => user.username === req.user))
})


//login sign with jwt token
app.post('/login', async(req, res) => {
    //Authenticate user
    //checking if user exits
    const user = users.find(user => user.username === req.body.username)
    if(user == null) return res.sendStatus(400).send('user not found')

    //validating credentials
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            //giving the user a jwt token 
            const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET)
            res.json({accessToken: accessToken, status: "login successful"})
        }
        else res.send('login failed')
    } catch (error) {
        res.sendStatus( ).send()
    }
    
})

//verify jwt token
function AuthenticateToken(req, res, next){
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]

    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) =>{
        if(error) return res.sendStatus(403)
        req.user = user
        next()
    } )
}


//sign up
app.post('/signup', async(req, res) => {
    // check if user exists
    const username = req.body.username
    const user = users.find(user => user.username === username)
    if (user) return res.send('this email is already in registered')

    //hashing password with salt
    let hashedPassword = null
    try{
        const salt = await bcrypt.genSalt()
        hashedPassword = await bcrypt.hash(req.body.password, salt)
    }catch (error){
        console.log(error)
    }
    
    //creating new user with hashed pass
    const newUser= {...req.body, username: username, password: hashedPassword, UserID: uuid()}
    users.push(newUser)
    res.json(users)
})


//change user first name and last name
app.put('/user/account', AuthenticateToken, async(req, res) => {
    const userInfo = users.find(user => user.username === req.user)

    //verifying user
    try {
        if(await bcrypt.compare(req.body.password, userInfo.password)){
            const index = users.indexOf(userInfo)
            users[index] = {...users[index], firstName: req.body.firstName, LastName: req.body.LastName}
            res.json(users)
        }
        else res.send('incorrect password')
    } catch (error) {
        res.sendStatus( ).send()
    }
    
})


app.post('/user/tickets', AuthenticateToken, (req, res) => {
    const userInfo = users.find(user => user.username === req.user)
    const ticket = {UserID: userInfo.UserID, message: req.body.message}
    tickets.push(ticket);
    res.json(tickets)
})

app.get('/user/tickets', AuthenticateToken, (req, res) => {
    const userInfo = users.find(user => user.username === req.user)
    if(userInfo.role == "Admin") res.json(tickets);
    else res.json(tickets.filter(tk => tk.UserID == userInfo.UserID))
})


app.listen(3000);
