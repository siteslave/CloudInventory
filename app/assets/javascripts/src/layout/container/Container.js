/**
 * This class is intended to be extended or created via the {@link Ext.container.Container#layout layout}
 * configuration property.  See {@link Ext.container.Container#layout} for additional details.
 */
Ext.define('Ext.layout.container.Container', {

    /* Begin Definitions */

    extend: 'Ext.layout.Layout',

    alternateClassName: 'Ext.layout.ContainerLayout',

    mixins: {
        elementCt: 'Ext.util.ElementContainer'
    },

    requires: [
        'Ext.XTemplate'
    ],

    type: 'container',

    /* End Definitions */

    /**
     * @cfg {String} itemCls
     * An optional extra CSS class that will be added to the container. This can be useful for
     * adding customized styles to the container or any of its children using standard CSS
     * rules. See {@link Ext.Component}.{@link Ext.Component#componentCls componentCls} also.
     */

    /**
     * @cfg {Number} manageOverflow
     * One of the following values:
     *
     *  - 0 if the layout should ignore overflow.
     *  - 1 if the layout should be rerun if scrollbars are needed.
     *  - 2 if the layout should also correct padding when overflowed.
     *
     * The default is 0 or unmanaged.
     */
    manageOverflow: 0,

    /**
     * @private
     * Called by an owning Panel before the Panel begins its collapse process.
     * Most layouts will not need to override the default Ext.emptyFn implementation.
     */
    beginCollapse: Ext.emptyFn,

    /**
     * @private
     * Called by an owning Panel before the Panel begins its expand process.
     * Most layouts will not need to override the default Ext.emptyFn implementation.
     */
    beginExpand: Ext.emptyFn,

    /**
     * An object which contains boolean properties specifying which properties are to be 
     * animated upon flush of child Component ContextItems. For example, Accordion would
     * have:
     *
     *      {
     *          y: true,
     *          height: true
     *      }
     *
     * @private
     */
    animatePolicy: null,

    childEls: [
        /**
         * @property {Ext.Element} overflowPadderEl
         * The element used to correct body padding during overflow.
         */
        'overflowPadderEl'
    ],

    renderTpl: [
        '{%this.renderBody(out,values)%}'
    ],

    constructor: function () {
        this.callParent(arguments);
        this.mixins.elementCt.constructor.call(this);
    },

    destroy : function() {
        this.callParent();
        this.mixins.elementCt.destroy.call(this);
    },

    /**
     * In addition to work done by our base classes, containers benefit from some extra
     * cached daata. The following properties are added to the ownerContext:
     * 
     *  - visibleItems: the result of {@link #getVisibleItems}
     *  - childItems: the ContextItem[] for each visible item
     *  - targetContext: the ContextItem for the {@link #getTarget} element
     */
    beginLayout: function (ownerContext) {
        this.callParent(arguments);

        ownerContext.targetContext = ownerContext.getEl('getTarget', this);

        this.cacheChildItems(ownerContext);
    },

    beginLayoutCycle: function (ownerContext) {
        var padEl = this.overflowPadderEl;

        this.callParent(arguments);

        if (padEl) {
            padEl.setStyle('display', 'none');
        }
    },

    cacheChildItems: function (ownerContext) {
        var context = ownerContext.context,
            childItems = [],
            items = this.getVisibleItems(),
            length = items.length,
            i;

        ownerContext.childItems = childItems;
        ownerContext.visibleItems = items;

        for (i = 0; i < length; ++i) {
            childItems.push(context.getCmp(items[i]));
        }
    },

    cacheElements: function () {
        var owner = this.owner;

        this.applyChildEls(owner.el, owner.id); // from ElementContainer mixin
    },

    calculateContentSize: function (ownerContext, dimensions) {
        var me = this,
            containerDimensions = (dimensions || 0) |
                   ((ownerContext.autoWidth ? 1 : 0) | (ownerContext.autoHeight ? 2 : 0)),
            calcWidth = (containerDimensions & 1) || undefined,
            calcHeight = (containerDimensions & 2) || undefined,
            childItems = ownerContext.childItems,
            length = childItems.length,
            contentHeight = 0,
            contentWidth = 0,
            needed = 0,
            props = ownerContext.props,
            targetXY, targetX, targetY, targetPadding,
            borders, child, childContext, childX, childY, height, i, margins, width, xy;

        if (calcWidth) {
            if (isNaN(props.contentWidth)) {
                ++needed;
            } else {
                calcWidth = undefined;
            }
        }
        if (calcHeight) {
            if (isNaN(props.contentHeight)) {
                ++needed;
            } else {
                calcHeight = undefined;
            }
        }

        if (needed) {
            // TODO - this is rather brute force... maybe a wrapping el or clientHeight/Width
            // trick might help. Whatever we do, it must either work for Absolute layout or
            // at least be correctable by an overridden method in that derived class.
            for (i = 0; i < length; ++i) {
                childContext = childItems[i];
                child = childContext.target;
                height = calcHeight && childContext.getProp('height');
                width = calcWidth && childContext.getProp('width');
                margins = childContext.getMarginInfo();

                // getXY is the root method here (meaning that we cannot avoid getting both
                // even if we need only one), so dip into the DOM if something is needed
                if ((calcWidth && isNaN(child.x)) || (calcHeight && isNaN(child.y))) {
                    xy = child.el.getXY();
                    if (!targetXY) {
                        targetXY = ownerContext.targetContext.el.getXY();
                        borders = ownerContext.targetContext.getBorderInfo();
                        targetX = targetXY[0] + borders.left;
                        targetY = targetXY[1] + borders.top;
                    }
                    // not worth avoiding the possibly useless calculation here:
                    childX = xy[0] - targetX;
                    childY = xy[1] - targetY;
                } else {
                    // not worth avoiding these either:
                    childX = child.x;
                    childY = child.y;
                }
                // XY includes the top/left margin

                height += margins.bottom;
                width  += margins.right;

                contentHeight = Math.max(contentHeight, childY + height);
                contentWidth = Math.max(contentWidth, childX + width);

                if (isNaN(contentHeight) && isNaN(contentWidth)) {
                    me.done = false;
                    return;
                }
            }

            if (calcWidth || calcHeight) {
                targetPadding = ownerContext.targetContext.getPaddingInfo();
            }
            if (calcWidth && !ownerContext.setContentWidth(contentWidth + targetPadding.right)) {
                me.done = false;
            }
            if (calcHeight && !ownerContext.setContentHeight(contentHeight + targetPadding.bottom)) {
                me.done = false;
            }

            /* add a '/' to turn on this log ('//* enables, '/*' disables)
            if (me.done) {
                var el = ownerContext.targetContext.el.dom;
                Ext.log(this.owner.id, '.contentSize: ', contentWidth, 'x', contentHeight,
                    ' => scrollSize: ', el.scrollWidth, 'x', el.scrollHeight);
            }/**/
        }
    },

    /**
     * Handles overflow processing for a container. This should be called once the layout
     * has determined contentWidth/Height. In addition to the ownerContext passed to the
     * {@link #calculate} method, this method also needs the containerSize (the object
     * returned by {@link #getContainerSize}).
     * 
     * @param {Ext.layout.ContextItem} ownerContext
     * @param {Object} containerSize
     * @param {Number} dimensions A bit mask for the overflow managed dimensions. The 0-bit
     * is for `width` and the 1-bit is for `height`. In other words, a value of 1 would be
     * only `width`, 2 would be only `height` and 3 would be both. If not provided, the
     * non-auto dimensions are returned.
     */
    calculateOverflow: function (ownerContext, containerSize, dimensions) {
        var me = this,
            owner = me.owner,
            manageOverflow = me.manageOverflow,
            state = ownerContext.state,
            overflowAdjust = state.overflowAdjust,
            padWidth, padHeight, padElContext, padding, scrollRangeFlags,
            overflow, scrollbarSize, contentW, contentH, ownerW, ownerH, scrollbars,
            xauto, yauto;

        if (manageOverflow && !overflowAdjust) {
            // Determine the dimensions that have overflow:auto applied. If these come by
            // way of component config, this does not require a DOM read:
            if (owner.autoScroll) {
                xauto = yauto = true;
            } else {
                if (owner.overflowX) {
                    xauto = owner.overflowX == 'auto';
                } else {
                    overflow = ownerContext.targetContext.getStyle('overflow-x');
                    xauto = overflow && overflow != 'hidden' && overflow != 'scroll';
                }

                if (owner.overflowY) {
                    yauto = owner.overflowY == 'auto';
                } else {
                    overflow = ownerContext.targetContext.getStyle('overflow-y');
                    yauto = overflow && overflow != 'hidden' && overflow != 'scroll';
                }
            }

            // If the container layout is not using width, we don't need to adjust for the
            // vscroll (likewise for height). Perhaps we don't even need to run the layout
            // again if the adjustments won't have any effect on the result!
            if (!containerSize.gotWidth) {
                xauto = false;
            }
            if (!containerSize.gotHeight) {
                yauto = false;
            }

            if (xauto || yauto) {
                scrollbarSize = Ext.getScrollbarSize();

                // as a container we calculate contentWidth/Height, so we don't want
                // to use getProp and make it look like we are triggered by them...
                contentW = ownerContext.peek('contentWidth');
                contentH = ownerContext.peek('contentHeight');
                ownerW = containerSize.width;
                ownerH = containerSize.height;

                scrollbars = me.getScrollbarsNeeded(ownerW, ownerH, contentW, contentH);
                state.overflowState = scrollbars;

                if (typeof dimensions == 'number') {
                    scrollbars &= dimensions; // ignore dimensions that have no effect
                }

                if (scrollbars) {
                    overflowAdjust = {
                        width:  (xauto && (scrollbars & 1)) ? scrollbarSize.width : 0,
                        height: (yauto && (scrollbars & 2)) ? scrollbarSize.height : 0
                    };

                    // We can have 0-sized scrollbars (new Mac OS) and so don't invalidate
                    // the layout unless this will change something...
                    if (overflowAdjust.width + overflowAdjust.height) {
                        me.done = false;

                        // we pass overflowAdjust and overflowState in as state for the next
                        // cycle (these are discarded if one of our ownerCt's invalidates):
                        ownerContext.invalidate({
                            state: {
                                overflowAdjust: overflowAdjust,
                                overflowState: state.overflowState
                            }
                        });
                    }
                }
            }
        }

        if (!me.done) {
            return;
        }

        padElContext = ownerContext.padElContext ||
                      (ownerContext.padElContext = ownerContext.getEl('overflowPadderEl', me));

        // Even if overflow does not effect the layout, we still do need the padEl to be
        // sized or hidden appropriately...
        if (padElContext) {
            scrollbars = state.overflowState; // the true overflow state
            padWidth = containerSize.width;
            padHeight = 0;//  TODO me.padHeightAdj; // 0 or 1

            if (scrollbars) {
                padding = ownerContext.targetContext.getPaddingInfo();
                scrollRangeFlags = me.scrollRangeFlags;

                if ((scrollbars & 2) && (scrollRangeFlags & 1)) { // if (vscroll and loses bottom)
                    padHeight += padding.bottom;
                }

                if ((scrollbars & 1) && (scrollRangeFlags & 4)) { // if (hscroll and loses right)
                    padWidth += padding.right;
                }
                padElContext.setProp('display', '');
                padElContext.setSize(padWidth, padHeight);
            } else {
                padElContext.setProp('display', 'none');
            }
        }
    },

    /**
     * Adds layout's itemCls and owning Container's itemCls
     * @protected
     */
    configureItem: function(item) {
        var me = this,
            itemCls = me.itemCls,
            ownerItemCls = me.owner.itemCls;

        me.callParent(arguments);

        if (itemCls) {
            item.addCls(itemCls);
        }
        if (ownerItemCls) {
            item.addCls(ownerItemCls);
        }
    },

    doRenderBody: function (out, renderData) {
        // Careful! This method is bolted on to the renderTpl so all we get for context is
        // the renderData! The "this" pointer is the renderTpl instance!

        this.renderItems(out, renderData);
        this.renderContent(out, renderData);
    },

    doRenderContainer: function (out, renderData) {
        // Careful! This method is bolted on to the renderTpl so all we get for context is
        // the renderData! The "this" pointer is the renderTpl instance!

        var me = renderData.$comp.layout,
            tpl = me.getRenderTpl(),
            data = me.getRenderData();

        tpl.applyOut(data, out);
    },

    doRenderItems: function (out, renderData) {
        // Careful! This method is bolted on to the renderTpl so all we get for context is
        // the renderData! The "this" pointer is the renderTpl instance!

        var me = renderData.$layout,
            tree = me.getRenderTree();

        if (tree) {
            Ext.DomHelper.generateMarkup(tree, out);
        }
    },

    /**
     * Creates an element that makes bottom/right body padding consistent across browsers.
     * This element is sized based on the need for scrollbars in {@link #calculateOverflow}.
     * If the {@link #manageOverflow} option is false, this element is not created.
     *
     * See {@link #getScrollRangeFlags} for more details.
     */
    doRenderPadder: function (out, renderData) {
        // Careful! This method is bolted on to the renderTpl so all we get for context is
        // the renderData! The "this" pointer is the renderTpl instance!

        var me = renderData.$layout,
            owner = me.owner,
            scrollRangeFlags = me.getScrollRangeFlags();

        if (me.manageOverflow == 2) {
            if (scrollRangeFlags & 5) { // if (loses parent bottom and/or right padding)
                out.push('<div id="',owner.id,'-overflowPadderEl" ',
                    'style="font-size: 1px; width:1px; height: 1px;');

                // We won't want the height of the padder to cause problems when we only
                // want to adjust for right padding, so we relatively position it up 1px so
                // its height of 1px will have no vertical effect. This trick does not work
                // on IE due to bugs (the effects are worse than the off-by-1px in scroll
                // height).
                //
                /* turns out this does not work on FF (5) either... TODO
                if (Ext.isIE || Ext.isGecko) {
                    me.padHeightAdj = 0;
                } else {
                    me.padHeightAdj = 1;
                    out.push('position: relative; top: -1px;');
                }/**/

                out.push('"></div>')

                me.scrollRangeFlags = scrollRangeFlags; // remember for calculateOverflow
            }
        }
    }, 

    finishRender: function () {
        var me = this,
            target, items;

        me.callParent();

        me.cacheElements();

        target = me.getRenderTarget();
        items = me.getLayoutItems();

        if (me.targetCls) {
            me.getTarget().addCls(me.targetCls);
        }

        me.finishRenderItems(target, items);
    },

    /**
     * @private
     * Called for every layout in the layout context after all the layouts have been finally flushed
     */
    notifyOwner: function(ownerContext) {
        this.owner.afterLayout(this);
    },

    /**
     * Returns the container size (that of the target). Only the fixed-sized dimensions can
     * be returned because the auto-sized dimensions are based on the contentWidth/Height
     * as determined by the container layout.
     *
     * If the {@link #calculateOverflow} method is used and if {@link #manageOverflow} is
     * true, this may adjust the width/height by the size of scrollbars.
     * 
     * @param {Ext.layout.ContextItem} ownerContext The owner's context item.
     * @param {Boolean} [inDom=false] True if the container size must be in the DOM.
     * @param {Number} [dimensions] A bit mask for the desired container dimensions. The 0-bit
     * is for `width` and the 1-bit is for `height`. In other words, a value of 1 would be
     * only `width`, 2 would be only `height` and 3 would be both. If not provided, the
     * non-auto dimensions are returned.
     * @return {Object} The size
     * @return {Number} return.width The width
     * @return {Number} return.height The height
     * @protected
     */
    getContainerSize : function(ownerContext, inDom) {
        // Subtle But Important:
        // 
        // We don't want to call getProp/hasProp et.al. unless we in fact need that value
        // for our results! If we call it and don't need it, the layout manager will think
        // we depend on it and will schedule us again should it change.

        var me = this,
            target = me.getTarget(),
            targetContext = ownerContext.getEl(target),
            frameInfo = targetContext.getFrameInfo(),
            got = 0,
            needed = 0,
            overflowAdjust = ownerContext.state.overflowAdjust,
            gotWidth, gotHeight, width, height;

        // In an autoWidth/Height case, we must not ask for any of the auto dimensions
        // because they will be determined by contentWidth/Height which is calculated by
        // this layout...

        // Attempt to get only dimensions that are being controlled, not autosized dimensions.
        // Fit/Card layouts are able to set just the width of children, allowing child's
        // resulting height to autosize the Container.
        // See examples/tabs/tabs.html for an example of this.

        if (!ownerContext.autoWidth) {
            ++needed;
            width = inDom ? targetContext.getDomProp('width') : targetContext.getProp('width');
            gotWidth = (typeof width == 'number');
            if (gotWidth) {
                ++got;
                width -= frameInfo.width;
                if (overflowAdjust) {
                    width -= overflowAdjust.width;
                }
            }
        }

        if (!ownerContext.autoHeight) {
            ++needed;
            height = inDom ? targetContext.getDomProp('height') : targetContext.getProp('height');
            gotHeight = (typeof height == 'number');
            if (gotHeight) {
                ++got;
                height -= frameInfo.height;
                if (overflowAdjust) {
                    height -= overflowAdjust.height;
                }
            }
        }

        return {
            width: width,
            height: height,
            needed: needed,
            got: got,
            gotAll: got == needed,
            gotWidth: gotWidth,
            gotHeight: gotHeight
        };
    },

    /**
     * Returns an array of child components either for a render phase (Performed in the beforeLayout
     * method of the layout's base class), or the layout phase (onLayout).
     * @return {Ext.Component[]} of child components
     */
    getLayoutItems: function() {
        var owner = this.owner,
            items = owner && owner.items;

        return (items && items.items) || [];
    },

    getRenderData: function () {
        var comp = this.owner;

        return {
            $comp: comp,
            $layout: this,
            ownerId: comp.id
        };
    },

    /**
     * @protected
     * Returns all items that are rendered
     * @return {Array} All matching items
     */
    getRenderedItems: function() {
        var me = this,
            target = me.getRenderTarget(),
            items = me.getLayoutItems(),
            ln = items.length,
            renderedItems = [],
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.rendered && me.isValidParent(item, target, i)) {
                renderedItems.push(item);
            }
        }

        return renderedItems;
    },

    /**
     * Returns the element into which rendering must take place. Defaults to the owner Container's
     * target element.
     *
     * May be overridden in layout managers which implement an inner element.
     *
     * @return {Ext.Element}
     */
    getRenderTarget: function() {
        return this.owner.getTargetEl();
    },

    getRenderTpl: function () {
        var me = this,
            renderTpl = Ext.XTemplate.getTpl(this, 'renderTpl');

        // Make sure all standard callout methods for the owner component are placed on the
        // XTemplate instance (but only once please):
        if (!renderTpl.renderContent) {
            me.owner.setupRenderTpl(renderTpl);
        }

        return renderTpl;
    },

    getRenderTree: function () {
        return this.getItemsRenderTree(this.getLayoutItems());
    },

    getScrollbarsNeeded: function (width, height, contentWidth, contentHeight) {
        var scrollbarSize = Ext.getScrollbarSize(),
            hasWidth = typeof width == 'number',
            hasHeight = typeof height == 'number',
            needHorz = 0,
            needVert = 0;

        if (hasHeight && height < contentHeight) {
            needVert = 2;
            width -= scrollbarSize.width;
        }

        if (hasWidth && width < contentWidth) {
            needHorz = 1;
            if (!needVert && hasHeight) {
                height -= scrollbarSize.height;
                if (height < contentHeight) {
                    needVert = 2;
                }
            }
        }

        return needVert + needHorz;
    },

    /**
     * Returns flags indicating cross-browser handling of scrollHeight/Width. In particular,
     * IE has issues with padding-bottom in a scrolling element (it does not include that
     * padding in the scrollHeight). Also, margin-bottom on a child in a scrolling element
     * can be lost.
     * 
     * All browsers seem to ignore margin-right on children and padding-right on the parent
     * element (the one with the overflow)
     * 
     * This method returns a number with the follow bit positions set based on things not
     * accounted for in scrollHeight and scrollWidth:
     *
     *  - 1: Scrolling element's padding-bottom is not included in scrollHeight.
     *  - 2: Last child's margin-bottom is not included in scrollHeight.
     *  - 4: Scrolling element's padding-right is not included in scrollWidth.
     *  - 8: Child's margin-right is not included in scrollWidth.
     *
     * To work around the margin-bottom issue, it is sufficient to create a 0px tall last
     * child that will "hide" the margin. This can also be handled by wrapping the children
     * in an element, again "hiding" the margin. Wrapping the elements is about the only
     * way to preserve their right margins. This is the strategy used by Column layout.
     *
     * To work around the padding-bottom problem, since it is comes from a style on the
     * parent element, about the only simple fix is to create a last child with height
     * equal to padding-bottom. To preserve the right padding, the sizing element needs to
     * have a width that includes the right padding.
     */
    getScrollRangeFlags: function () {
        var flags = -1;

        return function () {
            if (flags < 0) {
                var div = Ext.getBody().createChild({
                        //cls: 'x-border-box x-hide-offsets',
                        cls: Ext.baseCSSPrefix + 'border-box',
                        style: {
                            width: '100px', height: '100px', padding: '10px',
                            overflow: 'auto'
                        },
                        children: [{
                            style: {
                                border: '1px solid red',
                                width: '150px', height: '150px',
                                margin: '0 5px 5px 0' // TRBL
                            }
                        }]
                    }),
                    scrollHeight = div.dom.scrollHeight,
                    scrollWidth = div.dom.scrollWidth,
                    heightFlags = {
                        // right answer, nothing missing:
                        175: 0,
                        // missing parent padding-bottom:
                        165: 1,
                        // missing child margin-bottom:
                        170: 2,
                        // missing both
                        160: 3
                    },
                    widthFlags = {
                        // right answer, nothing missing:
                        175: 0,
                        // missing parent padding-right:
                        165: 4,
                        // missing child margin-right:
                        170: 8,
                        // missing both
                        160: 12
                    };

                flags = (heightFlags[scrollHeight] || 0) | (widthFlags[scrollWidth] || 0);
                //Ext.log('flags=',flags.toString(2));
                div.remove();
            }

            return flags;
        };
    }(),

    /**
     * Returns the owner component's resize element.
     * @return {Ext.Element}
     */
    getTarget: function() {
        return this.owner.getTargetEl();
    },

    /**
     * @protected
     * Returns all items that are both rendered and visible
     * @return {Array} All matching items
     */
    getVisibleItems: function() {
        var target   = this.getRenderTarget(),
            items = this.getLayoutItems(),
            ln = items.length,
            visibleItems = [],
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.rendered && this.isValidParent(item, target, i) && item.hidden !== true) {
                visibleItems.push(item);
            }
        }

        return visibleItems;
    },

    setupRenderTpl: function (renderTpl) {
        var me = this;

        renderTpl.renderBody = me.doRenderBody;
        renderTpl.renderContainer = me.doRenderContainer;
        renderTpl.renderItems = me.doRenderItems;
        renderTpl.renderPadder = me.doRenderPadder;
    }
});
