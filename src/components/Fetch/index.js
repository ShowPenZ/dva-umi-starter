import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Request from '@/utils/request';
import { hasString, hasPlainObject, mergeObject } from '@/utils/helper';

class Fetch extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['get', 'post', 'form', 'put', 'patch', 'delete', 'base']).isRequired,
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    data: PropTypes.object,
    options: PropTypes.object,
    ignoreError: PropTypes.bool,
    ignoreLoading: PropTypes.bool,
    resetResponseBeforeFetch: PropTypes.bool,
    // renderNullBeforeDone: PropTypes.bool,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: {},
    options: {},
    ignoreError: false,
    ignoreLoading: false,
    resetResponseBeforeFetch: false,
    // renderNullBeforeDone: false,
  };

  constructor() {
    super(...arguments);
    // console.log('constructor', arguments);
    const that = this;
    const { ignoreLoading } = that.props;

    that.cancel = undefined;
    that.unMounting = false;

    that.state = {
      error: undefined,
      loading: !ignoreLoading,
      response: undefined,
      container: {},
    };
  }

  componentDidMount() {
    const that = this;
    // console.log('componentDidMount', that.props, that.state);
    const { data } = that.props;
    // const {  } = that.state;

    that.fetch(data);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const that = this;
    // console.log('shouldComponentUpdate', that.props, nextProps, that.state, nextState);
    const { data, ignoreError, ignoreLoading } = that.props;
    const { error, loading, response, container } = that.state;

    if (!_.isEqual(data, nextProps.data)) {
      that.fetch(nextProps.data);
    }

    if (!ignoreError && !_.isEqual(error, nextState.error)) {
      return true;
    }

    if (!ignoreLoading && loading !== nextState.loading) {
      return true;
    }

    if (!_.isEqual(response, nextState.response)) {
      return true;
    }

    if (!_.isEqual(container, nextState.container)) {
      return true;
    }

    return false;
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const that = this;
  //   // console.log('componentDidUpdate', prevProps, that.props, prevState, that.state, snapshot);
  //   const { data } = that.props;
  //   // const {  } = that.state;

  //   if (!_.isEqual(data, prevProps.data)) {
  //     that.fetch();
  //   }
  // }

  componentWillUnmount() {
    const that = this;
    // console.log('componentWillUnmount', that.props, that.state);
    // const {  } = that.props;
    // const {  } = that.state;
    that.unMounting = true;

    if (_.isFunction(that.cancel)) {
      that.cancel('The component will unmount.');
      that.cancel = undefined;
    }
  }

  setContainer = (updater, callback) => {
    const that = this;
    // console.log('setContainer', that.props, that.state);
    // const {  } = that.props;
    const { container } = that.state;

    if (that.unMounting) {
      return;
    }

    const state = _.isFunction(updater) ? updater(_.cloneDeep(container), that.props) : updater;
    if (!hasPlainObject(state)) {
      return;
    }

    return that.setState(
      {
        container: mergeObject({}, container, state),
      },
      callback
    );
  };

  update = (...args) => {
    const that = this;
    // console.log('update', that.props, that.state);
    // const {  } = that.props;
    // const {  } = that.state;

    if (that.unMounting) {
      return;
    }

    return that.forceUpdate(...args);
  };

  fetch = newData => {
    const that = this;
    // console.log('fetch', that.props, that.state, newData);
    const { type, url, data: oldData, options, ignoreError, ignoreLoading, resetResponseBeforeFetch } = that.props;
    const { response } = that.state;

    if (that.unMounting) {
      return;
    }

    if ((type === 'base' && !_.isFunction(url)) || (type !== 'base' && !hasString(url))) {
      return;
    }

    that.setState({
      error: undefined,
      loading: !ignoreLoading,
      response: resetResponseBeforeFetch ? undefined : response,
    });

    const defaultOption =
      type === 'base'
        ? {}
        : {
            useBaseRequest: false,
            extraHeader: {},
            extraValidate: [],
          };

    const opts = mergeObject({}, defaultOption, options, {
      cancelToken: c => {
        that.cancel = c;
      },
    });

    const data = newData || oldData;
    const promise = type === 'base' ? url(data, opts) : Request[type](url, data, opts);
    return promise
      .then(response => {
        if (that.unMounting) {
          return;
        }

        if (_.isFunction(that.cancel)) {
          that.cancel = null;
        }

        that.setState({ response, loading: false });
      })
      .catch(error => {
        if (that.unMounting) {
          return;
        }

        if (_.isFunction(that.cancel)) {
          that.cancel = null;
        }

        if (ignoreError) {
          return;
        }

        that.setState({ error, loading: false });
      });
  };

  render() {
    const that = this;
    // console.log('render', that.props, that.state);
    const { children } = that.props;
    const { error, loading, response } = that.state;

    const props = {
      error,
      loading,
      response,
      fetch: that.fetch.bind(that),
      forceUpdate: that.update.bind(that),
      setState: that.setContainer.bind(that),
    };

    const renderedChildren = children(props);
    return renderedChildren && React.Children.only(renderedChildren);
  }
}

export default Fetch;
