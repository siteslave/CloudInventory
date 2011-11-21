Ext.define('CloudHIS.view.tree.ToolsTree', {
    extend: 'Ext.tree.Panel',
    
    xtype: 'toolstree',
    
    title: 'เครื่องมือ',
    width: 250,
    
    rootVisible: false,
    
    cls: 'examples-list',
    lines: false,
    useArrows: true,
    
    store: 'ToolTreeStore'
});