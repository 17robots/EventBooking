const express = require('express')
const bodyParser = require('body-parser')
const graphQLHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQLSchema = require('./graphql/schema')
const graphQlResolvers = require('./graphql/resolvers')

const app = express()

app.use(bodyParser.json())

app.use('/graphql', graphQLHttp({
    schema: graphQLSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${process.env.user}:${process.env.password}@projects-wtsk3.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)  
}).catch(err => {
    console.log(err)
})