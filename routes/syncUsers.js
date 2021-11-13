const syncUsersController = require('../controllers/syncUsersController')

const syncUsers = (userRepository) => {
  return async (req, res) => {
    try {
      let dataToInsert = await syncUsersController.invokeData(userRepository)

      syncUsersController.deleteNotListed(dataToInsert, userRepository)
      res.send({
       "users": dataToInsert,
       "status": 200,
       "message": "Users synced successfully."
      })
    }
    catch (e) {
      console.log("Error running sync process due to"+e.message);
      res.send({
        "status": 500,
        "error": e.message
       })
    }
  }
}

module.exports = syncUsers;