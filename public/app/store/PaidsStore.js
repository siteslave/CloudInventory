Ext.define('CloudHIS.store.PaidsStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.PaidProductsModel',
    proxy: {
        type: 'rest',
        noCache: false,
        url: '/paids',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
