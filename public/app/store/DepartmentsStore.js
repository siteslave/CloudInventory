Ext.define('CloudHIS.store.DepartmentsStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.DepartmentsModel',
    proxy: {
        type: 'rest',
        noCache: false,
        api: {
            read: '/department',
            update: '/department',
            destroy: '/department'
        },
        reader: {
            type: 'json',
            root: 'rows',
            idProperty: 'id',
            successProperty: 'success'
        },
        writer: {
            type: 'json',
            root: 'departments'
        }
    },
    autoLoad: true,
    autoSync: true,
    batch: true
});