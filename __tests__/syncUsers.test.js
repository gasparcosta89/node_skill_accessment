const request = require('supertest')
const app = require('../infrastructure/server')

describe('Sync Users', () => {
  it('should return all users synced', async () => {
    const res = await request(app.server)
      .get('/users/sync')

    expect(res.statusCode).toEqual(200)
  })
})
