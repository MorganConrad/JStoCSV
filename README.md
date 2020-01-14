[![Build Status](https://secure.travis-ci.org/MorganConrad/JStoCSV.png)](http://travis-ci.org/MorganConrad/JStoCSV)
[![License](http://img.shields.io/badge/license-MIT-A31F34.svg)](https://github.com/MorganConrad/JStoCSV)
[![NPM Downloads](http://img.shields.io/npm/dm/jstocsv.svg)](https://www.npmjs.org/package/jstocsv)
[![Known Vulnerabilities](https://snyk.io/test/github/morganconrad/JStoCSV/badge.svg)](https://snyk.io/test/github/morganconrad/JStoCSV)
[![Coverage Status](https://coveralls.io/repos/github/MorganConrad/JStoCSV/badge.svg)](https://coveralls.io/github/MorganConrad/JStoCSV)

# JStoCSV
A small, versatile, dependency free module to convert an array of JavaScript objects to CSV.

 - Handles basic nesting, _e.g._ `field.nested.inAnother` or `myArray[4]`
 - Support alternative delimiters (_e.g._ TAB delimted) and end of lines.
 - Powerful user function option for "tricky stuff".

## Usage

```js
const labelledFields = [
  { path: "name.given", label: "First Name" },  // example of nested data
  { path: "name.surname", label: "Last Name" }
  { path: "birth_day", label: "Date of Birth" },
...
];

data = [
 { name: { given: "John", surname: "Doe" }, birth_day: "06 March 2003" },
  ...
]

const jstocsv = new JStoCSV(labelledFields);
jstocsv.stream(data, someWriteableStream); // or
jstocsv.generateString(data);

Output / Result
First Name,Last Name,Date of Birth
John,Doe, 06 March 2003
...
```

## API

### JStoCSV(fields, options)   constructor
 - fields is usually an array of {}
   - path: usually a string, route to get the data, e.g. "name" or "name.first"
    - to retrieve data from arrays, pass an array, _e.g._ ["myArray", 3]
   - label: label for header line (defaults to path)
   - fn: user function to apply afterwards (usually null, see Notes at end)

 - fields may be an array of strings
   - if so, they are used for the path (and the header label)

If fields is not provided, JStoCSV will use all keys from the first data value.

 - options
   - delimiter     you can use '\t' etc.  defaults to ','
   - eol           defaults to '\n'
   - quoteEmpties  put quotes around all empty fields
   - quoteAll      put quotes around all fields
   - noHeaderLine  don't write out a header line

### generateLines(data)
Creates an array of Strings, one per line of the CSV file.
  - data is an array of objects.

### generateString(data, appendEOL)
Joins the lines with the eol character.
  - data is an array of objects.
  - appendEOL  at end (default is false)

Both of those require that all the CSV file fit in memory.  If your data is huge, consider

### stream(data, writeStream)
 - data is an array of objects.
 - writeStream   **note:** caller must end() or close() etc...

For the ultimate in control
### reduce(data, reducer, acc)
 - data is an array of objects
 - reducer(acc, line) called for each line in the csv file
 - acc   the initial accumulator

For convenience, you can use (see tests)
 - _stringReducer();
 - _streamReducer()

### Notes, Todos, and  Caveats

#### Supplying a user function `fn` in `fields`

This module is short because it just does the basics for output.  If you need to "do something very special", supply a user function `fn` to `fields`.  For each value, it will be called with

`fn(value, datum, index, array)`
 - **value** is the value within datum (as determined by path)
 - **datum** is the object in the data array
 - **index** is the 0-based index of the object within the data array
 - **array** is the full data array

For example, in the unit test "userfn", we generate an artificial column based on the difference between successive values in the field `.number`, via

```js
fn: function(val, datum, index, array) {
  return index ? val-array[index-1].number : val;
}
```

#### Caveats

 - The `_quoteValue()` method is pretty basic.  Pathological data may break it.
 - a new field, `.splitpath`, will be added to each of the fields you pass in.

### Alternatives.  Most are larger.

#### [json-csv](https://www.npmjs.com/package/json-csv)
 - works very similarly, even has a user function (caller "filter") but less versatile

#### [simple-csv-writer](https://www.npmjs.com/package/simple-csv-writer-csv-writer)
 - works with arrays of **arrays** (not objects)

#### [csv-writer](https://github.com/ryu1kn/csv-writer)
 - looks good but more complex.

#### [fast-csv](https://www.npmjs.com/package/fast-csv)
 - looks powerful
 - the headers are confusing
