Ext.define('CloudHIS.store.UsersStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.UsersModel',
    storeId: 'UsresStore',
    proxy: {
        type: 'rest',
        noCache: false,
        url: '/users',
        reader: {
            type: 'json',
            root: 'rows',
            idProperty: 'id',
            successProperty: 'success'
        }
    },
    autoLoad: true
});