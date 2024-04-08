export default class MovieServices {
  async getResource(url) {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return await res.json()
  }

  async getAllMovie() {
    const res = await this.getResource(
      'https://api.themoviedb.org/3/search/movie?api_key=00f653e348e3161b1f1cddf56b865aed&query=return'
    )
    return res.results.slice(0, 6).map(this.getMovie)
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
