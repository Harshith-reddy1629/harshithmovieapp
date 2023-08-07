import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Loader from 'react-loader-spinner'
// import Cookies from 'js-cookie'

import MovieItem from '../MovieItem'

const pageStatus = {
  Loading: 'LOADING',
  Success: 'SUCCESS',
  Failed: 'FAILED',
}

const Originals = props => {
  const {status, OriginalsList, tryAgain} = props

  const onTryAgain = () => {
    tryAgain()
  }

  const failureView = () => (
    <div className="home-fv">
      <img
        src="https://res.cloudinary.com/reddyimgs/image/upload/v1687103762/alert-triangle_fqs6cl.png"
        alt="failure view"
      />

      <p> Something went wrong. Please try again </p>

      <button type="button" onClick={onTryAgain}>
        Try Again
      </button>
    </div>
  )

  const successView = () => {
    const settings = {
      slidesToShow: 4,
      slidesToScroll: 3,
      infinite: false,
    }

    return (
      <>
        <ul className="slider-container">
          <Slider {...settings}>
            {OriginalsList.map(each => (
              <MovieItem key={each.id} items={each} />
            ))}
          </Slider>
        </ul>
      </>
    )
  }

  const loadingView = () => (
    <div className="home-lv" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  switch (status) {
    case pageStatus.Success:
      return successView()
    case pageStatus.Failed:
      return failureView()
    case pageStatus.Loading:
      return loadingView()
    default:
      return null
  }
}

export default Originals
