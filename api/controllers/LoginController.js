
var passwordHash = require("password-hash")



module.exports = {
    login: async function(req,res){
        console.log("*********login request recieved**********")
        var user = await User.findOne({username:req.body.username})
        if(!user){
            let toSend = {isLoggedIn:false}
            return res.json(toSend)
        }

        if(passwordHash.verify(req.body.password,user.password === false)){
            console.log("Incorrect password")
            let toSend = {isLoggedIn:false}
            return res.json(toSend)
        }
        var details = {username:user.username,email:user.email,phone:user.phone}
        var toSend = {isLoggedIn:true,details:details,listOfHobbies:["Cycling", "Jugging"]}
        req.session.username = user.username;
        //res.cookie('user','abass')
        console.log(req.session);
        return res.json(toSend)
    },
        
    signup: async function(req, res){
        
        var alluser = await User.find({where:{username:req.body.username}})
        if(alluser.length > 0){
            toSend = {isLoggedIn:false}
            return res.json(toSend);
        }
        hashedPassword = passwordHash.generate(req.body.password);
        await User.create({username:req.body.username,email:req.body.email,phone:req.body.phone,password:hashedPassword,plain_password:req.body.password})
        var toReturn = {isLoggedIn:true}
        req.session.username = req.body.username;
        console.log(`Sessison sent from the sign up controller`)
        console.log(req.session);
        return res.json(toReturn);
    }
}