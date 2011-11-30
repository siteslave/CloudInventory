Ext.define('CloudHIS.store.AddProductsReceivesStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.AddProductsReceivesModel',
    proxy: {
        type: 'rest',
        // Disable cache: _id in url path
        noCache: false,

        // GET  /receive_details
        url: '/receive_details',

        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
