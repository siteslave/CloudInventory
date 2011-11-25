Ext.define('CloudHIS.store.ProductsStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.ProductsModel',
    proxy: {
        type: 'rest',
        noCache: false,
        url: '/products',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
