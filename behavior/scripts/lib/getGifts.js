'use strict'

const request = require('request')

module.exports = function getGiftsAmazon(genre, age, budget, next) {
  switch (genre) {
    case 'man':
    case 'husband':
    case 'father':
    case 'dad':
    case 'brother':
    case 'boyfriend':
      var genre = 'boy';
      break;

    case 'woman':
    case 'wife':
    case 'mom':
    case 'mother':
    case 'girlfriend':
      var genre = 'girl';
      break;

  }

  console.log("Getting gift list for "+genre+" "+age+"yo with "+budget);
  
  var giftsdata = require('./gifts.json');

  var selected = [];
  var treated = [];


  for (let g of giftsdata)
    if ((parseFloat(age) >= parseFloat(g[5]) || g[5] == '') && (parseFloat(age) <= parseFloat(g[6]) || g[6] == '') && (parseFloat(g[4]) <= parseFloat(budget)) )
      selected.push(g);

  for (let g of selected) {
    treated.push({
        media_url: g[3],
        media_type: 'image/jpeg',
        description: g[2],
        title: toString(Math.round(g[4]))+'$: '+g[1],
        actions: [
          {
            type: 'link',
            text: 'View',
            uri: g[8],
          },
        ],
    })
  }

  next(treated, genre, age, budget);
}
