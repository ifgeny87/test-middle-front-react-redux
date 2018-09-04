import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './appTheme.scss'

export default class App extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    ping: PropTypes.func.isRequired,
    getConfig: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      counter: 0,
      data: this.updateConfig(props.data)
    }
  }

  componentDidMount () {
    const { ping, getConfig } = this.props
    this.increment()
    ping()
    getConfig()
  }

  componentWillUnmount () {
    clearTimeout(this.timerId)
  }

  componentWillReceiveProps (nextProps) {
    const { data: oldData } = nextProps
    const { data } = this.props
    if (data !== oldData) {
      this.setState({ data: this.updateConfig(oldData) })
    }
  }

  updateConfig = data => ({
    apiConfig: JSON.stringify(data.apiConfig),
    ping: data.ping
  });

  increment = () => {
    const { state: { counter } } = this
    this.setState({ counter: counter + 1 })
    this.timerId = setTimeout(this.increment, 1000)
  };

  render () {
    const { counter, data: { apiConfig, ping: { pong } } } = this.state

    return (
      <div>
        <img src="/img/start.png"/>
        <h1>Application loaded</h1>
        <div>Counter: {counter}</div>
        {
          pong && <pre>Pong: {pong}</pre>
        }
        {
          apiConfig && <pre>Api Config: {apiConfig}</pre>
        }
      </div>
    )
  }
}
