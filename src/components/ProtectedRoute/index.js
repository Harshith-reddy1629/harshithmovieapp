import {v4} from 'uuid'

import {Redirect, Route} from 'react-router-dom'

import Cookie from 'js-cookie'

const ProtectedRoute = props => {
  const token = Cookie.get('jwt_token')

  if (token === undefined) {
    return <Redirect to="/login" />
  }

  return <Route {...props} key={v4()} />
}

export default ProtectedRoute
