Ext.define('CloudHIS.store.PaidsMainStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.PaidsMainModel',
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
