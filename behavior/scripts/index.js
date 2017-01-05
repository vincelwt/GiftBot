'use strict'

const getGiftsAmazon = require('./lib/getGifts')

exports.handle = function handle(client) {
  const collectGenre = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().genre)
    },

    extractInfo() {
     const genre = client.getFirstEntityWithRole(client.getMessagePart(), 'genre')
      if (genre) {
        client.updateConversationState({
          genre: genre,
        })
        console.log('User wants a gift for:', genre.value);
      }
      
    },

    prompt() {
      client.addResponse('prompt/genre')
      client.done()
    },
  })

  const collectAge = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().age)
    },

    extractInfo() {
     const age = client.getFirstEntityWithRole(client.getMessagePart(), 'age')
      if (age) {
        client.updateConversationState({
          age: age,
        })
        console.log('User wants a gift for age:', age.value)
      }
    },

    prompt() {
      client.addResponse('prompt/age')
      client.done()
    },
  })

  const collectBudget = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().budget)
    },

    extractInfo() {
     const budget = client.getFirstEntityWithRole(client.getMessagePart(), 'budget')
      if (budget) {
        client.updateConversationState({
          budget: budget,
        })
        console.log('User wants a gift for budget:', budget.value)
      }
    },

    prompt() {
      client.addResponse('prompt/budget')
      client.done()
    },
  })

  const provideGifts = client.createStep({

    satisfied() {
      return false
    },

    prompt(callback) {
      console.log("Almost done!");
      const environment = client.getCurrentApplicationEnvironment()
      //getGiftsAmazon(client.getConversationState().genre.value, client.getConversationState().age.value, client.getConversationState().budget.value, giftsData => {
        /*if (!resultBody || resultBody.cod !== 200) {
          console.log('Error getting weather.')
          callback()
          return
        }

        const weatherDescription = (
          resultBody.weather.length > 0 ?
          resultBody.weather[0].description :
          null
        )

        const weatherData = {
          temperature: Math.round(resultBody.main.temp),
          condition: weatherDescription,
          city: resultBody.name,
        }

        console.log('sending real weather:', weatherData)*/
        const giftsData = {
          links: 'http://amzn.eu/fqUJPBH'
        }

        client.addResponse('provide_gifts', giftsData)
        client.addCarouselListResponse({
          items: [
            {
              media_url: 'https://c2.staticflickr.com/4/3512/5763418254_e2f42b2224_b.jpg',
              media_type: 'image/jpeg',
              description: 'Yosemite is a really nice place.',
              title: 'Yosemite',
              actions: [
                {
                  type: 'postback',
                  text: 'Visit',
                  payload: {
                    data: {
                      action: 'visit',
                      park: 'yosemite'
                    },
                    version: '1',
                    stream: 'selectPark',
                  },
                },
              ],
            },
            {
              media_url: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Morning_Glory_Pool.jpg',
              media_type: 'image/jpeg',
              description: 'Yellowstone showcases geology in its most raw form.',
              title: 'Yellowstone',
              actions: [
                {
                  type: 'link',
                  text: 'View info',
                  uri: 'https://en.wikipedia.org/wiki/Yellowstone_National_Park',
                },
              ],
            },
          ],
        })
        client.done()

      //  callback()
      //})
    },
  })

  client.runFlow({
    classifications: {},
    streams: {
      main: 'getGifts',
      askAboutGifts: [collectGenre, collectAge, collectBudget, provideGifts],
      getGifts: ['askAboutGifts'],
    }
  })
}
