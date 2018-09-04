import { createReducer } from 'redux-act'
import { PING } from '../actions/pingAction'

export default createReducer(
  {
    [PING]: (state, data) => ({ ...state, ...data })
  },
  {
    pong: null
  }
)
