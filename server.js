//initialize server
const express =  require('express')

const app = express()
const cors = require('cors')


//middleware
app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
   return res.send('hello world')
})

app.listen(5001,()=>{
    console.log("app listen on port 6000")
})