Ext.Loader.setConfig({ enabled: true });

Ext.application({
    name: 'CloudHIS',
    appFolder: 'app',
    controllers: [
        'Main',
        'Users',
        'Services'
    ],
    launch: function() {
        Ext.create('CloudHIS.view.Viewport');
    }
});