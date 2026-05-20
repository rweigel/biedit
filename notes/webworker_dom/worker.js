// Import the bundled xmldom.DOMParser
importScripts('domparser_browserfied.js');

var DOMParser = xmldom.DOMParser;
var XMLSerializer = xmldom.XMLSerializer;

// Add event listener to webworker
self.addEventListener('message', function(e) {
    // Example taken from https://github.com/jindw/xmldom
    console.log("Worker got " + e.data);
    var doc = new DOMParser().parseFromString(e.data,'text/html');
    elements = doc.documentElement.getElementsByTagName('div');
    for(let i = 0;i < elements.length; i++) {
        elements[i].removeAttribute('lo');
    }
    data = new XMLSerializer().serializeToString(doc);
    self.postMessage(data);
  }, false);