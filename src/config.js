//处理配置相关逻辑
chart_fn.getDefaultConfig = function () {
    var config = {
        type: 'spline',
        option: {},
        data: {},
        bindto: '',
        legend: {},
        padding: {},
        size: {},
        color: {},
        zoom: false,
        axis: {},
        line: {},
        spline: {},
        bar: {},
        pie: {},
        donut: {},
        x: null,
        y: null
        //默认配置
    };

    Object.keys(this.additionalConfig).forEach(function (key) {
        config[key] = this.additionalConfig[key];
    }, this);

    return config;
};

chart_fn.additionalConfig = {};

chart_fn.loadConfig = function (config) {
    var this_config = this.config, target, keys, read;
    function find() {
        var key = keys.shift();
    
        if (key && target && typeof target === 'object' && key in target) {
            target = target[key];
            return find();
        }
        else if (!key) {
            return target;
        }
        else {
            return undefined;
        }
    }
    Object.keys(this_config).forEach(function (key) {
        target = config;
        keys = key.split('_');
        read = find();
        if (read) {
            this_config[key] = read;
        }
    });
};
