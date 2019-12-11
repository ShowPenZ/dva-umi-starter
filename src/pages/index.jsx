/**
 * title: page.index.title
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd-mobile';

import { NS_INDEX } from '@/redux/namespaces';

import styles from './index.less';

class Page extends React.Component {
  state = {};

  render() {
    return (
      <div className={styles.container}>
        <h3>index</h3>
        <Button>index</Button>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading,
    index: state[NS_INDEX].index,
  };
}

// Page.propTypes = {};

// Page.defaultProps = {};

export default connect(mapStateToProps)(Page);
