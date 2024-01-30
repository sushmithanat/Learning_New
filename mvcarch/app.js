const mongoose = require('mongoose');
const express = require('express');
const contactRouter = require('./Routes/contactRouter')

const port = 8000;
const app = express()
const uri = "mongodb+srv://thalaiva:37CEFY11OBdiS8vD@cluster0.nmvssll.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json())
mongoose.connect(uri).then(() => console.log("DB connection successful")).catch((err) => console.log(err));

app.listen(port, () => {console.log("Listening on PORT ",port)})

app.use("/contact", contactRouter)