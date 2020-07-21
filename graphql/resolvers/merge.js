const DataLoader = require('dataloader')

const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../helpers/date')

const eventLoader = new DataLoader(eventIds => events(eventIds))

const userLoader = new DataLoader(userIds => {
    // console.log(userIds)
    return User.find({ _id: { $in: userIds } })
})

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString())
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
            // .bind(this, ...) doesnt woek with loadMany because of this keyword and user function
        }
    } catch (err) {
        throw err
    }
}

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } }) // special mongodb syntax $in specified as a filter
        events.sort((a, b) => eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString()))
        return events.map(event => {
            return transformEvent(event)
        })
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString())
        return event
    } catch (err) {
        throw err
    }
}

exports.user = user
exports.events = events
exports.singleEvent = singleEvent
exports.transformEvent = transformEvent
exports.transformBooking = transformBooking