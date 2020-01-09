const test = require('tape');
const Yajscsv = require('../yajscsv.js');
const data = require('./data.js');
const spectrum = require('csv-spectrum');

const rawFields = [
  { path: "string" },
  { path: "number" },
  { path: "with comma" },
  { path: "with quotes" },
];

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
];


test('export rawFields', function(t) {
  let yajscsv = new Yajscsv(rawFields);
  let actualCSV = yajscsv.generateString(data.testObject);
  t.equals(actualCSV, data.testCSV.rawFields);

    t.end();
});


test('export labelledFields', function(t) {
  let yajscsv = new Yajscsv(labelledFields);
  let actualCSV = yajscsv.generateString(data.testObject);
  t.equals(actualCSV, data.testCSV.labelledFields);

  t.end();
});

test('export nestedFields', function(t) {
  let yajscsv = new Yajscsv(nestedFields);
  let actualCSV = yajscsv.generateString(data.testObject);
  t.equals(actualCSV, data.testCSV.nestedFields);

  t.end();
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
      console.log('testing ' + testData.name);
      let yajscsv = new Yajscsv(null, SPECTRUM_OPTS[testData.name]);
      let inJSON = JSON.parse(testData.json);
      let actualCSV = yajscsv.generateString(inJSON)+addSpectrumEOF(testData.name);
      let expected = testData.csv.toString().replace(/\r?\n|\r/g, '\n');
      if (testData.name === 'newlines_crlf')
        actualCSV = actualCSV.replace(/\r\n/, '\n');
      t.equals(actualCSV, expected);
    }

    t.end();
  })
});
