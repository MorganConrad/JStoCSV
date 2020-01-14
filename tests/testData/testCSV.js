const testCSV = {
  labelledFields:
`STRING,number,WITH COMMA,WITH QUOTES
String1,1,"this, has, commas","This ""has ""quotes "
String2,2,"this, has, commas","This ""has ""quotes "
String3,31,"this, has, commas","This ""has ""quotes "
`,
  nestedFields:
`STRING,number,NESTED,NULLS,WITH QUOTES, ARRAY[1]
String1,1,n1,,"This ""has ""quotes ",101
String2,2,n2,,"This ""has ""quotes ",201
String3,31,n3,,"This ""has ""quotes ",301
`,
  rawFields:
`string,number,with comma,with quotes
String1,1,"this, has, commas","This ""has ""quotes "
String2,2,"this, has, commas","This ""has ""quotes "
String3,31,"this, has, commas","This ""has ""quotes "
`,
  userFn:
`STRING,number,WITH COMMA,WITH QUOTES,difference
String1,1,"this, has, commas","This ""has ""quotes ",1
String2,2,"this, has, commas","This ""has ""quotes ",1
String3,31,"this, has, commas","This ""has ""quotes ",29
`
};

module.exports = testCSV;
