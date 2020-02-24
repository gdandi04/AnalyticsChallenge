// Set up JDBC connection
    var presto = require('presto-stream-client');
    var client = new presto.Client({user: 'presto', host: '34.74.56.14', catalog: 'hive', schema: 'leap'});

var query = "SELECT json_extract_scalar(json, '$.substance.coding[0].code') AS Code, json_extract_scalar(json, '$.substance.text') AS Description " +
	"FROM allergyintolerance a " +
        "WHERE substr(json_extract_scalar(json, '$.patient.reference'), 10) " +
        "IN (SELECT json_extract_scalar(json, '$.id') " +
        "FROM patient p " + 
        "WHERE (json_extract_scalar(json, '$.name[0].family[0]') = 'Zboncak558' " +
        "AND json_extract_scalar(json, '$.name[0].given[0]') = 'Marshall526'))";

let execution = client.execute({
    query:   query,
    catalog: 'hive',
    schema:  'leap',
    objectMode: true,
    state:   function(error, query_id, stats){},
    columns: function(error, data){},
    data:    function(error, data, columns, stats){ console.log(data); },
    success: function(error, stats){},
    error:   function(error){ console.log('e', error) }
}).then((statement)=>{
   /* statement.on('columns',(columns)=>{  // [{name:"cnt",type:"bigint"}, {name:"usergroup",type:"varchar"}]
        console.log(columns);
    });*/
    statement.on('data',(row)=>{
        console.log(row); // {cnt:1234,usergroup:"admin"}
    });
    statement.on('end',()=>{
        console.log('done');
    });
},(error)=>{
    console.error(error);
});
