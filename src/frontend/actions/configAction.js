import { createAction } from 'redux-act';
import call from 'utils/call';

export const GET_CONFIG = createAction('getConfig');

export const getConfig = () => (dispatch) => {
  dispatch(GET_CONFIG({ isRequest: true }));

  setTimeout(() => {
    call('api/config').then(data => dispatch(GET_CONFIG(data)));
  }, 3000);
};
