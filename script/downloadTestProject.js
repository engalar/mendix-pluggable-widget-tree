var file_url = 'https://github.com/engalar/mendix-testproject-960/archive/refs/heads/master.zip';

var AdmZip = require('adm-zip');
var request = require('request');

request.get({ url: file_url, encoding: null }, (err, res, body) => {
  var zip = new AdmZip(body);
  zip.extractAllTo("./tests/testProject/", true);
});