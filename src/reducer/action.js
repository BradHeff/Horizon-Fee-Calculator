import { NAVBAR, CAMPUS, TOGGLE, B2T, NEXT, AUTH } from "./constants";

export const setNavbar = (link) => ({
  type: NAVBAR,
  payload: link,
});

export const setToggle = (link) => ({
  type: TOGGLE,
  payload: link,
});

export const setB2T = (link) => ({
  type: B2T,
  payload: link,
});

export const setCampus = (link) => ({
  type: CAMPUS,
  payload: link,
});

export const setNext = (link) => ({
  type: NEXT,
  payload: link,
});

export const setNeedAuth = (link) => ({
  type: AUTH,
  payload: link,
});
