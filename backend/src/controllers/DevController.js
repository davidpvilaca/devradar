const axios = require('axios')
const Dev = require('../models/Dev')
const { findConnections, sendMessage } = require('../websocket')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {

  async index (req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  async store (req, res) {
    const { github_username: githubUsername, techs, latitude, longitude } = req.body
    const techsNormalized = parseStringAsArray(techs)

    let dev = await Dev.findOne({ github_username: githubUsername })

    if (!dev) {
      try {
        const { data } = await axios.get(`https://api.github.com/users/${githubUsername}`)
        const {
          name = data.login,
          avatar_url: avatarUrl,
          bio
        } = data

        const location = {
          type: 'Point',
          coordinates: [longitude, latitude]
        }

        dev = await Dev.create({
          github_username: githubUsername,
          name,
          avatar_url: avatarUrl,
          bio,
          techs: techsNormalized,
          location
        })
        res.status(201)

        const sendSocketMessageTo = findConnections(
          { latitude, longitude },
          techsNormalized
        )

        sendMessage(sendSocketMessageTo, 'new-dev', dev)
      } catch (e) {
        return res.status(400).json({ error: e.message || 'Envie dados válidos para o cadastro!' })
      }
    } else {
      res.status(200)
    }

    return res.json(dev)
  }
}
