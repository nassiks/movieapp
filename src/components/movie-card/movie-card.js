import React, { Component } from 'react'
import { Card, Rate, Tag, Row, Col } from 'antd'
import { format, parse, isValid } from 'date-fns'

import './movie-card.css'

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }

  let truncated = text.substr(0, maxLength)
  truncated = truncated.substr(0, Math.min(truncated.length, truncated.lastIndexOf(' ')))

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
  render() {
    const { imageUrl, title, rating, genre, description, releaseDate } = this.props.movie
    const maxLength = 150

    return (
      <Card hoverable className="movie-card">
        <Row wrap={false}>
          <Col flex="none">
            <img alt={title} src={imageUrl} className="movie-card-image" />
          </Col>
          <Col flex="auto" className="movie-card-info">
            <h2 className="movie-card-title">{title}</h2>
            <div className="movie-card-release-date">{formatDate(releaseDate)}</div>
            <div className="movie-card-genre">
              <Tag className="movie-card-genre">{genre}</Tag>
            </div>
            <p className="movie-card-description">{truncateText(description, maxLength)}</p>
            <Rate className="movie-card-rate" count={10} allowHalf disabled value={rating} />
          </Col>
        </Row>
      </Card>
    )
  }
}
