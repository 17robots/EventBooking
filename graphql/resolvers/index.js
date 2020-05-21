const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')
const { dateToString } = require('../helpers/date')

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
    } catch(err) {
        throw err
    }
}

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

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}}) // special mongodb syntax $in specified as a filter
        return events.map(event => {
            return transformEvent(event)
        })
    } catch(err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return transformEvent(event)
    } catch(err) {
        throw err
    }
}

module.exports = {
    events: async () => {
        try {
        const events = await Event.find()
        return events.map(event => {
            return transformEvent(event)
        })
        } catch(err) {
            throw err
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch(err) {
            throw err
        }
    },
    createEvent: async args => {
        const {title, description, price, date} = args.eventInput
        const event = new Event({
            title: title,
            description: description,
            price: price,
            date: new Date(date),
            creator: '5ea12da24fa9db00f52e3bf1'
        })
        let createdEvent
        try {
            const result = await event.save()
            createdEvent = transformEvent(result)
            const user = await User.findById('5ea12da24fa9db00f52e3bf1')
            if(!user) {
                throw new Error('User not found')
            }
            user.createdEvents.push(event)
            await user.save()
            return createdEvent
        } catch(err) {
            console.log(err)
            throw err
        }
    },
    createUser: async args => {
        try {
            const userResponse = await User.findOne({ email: args.userInput.email })
            if(userResponse) {
                throw new Error('User exists already.')
            }
            const hashPass = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashPass
            })
            const result = await user.save()
            return {
                ...result._doc,
                password: null,
                _id: result.id
            }
        } catch(err) {
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId })
            const booking = new Booking({
                user: "5ea12da24fa9db00f52e3bf1",
                event: fetchedEvent
            })

            const result = await booking.save()
            return transformBooking(result)
        } catch(err) {
            throw err
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking._doc.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch(err) {
            throw err
        }
    }
}