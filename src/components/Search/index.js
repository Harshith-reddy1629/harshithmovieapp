import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import MovieItem from '../MovieItem'

import './index.css'

const pageStatus = {
  Loading: 'LOADING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
  Empty: 'EMPTY',
}

class Search extends Component {
  state = {status: '', searchList: [], searched: ''}

  tryAgain = () => {
    this.fetchData()
  }

  searchRoute = () => {
    const {status} = this.state

    switch (status) {
      case pageStatus.Success:
        return this.SuccessView()
      case pageStatus.Loading:
        return this.loadingView()
      case pageStatus.Failed:
        return this.failureView()
      case pageStatus.Empty:
        return this.emptyView()
      default:
        return null
    }
  }

  emptyView = () => {
    const {searched} = this.state

    return (
      <div className="search-container search-fv">
        <img
          alt="no movies"
          src="https://res.cloudinary.com/reddyimgs/image/upload/v1687101303/Group_7394_gadzmp.png"
        />

        <p className="search-not-found-para">
          {`Your search for ${searched} did not find any matches.`}
        </p>
      </div>
    )
  }

  SuccessView = () => {
    const {searchList} = this.state

    return (
      <ul className="popular-container">
        {searchList.map(each => (
          <MovieItem key={each.id} items={each} />
        ))}
      </ul>
    )
  }

  failureView = () => (
    <div className="search-fv">
      <img
        src="https://res.cloudinary.com/reddyimgs/image/upload/v1687103762/alert-triangle_fqs6cl.png"
        alt="failure view"
      />

      <p> Something went wrong. Please try again </p>

      <button type="button" onClick={this.tryAgain}>
        Try Again
      </button>
    </div>
  )

  loadingView = () => (
    <div className="search-lv" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  fetchData = async valueOFSearch => {
    this.setState({status: pageStatus.Loading})

    const jwtToken = Cookies.get('jwt_token')

    const requiredUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${valueOFSearch}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(requiredUrl, options)

      const data = await response.json()

      if (response.ok) {
        const receivedResults = data.results

        const fetchedData = receivedResults.map(each => ({
          backdropPath: each.backdrop_path,
          id: each.id,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))

        const isEmpty = fetchedData.length === 0

        if (isEmpty) {
          this.setState({status: pageStatus.Empty, searched: valueOFSearch})
        } else {
          this.setState({status: pageStatus.Success, searchList: fetchedData})
        }
      } else {
        this.setState({status: pageStatus.Failed})
      }
    } catch (error) {
      this.setState({status: pageStatus.Failed})
    }
  }

  render() {
    return (
      <>
        <Header fetchData={this.fetchData} />

        {this.searchRoute()}
      </>
    )
  }
}

export default Search
