Ext.define('CloudHIS.store.CategoryListStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.CategoryModel',
    storeId: 'CategoryListStore',
    proxy: {
        type: 'rest',
        noCache: false,
        url: '/category',
        reader: {
            type: 'json',
            root: 'categories',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
