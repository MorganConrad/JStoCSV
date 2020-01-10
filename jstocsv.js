const DEFAULT_OPTIONS = {
  delimiter: ',',
  eol: '\n',
};


class JStoCSV {

  constructor(fields, options) {
    if (fields && !fields[0].path) // passed an array of strings
      fields = fields.map((path) => { return { path } });
    this.fields = fields;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  generateString(data, appendEOL) {
    let s = this.generateLines(data).join(this.options.eol);
    if (appendEOL)
      s += this.options.eol;
    return s;
  }

  generateLines(data) {
    if (!this.fields)
      this.fields = this._autoFields(data[0]);
    const lines = data.map((datum) => this._dataLine(datum));
    if (!this.options.noHeaderLine)
      lines.unshift(this._headerLine());
    return lines;
  }


  reduce(data, reducer, acc) {

    if (!this.options.noHeaderLine)
      acc = reducer(acc, this._headerLine());
    data.forEach((datum) => {
      acc = reducer(acc, this._dataLine(datum));
    });

    return acc;
  }

  stream(data, writeStream) {
    return this.reduce(data, this._streamReducer(), writeStream);
  }


  _autoFields(data) {
    return Object.keys(data).map(function(key) {
      return { path: key };
    } );
  }

  _headerLine() {
    let fieldLabels = this.fields.map((field) => this._quoteValue(field.label || field.path));
    return fieldLabels.join(this.options.delimiter);
  }

  _dataLine(datum) {
    let columns = this.fields.map((field) => {
       let path = field.path;
       let val = path ? JStoCSV.followPath(datum, ...path.split('.')) : datum;  // todo recur...
       if (field.fn)
         val = field.fn(val);
       return this._quoteValue(val);
    });

    return columns.join(this.options.delimiter);
  }

  _quoteValue(val) {
    let str = (val == null) ? '' : String(val);

    let mustBeQuoted = this.options.quoteAll ||
                         (this.options.quoteEmpties && !str.length) ||
                         str.includes('"') || str.includes(this.options.delimiter) || str.includes(this.options.eol);

    return (mustBeQuoted) ? '"' + str.replace(/\"/g, '""') + '"' : str;
  }

  static followPath(datum, ...path) {
    return path.reduce(
      function(prev, cur) {
        return prev ? prev[cur] : null;
      }, datum);
  }

  _stringReducer(eol = this.options.eol) {
    return function(acc, line) {
      acc += (line + eol);
      return acc;
    }
  }

  _streamReducer(eol = this.options.eol) {
    return function(acc, line) {
      acc.write(line + eol);
      return acc;
    }
  }
}


module.exports = JStoCSV;
