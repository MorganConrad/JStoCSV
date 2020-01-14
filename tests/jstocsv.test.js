const test = require('tape');
const fs = require('fs');
const JStoCSV = require('../jstocsv.js');
const testObject = require('./testData/testObject.js');
const testCSV = require('./testData/testCSV.js');
const CountingStream = require('./countingStream');
const spectrum = require('csv-spectrum');

const rawFields = ["string","number","with comma","with quotes"];

const labelledFields = [
  { path: "string", label: "STRING" },
  { path: "number" },    // deliberately left no label
  { path: "with comma", label: "WITH COMMA" },
  { path: "with quotes", label: "WITH QUOTES" },
];

const nestedFields = [
  { path: "string", label: "STRING" },
  { path: "number" },    // deliberately left no label
  { path: "nested.value", label: "NESTED" },
  { path: "nested.x.y", label: "NULLS" },
  { path: "with quotes", label: "WITH QUOTES" },
  { path: "arrayData.1", label: " ARRAY[1]" }
];


test('mytests', function(t) {
  let jstocsv = new JStoCSV(rawFields);
  let actualCSV = jstocsv.generateString(testObject) + "\n";
  t.equals(actualCSV, testCSV.rawFields, "rawFields");

  labelledFields.length = 4;
  jstocsv = new JStoCSV(labelledFields);
  actualCSV = jstocsv.generateString(testObject, true);
  t.equals(actualCSV, testCSV.labelledFields, "labelledFields");

  jstocsv = new JStoCSV(nestedFields);
  actualCSV = jstocsv.generateString(testObject) + "\n";
  t.equals(actualCSV, testCSV.nestedFields, "nestedFields");

  actualCSV = jstocsv.reduce(testObject, jstocsv._stringReducer(), "");
  t.equals(actualCSV, testCSV.nestedFields, "reduce.nestedFields");
  t.end();
});

test('writeStream', function(t) {
  let cs = new CountingStream();
  let jstocsv = new JStoCSV(rawFields);
 // let reducerInfo = jstocsv.streamReducer(cs);
  jstocsv.stream(testObject, cs);
  cs.end(() => {
    t.equals(cs.bytesWritten, 197);
    t.equals(cs.lines, 4);
    t.end();
  });
});


test("userfn", function(t) {
  labelledFields.push( {
    path: "number", label: "difference",
    fn: function(val, datum, index, array) {
       return index? val-array[index-1].number : val;
    }
  });
  let jstocsv = new JStoCSV(labelledFields);
  let actualCSV = jstocsv.generateString(testObject) + "\n";
  t.equals(actualCSV, testCSV.userFn, "userFn");
  t.end()
});


const SPECTRUM_OPTS = {
  comma_in_quotes: { quoteEmpties: true },
  empty_crlf: { quoteEmpties: true },
  empty: { quoteEmpties: true },
}


const SPECTRUM_ADDS_EOF = [
  'escaped_quotes',
  'json',
  'newlines',
  'simple_crlf',
  'simple',
  'quotes_and_newlines',
  'newlines_crlf'
];

function addSpectrumEOF(testName) {
  return SPECTRUM_ADDS_EOF.includes(testName) ? '\n' : '';
}

test('spectrum', function(t) {
  spectrum(function(err, sdata) {
    for (let testData of sdata) {
      let jstocsv = new JStoCSV(null, SPECTRUM_OPTS[testData.name]);
      let inJSON = JSON.parse(testData.json);
      let actualCSV = jstocsv.generateString(inJSON)+addSpectrumEOF(testData.name);
      let expected = testData.csv.toString().replace(/\r?\n|\r/g, '\n');
      if (testData.name === 'newlines_crlf')
        actualCSV = actualCSV.replace(/\r\n/, '\n');
      t.equals(actualCSV, expected, testData.name);
    }

    t.end();
  })
});
