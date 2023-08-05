import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import MovieItem from '../MovieItem'

import Contacts from '../Contacts'

import './index.css'

const pageStatus = {
  Loading: 'LOADING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
}

class Popular extends Component {
  state = {status: 'LOADING', popularList: []}

  componentDidMount() {
    this.fetchData()
  }

  tryAgain = () => {
    this.fetchData()
  }

  popularView = () => {
    const {status} = this.state

    switch (status) {
      case pageStatus.Success:
        return this.successView()

      case pageStatus.Loading:
        return this.loadingView()

      case pageStatus.Failed:
        return this.failureView()

      default:
        return null
    }
  }

  successView = () => {
    const {popularList} = this.state

    return (
      <ul className="popular-container">
        {popularList.map(each => (
          <MovieItem key={each.id} items={each} />
        ))}
      </ul>
    )
  }

  failureView = () => (
    <div className="popular-fv">
      <img
        src="https://res.cloudinary.com/reddyimgs/image/upload/v1687103762/alert-triangle_fqs6cl.png"
        alt="failure view "
      />

      <p> Something went wrong. Please try again </p>

      <button type="button" onClick={this.tryAgain}>
        Try Again
      </button>
    </div>
  )

  loadingView = () => (
    <div className="loader-fv" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  fetchData = async () => {
    this.setState({status: pageStatus.Loading})

    const jwtToken = Cookies.get('jwt_token')

    const requiredUrl = 'https://apis.ccbp.in/movies-app/popular-movies'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(requiredUrl, options)

      if (response.ok === true) {
        const data = await response.json()

        const recievedResults = data.results

        const fetchedData = recievedResults.map(each => ({
          backdropPath: each.backdrop_path,
          id: each.id,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))

        this.setState({status: pageStatus.Success, popularList: fetchedData})
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
        <Header />

        {this.popularView()}

        <Contacts />
      </>
    )
  }
}

export default Popular
