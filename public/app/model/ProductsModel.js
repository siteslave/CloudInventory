Ext.define('CloudHIS.model.ProductsModel',{
    extend: 'Ext.data.Model',
    fields:[
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'price', type: 'double'},
        {name: 'qty', type: 'double'},
        {name: 'category_id', type: 'int'},
        {name: 'category_name', type: 'string'},
        {name: 'unit_count_id', type: 'int'},
        {name: 'unit_count_name', type: 'string'}
    ]

});
