import React from 'react'
import { Link } from 'react-router-dom'

const eventDetails = props => (
    <React.Fragment>
        <h1>{props.selectedEvent.title}</h1>
        <h3>Date: {new Date(props.selectedEvent.date).toLocaleDateString()}</h3>
        <h3>Price: {props.selectedEvent.price}</h3>
        <h3>Details</h3>
        <p>{props.selectedEvent.description}</p>
        {!props.context.userId && <p>You must <Link to="/auth">log in</Link> to book the event</p>}
    </React.Fragment>
)

export default eventDetails