 const express = require('express')
 const mongoose = require('mongoose')
 const authRoute = require('./routes/auth')
 const blogRoute = require('./routes/blogRoutes')
 const {checkforAuthentication} = require('./middleware/authMiddleware')

 const app = express()
 const port = 8000

 const uri = "mongodb+srv://thalaiva:37CEFY11OBdiS8vD@cluster0.nmvssll.mongodb.net/blog-app?retryWrites=true&w=majority"
 app.use(express.json())

 mongoose.connect(uri).
 then(() => console.log("DB connected")).
 catch((err) => console.log("error in connecting DB ", err))

 app.use('/auth', authRoute)
//  app.use(checkforAuthentication)
console.log("we are receiving the request")
 app.use('/blog', blogRoute)

 app.listen(port, () => console.log("Server started on ",port))