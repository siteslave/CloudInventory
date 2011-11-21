Ext.define('CloudHIS.controller.Users', {
   extend: 'Ext.app.Controller',

   views: [
      'user.List'           
   ],
   
   init: function() {
      this.control({
         'userlist': {
            itemdblclick: function(grid, record) {
               console.log(record.get('name'));
            }
         }   
      });
   }
});