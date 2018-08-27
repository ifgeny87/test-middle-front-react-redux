import { createReducer } from 'redux-act';
import { GET_CONFIG } from '../actions/configAction';

export default createReducer(
  {
    [GET_CONFIG]: (state, apiConfig) => ({ ...state, apiConfig }),
  },
  {
    apiConfig: null,
  },
);
