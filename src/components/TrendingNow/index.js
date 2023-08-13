import {Component} from 'react'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import MovieItem from '../MovieItem'

const pageStatus = {
  Loading: 'LOADING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
}

class TrendingNow extends Component {
  state = {status: pageStatus.Loading, TrendingList: []}

  componentDidMount() {
    this.fetchData()
  }

  tryAgain = () => {
    this.fetchData()
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

  successView = () => {
    const {TrendingList} = this.state

    const settings = {
      slidesToShow: 4,
      slidesToScroll: 3,
      infinite: false,
    }
    // const mobilesettings = {
    //   slidesToShow: 3,
    //   slidesToScroll: 3,
    //   infinite: false,
    // }

    return (
      <>
        <ul className="slider-container">
          <Slider {...settings}>
            {TrendingList.map(each => (
              <MovieItem key={each.id} items={each} />
            ))}
          </Slider>
          {/* <Slider {...mobilesettings}>
            {TrendingList.map(each => (
              <MovieItem key={each.id} items={each} />
            ))}
          </Slider> */}
        </ul>
      </>
    )
  }

  loadingView = () => (
    <div className="home-lv" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  fetchData = async () => {
    this.setState({status: pageStatus.Loading})

    const reqUrl = 'https://apis.ccbp.in/movies-app/trending-movies'

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        AuthoriZation: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(reqUrl, options)

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

        this.setState({status: pageStatus.Success, TrendingList: fetchedData})
      } else {
        this.setState({status: pageStatus.Failed})
      }
    } catch (error) {
      this.setState({status: pageStatus.Failed})
    }
  }

  render() {
    const {status} = this.state

    switch (status) {
      case pageStatus.Success:
        return this.successView()
      case pageStatus.Failed:
        return this.failureView()
      case pageStatus.Loading:
        return this.loadingView()
      default:
        return null
    }
  }
}

export default TrendingNow
