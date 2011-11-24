Ext.define('CloudHIS.store.DepartmentsStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.DepartmentsModel',
    proxy: {
        type: 'rest',
        url: '/departments',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: true
});