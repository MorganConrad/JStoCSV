[![Build Status](https://secure.travis-ci.org/MorganConrad/JStoCSV.png)](http://travis-ci.org/MorganConrad/JStoCSV)
[![License](http://img.shields.io/badge/license-MIT-A31F34.svg)](https://github.com/MorganConrad/JStoCSV)
[![NPM Downloads](http://img.shields.io/npm/dm/jstocsv.svg)](https://www.npmjs.org/package/jstocsv)
[![Known Vulnerabilities](https://snyk.io/test/github/morganconrad/JStoCSV/badge.svg)](https://snyk.io/test/github/morganconrad/JStoCSV)
[![Coverage Status](https://coveralls.io/repos/github/MorganConrad/JStoCSV/badge.svg)](https://coveralls.io/github/MorganConrad/JStoCSV)

# JStoCSV
A small, dependency free module to convert an array of JavaScript objects to CSV.

## API

### JStoCSV(fields, options)   constructor
 - fields is usually an array of {}
   - path: route to get the data, e.g. "name" or "name.first"
   - label: label for header line (defaults to path)
 - fields may be an array of strings
   - if so, they are used for the path (and the header label)

If fields is not provided, will use all keys from the first data.
   
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
