import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Rate, Row, Col } from 'antd'
import { format, parse, isValid } from 'date-fns'

import './movie-card.css'
import GenreContext from '../genre-context/genre-contex'

import RatingCircle from './rating-circle'
import Poster from './poster'
import Genre from './genre'

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }

  let truncated = text.substring(0, maxLength)
  truncated = truncated.substring(0, Math.min(truncated.length, truncated.lastIndexOf(' ')))

  return truncated + '...'
}

function formatDate(dateString) {
  const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date())
  if (!isValid(parsedDate)) {
    return 'Invalid date'
  }
  return format(parsedDate, 'MMMM d, yyyy')
}

export default class MovieCard extends Component {
  static defaultProps = {
    movie: {
      id: '',
      imageUrl: '',
      title: 'Unknown title',
      rating: 0,
      genre: [],
      description: '',
      releaseDate: '',
    },
  }

  static propTypes = {
    movie: PropTypes.shape({
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
      title: PropTypes.string,
      rating: PropTypes.number,
      genre: PropTypes.arrayOf(PropTypes.number),
      description: PropTypes.string,
      releaseDate: PropTypes.string,
    }),
  }
  constructor(props) {
    super(props)
    const savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {}
    const userRating = savedRatings[props.movie.id] || 0
    this.state = {
      userRating: userRating,
    }
  }

  handleRatingChange = (newRating) => {
    const { movie } = this.props
    this.setState({ userRating: newRating })
    const ratings = JSON.parse(localStorage.getItem('movieRatings')) || {}
    ratings[movie.id] = newRating
    localStorage.setItem('movieRatings', JSON.stringify(ratings))
  }

  render() {
    const { imageUrl, title, rating, genre, description, releaseDate } = this.props.movie
    const maxLength = 150

    return (
      <GenreContext.Consumer>
        {({ genres }) => (
          <Card hoverable className="movie-card">
            <Row wrap={false}>
              <Col flex="none">
                <Poster src={imageUrl} title={title} />
              </Col>
              <Col flex="auto" className="movie-card-info">
                <div className="movie-card-info-header">
                  <h2 className="movie-card-title">{title}</h2>
                  <RatingCircle rating={rating}></RatingCircle>
                </div>
                <div className="movie-card-release-date">{formatDate(releaseDate)}</div>
                <div className="movie-card-genre">
                  <Genre genreIds={genre} genres={genres} />
                </div>
                <p className="movie-card-description">{truncateText(description, maxLength)}</p>
                <Rate
                  className="movie-card-rate"
                  count={10}
                  allowHalf
                  value={this.state.userRating}
                  onChange={this.handleRatingChange}
                />
              </Col>
            </Row>
          </Card>
        )}
      </GenreContext.Consumer>
    )
  }
}
