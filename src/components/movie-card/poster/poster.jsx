import React from 'react'

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

export default Poster
