/**
 * @class Ext.perf.Accumulator
 * @private
 */
Ext.define('Ext.perf.Accumulator', function () {
    var currentFrame = null,
        formatTpl;

    var getTimestamp = function () {
        return new Date().getTime();
    };

    if (window.ActiveXObject) {
        try {
            // the above technique is not very accurate for small intervals...
            var toolbox = new ActiveXObject('SenchaToolbox.Toolbox');
            getTimestamp = function () {
                return toolbox.milliseconds;
            };
        } catch (e) {
            // ignore
        }
    }

    function adjustSet (set, time) {
        set.sum += time;
        set.min = Math.min(set.min, time);
        set.max = Math.max(set.max, time);
    }

    function leaveFrame () {
        var time = getTimestamp(), // do this first
            me = this, // me = frame
            accum = me.accum,
            totalTime = time - me.time;

        ++accum.count;
        if (! --accum.depth) {
            adjustSet(accum.total, totalTime);
        }
        adjustSet(accum.pure, totalTime - me.childTime);

        currentFrame = me.parent;
        if (currentFrame) {
            ++currentFrame.accum.childCount;
            currentFrame.childTime += totalTime;
        }
    }

    function makeSet () {
        return {
            min: Number.MAX_VALUE,
            max: 0,
            sum: 0
        }
    }

    function makeTap (me, fn) {
        return function () {
            var frame = me.enter(),
                ret = fn.apply(this, arguments);

            frame.leave();
            return ret;
        };
    }

    function round (x) {
        return Math.round(x * 100) / 100;
    }

    function setToJSON (count, childCount, calibration, set) {
        var data = {
            avg: 0,
            min: set.min,
            max: set.max,
            sum: 0
        };

        if (count) {
            calibration = calibration || 0;
            data.sum = set.sum - childCount * calibration;
            data.avg = data.sum / count;
            // min and max cannot be easily corrected since we don't know the number of
            // child calls for them.
        }

        return data;
    }

    return {
        constructor: function (name) {
            var me = this;

            me.count = me.childCount = me.depth = me.maxDepth = 0;
            me.pure = makeSet();
            me.total = makeSet();
            me.name = name;
        },

        statics: {
            getTimestamp: getTimestamp
        },

        format: function (calibration) {
            if (!formatTpl) {
                formatTpl = new Ext.XTemplate([
                        '{name} - {count} call(s)',
                        '<tpl if="count">',
                            '<tpl if="childCount">',
                                ' ({childCount} children)',
                            '</tpl>',
                            '<tpl if="depth - 1">',
                                ' ({depth} deep)',
                            '</tpl>',
                            '<tpl for="times">',
                                ', {type}: {[this.time(values.sum)]} msec (',
                                     //'min={[this.time(values.min)]}, ',
                                     'avg={[this.time(values.sum / parent.count)]}',
                                     //', max={[this.time(values.max)]}',
                                     ')',
                            '</tpl>',
                        '</tpl>'
                    ].join(''), {
                        time: function (t) {
                            return Math.round(t * 100) / 100;
                        }
                    });
            }

            var data = this.getData(calibration);
            data.name = this.name;
            data.pure.type = 'Pure';
            data.total.type = 'Total';
            data.times = [data.pure, data.total];
            return formatTpl.apply(data);
        },

        getData: function (calibration) {
            var me = this;

            return {
                count: me.count,
                childCount: me.childCount,
                depth: me.maxDepth,
                pure: setToJSON(me.count, me.childCount, calibration, me.pure),
                total: setToJSON(me.count, me.childCount, calibration, me.total)
            };
        },

        enter: function () {
            var me = this,
                frame = {
                    accum: me,
                    leave: leaveFrame,
                    childTime: 0,
                    parent: currentFrame
                };

            ++me.depth;
            if (me.maxDepth < me.depth) {
                me.maxDepth = me.depth;
            }

            currentFrame = frame;
            frame.time = getTimestamp(); // do this last
            return frame;
        },

        monitor: function (fn, scope, args) {
            var frame = this.enter();
            if (args) {
                fn.apply(scope, args);
            } else {
                fn.call(scope);
            }
            frame.leave();
        },

        report: function () {
            Ext.log(this.format());
        },

        tap: function (className, methodName) {
            var me = this,
                methods = typeof methodName == 'string' ? [methodName] : methodName,
                klass, statik, i, parts, length, name, src;

            if (typeof className == 'string') {
                klass = Ext.global;
                parts = className.split('.');
                for (i = 0, length = parts.length; i < length; ++i) {
                    klass = klass[parts[i]];
                }
            } else {
                klass = className;
            }

            for (i = 0, length = methods.length; i < length; ++i) {
                name = methods[i];
                statik = name.charAt(0) == '!';

                if (statik) {
                    name = name.substring(1);
                } else {
                    statik = !(name in klass.prototype);
                }

                src = statik ? klass : klass.prototype;
                src[name] = makeTap(me, src[name]);
            }

            return me;
        }
    };
}(),

function () {
    Ext.perf.getTimestamp = this.getTimestamp;
});
