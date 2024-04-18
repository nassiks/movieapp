import React from 'react'
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

export default Genre
