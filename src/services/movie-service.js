export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3/';

  _apiKey = 'api_key=bd70e48556c55b9d812c859de543c2ac';

  getResource = async (url) => {
    const res = await fetch(`${this._apiBase}${url}`);
    if (!res.ok) {
      throw new Error('Yps!!!!!!!!');
    }
    return await res.json();
  };

  getMovies = async (req, pageNum) => {
    const res = await this.getResource(`search/movie?${this._apiKey}&${encodeURI(`query=${req}&page=${pageNum}`)}`);
    const totalPages = res.total_results;
    return { movies: res.results.map(this._transformMovies), totalPages: totalPages };
  };

  getNewSession = async () => {
    const res = await this.getResource(`authentication/guest_session/new?${this._apiKey}`);
    return res;
  };

  getGeneres = async () => {
    const res = await this.getResource(`genre/movie/list?${this._apiKey}`);
    return res.genres;
  };

  getRatedMovie = async (token, page) => {
    const res = await this.getResource(`guest_session/${token}/rated/movies?${this._apiKey}&page=${page}`);
    const totalPages = res.total_results;
    return { moviesRate: res.results.map(this._transformMovies), totalPages: totalPages };
  };

  setRated = async (id, value, token) => {
    const body = { value };
    await fetch(`${this._apiBase}movie/${id}/rating?${this._apiKey}&guest_session_id=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    });
  };

  _transformMovies = (movie) => {
    return {
      id: movie.id,
      poster: movie.poster_path,
      overview: movie.overview,
      date: movie.release_date,
      title: movie.title,
      genreIds: movie.genre_ids,
      averageRate: movie.vote_average,
    };
  };
}
