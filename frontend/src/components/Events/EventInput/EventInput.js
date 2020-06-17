import React from 'react'

const eventInput = props => (
    <form>
        <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" ref={props.titleEl}>{props.selectedEvent.title}</input>
        </div>
        <div className="form-control">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" ref={props.priceEl}></input>
        </div>
        <div className="form-control">
            <label htmlFor="date">Date</label>
            <input type="datetime-local" id="title" ref={props.dateEl}></input>
        </div>
        <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea id="title" rows="4" ref={props.descriptionEl}></textarea>
        </div>
    </form>
)

export default eventInput