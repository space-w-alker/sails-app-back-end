var accountSId = 'AC44adadd3620864d7530ccd1c4208a29a'
var authToken = '114dba87e4ea569edfa5c06d8ec94bae'
var twilio = require("twilio")(accountSId,authToken)
var nodemailer = require("nodemailer")


module.exports = {

    addHoby: async function(req,res){

        if(!req.session.username){
          return res.json({isLoggedIn:false})
        }

        var user = await User.findOne({username:req.session.username})
        console.log(user);
        var email = user.email;
        var phone = user.phone;

        console.log(user.email)
        console.log(user.phone)

        console.log(req.body.hobbyName);
        await Hobby.create({username:req.session.username,hobby:req.body.hobbyName})
        var transporter = nodemailer.createTransport({service:"gmail",auth:{user:"abassabdullahi7@gmail.com", pass:"abasstheone"}});
        var html = `<style>div{border-radius:5px;padding:40px;box-shadow:0 0 10px}</style><div><p> You added <strong>${req.body.hobbyName}</strong> to your list of hobbies</p></div>`
        var mailOptions = {from:'abassabdullahi7@gmail.com', to:email, subject:"You added A Hobby", html:html}
        transporter.sendMail(mailOptions,function(error,info){
          if(error)throw error;
          else{
            console.log("Email Sent " + info.response);
          }
        })
        
        twilio.messages.create({
          body:`You added ${req.body.hobbyName} to your list of hobbies`,
          from:'+19803191564',
          to:`+234${phone.slice(1)}`
        }).then(message=>{console.log(message.sid)}).done();
        return res.json({});
    },

    getUserInfo: async function(req,res){
        console.log("##############   update request recieved   ##########")
        console.log(req.session);
        if(req.session.username){
          console.log("found Session")
          let toReturn = await sails.helpers.formatUserDetails(req.session.username);
          if(toReturn === "err"){
               toReturn = {isLoggedIn:false}
               return res.json(toReturn)
          }
          return res.json(toReturn);
        }
        toReturn = {isLoggedIn:false}
        return res.json(toReturn);
    },

    logOut: async function(req,res){
      console.log("$$$$$$$$$$$$$$$$ Log out request recieved $$$$$$$$$$$$$$$$")
      req.session.username = undefined;
      return res.json({})
    }

}