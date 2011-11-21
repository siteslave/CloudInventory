Ext.define('CloudHIS.store.CategoriesTypesStore', {
    extend: 'Ext.data.Store',
    model: 'CloudHIS.model.CategoriesTypesModel',
    proxy: {
        type: 'rest',
        url: '/categorytype',
        reader: {
            type: 'json',
            root: 'rows',
            successProperty: 'success'
        }
    },
    autoLoad: true
});