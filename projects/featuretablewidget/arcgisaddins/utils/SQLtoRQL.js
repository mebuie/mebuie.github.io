define([
  'dojo/_base/declare',
], function (declare) {
  return declare([], {

    convert: function (input) {
      var rql = input
      // TODO: and should only be replaced when after and operator.
      var regex = new Map([
        [/\s/g,'']
        // [/ AND /g, '&'],
      ])

      regex.forEach(function(value, key){
        rql = rql.replace(key, value)
      });

      console.log('Filter text converted to: ', rql)
      return rql
    }
  })
})



