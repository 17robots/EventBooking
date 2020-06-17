const Event = require('../../models/event')
const User = require('../../models/user')
const { transformEvent } = require('./merge')

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event)
            })
        } catch (err) {
            throw err
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        const { title, description, price, date } = args.eventInput
        const event = new Event({
            title: title,
            description: description,
            price: price,
            date: new Date(date),
            creator: req.userId
        })
        let createdEvent
        try {
            const result = await event.save()
            createdEvent = transformEvent(result)
            const user = await User.findById(req.userId)
            if (!user) {
                throw new Error('User not found')
            }
            user.createdEvents.push(event)
            await user.save()
            return createdEvent
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    editEvent: async (args, req) => {
        if (!req.isAuth) throw new Error('Unauthorized!')
    }
}