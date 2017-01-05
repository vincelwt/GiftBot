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
      getGiftsAmazon(client.getConversationState().genre.value, client.getConversationState().age.value, client.getConversationState().budget.value, giftsData => {

        client.addCarouselListResponse({
          items: giftsData,
        })
        client.done()

        callback()
      })
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
