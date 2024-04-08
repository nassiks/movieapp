import React, { Component } from 'react'
import { List, Spin, Alert } from 'antd'

import MovieCard from '../movie-card'
import MovieServices from '../../services/movie-services'

import './movie-card-list.css'

export default class MovieCardList extends Component {
  state = {
    movies: [],
    loading: true,
    error: null,
  }

  movieService = new MovieServices()

  componentDidMount() {
    this.getMovies()
  }

  getMovies() {
    this.movieService
      .getAllMovie()
      .then((movies) => {
        this.setState({
          movies,
          loading: false,
        })
      })
      .catch(() => {
        this.setState({
          error: 'Не удается загрузить данные. Пожалуйста, проверьте соединение с интернетом.',
          loading: false,
        })
      })
  }

  render() {
    const { movies, loading, error } = this.state

    if (error) {
      return (
        <div className="movie-list-container">
          <Alert message="Ошибка!" description={error} type="error" showIcon />
        </div>
      )
    }

    if (loading) {
      return (
        <div className="movie-list-container">
          <Spin size="large" />
        </div>
      )
    }

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
