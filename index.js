const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./dbConnect');
const authRouter = require("./routers/authRouter");
const router = require('./routers/bookRouter');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors');
dotenv.config("./.env");

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin : 'https://books-frontend-nu.vercel.app'
}));

//router
app.use("/auth", authRouter);
app.use("/books", router);

app.get('/', (req, res) => {
    return res.status(200).json({
        id : 123,
        name : "Ankit Sharma",
        city : "Delhi"
    })
})

const PORT = process.env.PORT || 4001;

//call database
dbConnect();

app.listen(PORT, () => {
    console.log(`listening on port : ${PORT}`);
})
 