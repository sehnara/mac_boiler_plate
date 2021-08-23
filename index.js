const express = require('express');
const app = express();
const port = 5002;

const config = require("./config/key");

const { User } = require("./models/User");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.connect(config.mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(() => {
    console.log("MongoDB Connected...")
}).catch(err => {
    console.log(err);
})

app.get('/', (req, res) => {
    res.send('Hello World! hello kangsehoon');
});

app.post('/register', (req, res) => {
    // 1. client에서 정보 가져온다
    // 2. 정보들을 데이터베이스에 넣는다.
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if (err) return res.json({
            success: "false",
            "message": err
        })
        return res.status(200).json({
            success: true
        })
    });

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});