import createSagaMiddleware from 'redux-saga';
import { call } from 'redux-saga/effects';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import appSaga from './sagas';
import bubblesReducer from './reducers';

function* rootSaga() {
  yield [
    call(appSaga),
  ];
}

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(combineReducers({ bubbles: bubblesReducer }),
    {},
    compose(applyMiddleware(sagaMiddleware), window.devToolsExtension ? window.devToolsExtension() : f => f));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  sagaMiddleware.run(rootSaga);

  return store;
}