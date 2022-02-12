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
        password: {
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
        res.send('Our backend is live!')
})

// --- routes ---
app.post ('/create-user', (req, res) => {
        const {name, email, password} = req.body

        UserModel.create({name, email, password})

        .then((response) => {
                res.status(200).json(response)
        })
        .catch((err) => {
                res.status(500).json({
                        error: 'Something went wrong',
                        message: err
                })
        })
})

// listen method will connect our app to the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})