import React, { Component } from 'react'
import { List } from 'antd'

import MovieCard from '../movie-card'
import MovieServices from '../../services/movie-services'
import './movie-card-list.css'

export default class MovieCardList extends Component {
  state = {
    movies: [],
  }

  movieService = new MovieServices()

  componentDidMount() {
    this.getMovies()
  }

  getMovies() {
    this.movieService.getAllMovie().then((movies) => {
      this.setState({
        movies,
      })
    })
  }

  render() {
    const { movies } = this.state
    return (
      <div className="movie-list-container">
        <List
          grid={{
            gutter: [36, 36],
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
          }}
          dataSource={movies}
          renderItem={(movie) => (
            <List.Item>
              <MovieCard movie={movie} />
            </List.Item>
          )}
        />
      </div>
    )
  }
}
