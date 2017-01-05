'use strict'

const request = require('request')

module.exports = function getGiftsAmazon(genre, age, budget, next) {
  console.log("Getting gift list for "+genre+" "+age+"yo with "+budget);
  
  var giftsdata = require('./gifts.json');

  var selected = treated = [];


  for (g of giftsdata) {
    if ((age >= g[5] || g[5] == '') && (age <= g[6] || g[5] == '') && (g[7] == genre.toLowerCase()) && (g[4] < budget) ) {
      selected.push(g);
    }
  }

  for (g of selected) {
    treated.push({
        media_url: g[3],
        media_type: 'image/jpeg',
        description: g[2],
        title: g[1],
        actions: [
          {
            type: 'link',
            text: 'View',
            uri: g[8],
          },
        ],
    })
  }

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

  next(treated);
}
