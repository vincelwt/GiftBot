'use strict'

const getGiftsAmazon = require('./lib/getGifts')

exports.handle = function handle(client) {
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

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
     const age = client.getFirstEntityWithRole(client.getMessagePart(), 'number/age')
     
      if (age) {
        console.log(age);
        client.updateConversationState({
          age: age,
        })
        console.log('User wants a gift for age:', age.value)
      }
    },

    prompt() {
      if (client.getConversationState().genre.value) {
        var genre = client.getConversationState().genre.value
        switch (genre) {
            case 'girl':
            case 'woman':
            case 'wife':
            case 'mom':
            case 'aunt':
            case 'daughter':
            case 'sis':
            case 'mother':
            case 'girlfriend':
              var genre = 'girl';
              break;

            case 'man':
            case 'husband':
            case 'father':
            case 'dad':
            case 'son':
            case 'bro':
            case 'uncle':
            case 'brother':
            case 'boyfriend':
            case 'boy':
            default:
              var genre = 'boy';
              break;

        }

        client.addResponse('prompt/age', {
          sex: (genre == 'boy' ? 'he' : 'she')
        })
        client.done()
      }
      
    },
  })

  const collectBudget = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().budget)
    },

    extractInfo() {
     const budget = client.getFirstEntityWithRole(client.getMessagePart(), 'number/budget')
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

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addTextResponse('See you later!')
      client.done()
    }
  })

  const provideGifts = client.createStep({

    satisfied() {
      return false
    },

    prompt(callback) {
      console.log("Almost done!");
      const environment = client.getCurrentApplicationEnvironment()

      var genre = client.getConversationState().genre.value;
      var age = (client.getConversationState().age.parsed.results[0] ? client.getConversationState().age.parsed.results[0].value.value : client.getConversationState().age.value)
      var budget = (client.getConversationState().budget.parsed.results[0] ? client.getConversationState().budget.parsed.results[0].value.value : client.getConversationState().budget.value)

      if (genre && age && budget)
        getGiftsAmazon(genre, age, budget, function (giftsData, genre, age, budget) {
          console.log('Age:'+age+'Budget:'+budget+genre)

          client.addResponse('provide_gifts')
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
    autoResponses: {
      'welcome': {},
      'reply/howareyou': {
        minimumConfidence: 0.2
      }
    },
    streams: {
      main: 'getGifts',
      hi: [sayHello],
      askAboutGifts: [collectGenre, collectAge, collectBudget, provideGifts],
      getGifts: ['askAboutGifts'],
      goodbye: handleGoodbye,
    }
  })
}
