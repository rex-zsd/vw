import { nativePage } from './native';
import { extendLife, mergeInstances, extendWatcher, extendStore } from './extend';
import getWatchers from './watch';
import Store from '../vuex/store';
import { isEmpty } from '../utils';

var PAGE_LIFT_TIME = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onPageScroll',
// 'onShareAppMessage', 同一个PAGE不应该存在多个
'onTabItemTap'];

export default function () {
  for (var _len = arguments.length, pages = Array(_len), _key = 0; _key < _len; _key++) {
    pages[_key] = arguments[_key];
  }

  pages.unshift({
    onLoad: function onLoad() {},
    onUnload: function onUnload() {}
  });
  var page = mergeInstances(PAGE_LIFT_TIME, pages);
  var store = page.store,
      watch = page.watch;

  var watchers = getWatchers(watch);

  PAGE_LIFT_TIME.forEach(function (key) {
    var lifes = page[key];

    if (!(lifes && lifes.length)) return false;

    if (key === 'onLoad') {
      !isEmpty(watchers) && lifes.unshift(extendWatcher(watchers));
      !isEmpty(store) && lifes.unshift(extendStore(store));
    }

    if (key === 'onUnload') {
      lifes.push(function onUnload() {
        !isEmpty(watchers) && this._watchers.forEach(function (watcher) {
          return watcher.unSubscribe();
        });
        this._module && this.$store.uninstall(this._module);
      });
    }
    page[key] = extendLife(lifes);
  });

  nativePage(page);
}