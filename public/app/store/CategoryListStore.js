Ext.define('CloudHIS.store.CategoryListStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.CategoryModel',
    storeId: 'CategoryListStore',
    proxy: {
        type: 'rest',
        noCache: false,
        url: '/categories',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
