const express = require('express');
const app = express();
const port = 5002;

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://sehoon:abcd1234@boilerplate.7ltub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
    res.send('Hello World! hello');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

