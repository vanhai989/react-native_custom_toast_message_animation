/**
 * @format
 */

import {AppRegistry, LogBox, YellowBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

LogBox.ignoreAllLogs()

