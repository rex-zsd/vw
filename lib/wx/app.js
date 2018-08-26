import { mergeInstances, extendWatcher, extendLife } from './extend';
import { isEmpty } from '../utils';
import getWatchers from './watch';
import Store from '../vuex/store';
import { nativeApp } from './native';

var APP_LIFT_TIME = ['onLaunch', 'onShow', 'onHide'];

export default function () {
  for (var _len = arguments.length, apps = Array(_len), _key = 0; _key < _len; _key++) {
    apps[_key] = arguments[_key];
  }

  var app = mergeInstances(APP_LIFT_TIME, apps);
  var store = app.store,
      watch = app.watch;


  var watchers = watch ? getWatchers(watch) : [];

  app.$store = new Store(store);
  app._watchers = [];

  APP_LIFT_TIME.forEach(function (key) {
    var lifes = app[key];

    if (!(lifes && lifes.length)) return;

    if (key === 'onLaunth') {
      !isEmpty(watchers) && lifes.unshift(extendWatcher(watchers));
      console.log(lifes);
    }

    app[key] = extendLife(lifes);
  });
  nativeApp(app);
}