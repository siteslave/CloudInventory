/**
 * @class Ext.view.TableChunker
 * 
 * Produces optimized XTemplates for chunks of tables to be
 * used in grids, trees and other table based widgets.
 *
 * @singleton
 */
Ext.define('Ext.view.TableChunker', {
    singleton: true,
    requires: ['Ext.XTemplate'],
    metaTableTpl: [
        '{[this.openTableWrap()]}',
        '<table class="' + Ext.baseCSSPrefix + 'grid-table ' + Ext.baseCSSPrefix + 'grid-table-resizer" border="0" cellspacing="0" cellpadding="0" {[this.embedFullWidth(values)]}>',
            '<tbody>',
            '<tr class="' + Ext.baseCSSPrefix + 'grid-header-row">',
            '<tpl for="columns">',
                '<th class="' + Ext.baseCSSPrefix + 'grid-col-resizer-{id}" style="width: {width}px; height: 0px;"></th>',
            '</tpl>',
            '</tr>',
            '{[this.openRows()]}',
                '{row}',
                '<tpl for="features">',
                    '{[this.embedFeature(values, parent, xindex, xcount)]}',
                '</tpl>',
            '{[this.closeRows()]}',
            '</tbody>',
        '</table>',
        '{[this.closeTableWrap()]}'
    ],

    constructor: function() {
        Ext.XTemplate.prototype.recurse = function(values, reference) {
            return this.apply(reference ? values[reference] : values);
        };
    },

    embedFeature: function(values, parent, x, xcount) {
        var tpl = '';
        if (!values.disabled) {
            tpl = values.getFeatureTpl(values, parent, x, xcount);
        }
        return tpl;
    },

    embedFullWidth: function(values) {
        var result = 'style="width:{fullWidth}px;';

        // If there are no records, we need to give the table a height so that it
        // is displayed and causes q scrollbar if the width exceeds the View's width.
        if (!values.rowCount) {
            result += 'height:1px;';
        }
        return result + '"';
    },

    openRows: function() {
        return '<tpl for="rows">';
    },

    closeRows: function() {
        return '</tpl>';
    },

    metaRowTpl: [
        '<tr class="' + Ext.baseCSSPrefix + 'grid-row {addlSelector} {[this.embedRowCls()]}" {[this.embedRowAttr()]}>',
            '<tpl for="columns">',
                '<td class="{cls} ' + Ext.baseCSSPrefix + 'grid-cell ' + Ext.baseCSSPrefix + 'grid-cell-{columnId} {{id}-modified} {{id}-tdCls} {[this.firstOrLastCls(xindex, xcount)]}" {{id}-tdAttr}>',
                    '<div{[parent.enableTextSelection ? "" : " unselectable=\'on\'"]} class="' + Ext.baseCSSPrefix + 'grid-cell-inner{[parent.enableTextSelection ? "" : " ' + Ext.baseCSSPrefix + 'unselectable"]}" style="text-align: {align}; {{id}-style};">{{id}}</div>',
                '</td>',
            '</tpl>',
        '</tr>'
    ],
    
    firstOrLastCls: function(xindex, xcount) {
        var cssCls = '';
        if (xindex === 1) {
            cssCls = Ext.baseCSSPrefix + 'grid-cell-first';
        } else if (xindex === xcount) {
            cssCls = Ext.baseCSSPrefix + 'grid-cell-last';
        }
        return cssCls;
    },
    
    embedRowCls: function() {
        return '{rowCls}';
    },
    
    embedRowAttr: function() {
        return '{rowAttr}';
    },
    
    openTableWrap: function() {
        return '';
    },
    
    closeTableWrap: function() {
        return '';
    },

    getTableTpl: function(cfg, textOnly) {
        var tpl,
            tableTplMemberFns = {
                openRows: this.openRows,
                closeRows: this.closeRows,
                embedFeature: this.embedFeature,
                embedFullWidth: this.embedFullWidth,
                openTableWrap: this.openTableWrap,
                closeTableWrap: this.closeTableWrap
            },
            tplMemberFns = {},
            features = cfg.features || [],
            ln = features.length,
            i  = 0,
            memberFns = {
                embedRowCls: this.embedRowCls,
                embedRowAttr: this.embedRowAttr,
                firstOrLastCls: this.firstOrLastCls
            },
            // copy the default
            metaRowTpl = Array.prototype.slice.call(this.metaRowTpl, 0),
            metaTableTpl;
            
        for (; i < ln; i++) {
            if (!features[i].disabled) {
                features[i].mutateMetaRowTpl(metaRowTpl);
                Ext.apply(memberFns, features[i].getMetaRowTplFragments());
                Ext.apply(tplMemberFns, features[i].getFragmentTpl());
                Ext.apply(tableTplMemberFns, features[i].getTableFragments());
            }
        }
        
        metaRowTpl = new Ext.XTemplate(metaRowTpl.join(''), memberFns);
        cfg.row = metaRowTpl.applyTemplate(cfg);
        
        metaTableTpl = new Ext.XTemplate(this.metaTableTpl.join(''), tableTplMemberFns);
        
        tpl = metaTableTpl.applyTemplate(cfg);
        
        // TODO: Investigate eliminating.
        if (!textOnly) {
            tpl = new Ext.XTemplate(tpl, tplMemberFns);
        }
        return tpl;
        
    }
});
