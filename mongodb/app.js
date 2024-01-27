const express = require('express');
const mongoose = require('mongoose');

const PORT = 8000;
const app = express()
app.use(express.json())

const uri = "mongodb+srv://thalaiva:37CEFY11OBdiS8vD@cluster0.nmvssll.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri).then(() => console.log("MongoDB connection success")).catch((err) => console.log("Connection error: ", err));

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    contactType: {
        type: String
    }
});

const user = mongoose.model('user', userSchema);

app.patch("/contact", async (req, res) => {
    try{
        const id = req.query.id;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const phone = req.body.phone;

        // console.log(firstName, lastName, phone);
        // console.log(req);
        // console.log(firstName || lastName || phone);

        if(firstName || lastName || phone){
            const result = await user.findByIdAndUpdate(id, req.body);

            const query = await user.findById(id);

            res.status(200).json({result, message: "Successfully updated contact As: ", query})
        }
        else{
            res.status(400).json({message: "require one field: firstName or lastName or phone"})
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(404).json({error: "Data not found"});
    }
})

app.delete("/contact", async (req, res) => {
    try{
        const id = req.query.id;
        const query = await user.findById(id);

        const result = await user.deleteOne(query);

        console.log("Removed user", query);
        return res.status(200).json({message: "removed contact", query});
    }
    catch(err)
    {
        console.log(err);
        res.status(404).json({error: "Data not found"});
    }
})

app.get("/", async (req, res) => {
    try{
        const allContacts = await user.find({});
        console.log(allContacts);

        res.json(allContacts);
    }
    catch(err){
        res.status(404).json({error: "Data not found"});
    }
})

app.post("/add", async (req, res) => {
    try{
        const {firstName, lastName, phone, contactType} = req.body;

        if(firstName && lastName && phone)
        {
            const data = await user.create({
                firstName,
                lastName,
                phone,
                contactType
            })

            return res.status(200).json({message: "Added data successfully", data})
        }
        else{
            res.status(400).json({message: "one of the fields missing: firstName, lastName, PhoneNumber"})
        }        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal Server Error"});
    }
})

app.listen(PORT, () => console.log("port connected"))