import React from 'react'
import { Bar } from 'react-chartjs-2'

const BOOKINGS_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 100,
    },
    'Normal': {
        min: 101,
        max: 200
    },
    'Expensive': {
        min: 201,
        max: 100000000
    }
}

const bookingChart = props => {
    const chartData = { labels: [], datasets: [] }
    let values = []
    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = props.bookings.reduce((prev, curr) => {
            return prev + (curr.event.price < BOOKINGS_BUCKETS[bucket].max && curr.event.price >= BOOKINGS_BUCKETS[bucket].min ? 1 : 0)
        }, 0)
        values.push(filteredBookingsCount)
        chartData.labels.push(bucket)
        chartData.datasets.push({
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightStroke: "rgba(220,220,220,0.75)",
            data: values
        })
        values = [...values]
        values[values.length - 1] = 0
    }
    console.log(chartData)
    return <Bar data={chartData} />
}

export default bookingChart