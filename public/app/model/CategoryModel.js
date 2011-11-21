Ext.define('CloudHIS.model.CategoryModel',{
    extend: 'Ext.data.Model',
    fields:[
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'categories_type_id', type: 'int'}
    ]

});
