[ ![Codeship Status for buzzn/module-bubbles](https://app.codeship.com/projects/57783ed0-9f59-0134-f7d3-666295f6c944/status?branch=master)](https://app.codeship.com/projects/189258)
# module-bubbles

To run local dev server:
- clone this repository
- install node.js 6.xx
- run `sudo npm i -g yarn webpack`
- run `yarn`
- run `yarn run dev-server`
- open in browser `http://localhost:2999`

To run tests:
- run `sudo npm i -g mocha`
- run `yarn run test`

How to build automatically on codeship:
- setup commands:
```
nvm install 6.7.0
npm cache clean
npm i -g yarn cross-env rimraf
yarn
npm rebuild node-sass
```
- test pipeline commands:
```
yarn run test
yarn run build
```

To use linter:
- install eslint globally `sudo npm i -g eslint`
- add eslint plugin to your favorite editor

How to use this module in app:
- add it as a dependency in package.json (replace v1.0.0 with required tag):
```
"@buzzn/module_bubbles": "git+https://github.com/buzzn/module-bubbles.git#v1.0.0"
```
- add Bubbles reducers to app reducers:
```
import { combineReducers } from 'redux';
import Bubbles from '@buzzn/module_bubbles';

export default combineReducers({
  bubbles: Bubbles.reducers,
});
```
- run Bubbles saga in saga middleware:
```
import Bubbles from '@buzzn/module_bubbles';
import appSaga from './sagas';

function* rootSaga() {
  yield [call(Bubbles.sagas), call(appSaga)];
}
// ...
// store configuration
  sagaMiddleware.run(rootSaga);
// ...
```
- mount bubbles component in react UI:
```
import Bubbles from '@buzzn/module_bubbles';
// ...
// somewhere in UI
<Bubbles.container />
// ...
```
- dispatch setGroup action with groupId:
```
Bubbles.actions.setGroup(group)
```
- this module relies on config part of a redux state. (should be changed)