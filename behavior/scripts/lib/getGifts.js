'use strict'

const request = require('request')

module.exports = function getGiftsAmazon(genre, age, budget, next) {
  console.log("Getting gift list for "+boy+" "+age+"yo with"+budget);
  //const requestUrl = `http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${weatherAPIKey}&q=${locationName}`

  //console.log('Making HTTP GET request to:', requestUrl)

  /*request(requestUrl, (err, res, body) => {
    if (err) {
      throw new Error(err)
    }

    if (body) {
      const parsedResult = JSON.parse(body)
      next(parsedResult)
    } else {
      next()
    }


  })*/

  const parsedResult = "http://amzn.eu/0E9blr9"
  next(parsedResult);
}
