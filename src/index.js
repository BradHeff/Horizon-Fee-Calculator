import React from "react";

import "bootstrap/dist/css/bootstrap.css";
import "normalize.css/normalize.css";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import "./assets/css/index.css";
import "./assets/css/lineicons.css";
import "./assets/css/Loading.css";
import "./assets/css/shapes.css";
import App from "./contents/App";

// import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from "react-redux";
import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import reportWebVitals from "./reportWebVitals";
//import { createLogger } from 'redux-logger';
import { thunk } from "redux-thunk";
import { BaseReducer } from "./reducer/reducer";

//const logger = createLogger();
const rootReducer = combineReducers({ BaseReducer });
const store = createStore(rootReducer, applyMiddleware(thunk /*, logger*/));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
