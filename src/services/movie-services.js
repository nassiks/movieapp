export default class MovieServices {
  constructor() {
    this.API_KEY = '00f653e348e3161b1f1cddf56b865aed'
    this.BASE_URL = 'https://api.themoviedb.org/3'
    this.guestSessionId = localStorage.getItem('guestSessionId') || null
  }
  async getResource(url, needsAuth = false) {
    let modifiedUrl = url
    if (needsAuth && this.guestSessionId) {
      const delimiter = url.includes('?') ? '&' : '?'
      modifiedUrl = `${url}${delimiter}guest_session_id=${this.guestSessionId}`
    }

    const response = await fetch(modifiedUrl)
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }
    return await response.json()
  }

  async initializeGuestSession() {
    if (!this.guestSessionId) {
      const url = `${this.BASE_URL}/authentication/guest_session/new?api_key=${this.API_KEY}`
      const data = await this.getResource(url)
      this.guestSessionId = data.guest_session_id
      localStorage.setItem('guestSessionId', this.guestSessionId)
    }
    return this.guestSessionId
  }

  async getMovieDetails(movieId) {
    const url = `${this.BASE_URL}/movie/${movieId}?api_key=${this.API_KEY}`
    const res = await this.getResource(url)
    if (res && res.id) {
      return this.getMovie(res)
    } else {
      return null
    }
  }

  async getGenres() {
    const url = `${this.BASE_URL}/genre/movie/list?api_key=${this.API_KEY}`
    return await this.getResource(url)
  }

  async getPopularMovies(page = 1) {
    const url = `${this.BASE_URL}/movie/popular?api_key=${this.API_KEY}&page=${page}`
    const res = await this.getResource(url)
    return {
      movies: res.results.map(this.getMovie.bind(this)),
      totalResults: res.total_results,
      totalPages: res.total_pages,
    }
  }

  async getAllMovie(searchTerm = '', page = 1) {
    const url = `${this.BASE_URL}/search/movie?api_key=${this.API_KEY}&query=${encodeURIComponent(searchTerm)}&page=${page}`
    const res = await this.getResource(url)
    return {
      movies: res.results.map(this.getMovie.bind(this)),
      totalResults: res.total_results,
      totalPages: res.total_pages,
    }
  }

  getMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      rating: movie.vote_average,
      genre: movie.genre_ids,
      description: movie.overview,
      releaseDate: movie.release_date,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    }
  }
}
