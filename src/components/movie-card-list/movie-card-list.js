import React, { Component } from 'react'
import { Spin, Alert, Tabs, Pagination } from 'antd'
import { debounce } from 'lodash'

import MovieServices from '../../services/movie-services'
import Search from '../search'

import MovieList from './movie-list'

import './movie-card-list.css'

export default class MovieCardList extends Component {
  state = {
    movies: [],
    ratedMovies: [],
    loading: true,
    error: null,
    searchTerm: '',
    currentPage: 1,
    totalResults: 0,
  }

  movieService = new MovieServices()

  componentDidMount() {
    if (!this.state.guestSessionId) {
      this.initializeGuestSession()
    }
    this.getMoviesOrPopular()
    this.loadRatedMovies()
  }

  initializeGuestSession = async () => {
    if (this.state.guestSessionId) {
      return
    }
    try {
      const guestSessionId = await this.movieService.initializeGuestSession()
      this.setState({ guestSessionId })
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  fetchRatedMovies = (movieRatings) => {
    const movieIds = Object.keys(movieRatings)
    const moviesPromises = movieIds.map((id) => this.movieService.getMovieDetails(id))

    Promise.all(moviesPromises)
      .then((movies) => {
        const ratedMovies = movies.map((movie) => ({
          ...movie,
          userRating: movieRatings[movie.id],
        }))
        this.setState({ ratedMovies })
      })
      .catch((error) => {
        this.setState({ error: error.message })
      })
  }

  loadRatedMovies = () => {
    try {
      const savedMovieRatings = localStorage.getItem('movieRatings')
      if (savedMovieRatings) {
        const movieRatings = JSON.parse(savedMovieRatings)
        this.fetchRatedMovies(movieRatings)
      }
    } catch (error) {
      localStorage.removeItem('movieRatings')
    }
  }

  rateMovie = (movie) => {
    this.setState((prevState) => {
      const updatedRatedMovies = [...prevState.ratedMovies, movie]
      const movieRatings = updatedRatedMovies.reduce((acc, curr) => {
        acc[curr.id] = curr.userRating
        return acc
      }, {})
      localStorage.setItem('movieRatings', JSON.stringify(movieRatings))
      return { ratedMovies: updatedRatedMovies }
    })
  }

  getMoviesOrPopular() {
    const { searchTerm, currentPage } = this.state

    if (searchTerm) {
      this.movieService.getAllMovie(searchTerm, currentPage).then(this.updateMoviesState).catch(this.handleError)
    } else {
      this.movieService.getPopularMovies(currentPage).then(this.updateMoviesState).catch(this.handleError)
    }
  }

  getMovies() {
    const { searchTerm, currentPage } = this.state

    this.movieService
      .getAllMovie(searchTerm, currentPage)
      .then((data) => {
        this.setState({
          movies: data.movies,
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

  handleSearch = debounce((searchTerm) => {
    this.setState({ searchTerm, currentPage: 1, loading: true }, () => {
      this.getMovies()
    })
  }, 500)

  handlePaginationChange = (page) => {
    this.setState({ currentPage: page, loading: true }, () => {
      this.getMoviesOrPopular()
    })
  }

  updateMoviesState = (movies) => {
    this.setState({
      movies: movies.movies,
      totalResults: movies.totalResults || 0,
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
    const { movies, ratedMovies, loading, error, currentPage, totalResults, searchTerm } = this.state

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

    const noResults = !loading && (movies || []).length === 0 && searchTerm

    const searchTabContent = (
      <div>
        <Search onSearch={this.handleSearch} />
        <div className="movie-list-container">
          {noResults ? (
            <Alert
              message="Ничего не найдено!"
              description={`По запросу "${searchTerm}" ничего не найдено.`}
              type="info"
              showIcon
            />
          ) : (
            <MovieList movies={movies} onRate={this.rateMovie} />
          )}
        </div>
        <div className="movie-card-pagination">
          <Pagination current={currentPage} total={totalResults} pageSize={20} onChange={this.handlePaginationChange} />
        </div>
      </div>
    )

    const ratedTabContent = (
      <div>
        <div className="movie-list-container-rated">
          <MovieList movies={ratedMovies} />
        </div>
        <div className="movie-card-pagination">
          <Pagination current={currentPage} pageSize={20} onChange={this.handlePaginationChange} />
        </div>
      </div>
    )

    const items = [
      {
        label: 'Search',
        key: 'search',
        children: searchTabContent,
      },
      {
        label: 'Rated',
        key: 'rated',
        children: ratedTabContent,
      },
    ]

    return <Tabs defaultActiveKey="search" items={items} destroyInactiveTabPane={false} />
  }
}
