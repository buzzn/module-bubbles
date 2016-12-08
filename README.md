[ ![Codeship Status for buzzn/module-consumer-form](https://app.codeship.com/projects/867cccd0-99df-0134-8de6-3e4c54ed65a2/status?branch=master)](https://app.codeship.com/projects/187835)
# module-powertaker-form

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
- add it as a dependency in package.json (replace v1.0.3 with required tag):
```
"@buzzn/module_auth": "git+https://github.com/buzzn/module-auth.git#v1.0.3"
```
- add PowerForm reducers to app reducers:
```
import { combineReducers } from 'redux';
import PowerForm from '@buzzn/module_powertaker_form';

export default combineReducers({
  [PowerForm.constants.MOUNT_POINT]: PowerForm.reducers,
});
```
- run Auth saga in saga middleware:
```
import PowerForm from '@buzzn/module_powertaker_form';
import appSaga from './sagas';

function* rootSaga() {
  yield [call(PowerForm.sagas), call(appSaga)];
}
// ...
// store configuration
  sagaMiddleware.run(rootSaga);
// ...
```
- dispatch PowerForm.actions.startForm({ apiUrl, apiPath, token }) and PowerForm.actions.cleanState() to start/clean the form
- add PowerForm react component to UI: PowerForm.container
- as of 06.12.2016 this module is only working with proper token. @buzzn/module_auth can be used to get one.
