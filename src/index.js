import React from 'react';
import { createRoot } from 'react-dom/client';
import { combineReducers, createStore } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from 'components/App';
import { current, directory, env, player, toast } from 'reducers';
import './stylesheet.scss';

const store = createStore(combineReducers({ current, directory, env, player, toast }));

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/scratch-paper/:gistId" component={App}/>
        <Route exact path="/:categoryKey/:algorithmKey" component={App}/>
        <Route path="/" component={App}/>
      </Switch>
    </BrowserRouter>
  </Provider>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Service worker optional
    });
  });
}
