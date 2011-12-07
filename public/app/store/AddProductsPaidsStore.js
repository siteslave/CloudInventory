Ext.define('CloudHIS.store.AddProductsPaidsStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.AddProductsPaidsModel',
    proxy: {
        type: 'rest',
        // Disable cache: _id in url path
        noCache: false,

        // GET  /paids/tmpproducts
        url: '/paids/tmpproducts',

        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
