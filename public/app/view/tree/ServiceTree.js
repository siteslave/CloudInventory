Ext.define('CloudHIS.view.tree.ServiceTree', {
    extend: 'Ext.tree.Panel',
    
    xtype: 'servicetree',
    
    title: 'การให้บริการหลัก',
    width: 250,
    padding: 0,
    
    rootVisible: false,
    
    cls: 'examples-list',
    lines: false,
    useArrows: true,
    
    store: 'ServiceTreeStore',
    listeners: {
        itemclick: function(tree, record) {

            if (!record.isLeaf()) {
                return false;
            }

            var id = record.get('id'),
            title = record.get('text'),
            className = null;

            switch( id ) {
                case 'svTreePaidGet':
                    className = 'CloudHIS.view.services.RequestGrid';
                    this.setActiveItem(className, title);
                    break;

                case 'svTreeProductCategory':
                    className = 'CloudHIS.view.basic.CategoriesGrid';
                    this.setActiveItem(className, title);

                    break;
            }

        }
    },
    setActiveItem: function(className, title) {
        var panel = Ext.getCmp('mainPanel');
        var component = Ext.create(className);

        panel.setTitle(title);

        panel.removeAll();
        panel.add(component);
    }
});