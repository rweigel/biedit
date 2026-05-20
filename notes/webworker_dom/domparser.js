// create DOMParser variable from xmldom
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

// necessary to create a standalone browserify version
module.exports = {
    DOMParser: DOMParser,
    XMLSerializer: XMLSerializer
}