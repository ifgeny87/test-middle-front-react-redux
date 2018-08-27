import { combineReducers } from 'redux';
import config from './configReducer';
import ping from './pingReducer';

export default combineReducers({
  config,
  ping,
});
