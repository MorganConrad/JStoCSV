/* eslint-disable no-restricted-syntax */
const DEFAULT_OPTIONS = {
  delimiter: ',',
  eol: '\n',
};


class Yajscsv {

  constructor(fields, options) {
    this.fields = fields;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  generateString(data) {
    return this.generateLines(data).join(this.options.eol);
  }

  generateLines(data) {
    if (!this.fields)
      this.fields = this._autoFields(data[0]);
    const lines = data.map((datum) => this._dataLine(datum));
    if (!this.options.noHeaderLine)
      lines.unshift(this._headerLine());
    return lines;
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
       let val = path ? Yajscsv.followPath(datum, ...path.split('.')) : datum;  // todo recur...
       if (field.fn)
         val = field.fn(val);
       return this._quoteValue(val);
    });

    return columns.join(this.options.delimiter);
  }

  _quoteValue(val) {
    let str = (val == null) ? '' : String(val);

    let mustBeQuoted = this.options.forceAllQuoted ||
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
}


module.exports = Yajscsv;
