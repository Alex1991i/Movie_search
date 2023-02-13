import PropTypes from 'prop-types';

import Card from '../card/card';
import './card-list.css';

const CardList = ({ movies }) => {
  const elements = movies.map((movie) => {
    const { id, ...movieInfo } = movie;
    return <Card {...movieInfo} key={id} id={id} />;
  });

  return <div className="container-card">{elements}</div>;
};

export default CardList;

CardList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      poster: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      overview: PropTypes.string,
      date: PropTypes.string,
      title: PropTypes.string,
      genreIds: PropTypes.array,
      averageRate: PropTypes.number,
    })
  ),
};
