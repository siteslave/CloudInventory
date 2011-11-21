Ext.define('CloudHIS.view.tree.ReportsTree', {
    extend: 'Ext.tree.Panel',
    
    alias: 'widget.reportstree',
    
    title: 'ระบบรายงาน',
    width: 250,
    padding: 0,
    
    rootVisible: false,
    
    cls: 'examples-list',
    lines: false,
    useArrows: true,
    
    store: 'ServiceTreeStore'
});