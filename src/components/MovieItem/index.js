import {Link} from 'react-router-dom'

import './index.css'

const MovieItem = props => {
  const {items} = props

  const {id, title, posterPath} = items

  return (
    <li className="slider-img-container">
      <Link to={`/movies/${id}`}>
        <img alt={title} src={posterPath} className="slider-image" />
      </Link>
    </li>
  )
}

export default MovieItem
