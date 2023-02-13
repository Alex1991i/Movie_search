import { Component } from 'react';
import './search.css';

export default class Search extends Component {
  state = {
    label: '',
  };

  onLabelChange = (e) => {
    const { onSearch } = this.props;
    this.setState({
      label: e.target.value,
    });
    onSearch(e.target.value);
  };

  render() {
    const { label } = this.state;
    return (
      <input className="search" autoFocus placeholder="type to search..." onChange={this.onLabelChange} value={label} />
    );
  }
}
