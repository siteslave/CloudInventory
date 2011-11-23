Ext.define('CloudHIS.store.UnitCountStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.UnitCountModel',
    storeId: 'UnitCountStore',

    proxy: {
        type: 'rest',
        url: '/unit_count',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: true
});
