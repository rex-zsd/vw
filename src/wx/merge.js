export function extendLife (lifeFns) {
  return function () {
    let args = Array.prototype.slice.apply(arguments)
    lifeFns.forEach(lifeFn => lifeFn.apply(this, args))
  }
}

export function merge (lifes) {

  return function (result, instance) {
    let keys = Object.keys(instance)

    keys.forEach((key) => {
      if (lifes.indexOf(key) !== -1) {
        const lifeFns = result[key] = result[key] || []
        lifeFns.push(instance[key])
      }
    })

    return result
  }
}

const extendCreator = (config = {}) => {
  const {
    life = LIFE_CYCLE,
      exclude = [],
  } = config;

  const excludeList = exclude.concat(LIFE_CYCLE.map(getFuncArrayName));

  if (!Array.isArray(life) || !Array.isArray(exclude)) throw new Error('Invalid Extend Config');
  let lifeCycleList = life.filter(item => LIFE_CYCLE.indexOf(item) >= 0);
  return function extend(target, ...objList) {
    objList.forEach((source) => {
      if (source) {
        let keys = Object.keys(source);
        keys.forEach((key) => {
          let value = source[key];
          if (excludeList.indexOf(key) >= 0) return;
          if (lifeCycleList.indexOf(key) >= 0 && typeof value === 'function') {
            // 合并生命周期函数，可选择改成闭包函数列表
            let funcArrayName = getFuncArrayName(key);

            if (!target[funcArrayName]) {
              target[funcArrayName] = [];
              if (target[key]) {
                target[funcArrayName].push(target[key]);
              }
              target[key] = function (options) {
                if (key === 'onLaunch' || (key === 'onShow' && options)) {
                  options.query = extractQuery(options.query);
                } else if (key === 'onLoad') {
                  options = extractQuery(options);
                }
                target[funcArrayName].forEach(func => func.apply(this, [options]));
              };
            }

            if (source[funcArrayName]) {
              // 经过生命周期合并的组件直接整合函数列表
              target[funcArrayName].push(...source[funcArrayName]);
            } else {
              // 添加生命周期函数进入函数列表
              target[funcArrayName].push(value);
            }
          } else {
            target[key] = value;
          }
        });
      }
    });
    return target;
  };
};

const getFuncArrayName = name => `__$${name}`;

export default extendCreator;
