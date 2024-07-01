
const express = require('express');

const product = require("./routes/ProductRoute"); // ProductRoute should be lowercase
const user = require("./routes/userroute"); // userroute should be lowercase
const order = require("./routes/orderRoute")
const app = express();

const cookieparser = require("cookie-parser")
const dotenv = require('dotenv');
const connectDatabase = require("./config/database");
app.use(express.json());
app.use(cookieparser());
dotenv.config({ path: 'backend/config/config.env' });

connectDatabase();

app.use("/api/v1", product);
app.use("/api/v1" , user);
app.use("/api/v1" , order)

app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

process.on("unhandled rejection" , (err) =>{
    console.log(`Error: ${err.message}`);
    console.log(`shuting down the server due to the unhandled promise Rejection`);

    // The following line should be app.close() instead of ServiceWorkerRegistration.close()
    app.close(() => {
        process.exit(1);
    });
});
