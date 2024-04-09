import React, { Component } from 'react'
import { List, Spin, Alert, Input, Pagination } from 'antd'
import { debounce } from 'lodash'

import MovieCard from '../movie-card'
import MovieServices from '../../services/movie-services'

import './movie-card-list.css'

export default class MovieCardList extends Component {
  state = {
    movies: [],
    loading: true,
    error: null,
    searchTerm: '',
    currentPage: 1,
    totalResults: 0,
  }

  movieService = new MovieServices()

  componentDidMount() {
    this.getMoviesOrPopular()
  }

  getMoviesOrPopular() {
    const { searchTerm, currentPage } = this.state

    if (searchTerm) {
      this.movieService.getAllMovie(searchTerm, currentPage).then(this.updateMoviesState).catch(this.handleError)
    } else {
      this.movieService.getPopularMovies(currentPage).then(this.updateMoviesState).catch(this.handleError)
    }
  }

  handleSearch = debounce((searchTerm) => {
    this.setState({ searchTerm, currentPage: 1, loading: true }, () => {
      this.getMovies()
    })
  }, 500)

  getMovies() {
    const { searchTerm, currentPage } = this.state

    this.movieService
      .getAllMovie(searchTerm, currentPage)
      .then((data) => {
        console.log(data)
        this.setState({
          movies: data.movies, // Direct assignment without spread operator
          totalResults: data.totalResults,
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

  handlePaginationChange = (page) => {
    this.setState({ currentPage: page, loading: true }, () => {
      this.getMovies()
    })
  }

  updateMoviesState = (movies) => {
    this.setState({
      movies: movies,
      loading: false,
      error: null,
    })
  }

  handleError = (error) => {
    this.setState({
      error: error.message,
      loading: false,
    })
  }

  render() {
    const { movies, loading, error, currentPage, totalResults, searchTerm } = this.state
    const noResults = !loading && (movies || []).length === 0 && searchTerm

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
      <div className="movie-card-list">
        <div className="movie-list-search">
          <Input placeholder="Type to search..." onChange={(e) => this.handleSearch(e.target.value)} />
        </div>
        <div className="movie-list-container">
          {noResults ? (
            <Alert
              message="Ничего не найдено!"
              description={`По запросу "${searchTerm}" ничего не найдено.`}
              type="info"
              showIcon
            />
          ) : (
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
          )}
        </div>
        <div className="movie-card-pagination">
          <Pagination current={currentPage} total={totalResults} pageSize={20} onChange={this.handlePaginationChange} />
        </div>
      </div>
    )
  }
}
