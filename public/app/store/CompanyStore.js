Ext.define('CloudHIS.store.CompanyStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.CompanyModel',

    proxy: {
        type: 'rest',
        noCache: false,
        url: '/companies',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: false
});
