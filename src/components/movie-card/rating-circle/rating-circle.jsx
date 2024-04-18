import React from 'react'
import PropTypes from 'prop-types'

import './rating-circle.css'

function RatingCircle({ rating }) {
  function getRatingColor(rating) {
    if (rating >= 7) {
      return '#66E900'
    } else if (rating >= 5) {
      return '#E9D100'
    } else if (rating >= 3) {
      return '#E97E00'
    }
    return '#E90000'
  }

  return (
    <div className="movie-card-rating-circle" style={{ borderColor: getRatingColor(rating) }}>
      {parseFloat(rating.toFixed(1))}
    </div>
  )
}

RatingCircle.defaultProps = {
  rating: 0,
}

RatingCircle.propTypes = {
  rating: PropTypes.number,
}

export default RatingCircle
