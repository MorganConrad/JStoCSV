const testObject =
[
  {
    "string": "String1",
    "number": 1,
    "with comma": "this, has, commas",
    "with quotes": "This \"has \"quotes ",
    nested : {
      value: "n1"
    }
  },
  {
    "string": "String2",
    "number": 2,
    "with comma": "this, has, commas",
    "with quotes": "This \"has \"quotes ",
    nested : {
      value: "n2"
    }
  },
  {
    "string": "String3",
    "number": 31,
    "with comma": "this, has, commas",
    "with quotes": "This \"has \"quotes ",
    nested : {
      value: "n3"
    }
  }
];


const testCSV = {
  rawFields:
`string,number,with comma,with quotes
String1,1,"this, has, commas","This ""has ""quotes "
String2,2,"this, has, commas","This ""has ""quotes "
String3,31,"this, has, commas","This ""has ""quotes "`,
  labelledFields:
`STRING,number,WITH COMMA,WITH QUOTES
String1,1,"this, has, commas","This ""has ""quotes "
String2,2,"this, has, commas","This ""has ""quotes "
String3,31,"this, has, commas","This ""has ""quotes "`,
  nestedFields:
`STRING,number,NESTED,NULLS,WITH QUOTES
String1,1,n1,,"This ""has ""quotes "
String2,2,n2,,"This ""has ""quotes "
String3,31,n3,,"This ""has ""quotes "`,
}


module.exports = { testObject, testCSV };
