import React, { Component } from 'react'
import AuthContext from '../context/auth-context'

import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import EventList from '../components/Events/EventList/EventList'
import Spinner from '../components/Spinner/Spinner'
import EventDetails from '../components/Events/EventDetails/EventDetails'

import './Events.css'

export default class EventPage extends Component {

    static contextType = AuthContext

    state = {
        creating: false,
        editing: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    }

    constructor(props) {
        super(props)
        this.titleEl = React.createRef()
        this.priceEl = React.createRef()
        this.dateEl = React.createRef()
        this.descriptionEl = React.createRef()
    }

    componentDidMount() {
        this.fetchEvents()
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true })
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false })
        const title = this.titleEl.current.value
        const price = +this.priceEl.current.value
        const date = this.dateEl.current.value
        const description = this.descriptionEl.current.value

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) return

        const event = { title, price, date, description }
        console.log(event)

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `
        }

        const token = this.context.token

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then(resData => {
                this.setState(prevState => {
                    const updatedEvent = [...prevState.events]
                    updatedEvent.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        date: resData.data.createEvent.date,
                        price: resData.data.createEvent.price,
                        creator: {
                            _id: this.context.userId
                        }
                    })
                    return { events: updatedEvent }
                })
            })
            .catch(err => console.log(err))
    }

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null })
    }

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId)
            return { selectedEvent: selectedEvent }
        })
    }

    bookEventHandler = () => { 
        const requestBody = {
            query: `
                mutation {
                    bookEvent(eventId: ${this.selectedEvent._id}}) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `
        }

        const token = this.context.token

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed')
            }
            return res.json()
        })
        .then(resData => {
            this.setState(prevState => {
                const updatedEvent = [...prevState.events]
                updatedEvent.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: this.context.userId
                    }
                })
                return { events: updatedEvent }
            })
        })
        .catch(err => console.log(err))
    }

    fetchEvents() {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then(resData => {
                const events = resData.data.events
                this.setState({ events: events, isLoading: false })
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
                {
                    this.state.creating &&
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                        confirmText="Confirm"
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleEl}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceEl}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="datetime-local" id="title" ref={this.dateEl}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <textarea id="title" rows="4" ref={this.descriptionEl}></textarea>
                            </div>
                        </form>
                    </Modal>
                }
                {this.state.selectedEvent && (
                    <Modal
                        title="Event Details"
                        canCancel
                        canConfirm={(this.context.userId && this.context.userId !== this.state.selectedEvent.creator._id) ? true : false}
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.bookEventHandler}
                        confirmText="Book Event"
                    >
                        <EventDetails context={this.context} selectedEvent={this.state.selectedEvent} />
                    </Modal>

                )}
                {this.context.token && <div className="events-control">
                    <p>Share Your Own Events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>}
                {
                    this.state.isLoading ?
                        <Spinner />
                        :
                        <EventList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.showDetailHandler} />
                }
            </React.Fragment>
        )
    }
}