const connectToMongo=require("./db")
const express=require("express")
var cors = require('cors')
const app = express()
const dotenv=require("dotenv")
dotenv.config({path:'./config.env'})
const port = process.env.PORT
connectToMongo();
app.use(cors())
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Hello TG")
})

app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/treks',require('./routes/treks.js'))
app.use('/api/images',require('./routes/images.js'))
app.use('/api/articles',require('./routes/articles.js'))

app.listen(port, () => {
    console.log(`Trekposh is listening on port ${port}`)
  })
