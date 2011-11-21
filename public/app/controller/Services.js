Ext.define('CloudHIS.controller.Services', {
    extend: 'Ext.app.Controller',
    
    stores: [
        'ServiceTreeStore',
        'Visit',
        'CategoriesTypesStore',
        'CategoryListStore'
    ],
    models: ['Visit'],
    requires: [],
    
    init: function(){

    }


});