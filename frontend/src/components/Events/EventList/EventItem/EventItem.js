import React from 'react'

import './EventItem.css'

const eventItem = props => (
    <li key={props._id} className="events__list-item">
        <div>
            <h1>{props.title}</h1>
            {/* <h3>${props.price} - {new Date(props.date).toLocaleDateString()}</h3> */}
        </div>
        <div>
            <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>
            {/* <p>You created the event</p> */}
        </div>
    </li>
)

export default eventItem