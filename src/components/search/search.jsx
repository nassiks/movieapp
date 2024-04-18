import { Input } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

import './search.css'
export default function Search({ onSearch }) {
  const handleSearch = debounce((value) => {
    onSearch(value)
  }, 500)

  return (
    <div className="movie-list-search">
      <Input placeholder="Type to search..." onChange={(e) => handleSearch(e.target.value)} />
    </div>
  )
}

Search.defaultProps = {
  onSearch: () => {},
}

Search.propTypes = {
  onSearch: PropTypes.func,
}
