const testCSV = {
  labelledFields:
`STRING,number,WITH COMMA,WITH QUOTES
String1,1,"this, has, commas","This ""has ""quotes "
String2,2,"this, has, commas","This ""has ""quotes "
String3,31,"this, has, commas","This ""has ""quotes "
`,
  nestedFields:
`STRING,number,NESTED,NULLS,WITH QUOTES
String1,1,n1,,"This ""has ""quotes "
String2,2,n2,,"This ""has ""quotes "
String3,31,n3,,"This ""has ""quotes "
`,
  rawFields:
`string,number,with comma,with quotes
String1,1,"this, has, commas","This ""has ""quotes "
String2,2,"this, has, commas","This ""has ""quotes "
String3,31,"this, has, commas","This ""has ""quotes "
`
};

module.exports = testCSV;
