import React, { Component } from 'react'

import MovieServices from '../../services/movie-services'

import GenreContext from './genre-contex'

export default class GenresProvider extends Component {
  state = {
    genres: [],
    loading: true,
    error: null,
  }

  componentDidMount() {
    this.fetchGenres()
  }

  fetchGenres = async () => {
    const movieService = new MovieServices()
    try {
      const data = await movieService.getGenres()
      this.setState({ genres: data.genres, loading: false })
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  render() {
    const { genres, loading, error } = this.state
    const value = { genres, loading, error }

    return <GenreContext.Provider value={value}>{this.props.children}</GenreContext.Provider>
  }
}
