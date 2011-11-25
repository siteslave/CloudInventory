Ext.define('CloudHIS.store.ReceivesStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.ReceivesModel',
    proxy: {
        type: 'rest',
        noCache: false,
        url: '/receives',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
