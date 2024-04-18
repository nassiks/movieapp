import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'

function Genre({ genreIds, genres }) {
  if (!genreIds || !genres) return null

  return genreIds.map((genreId) => {
    const genre = genres.find((g) => g.id === genreId)
    return genre ? (
      <Tag key={genre.id} className="movie-card-genre-tag">
        {genre.name}
      </Tag>
    ) : null
  })
}

Genre.propTypes = {
  genreIds: PropTypes.arrayOf(PropTypes.number),
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
}

Genre.defaultProps = {
  genreIds: [],
  genres: [],
}

export default Genre
