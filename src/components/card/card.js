import './card.css';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { Spin, Rate, Alert } from 'antd';
import { Component, useContext } from 'react';
import PropTypes from 'prop-types';

import MovieService from '../../services/movie-service';
import MovieContext from '../movie-context/movieContext';
import ErrorBoundry from '../error-boundry/error-boundry';

export default class Card extends Component {
  movieService = new MovieService();

  state = {
    loading: false,
    value: localStorage.getItem(`${this.props.id}`) || 0,
    error: false,
    errorImg: false,
  };

  onErorr = () => {
    this.setState({
      error: true,
    });
  };

  onErorrImg = () => {
    this.setState({
      errorImg: true,
      loading: true,
    });
  };

  onLoad = () => {
    this.setState({
      loading: true,
    });
  };

  setRated = (rate) => {
    const { id } = this.props;
    this.setState({
      value: rate,
    });
    localStorage.setItem(`${id}`, rate);
    this.movieService.setRated(id, rate, localStorage.getItem('token')).catch(this.onErorr);
  };

  render() {
    const { ...info } = this.props;
    const { loading, value, error, errorImg } = this.state;

    const content = error ? (
      <Alert message="Failed to put a rating" type="error" />
    ) : (
      <CardView
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...info}
        onLoad={this.onLoad}
        onErorrImg={this.onErorrImg}
        loading={loading}
        error={errorImg}
        setRated={this.setRated}
        value={value}
      />
    );

    return (
      <div>
        <ErrorBoundry>{content}</ErrorBoundry>
      </div>
    );
  }
}

const CardView = ({
  overview,
  poster,
  date,
  title,
  onLoad,
  loading,
  setRated,
  value,
  genreIds,
  averageRate,
  onErorrImg,
  error,
}) => {
  const genresList = useContext(MovieContext);

  const genreMovie = genresList
    .filter((el) => genreIds.includes(el.id))
    .map((el) => {
      return (
        <div className="genre" key={el.name}>
          {el.name}
        </div>
      );
    });

  const dating =
    date !== ''
      ? format(new Date(date), 'MMMM dd, yyyy', {
          locale: enGB,
        })
      : '';

  const textFormat = (text) => {
    return text.slice(0, text.indexOf(' ', 150));
  };

  const text = textFormat(overview);

  const path = `https://image.tmdb.org/t/p/original${poster}`;

  const view = !loading ? <Spin size="large" /> : null;
  // eslint-disable-next-line no-undef
  const errorImg = error ? <img className="poster" src={require('../../img/errorImg.jpg')} alt="x" /> : null;
  const hiden = error ? 'hiden' : '';

  let color = '#E90000';
  if (averageRate >= 3 && averageRate < 5) {
    color = '#E97E00';
  } else if (averageRate >= 5 && averageRate < 7) {
    color = '#E9D100';
  } else if (averageRate >= 7) {
    color = '#66E900';
  }

  return (
    <div className="card">
      <div className="card-image">
        {view}
        {errorImg}
        <img className={`poster ${hiden}`} src={path} alt="Poster" onLoad={onLoad} onError={onErorrImg} />
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="card-rating" style={{ borderColor: color }}>
          {averageRate.toFixed(1)}
        </div>
        <div className="card-date">{dating}</div>
        <div className="card-genres">{genreMovie}</div>
        <div className="card-description">{text}</div>
        <Rate count={10} className="rating" onChange={(rate) => setRated(rate)} value={value} />
      </div>
    </div>
  );
};

CardView.propTypes = {
  overview: PropTypes.string,
  poster: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  onLoad: PropTypes.func,
  loading: PropTypes.bool,
  setRated: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  genreIds: PropTypes.array,
  averageRate: PropTypes.number,
  onErorrImg: PropTypes.func,
  error: PropTypes.bool,
};
