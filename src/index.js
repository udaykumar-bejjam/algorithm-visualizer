import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from 'components/App';
import { current, directory, env, player, toast } from 'reducers';
import './stylesheet.scss';

const store = createStore(combineReducers({ current, directory, env, player, toast }));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/scratch-paper/:gistId" component={App}/>
        <Route exact path="/:categoryKey/:algorithmKey" component={App}/>
        <Route path="/" component={App}/>
      </Switch>
    </BrowserRouter>
  </Provider>, document.getElementById('root'));
