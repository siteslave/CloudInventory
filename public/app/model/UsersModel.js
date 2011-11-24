Ext.define('CloudHIS.model.UsersModel',{
    extend: 'Ext.data.Model',
    fields:[
        {name: 'id', type: 'int'},
        {name: 'fullname', type: 'string'},
        {name: 'user_name', type: 'string'},
        {name: 'user_pass', type: 'string'},
        {name: 'active', type: 'string'},
        {name: 'department_id', type: 'string'},
        {name: 'department_name', type: 'string'},
        {name: 'last_login', type: 'date'}
    ]

});
