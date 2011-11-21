Ext.define('CloudHIS.store.CategoryListStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.CategoryModel',
    proxy: {
        type: 'rest',
        noCache: false,
        api: {
            read: '/category',
            update: '/category',
            destroy: '/category'
        },
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            root: 'categories'
        }
    },
    autoLoad: true,
    autoSync: true
});