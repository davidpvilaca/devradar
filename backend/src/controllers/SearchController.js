const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
  async index (req, res) {
    // buscar todos os devs num raio de 10km
    // filtrar techs

    const {
      latitude,
      longitude,
      techs
    } = req.query

    const techsArray = parseStringAsArray(techs)

    const devs = await Dev.find({
      techs: {
        $in: techsArray.map(tech => new RegExp(tech, 'i'))
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 100000
        }
      }
    })
    return res.json(devs)
  }
}
