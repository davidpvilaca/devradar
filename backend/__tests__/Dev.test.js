const request = require('supertest')

// const Dev = require('../src/models/Dev');
const { app } = require('../src/index')

describe('Dev module', () => {
  beforeAll(() => {
    // Dev.remove()
  })

  it('should get all devs', async () => {
    const res = await request(app)
      .get('/devs')
    expect(res.status).toBe(200)
    expect(res.body instanceof Array).toBe(true)
    expect(typeof res.body.length).toBe('number')
  })
})
