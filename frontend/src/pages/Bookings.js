import React, { Component } from 'react'
import AuthContext from '../context/auth-context'

import Spinner from '../components/Spinner/Spinner'
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingControls from '../components/Bookings/BookingsControls/BookingsControls'
import BookingChart from '../components/Bookings/BookingsChart/BookingsChart'

export default class BookingPage extends Component {
    static contextType = AuthContext
    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
    }

    componentDidMount() {
        this.fetchBookings()
    }

    fetchBookings = () => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                            price
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
                'Authorization': 'Bearer ' + this.context.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then(resData => {
                const bookings = resData.data.bookings
                this.setState({ bookings: bookings, isLoading: false })
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    deleteBookingHandler = bookingId => {
        this.setState({ isLoading: true })
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
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
                    const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId)
                    return { bookings: updatedBookings, isLoading: false }
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoading: false })
            })
    }

    changeOutputTypeHandler = outputType => {
        switch (outputType) {
            case 'list':
                this.setState({ outputType: 'list' })
                break
            default:
                this.setState({ outputType: 'chart' })
                break
        }
    }

    render() {
        let content = <Spinner />
        if (!this.state.isLoading) content = (
            <React.Fragment>
                <BookingControls activeOutputType={this.state.outputType} onChange={this.changeOutputTypeHandler} />
                <div>
                    {this.state.outputType === 'list' ? <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} /> : <BookingChart bookings={this.state.bookings} />}
                </div>
            </React.Fragment>
        )
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        )
    }
}