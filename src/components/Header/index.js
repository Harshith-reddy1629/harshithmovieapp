import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'

import {HiOutlineSearch} from 'react-icons/hi'

import './index.css'

class Header extends Component {
  state = {searchValue: ''}

  onSearchTyping = event => {
    this.setState({searchValue: event.target.value})
  }

  onClickSearch = () => {
    const {fetchData} = this.props

    const {searchValue} = this.state

    if (searchValue !== '') {
      fetchData(searchValue)
    }
  }

  render() {
    const {searchValue} = this.state

    const {match} = this.props

    const {path} = match

    console.log(path)

    const isSearchRoute = path === '/search'

    const condition = path === '/movies/:id' || path === '/'

    const isHome = condition ? 'home-class' : ''

    return (
      <header className={`header-container ${isHome}`}>
        <nav className="nav-container">
          <Link to="/">
            <img
              alt="website logo "
              src="https://res.cloudinary.com/reddyimgs/image/upload/v1689919947/Group_7399_ashfla.png"
              className="website-logo"
            />
          </Link>

          <ul className="p-1">
            <Link to="/">
              <li>
                <button className="header-button" type="button">
                  Home
                </button>
              </li>
            </Link>

            <Link to="/popular">
              <li>
                <button className="header-button" type="button">
                  Popular
                </button>
              </li>
            </Link>
          </ul>

          <div className="p-1">
            {isSearchRoute ? (
              <div className="search-con">
                <input
                  type="search"
                  onChange={this.onSearchTyping}
                  value={searchValue}
                  placeholder="Search"
                  className="search-in"
                />

                <button
                  onClick={this.onClickSearch}
                  className="header-button search-btn"
                  type="button"
                  testid="searchButton"
                >
                  <HiOutlineSearch />
                </button>
              </div>
            ) : (
              <Link to="/search">
                <button
                  className="header-button"
                  type="button"
                  testid="searchButton"
                >
                  <HiOutlineSearch />
                </button>
              </Link>
            )}
          </div>
          <div>
            <Link to="/account">
              <img
                className="lg-view"
                src="https://res.cloudinary.com/reddyimgs/image/upload/v1687011162/Avatar_zhzj4v.png"
                alt="profile"
              />
            </Link>
          </div>
        </nav>
      </header>
    )
  }
}

export default withRouter(Header)
