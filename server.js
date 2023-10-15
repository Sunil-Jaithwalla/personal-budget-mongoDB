const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


const budget =require('./budgetData.json');
app.use(cors());


app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded requests

const mongoose = require('mongoose')
const budgetModel = require('./models/budget_schema')
let url = 'mongodb://127.0.0.1:27017/budgetdatabase';
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to database")
            // Fetch
            budgetModel.find({})
                .then((data) => {
                    res.send(data);
                    mongoose.connection.close();
                })
                .catch((connectionError) => {
                    console.log(connectionError);
                })
        })
        .catch((connectionError) => {
            console.log(connectionError);
        })
});

app.post("/addBudgetData", (req, res) => {

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            // Insert
            let newData = new budgetModel(req.body);
            budgetModel.insertMany(newData)
            .then((data)=>{

                res.send("Data Entered Successfully")
                mongoose.connection.close();
            })
            .catch((connectionError)=>{
                res.send(connectionError.message)
            })
        })
        .catch((connectionError) => {
            res.send(connectionError);
        })
})

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
});