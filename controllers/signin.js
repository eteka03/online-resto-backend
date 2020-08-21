// signin api


const jwt = require('jsonwebtoken');
const redis = require('redis')

//setup redis
const redisClient = redis.createClient(process.env.REDIS_URI);


const handleSignin = (db,req,res) => {

    const {username,password} = req.body

    if(!username || !password) return Promise.reject('incorrect submission')


   return db.select('*')
    .from('users')
    .where({name: username})
    .then(data => {
         
        if(data.length > 0){
            return data[0]
        }else{
           return  Promise.reject('unable to get user')
        }
    })
    .catch(err => Promise.reject('unable to get user'))


   
}

const signToken = name => {
    const jwtPayload = {name}

    console.log(name)

    return jwt.sign(jwtPayload, process.env.JWTSECRET, {expiresIn:'2 days'})
}

const setToken = (key,value)=>{
  return  Promise.resolve(redisClient.set(key,value))
}

const createSession = user => {
    //Jwt token, return user data

    const {name, email} = user

    const token = signToken(name)
    return setToken(token,name)
            .then(()=> {return {succes:true , userEmail: email, name , token}})
            .catch(console.log)
} 

const getAuthTokenId = (req,res)=> {
    const {authorization} =  req.headres

  return redisClient.get(authorization,(err,reply)=>{
        if(err || !reply){
           return res.status(400).json('Unauthorized') 
        }
        return res.json({id: reply})
    })
}

const handleAuthentication = (db) =>  (req,res) => {
    const {authorization} = req.headers

    return authorization ? getAuthTokenId(req,res) :
         handleSignin(db,req,res)
         .then(data => {
          return  data.name && data.email ? createSession(data) : Promise.reject(data)
            })
            .then(session => res.json(session))
         .catch(err =>  res.status(400).json(err))
}

module.exports = {
    handleAuthentication : handleAuthentication
}