const fetch = require('node-fetch');

const invokeData =  async(userRepository) =>{  
    // fetch data from  external api to verify the insertion of the new users or update existing ones
    const responseFromApi = await fetch('https://api.github.com/search/users?q=payflow', {
      credentials: 'omit'// I had some problems in the past with cors policy between aps and cloudfront domains, I believe this will not send same origin headers, I might be wrong
    });

    // transform response from api to json
    const dataFromApi = await responseFromApi.json();
    
    const usersList = []

    dataFromApi['items'].forEach(item =>{
      const userToAdd = {
        externalId: item.node_id,
        userName: item.login,
        externalSource: "payflow", // as a mock only
        email: item.login+'@email.com',// as a mock only
        picture: item.avatar_url
      }

      usersList.push(userToAdd)
    })
    
    //data users to insert in our "database" giving the users on the call api
    usersList.forEach(user => {
        // this invocation will also be responsable for verifying the need of user insertion and update
        userRepository.addUser(user)
    })

    //returns fetched data 
    return usersList
  }

  const deleteNotListed = async (userList, userRepository) => {
    // If a user exists in our "database" but not in the given api service, we will delete it from our "database"
    userRepository.verifyToDelete(userList)
  }

  module.exports = { invokeData, deleteNotListed };
