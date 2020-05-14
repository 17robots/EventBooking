const bcrypt = require('bcryptjs')
const Event = require('../../models/event')
const User = require('../../models/user')

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) }
    } catch(err) {
        throw err
    } 
}

const events = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}}) // special mongodb syntax $in specified as a filter
        events.map(event => {
            return { 
                ...event._doc, 
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
        return events
    } catch(err) {
        throw err
    }
}

module.exports = {
    events: async () => {
        try {
        const events = await Event.find()
        return events.map(event => {
            return {
                ...event._doc, 
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator) // bind the element to the function call and use the event's creator field (the id) as the argument
            }
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
            createdEvent = {
                ...result._doc,
                _id: result.id.toString(),
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator) 
            }
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
            return {...result._doc, password: null, _id: result.id}
        } catch(err) {
            throw err;
        }
    }
}