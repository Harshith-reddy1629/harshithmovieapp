import {Link} from 'react-router-dom'

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

import Contacts from '../Contacts'

import MovieItem from '../MovieItem'

import './index.css'

const pageStatus = {
  Loading: 'LOADING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
}

class MovieDetails extends Component {
  state = {status: 'LOADING', movieDetails: [], similarMoviesList: []}

  componentDidMount() {
    this.fetchData()
  }

  tryAgain = () => {
    this.fetchData()
  }

  movieDetailsView = () => {
    const {status} = this.state

    switch (status) {
      case pageStatus.Success:
        return this.SuccessView()
      case pageStatus.Loading:
        return this.loadingView()
      case pageStatus.Failed:
        return this.failureView()
      default:
        return null
    }
  }

  getDateFormat = () => {
    const {movieDetails} = this.state

    const {releaseDate} = movieDetails

    const releasedDateInFormat = new Date(releaseDate)

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const dateOf = releasedDateInFormat.getDate()

    let dateOfRel

    switch (dateOf) {
      case 1:
        dateOfRel = '1st'

        break

      case 2:
        dateOfRel = '2nd'

        break

      case 3:
        dateOfRel = '3rd'

        break

      case 21:
        dateOfRel = '21st'

        break

      case 22:
        dateOfRel = '22nd'

        break

      case 31:
        dateOfRel = '31st'

        break

      case 23:
        dateOfRel = '23rd'

        break

      default:
        dateOfRel = `${dateOf}th`
    }

    const dayOfRel = monthNames[releasedDateInFormat.getMonth()]

    const yearOfRel = releasedDateInFormat.getFullYear()

    const formattedDate = `${dateOfRel} ${dayOfRel} ${yearOfRel}`

    return formattedDate
  }

  SuccessView = () => {
    const {movieDetails, similarMoviesList} = this.state

    const {
      backdropPath,
      title,
      runtime,
      adult,
      releaseDate,
      overview,
      id,
      genres,
      spokenLanguage,
      voteCount,
      voteAverage,
      budget,
    } = movieDetails

    const dateF = this.getDateFormat()

    return (
      <div>
        <div
          className="poster-container"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(24, 24, 24, 0.2896875) 78.26%, #181818 93.82%, #181818 96.68%, #181818 108.61%) , url(${backdropPath})`,
          }}
        >
          <div className="poster-content-movie-details">
            <h1 className="movie-details-heading">{title}</h1>

            <ul className="movie-details-runtime-container">
              <li>
                <p>{`${Math.floor(runtime / 60)}h ${runtime % 60}m`}</p>
              </li>
              <li>
                <p className="sensor">{adult ? 'A' : 'U/A'}</p>
              </li>

              <li>
                <p>{releaseDate.slice(0, 4)}</p>
              </li>
            </ul>

            <p className="poster-para">{overview}</p>

            <div>
              <Link to={`/movies/${id}`}>
                <button className="poster-button" type="submit">
                  Play
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="movie-details-genres-container">
          <div>
            <h1 className="detail-head">Genres </h1>
            <ul className="genre-list genre">
              {genres.map(each => (
                <li key={each.id}>
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className="detail-head ">Audio Available</h1>
            <ul className="genre-list genre">
              {spokenLanguage.map(each => (
                <li key={each.id}>
                  <p> {each.english_name}</p>{' '}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className="detail-head ">Rating Count</h1>
            <ul className="genre-list genre">
              <li>
                <p> {voteCount}</p>{' '}
              </li>
            </ul>
          </div>

          <div>
            <h1 className="detail-head ">Rating Average</h1>
            <ul className="genre-list genre">
              <li>
                <p>{voteAverage}</p>{' '}
              </li>
            </ul>
          </div>

          <div>
            <h1 className="detail-head ">Budget</h1>
            <ul className="genre-list genre">
              <li>
                <p>{budget} </p>
              </li>
            </ul>
          </div>

          <div>
            <h1 className="detail-head ">Release Date</h1>
            <ul className="genre-list genre">
              <li>
                <p> {dateF}</p>{' '}
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h1 className="more-head">More like this</h1>

          <ul className="popular-container">
            {similarMoviesList.map(each => (
              <MovieItem key={each.id} items={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureView = () => (
    <div>
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
    <div className="" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  fetchData = async () => {
    this.setState({status: pageStatus.Loading})

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props

    const {params} = match

    const {id} = params

    const requiredUrl = `https://apis.ccbp.in/movies-app/movies/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(requiredUrl, options)

      if (response.ok) {
        const data = await response.json()

        const receivedMovieDetails = data.movie_details

        const receivedSimilarMovies = receivedMovieDetails.similar_movies

        const similarMovies = receivedSimilarMovies.map(each => ({
          backdropPath: each.backdrop_path,
          id: each.id,
          overview: each.overview,
          posterPath: each.poster_path,
          title: each.title,
        }))

        const fetchedData = {
          adult: receivedMovieDetails.adult,
          backdropPath: receivedMovieDetails.backdrop_path,
          budget: receivedMovieDetails.budget,
          genres: receivedMovieDetails.genres,
          id: receivedMovieDetails.id,
          overview: receivedMovieDetails.overview,
          posterPath: receivedMovieDetails.poster_path,
          releaseDate: receivedMovieDetails.release_date,
          runtime: receivedMovieDetails.runtime,
          spokenLanguage: receivedMovieDetails.spoken_languages,
          title: receivedMovieDetails.title,
          voteAverage: receivedMovieDetails.vote_average,
          voteCount: receivedMovieDetails.vote_count,
        }

        this.setState({
          status: pageStatus.Success,
          similarMoviesList: similarMovies,
          movieDetails: fetchedData,
        })
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

        {this.movieDetailsView()}

        <Contacts />
      </>
    )
  }
}

export default MovieDetails
