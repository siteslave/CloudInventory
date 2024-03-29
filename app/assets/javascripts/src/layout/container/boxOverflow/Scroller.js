/**
 * @class Ext.layout.container.boxOverflow.Scroller
 * @private
 */
Ext.define('Ext.layout.container.boxOverflow.Scroller', {

    /* Begin Definitions */

    extend: 'Ext.layout.container.boxOverflow.None',
    requires: ['Ext.util.ClickRepeater', 'Ext.Element'],
    alternateClassName: 'Ext.layout.boxOverflow.Scroller',
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    /* End Definitions */

    /**
     * @cfg {Boolean} animateScroll
     * True to animate the scrolling of items within the layout (ignored if enableScroll is false)
     */
    animateScroll: false,

    /**
     * @cfg {Number} scrollIncrement
     * The number of pixels to scroll by on scroller click
     */
    scrollIncrement: 20,

    /**
     * @cfg {Number} wheelIncrement
     * The number of pixels to increment on mouse wheel scrolling.
     */
    wheelIncrement: 10,

    /**
     * @cfg {Number} scrollRepeatInterval
     * Number of milliseconds between each scroll while a scroller button is held down
     */
    scrollRepeatInterval: 60,

    /**
     * @cfg {Number} scrollDuration
     * Number of milliseconds that each scroll animation lasts
     */
    scrollDuration: 400,

    /**
     * @cfg {String} beforeCtCls
     * CSS class added to the beforeCt element. This is the element that holds any special items such as scrollers,
     * which must always be present at the leftmost edge of the Container
     */

    /**
     * @cfg {String} afterCtCls
     * CSS class added to the afterCt element. This is the element that holds any special items such as scrollers,
     * which must always be present at the rightmost edge of the Container
     */

    /**
     * @cfg {String} [scrollerCls='x-box-scroller']
     * CSS class added to both scroller elements if enableScroll is used
     */
    scrollerCls: Ext.baseCSSPrefix + 'box-scroller',

    /**
     * @cfg {String} beforeScrollerCls
     * CSS class added to the left scroller element if enableScroll is used
     */

    /**
     * @cfg {String} afterScrollerCls
     * CSS class added to the right scroller element if enableScroll is used
     */
    
    constructor: function(layout, config) {
        this.layout = layout;
        Ext.apply(this, config || {});
        
        this.addEvents(
            /**
             * @event scroll
             * @param {Ext.layout.container.boxOverflow.Scroller} scroller The layout scroller
             * @param {Number} newPosition The new position of the scroller
             * @param {Boolean/Object} animate If animating or not. If true, it will be a animation configuration, else it will be false
             */
            'scroll'
        );
        this.scrollPosition = 0;
    },
    
    getPrefixConfig: function() {
        var me = this;
        this.initCSSClasses();
        return {
            cls: Ext.layout.container.Box.prototype.innerCls + ' ' + me.beforeCtCls,
            cn : {
                id : me.layout.owner.id + '-before-scroller',
                cls: me.scrollerCls + ' ' + me.beforeScrollerCls,
                style: 'display:none'
            }
        };
    },

    getSuffixConfig: function() {
        var me = this;
        return {
            cls: Ext.layout.container.Box.prototype.innerCls + ' ' + me.afterCtCls,
            cn : {
                id : me.layout.owner.id + '-after-scroller',
                cls: me.scrollerCls + ' ' + me.afterScrollerCls,
                style: 'display:none'
            }
        };
    },

    getOverflowCls: function() {
        return Ext.baseCSSPrefix + this.layout.direction + '-box-overflow-body';
    },

    initCSSClasses: function() {
        var me = this,
            layout = me.layout,
            names = layout.getNames(),
            leftName = names.left,
            rightName = names.right;

        me.beforeCtCls = me.beforeCtCls || Ext.baseCSSPrefix + 'box-scroller-' + leftName;
        me.afterCtCls  = me.afterCtCls  || Ext.baseCSSPrefix + 'box-scroller-' + rightName;
        me.beforeScrollerCls = me.beforeScrollerCls || Ext.baseCSSPrefix + layout.owner.getXType() + '-scroll-' + leftName;
        me.afterScrollerCls  = me.afterScrollerCls  || Ext.baseCSSPrefix + layout.owner.getXType() + '-scroll-' + rightName;
    },

    handleOverflow: function(ownerContext) {
        var me = this,
            layout = me.layout,
            names = layout.getNames(),
            methodName = 'get' + names.widthCap;

        me.captureChildElements();
        me.showScrollers();

        return {
            reservedSpace: me.beforeCt[methodName]() + me.afterCt[methodName]()
        };
    },

    /**
     * @private
     * Gets references to the beforeCt and afterCt elements if they have not already been captured
     * and creates click handlers for them.
     */
    captureChildElements: function() {
        var me = this,
            el = me.layout.owner.el,
            before,
            after;

        // Grab the scroll click receiving elements
        if (!me.beforeCt) {
            before = me.beforeScroller = el.getById(me.layout.owner.id + '-before-scroller');
            after = me.afterScroller = el.getById(me.layout.owner.id + '-after-scroller');
            me.beforeCt = before.up('');
            me.afterCt = after.up('');
            me.createWheelListener();

            before.addClsOnOver(me.beforeScrollerCls + '-hover');
            after.addClsOnOver(me.afterScrollerCls + '-hover');

            before.setVisibilityMode(Ext.Element.DISPLAY);
            after.setVisibilityMode(Ext.Element.DISPLAY);

            me.beforeRepeater = new Ext.util.ClickRepeater(before, {
                interval: me.scrollRepeatInterval,
                handler : me.scrollLeft,
                scope   : me
            });

            me.afterRepeater = new Ext.util.ClickRepeater(after, {
                interval: me.scrollRepeatInterval,
                handler : me.scrollRight,
                scope   : me
            });
        }
    },

    /**
     * @private
     * Sets up an listener to scroll on the layout's innerCt mousewheel event
     */
    createWheelListener: function() {
        this.layout.innerCt.on({
            mousewheel: function(e) {
                this.scrollBy(e.getWheelDelta() * this.wheelIncrement * -1, false);
            },
            stopEvent: true,
            scope: this
        });
    },

    /**
     * @private
     */
    clearOverflow: function() {
        this.hideScrollers();
    },

    /**
     * @private
     * Shows the scroller elements in the beforeCt and afterCt. Creates the scrollers first if they are not already
     * present. 
     */
    showScrollers: function() {
        this.captureChildElements();
        this.beforeScroller.show();
        this.afterScroller.show();
        this.updateScrollButtons();
        this.layout.owner.addClsWithUI('scroller');
        // TODO - this may invalidates data in the ContextItem's styleCache
    },

    /**
     * @private
     * Hides the scroller elements in the beforeCt and afterCt
     */
    hideScrollers: function() {
        if (this.beforeScroller != undefined) {
            this.beforeScroller.hide();
            this.afterScroller.hide();
            this.layout.owner.removeClsWithUI('scroller');
            // TODO - this may invalidates data in the ContextItem's styleCache
        }
    },

    /**
     * @private
     */
    destroy: function() {
        Ext.destroy(this.beforeRepeater, this.afterRepeater, this.beforeScroller, this.afterScroller, this.beforeCt, this.afterCt);
    },

    /**
     * @private
     * Scrolls left or right by the number of pixels specified
     * @param {Number} delta Number of pixels to scroll to the right by. Use a negative number to scroll left
     */
    scrollBy: function(delta, animate) {
        this.scrollTo(this.getScrollPosition() + delta, animate);
    },

    /**
     * @private
     * @return {Object} Object passed to scrollTo when scrolling
     */
    getScrollAnim: function() {
        return {
            duration: this.scrollDuration, 
            callback: this.updateScrollButtons, 
            scope   : this
        };
    },

    /**
     * @private
     * Enables or disables each scroller button based on the current scroll position
     */
    updateScrollButtons: function() {
        if (this.beforeScroller == undefined || this.afterScroller == undefined) {
            return;
        }

        var beforeMeth = this.atExtremeBefore()  ? 'addCls' : 'removeCls',
            afterMeth  = this.atExtremeAfter() ? 'addCls' : 'removeCls',
            beforeCls  = this.beforeScrollerCls + '-disabled',
            afterCls   = this.afterScrollerCls  + '-disabled';
        
        this.beforeScroller[beforeMeth](beforeCls);
        this.afterScroller[afterMeth](afterCls);
        this.scrolling = false;
    },

    /**
     * @private
     * Returns true if the innerCt scroll is already at its left-most point
     * @return {Boolean} True if already at furthest left point
     */
    atExtremeBefore: function() {
        return this.getScrollPosition() === 0;
    },

    /**
     * @private
     * Scrolls to the left by the configured amount
     */
    scrollLeft: function() {
        this.scrollBy(-this.scrollIncrement, false);
    },

    /**
     * @private
     * Scrolls to the right by the configured amount
     */
    scrollRight: function() {
        this.scrollBy(this.scrollIncrement, false);
    },

    /**
     * Returns the current scroll position of the innerCt element
     * @return {Number} The current scroll position
     */
    getScrollPosition: function(){
        var me = this,
            layout = me.layout,
            result;

        // Until we actually scroll, the scroll[Top|Left] is stored as zero to avoid DOM hits.
        if (me.hasOwnProperty('scrollPosition')) {
            result = me.scrollPosition;
        } else {
            result = parseInt(layout.innerCt.dom['scroll' + layout.getNames().leftCap], 10) || 0;
        }
        return result;
    },

    /**
     * @private
     * Returns the maximum value we can scrollTo
     * @return {Number} The max scroll value
     */
    getMaxScrollPosition: function() {
        var layout = this.layout,
            names = layout.getNames(),
            widthName = names.widthCap;

        return layout.innerCt.dom['scroll' + widthName] - this.layout.innerCt['get' + widthName]();
    },

    /**
     * @private
     * Returns true if the innerCt scroll is already at its right-most point
     * @return {Boolean} True if already at furthest right point
     */
    atExtremeAfter: function() {
        return this.getScrollPosition() >= this.getMaxScrollPosition();
    },

    /**
     * @private
     * Scrolls to the given position. Performs bounds checking.
     * @param {Number} position The position to scroll to. This is constrained.
     * @param {Boolean} animate True to animate. If undefined, falls back to value of this.animateScroll
     */
    scrollTo: function(position, animate) {
        var me = this,
            layout = me.layout,
            names = layout.getNames(),
            oldPosition = me.getScrollPosition(),
            newPosition = Ext.Number.constrain(position, 0, me.getMaxScrollPosition());

        if (newPosition != oldPosition && !me.scrolling) {
            delete me.scrollPosition;
            if (animate == undefined) {
                animate = me.animateScroll;
            }

            layout.innerCt.scrollTo(names.left, newPosition, animate ? me.getScrollAnim() : false);
            if (animate) {
                me.scrolling = true;
            } else {
                me.updateScrollButtons();
            }
            me.fireEvent('scroll', me, newPosition, animate ? me.getScrollAnim() : false);
        }
    },

    /**
     * Scrolls to the given component.
     * @param {String/Number/Ext.Component} item The item to scroll to. Can be a numerical index, component id 
     * or a reference to the component itself.
     * @param {Boolean} animate True to animate the scrolling
     */
    scrollToItem: function(item, animate) {
        var me = this,
            layout = me.layout,
            names = layout.getNames(),
            visibility,
            box,
            newPos;

        item = me.getItem(item);
        if (item != undefined) {
            visibility = this.getItemVisibility(item);
            if (!visibility.fullyVisible) {
                box  = item.getBox(true, true);
                newPos = box[names.position];
                if (visibility.hiddenEnd) {
                    newPos -= (this.layout.innerCt['get' + names.widthCap]() - box[names.width]);
                }
                this.scrollTo(newPos, animate);
            }
        }
    },

    /**
     * @private
     * For a given item in the container, return an object with information on whether the item is visible
     * with the current innerCt scroll value.
     * @param {Ext.Component} item The item
     * @return {Object} Values for fullyVisible, hiddenStart and hiddenEnd
     */
    getItemVisibility: function(item) {
        var me          = this,
            box         = me.getItem(item).getBox(true, true),
            layout      = me.layout,
            names       = layout.getNames(),
            itemStart   = box[names.position],
            itemEnd     = itemStart + box[names.width],
            scrollStart = me.getScrollPosition(),
            scrollEnd   = scrollStart + layout.innerCt['get' + names.widthCap]();

        return {
            hiddenStart : itemStart < scrollStart,
            hiddenEnd   : itemEnd > scrollEnd,
            fullyVisible: itemStart > scrollStart && itemEnd < scrollEnd
        };
    }
});