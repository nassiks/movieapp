export default class MovieServices {
  async getResource(url) {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return await res.json()
  }

  async getPopularMovies(page = 1) {
    const API_KEY = '00f653e348e3161b1f1cddf56b865aed'
    const res = await this.getResource(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`)
    return res.results.map(this.getMovie.bind(this))
  }

  async getAllMovie(searchTerm = '', page = 1) {
    const API_KEY = '00f653e348e3161b1f1cddf56b865aed'
    const res = await this.getResource(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}`
    )
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
      genre: 'Drama',
      description: movie.overview,
      releaseDate: movie.release_date,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    }
  }
}
