const request = require('supertest')
const syncUsersController = require("../controllers/syncUsersController")
const InMemoryUserRepository = require('../infrastructure/in-memory-user.repository')

describe("syncUsersController", () => {
  const userRepository = new InMemoryUserRepository()
  const testUser = {
    userName: 'Payflow',
    externalId: 'test1234',
    externalSource: 'payflow',
    email: 'test@payflow.es'
  }

  it('should return data to be inserted not null', async () => {
      const success = userRepository.addUser(testUser)
      expect(success).toBe(true)
      const response = await syncUsersController.invokeData(userRepository);
      expect(response).not.toBeNull();
  })
})
