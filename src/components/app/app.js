import React, { Component } from 'react'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'

import './app.css'

import MovieCardList from '../movie-card-list'
import GenresProvider from '../genre-context/genre-provider'
export default class App extends Component {
  render() {
    return (
      <GenresProvider>
        <Layout className="movie-app">
          <Content>
            <MovieCardList />
          </Content>
        </Layout>
      </GenresProvider>
    )
  }
}
