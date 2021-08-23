const express = require('express');
const app = express();
const port = 5003;

const config = require("./config/key");

const { User } = require("./models/User");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const { auth } = require("./middleware/auth");
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

app.post('/api/users/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {
    console.log(1);
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            console.log(2);
            return res.json({
                success: false,
                message: "get out here!"
            })
        }
        console.log(5);
        user.comparePassword(req.body.password, (err, isMatched) => {
            console.log(3);
            if (!isMatched) {
                return res.json({ loginSuccess: false, message: "not matched password!" });
            }
            // 비밀번호가 맞았으니까 토큰 생성!!
            user.generateToken((err, user) => {
                console.log(4);
                if (err) return res.status(400).json({
                    status: 'error',
                    error: err,
                });

                // 토큰을 저장한다. -> cookie or sessionstorage or localstorage
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    })
            })
        })
    })
});

app.get("/api/users/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        inAdmin: req.user.role === 0 ? false : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
});

app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});