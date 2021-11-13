const userSchema = require('../entities/user')

class InMemoryUserRepository {
  constructor() {
    this.memory = {}
  }

  findAllUsers() {
    const result = []
    for (let [ key, value ] of Object.entries(this.memory)) {
      result.push(value)
    }
    return result
  }

  findByUserName(userName) {
    return this.memory[userName]
  }

  updateUser(user) {
    const updatedUser = {
      ...this.memory[user.userName],
      ...user
    }
    const {value, error} = userSchema.validate(updatedUser)
    if(error) {
      throw new Error(error)
    }

    this.memory[value.userName] = value
    return true
  }

  deleteUserByUserName(userName) {
    delete this.memory[userName]
  }

  addUser(user) {
    const {value, error} = userSchema.validate(user)
    if(error) {
      throw new Error(error)
    }
    let existingUser = this.findByUserName(user.userName)
    //if a user exists in our "database" and are from the same external source we wull update else we create a new one
    if( existingUser != null && user.externalSource === existingUser.externalSource) {
      this.updateUser(user)
    } else {
      this.memory[value.userName] = value;
    }
    
   
    return true
  }

  // it will iterate over the users in memory list and compare with the given ones from the api, if it exists it will not delete else it will delete
  verifyToDelete(users) {
    var usersInMemory = this.findAllUsers()
    users.filter(function(item){
      if ( usersInMemory.indexOf(item) !== -1 ){
        this.deleteUserByUserName(item.userName)
      };
    });
  }
}

module.exports = InMemoryUserRepository