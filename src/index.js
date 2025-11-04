import React from "react";

import "normalize.css/normalize.css";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import "./assets/css/index.css";
import "./assets/css/lineicons.css";
import "./assets/css/Loading.css";
import "./assets/css/shapes.css";
import AppRouter from "./contents/AppRouter";

// Material-UI imports
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { horizonTheme } from "./theme/horizonTheme";

import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
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
		<Router>
			<Provider store={store}>
				<ThemeProvider theme={horizonTheme}>
					<CssBaseline />
					<AppRouter />
				</ThemeProvider>
			</Provider>
		</Router>
	</React.StrictMode>,
	document.getElementById("root")
);

reportWebVitals();
