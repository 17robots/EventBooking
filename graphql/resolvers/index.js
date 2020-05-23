const authResolver = require('./auth')
const eventResolver = require('./events')
const bookingResolver = require('./booking')

module.exports = {
    ...authResolver,
    ...eventResolver,
    ...bookingResolver
}