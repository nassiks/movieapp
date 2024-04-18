import React from 'react'
import PropTypes from 'prop-types'

import './poster.css'

function Poster({ src, title }) {
  function handleImageError(event) {
    const imageContainer = event.target.parentNode
    imageContainer.style.background = 'grey'
    event.target.style.display = 'none'
  }

  return (
    <div className="movie-card-image-container">
      <img alt={title} src={src} onError={handleImageError} className="movie-card-image" />
    </div>
  )
}

Poster.defaultProps = {
  src: '',
  title: 'No title',
}

Poster.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
}

export default Poster
