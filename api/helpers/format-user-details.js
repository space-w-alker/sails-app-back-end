module.exports = {

    friendlyName: 'Format User Details',
  
  
    description: 'Search the database for the user and return a well formated json object containing the user details for the front end',
  
  
    inputs: {
  
      username: {
        type: 'string',
        example: 'spaceman',
        description: 'unique username of the user',
        required: true
      }
  
    },
  
  
    fn: async function (inputs, exits) {
      console.log("Helper Function Activated")
      var user = await User.findOne({username:inputs.username})
      var hobbyList = await Hobby.find({where:{username:inputs.username}})
      var listOfHobbies = []
      var i = 0;

      while(i < hobbyList.length){
        listOfHobbies.push(hobbyList[i].hobby)
        i++;
      }
      if(!user)return exits.success("err");
      var details = {username:user.username,email:user.email,phone:user.phone}
      //console.log(listOfHobbies);
      return exits.success({isLoggedIn:true,details:details,listOfHobbies:listOfHobbies});
    }
  
  };