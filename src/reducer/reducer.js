import {AUTH,B2T,CAMPUS,LOGIN,NAVBAR,NEXT,TOGGLE} from "./constants";

const initialStateBase = {
  sbar: false,
  toggle: false,
  show: false,
  sidebar: false,
  next: -1, //-1=start,0=downloads,1=certs,2=app,3=extension
  auth: false,
  login: false,
  campus: null,
};

export const BaseReducer = (state = initialStateBase, action = {}) => {
  switch (action.type) {
    case CAMPUS:
      return Object.assign({}, state, { campus: action.payload });
    case NAVBAR:
      return Object.assign({}, state, { sbar: action.payload });
    case TOGGLE:
      return Object.assign({}, state, { toggle: action.payload });
    case NEXT:
      return Object.assign({}, state, { next: action.payload });
    case B2T:
      return Object.assign({}, state, { show: action.payload });
    case AUTH:
      return Object.assign({}, state, { auth: action.payload });
    case LOGIN:
      return Object.assign({}, state, { login: action.payload });
    default:
      return state;
  }
};
