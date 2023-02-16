import './app.css';
import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Alert, Pagination, Spin, Tabs } from 'antd';
import debounce from 'lodash.debounce';

import Search from '../search/search';
import CardList from '../card-list/card-list';
import MovieContext from '../movie-context/movie-context';
import ErrorBoundry from '../error-boundry/error-boundry';
import movieService from '../../services/movie-service';
import localStorageService from '../../services/local-storage-service';

export default class App extends Component {
  state = {
    search: 'return',
    movies: [],
    moviesRate: [],
    pageNum: 1,
    totalPages: 0,
    token: localStorageService.getValue('token'),
    key: '1',
    genres: [],
    loading: true,
    error: false,
  };

  componentDidMount() {
    const { search, pageNum, token } = this.state;
    if (!token) {
      movieService
        .getNewSession()
        .then((res) => {
          localStorageService.setValue('token', res.guest_session_id);
        })
        .catch(this.onErorr);
    }
    movieService.getMovies(search, pageNum).then(this.onMovieLoaded).catch(this.onErorr);
    movieService
      .getGeneres()
      .then((res) => {
        this.setState({
          genres: res,
        });
      })
      .catch(this.onErorr);
  }

  componentDidUpdate(prevProps, prevState) {
    const { search, pageNum, key, token } = this.state;
    if (this.state.search !== prevState.search) {
      movieService.getMovies(search, pageNum).then(this.onMovieLoaded).catch(this.onErorr);
    } else if (this.state.pageNum !== prevState.pageNum) {
      movieService.getMovies(search, pageNum).then(this.onMovieLoaded).catch(this.onErorr);
    }
    if (key === 'rated' && this.state.key !== prevState.key) {
      movieService.getRatedMovie(token, pageNum).then(this.onMovieRateLoaded).catch(this.onErorr);
    }
    if (key === 'search' && this.state.key !== prevState.key) {
      movieService.getMovies(search, pageNum).then(this.onMovieLoaded).catch(this.onErorr);
    }
  }

  onErorr = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onMovieLoaded = ({ movies, totalPages }) => {
    this.setState({
      movies,
      totalPages,
      loading: false,
    });
  };

  onMovieRateLoaded = ({ moviesRate, totalPages }) => {
    this.setState({
      moviesRate,
      totalPages,
      loading: false,
    });
  };

  onSearch = (search) => {
    this.setState({
      search,
      pageNum: 1,
    });
  };

  onPageNumber = (page) => {
    this.setState({
      pageNum: page,
    });
  };

  onTabs = (key) => {
    this.setState({
      key,
      pageNum: 1,
    });
  };

  render() {
    const { movies, loading, pageNum, moviesRate, genres, error, totalPages } = this.state;
    const onSearchDeb = debounce(this.onSearch, 800);
    const movieList = movies.length ? <CardList movies={movies} /> : <Alert message="No movies found for this query" />;

    const moviesPage = (
      <React.Fragment>
        <Search onSearch={onSearchDeb} />
        {movieList}
        <Pagination
          className="pagination"
          current={pageNum}
          total={totalPages}
          defaultPageSize={20}
          onChange={this.onPageNumber}
        />
      </React.Fragment>
    );

    const moviesRatePage = (
      <React.Fragment>
        <CardList movies={moviesRate} />
        <Pagination
          className="pagination"
          current={pageNum}
          total={totalPages}
          defaultPageSize={20}
          onChange={this.onPageNumber}
        />
      </React.Fragment>
    );

    const hasData = !(loading || error);

    const errorMessage = error ? <Alert message="Request error" type="error" /> : null;
    const spinner = loading ? <Spin size="large" /> : null;
    const content = hasData ? moviesPage : null;
    const contentRate = hasData ? moviesRatePage : null;
    const tab1 = (
      <React.Fragment>
        {errorMessage}
        {spinner}
        {content}
      </React.Fragment>
    );
    const tab2 = (
      <React.Fragment>
        {errorMessage}
        {spinner}
        {contentRate}
      </React.Fragment>
    );

    const items = [
      {
        key: 'search',
        label: 'Search',
        children: tab1,
      },
      {
        key: 'rated',
        label: 'Rated',
        children: tab2,
      },
    ];

    return (
      <div className="container">
        <Online>
          <ErrorBoundry>
            <MovieContext.Provider value={genres}>
              <Tabs defaultActiveKey="1" centered items={items} onChange={this.onTabs} />
            </MovieContext.Provider>
          </ErrorBoundry>
        </Online>
        <Offline>
          <Alert message="There is no Internet connection, check the connection" type="error" />
        </Offline>
      </div>
    );
  }
}
