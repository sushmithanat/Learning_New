const user = require('../models/MongooseModel')

exports.getAllContacts = async (req, res) => {
    try{
        const allContacts = await user.find({});
        console.log(allContacts);

        res.json(allContacts);
    }
    catch(err){
        res.status(404).json({error: "Data not found"});
    }
}

exports.addContact = async (req, res) => {
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
}