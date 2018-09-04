import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ping } from 'frontend/actions/pingAction'
import { getConfig } from 'frontend/actions/configAction'
import App from './App'

export default connect(
  state => ({
    data: {
      apiConfig: state.config.apiConfig,
      ping: state.ping
    }
  }),
  dispatch => bindActionCreators({
    ping,
    getConfig
  }, dispatch)
)(App)
