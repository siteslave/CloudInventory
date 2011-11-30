Ext.define('CloudHIS.model.AddProductsReceivesModel',{
    extend: 'Ext.data.Model',
    fields:[
        {name: 'id', type: 'int'},
        {name: 'product_id', type: 'int'},
        {name: 'name', type: 'string'},
        {name: 'code', type: 'string'},
        {name: 'price', type: 'double'},
        {name: 'qty', type: 'double'},
        {name: 'total', type: 'double'}
    ]

});
