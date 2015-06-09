var isFunction = chart_fn.isFunction = function(value){
  return typeof value == 'function';
},

isArrayLike = chart_fn.isArrayLike = function(obj) {
  if (!obj || (typeof obj.length !== 'number')) return false;

  if (typeof obj.hasOwnProperty != 'function' &&
      typeof obj.constructor != 'function') {
    return true;
  } else  {
    return toString.call(obj) !== '[object Object]' ||   // some browser native object
           typeof obj.callee === 'function';              // arguments (on IE8 looks like regular obj)
  }
},

isObject = chart_fn.isObject = function(value){
  return value != null && typeof value == 'object';
},

forEach = chart_fn.forEach = function(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context);
    } else if (isArrayLike(obj)) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    }
  }
  return obj;
},

copy = chart_fn.copy = function(source, destination){
  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (isObject(source)) {
        destination = copy(source, {});
      }
    }
  } else {
    if (isArray(source)) {
      destination.length = 0;
      for ( var i = 0; i < source.length; i++) {
        destination.push(copy(source[i]));
      }
    } else {
      forEach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
    }
  }
  return destination;
},

extend = chart_fn.extend = function(dst) {
  forEach(arguments, function(obj){
    if (obj !== dst) {
      forEach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });

  return dst;
},

filter = chart_fn.filter = function(arr, key, value, callback, othercallback){
    if (!isArrayLike(arr)) return;
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] && arr[i][key] == value){
            if (callback) callback.call(null, arr[i], i);
            res.push(arr[i]);
        }else{
            if (othercallback) othercallback.call(null, arr[i], i);
        }
    }
    return res;
},

min = chart_fn.min = function(arr, id){
    var res = 1e10;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][id] && arr[i][id] < res)
            res = arr[i][id];
    }
    return res;
},

isArray = chart_fn.isArray = function (value) {
  return toString.apply(value) == '[object Array]';
},

max = chart_fn.max = function(arr, id){
    var res = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][id] && arr[i][id] > res)
            res = arr[i][id];
    }
    return res;
};

//模拟 requestAnimationFrame
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame){
  window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
      lastTime = currTime + timeToCall;
      return id;
  };
}

if (!window.cancelAnimationFrame){
  window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
  };
}