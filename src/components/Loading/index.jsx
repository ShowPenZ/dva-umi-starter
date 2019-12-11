import React from 'react';
// import PropTypes from 'prop-types';
import { Icon } from 'antd-mobile';

import styles from './index.less';

function Loading(props) {
  return <Icon className={styles.loading} type="loading" size="lg" />;
}

// Loading.propTypes = {};

// Loading.defaultProps = {};

export default Loading;
