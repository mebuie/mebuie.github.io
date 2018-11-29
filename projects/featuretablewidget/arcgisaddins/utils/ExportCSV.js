//Export dgrid collection to CSV.
// TODO: Test subtypes and domains.
// TODO: Test date fields. 

//Modified from following example:
//https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
//http://jsbin.com/vinafojuqa/edit?html,output

define([
  'dojo/_base/declare',
], function (declare) {
  return declare([], {

    exportCSV: function (args , inputData) {
    var data, filename, link;
    var csv = this.convertArrayOfObjectsToCSV({
      data: inputData
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  },

  convertArrayOfObjectsToCSV: function (args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    console.log(data);
    if (data == null || !data.length) {
      return alert("No Selection Found");
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  })
})