import { createAction } from 'redux-act';
import call from 'utils/call';

export const PING = createAction('ping');

export const ping = () => (dispatch) => {
  call('api/ping').then(data => dispatch(PING(data)));
};
