//initialize server
require('dotenv').config()
const express =  require('express')
const app = express()
const cors = require('cors')
const db = require('knex')({
    client:'pg',
    connection: {
        host:process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB
      }
})

const signin = require('./controllers/signin')


//controllers
const table = require('./controllers/table')




//middleware
app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{

    
    
    

    db.from('users')
    .select('*')
    .where({id:1})
    .then(data => {
        console.log('dta',data)
        return res.send('succes')
    })
    .catch(err => {
        console.log('user',process.env.POSTGRES_USER)
        console.log(err)
        return res.status(500).json({message:"booo"})
    })

    
})

app.post('/signin',signin.handleAuthentication(db))

app.post('/verifyStatus',(req,res)=>{table.verifyStatus(req,res,db)})

app.listen(5001,()=>{
    console.log("APP LISTENNING ON PORT 5001")
})