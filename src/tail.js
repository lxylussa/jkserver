    if (typeof define === 'function' && define.amd) {
        define("jk", ["d3"], jk);
    } else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
        module.exports = jk;
    } else {
        window.jk = jk;
    }

})(window);