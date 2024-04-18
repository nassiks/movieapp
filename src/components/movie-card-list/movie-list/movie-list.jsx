import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd'

import MovieCard from '../../movie-card'

function MovieList({ movies, onRate }) {
  return (
    <List
      grid={{
        gutter: [36, 36],
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 2,
        xxl: 2,
      }}
      dataSource={movies}
      renderItem={(movie) => (
        <List.Item>
          <MovieCard movie={movie} onRate={onRate} />
        </List.Item>
      )}
    />
  )
}

MovieList.defaultProps = {
  movies: [],
  onRate: () => {},
}

MovieList.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRate: PropTypes.func,
}
export default MovieList
