const express = require('express')
const bodyParser = require('body-parser')
const graphQLHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQLSchema = require('./graphql/schema')
const graphQlResolvers = require('./graphql/resolvers')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next()
})

app.use(isAuth)

app.use('/graphql', graphQLHttp({
    schema: graphQLSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.user}:${process.env.password}@projects-wtsk3.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`).then(() => {
    app.listen(8000)
})
    .catch(err => {
        console.log(err)
    })