// --- requirements ---
        // npm i dotenv
require('dotenv/config')

const express = require('express')
const app = express()
const port = process.env.PORT || 5005
        // npm i cors
const cors = require("cors");
        // npm i mongoose
const mongoose = require('mongoose')
        // npm i body-parser
const bodyParser = require('body-parser')
const MONGODB_URI = process.env.MONGODB_URI
        //npm i bcrypt
const bcrypt = require('bcrypt')
        //npm i jsonwebtoken

// --- cors ---
app.use(cors({credentials: true, origin: process.env.ORIGIN || 'http://localhost:3000'}))

// --- mongoose ---
        //1. connect to db
mongoose.connect(MONGODB_URI)
        //2. define your schema
let UserSchema = new mongoose.Schema(
{
        name: {
                type: String,
                required: [true, 'Please add a name']
        },
        email: {
                type:  String,
                required: [true, 'Please add an email'],
                unique: true
        },
        hashedPassword: {
                type: String,
                required: true
        }
},
{
        timestamps: true
})
        //3. define your model
let UserModel = mongoose.model('UserModel', UserSchema)


// --- express ---
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
        res.send('Our server is live!')
})

// --- routes ---
app.post ('/create-user', (req, res) => {
        //variables being grabbed and deconstructed from the client-side
        const {name, email, password} = req.body
        //password encryption
                // salt is a random string that makes the hash unpredictable
                let salt = bcrypt.genSaltSync(10)
                // hashing algorithms turn a plain text password into a new fixed-length string called a hash
                let hash = bcrypt.hashSync(password, salt)
                // a simpler way of hashing our password would be to skip the SALT creation and simply add the number of rounds in the HASH at the end 'let hash = bcrypt.hashSync(password, 10)'
        UserModel.create({name, email, hashedPassword: hash})
        .then((response) => {
                response.hashedPassword = "***";
                res.status(200).json(response)
        })
        .catch((err) => {
                res.status(500).json({
                        error: 'Something went wrong',
                        message: err
                })
        })
})

app.post ('/verify-user', (req, res) => {
        //variables being grabbed and deconstructed from the client-side
        const {email, password} = req.body
        //find user in our database
        console.log(password)
        
})

// --- listen method will connect our app to the specified port ---
app.listen(port, () => {
  console.log(`User authentication (server) is listening on port ${port}`)
})