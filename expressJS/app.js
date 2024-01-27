const express = require('express')
const fs = require('fs').promises;
const bodyParser = require('body-parser')
const path = require('path');
const writeFile = require('fs');

const port = 3000;
const app = express()

const filePath = path.resolve('data.json');
const logPath = 'logFile.txt';
// app.use(bodyParser.json());

async function readFile() {
    try{
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    }
    catch(error){
        return [];
    }
}

function checkContactType(req,res,next) {
    const contactType = req.query.contactType;
    if(!contactType)
    {
        req.contactType = "Unknown";
    }
    next();
}

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method}: ${req.url}`);
    fs.writeFile(logPath, JSON.stringify(`[${new Date().toLocaleString()}] ${req.method}: ${req.url}`), 'utf8');
    next();
})

app.post('/addContact', (req, res, next) => {
    const contactType = req.query.contactType;
    if(!contactType)
    {
        req.contactType = "Unknown";
    }
    next();
},async (req, res) => {
    try{
        let newData = req.body;
        
        const fileData = await readFile();
        const firstName = req.query.firstName;
        const lastName = req.query.lastName;
        const PhoneNumber = req.query.PhoneNumber;
        const contactType = req.query.contactType;
        // const {firstName, lastName, PhoneNumber, contactType} = newData;
        
        fileData.forEach((contactObj) => {
            if(contactObj.PhoneNumber === PhoneNumber)
            {
                return res.json({message: "Contact already exists", newData});
            }
        });
        
        if(firstName && lastName && PhoneNumber)
        {
            fileData.push(newData);

            await fs.writeFile(filePath, JSON.stringify(fileData), 'utf8');

            res.status(200).json({message: "Added data successfully"})
        }

        else{
            fs.writeFile(logPath, JSON.stringify(`{message: "one of the fields missing: firstName, lastName, PhoneNumber"}`), 'utf8'); 
            res.status(400).json({message: "one of the fields missing: firstName, lastName, PhoneNumber"})
        }
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
})

app.get('/', async (req,res) => {
    try{
        const fileData = await readFile();
        if(Object.keys(fileData).length === 0)
            res.json({message: "No contacts found.."});
        res.json({fileData});
    }

    catch(error){
        console.log('Error reading JSON request: ', error);
        res.status(404).json({error: "Data not found"});
    }
});

app.get('/getContact', async (req,res) => {
    // res.send('Hello World!')
    const params = req.query;

    const fname = req.query.firstName;
    const lname = req.query.lastName;

    if(fname && lname){
        
        try{
            const fileData = await readFile();

            fileData.forEach((contactObj) => {
                
                if(contactObj.firstName == fname && contactObj.lastName == lname)
                {
                    return res.json({firstName: fname, lastName: lname, "PhoneNumber" : contactObj.PhoneNumber});
                }
            });

            return res.json({message: "No contact found with follwing details", fname, lname})
        }
        catch(error){
            console.log('Error reading JSON request: ', error)
        }
    }

    else{
        return res.status(400).json({error: "Bad request"});
    }
    
    // console.log(arrayData);
});

app.get('/getContactByCell', async (req,res) => {
    
    const contactNum = req.query.PhoneNumber;

    if(contactNum)
    {
        try{
            const fileData = await readFile();
            // console.log(fileData);
            
            fileData.forEach((contactObj) => {
                console.log(contactObj.PhoneNumber);
                if(contactObj.PhoneNumber === contactNum)
                {
                    return res.json({message: "Contact Details", contactObj});
                }
            });

            return res.json({message: "No contact found with given details"})
            
        }
        catch(error){
            console.log('Error reading JSON request: ', error)
        }
    }
});

app.delete('/deleteContact', async (req, res) => {
    try{
        let newData = req.body;
        
        const fileData = await readFile();
        const remainingData = [];

        const fname = newData.firstName;
        const lname = newData.lastName;
        const Cnumber = newData.PhoneNumber;
        const type = newData.contactType;
        let found = false;
        fileData.forEach((contactObj) => {
            if(contactObj.firstName === fname && contactObj.lastName === lname && contactObj.PhoneNumber === Cnumber)
            {
                found=true;
                // return res.json({message: "Contact already exists", newData});
            }
            else{
                remainingData.push(contactObj);
            }
        });
        
        if(found === true)
        {
            // fileData.push(remainingData);

            await fs.writeFile(filePath, JSON.stringify(remainingData), 'utf8');

            res.status(200).json({message: "deleted data successfully"})
        }

        else{
            res.status(400).json({message: "contact doesn't exists"})
        }
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Error while deleting the data"});
    }
})

async function readFile() {
    try{
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    }
    catch(error){
        return [];
    }
}
// app.post('/getContact',async (req, res) => {
//     const data = req.body;
//     const filePath = "data.json";
//     const arrayData = [];

//     const fileData = await 

//     arrayData.push(data);
//     const jsonData = JSON.stringify(arrayData);

//     fs.appendFile(filePath, jsonData, (err) => {
//         if(err){
//             console.error("Error writting data to JSOn file: ", err);
//             return res.status(500).json({error: "Internal server error"});
//         }

//         res.json({message: 'contact saved successfully'})
//     })
// })

app.listen(port, () => {
    console.log("Example app listening at port")
})