const axios = require('axios');
const Dev = require('../models/Dev');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;
    const techsNormalized = techs.map(tech => tech.trim());

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const { data } = await axios.get(`https://api.github.com/users/${github_username}`);
      const {
        name = data.login,
        avatar_url,
        bio
      } = data;

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsNormalized,
        location,
      });
      res.status(201);

      const sendSocketMessageTo = findConnections(
        { latitude, longitude, },
        techsNormalized
      );

      sendMessage(sendSocketMessageTo, 'new-dev', dev)

    } else {
      res.status(200);
    }

    return res.json(dev);
  }
}