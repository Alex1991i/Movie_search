import { Component } from 'react';
import { Alert } from 'antd';

export default class ErrorBoundry extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch() {
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return <Alert message="The error, we are working to fix it" type="erorr" />;
    }

    return this.props.children;
  }
}
