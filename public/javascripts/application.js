
Ext.onReady(function(){

  /*
   * ================  Iteration form  =======================
   */

  // Ext.getBody().createChild({tag: 'h2', html: 'Create An Iteration'});

  var iterationForm = new Ext.FormPanel({
      labelWidth: 75, // label settings here cascade unless overridden
      url:'save-form.php',
      frame:true,
      title: 'Create An Iteration',
      bodyStyle:'padding:5px 5px 0',
      width: 350,
      defaults: {width: 230},
      defaultType: 'textfield',

      items: [{
              fieldLabel: 'Name',
              name: 'name',
              allowBlank:false
          },{
              fieldLabel: 'Description',
              name: 'description'
          },{
              fieldLabel: 'Company',
              name: 'company'
          }, {
              fieldLabel: 'Email',
              name: 'email',
              vtype:'email'
          }, new Ext.form.TimeField({
              fieldLabel: 'Time',
              name: 'time',
              minValue: '8:00am',
              maxValue: '6:00pm'
          })
      ],

      buttons: [{
          text: 'Save'
      },{
          text: 'Cancel'
      }]
  });

  iterationForm.render(document.body);
})
