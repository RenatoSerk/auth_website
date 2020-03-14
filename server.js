if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const dbConfig = require('./db.js');
const mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
const MongoClient = require('mongodb').MongoClient

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

async function initConnection() {
    let client = await MongoClient.connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    const db = client.db(dbConfig.name)
    return { db, client }
}

app.listen(3000)