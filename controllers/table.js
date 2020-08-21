
// table api controller

const verifyStatus = (req,res,db)=>{
    const {tableId} = req.body

    db('tables')
        .where({id:tableId})
        .then(table => {
            if(table.length){
                return res.status(201).json({isAvailable:table[0].isAvailable})
            }else{
                return res.json({error: 'table indisponible'})
            }
        })
        .catch(err => res.status(400).json({error: 'mauvais numero de table'}))
        

}

module.exports = {
    verifyStatus
}