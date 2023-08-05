import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import TrendingNow from '../TrendingNow'

import Originals from '../Originals'

import Contacts from '../Contacts'

import './index.css'

const pageStatus = {
  Loading: 'LOADING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
}

class Home extends Component {
  state = {OriginalsList: [], status: 'LOADING'}

  componentDidMount() {
    this.fetchData()
  }

  tryAgain = () => {
    this.fetchData()
  }

  posterView = () => {
    const {status} = this.state

    switch (status) {
      case pageStatus.Loading:
        return this.loadingView()
      case pageStatus.Success:
        return this.posterSuccessView()
      case pageStatus.Failed:
        return this.failureView()
      default:
        return null
    }
  }

  posterSuccessView = () => {
    const {OriginalsList} = this.state

    const randomNo = Math.floor(Math.random() * OriginalsList.length)

    const selectedMovie = OriginalsList[randomNo]

    const {id, title, overview, backdropPath} = selectedMovie

    return (
      <div
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(24, 24, 24, 0.2896875) 78.26%, #181818 93.82%, #181818 96.68%, #181818 108.61%) , url(${backdropPath})`,
        }}
        className="poster-container"
      >
        <div className="poster-content">
          <h1 className="poster-heading">{title}</h1>

          <p className="poster-para">{overview}</p>

          <Link to={`/movies/${id}`}>
            <button className="poster-button" type="button">
              Play
            </button>
          </Link>
        </div>
      </div>
    )
  }

  failureView = () => (
    <div className="home-fv">
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
    <div className="home-lv" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  fetchData = async () => {
    this.setState({status: pageStatus.Loading})

    const jwtToken = Cookies.get('jwt_token')

    const requiredUrl = 'https://apis.ccbp.in/movies-app/originals'

    const options = {
      method: 'GET',
      headers: {
        AuthoriZation: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(requiredUrl, options)

      if (response.ok === true) {
        const data = await response.json()

        const receivedResults = data.results

        const fetchedData = receivedResults.map(each => ({
          backdropPath: each.backdrop_path,
          id: each.id,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))

        this.setState({status: pageStatus.Success, OriginalsList: fetchedData})
      } else {
        this.setState({
          status: pageStatus.Failed,
        })
      }
    } catch (error) {
      this.setState({
        status: pageStatus.Failed,
      })
    }
  }

  render() {
    const {status, OriginalsList} = this.state
    return (
      <>
        <Header />

        {this.posterView()}

        <h1>Trending Now </h1>

        <TrendingNow />

        <h1>Originals </h1>

        <Originals
          status={status}
          OriginalsList={OriginalsList}
          tryAgain={this.tryAgain}
        />

        <Contacts />
      </>
    )
  }
}

export default Home
