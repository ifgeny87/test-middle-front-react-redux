import { render } from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import AppContainer from './components/App/AppContainer'

if (module.hot) module.hot.accept()

window.React = require('react')

async function initApp () {
  // window.onerror = (message) => alert(message);

  render(
    <Provider store={store()}>
      <AppContainer />
    </Provider>,
    document.getElementById('app')
  )
}

initApp()
