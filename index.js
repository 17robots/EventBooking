const express = require('express')
const bodyParser = require('body-parser')
const graphQLHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Event = require('./models/event')
const User = require('./models/user')

const app = express()


app.use(bodyParser.json())

app.use('/graphql', graphQLHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String
        password: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }
    
    schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            .populate('creator')
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc, 
                        _id: event.id,
                        creator: {
                            ...event._doc.creator._doc,
                            _id: event._doc.creator.id
                        }
                    }
                })
            })
            .catch(err => {
                throw err
            })
        },
        createEvent: args => {
            const {title, description, price, date} = args.eventInput
            const event = new Event({
                title: title,
                description: description,
                price: price,
                date: new Date(date),
                creator: '5ea12da24fa9db00f52e3bf1'
            })
            let createdEvent
            return event.save()
            .then(result => {
                createdEvent = {...result._doc, _id: result.id}
                return User.findById('5ea12da24fa9db00f52e3bf1')
            })
            .then(user => {
                if(!user)
                    throw new Error('User not found')
                user.createdEvents.push(event)
                return user.save()
            })
            .then(result => {
                console.log(createdEvent)
                return createdEvent
            })
            .catch(err => {
                console.log(err)
                throw err
            })
        },
        createUser: args => {
            return User.findOne({ email: args.userInput.email }).then(user => {
                if(user) {
                    throw new Error('User exists already.')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashPass => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashPass
                })
                return user.save()
            })
            .then(result => {
                return {...result._doc, password: null, _id: result.id}
            })
            .catch(err => {
                throw err;
            })
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.user}:${process.env.password}@projects-wtsk3.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)  
}).catch(err => {
    console.log(err)
})