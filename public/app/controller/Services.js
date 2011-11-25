Ext.define('CloudHIS.controller.Services', {
    extend: 'Ext.app.Controller',
    
    stores: [
        'ServiceTreeStore',
        'Visit',
        'CategoriesTypesStore',
        'CategoryStore'
    ],
    models: ['Visit'],
    requires: [],
    
    init: function(){

    }


});