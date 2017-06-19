import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import Redbox from 'redbox-react';
import configureStore from './configure_store';
import Root from './root';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer errorReporter={ Redbox }>
      <Provider store={ configureStore() }>
        <Component/>
      </Provider>
    </AppContainer>,
    document.querySelector('#root'),
  );
};

render(Root);

if (module.hot) {
  module.hot.accept('./root', () => {
    const NewRoot = require('./root').default;
    render(NewRoot);
  });
}