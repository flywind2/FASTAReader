var FASTAReader= require('../FASTAReader');
var test = require('./shinout.test');

var fpath = __dirname + '/sample.fasta';
var result = FASTAReader.parse(fpath);

var fs  = require('fs');
var fd = fs.openSync(fpath, 'r');


/* detect id test */
test('equal', Object.keys(result).length, 10, 'ids are not detected correctly.');

/* start position test */

console.log(result);
//process.exit();
Object.keys(result).forEach(function(id){
  var read = fs.readSync(fd, 1 + id.length, result[id].start);
  test('equal', read[0], '>' + id, 'invalid start position at ' + id);
});
test('result', 'start position test');


/* line length test */
Object.keys(result).forEach(function(id){
  var read = fs.readSync(fd, 1 + result[id].linelen, result[id].start + id.length +2);
  test('ok', read[0].match(/^[^\n]*\n$/), 'invalid line length at ' + id);
});
test('result', 'line length test');

/* get character test */
test('equal', FASTAReader.fetch(fpath, result.sample1, 1, 4), 'acta', 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample1, 51, 4), 'acta', 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample1, 50, 4), 'aact', 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample1, 49, 6), 'taacta', 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample1, 1, 600).length, 400, 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample4, 1, 8), 'aaaaaaaa', 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample4, 1, 333), 'aaaaaaaa', 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample4, 8, 1), 'a', 'invalid fetch result');
test('equal', FASTAReader.fetch(fpath, result.sample4, 9, 1), '', 'invalid fetch result');
test('result', 'line length test');
fs.closeSync(fd);

/* get start index, end index, end pos*/
var st = FASTAReader.fstartIndex(result.sample1);
var en = FASTAReader.fendIndex(result.sample1); 
test('equal', st, 12, 'invalid start index');
test('equal', en, 12 + 51*8, 'invalid end index');
test('equal', FASTAReader.fgetIndex(result.sample1, 1), st , 'invalid start index');
test('equal', FASTAReader.fgetIndex(result.sample1, 1), st , 'invalid end index');
test('equal', FASTAReader.fendPos(result.sample1), 400 , 'invalid end pos');
test('equal', FASTAReader.fendPos(result.sample2), 250 , 'invalid end pos');
test('equal', FASTAReader.fendPos(result.sample3), 19, 'invalid end pos');
test('equal', FASTAReader.fendPos(result.sample4), 8 , 'invalid end pos');

/* object test */

var fastas = new FASTAReader(fpath);
test('equal', fastas.fetch('sample1', 49, 6), 'taacta', 'invalid fetch result');
test('equal', fastas.fetch('sample4', 8, 1), 'a', 'invalid fetch result');
test('equal', fastas.getStartIndex('sample1'), 12, 'invalid getStartIndex result');
test('equal', fastas.getEndIndex('sample1'), 12 + 51*8, 'invalid getEndIndex result');
test('equal', fastas.getEndPos('sample1'), 400, 'invalid getEndPos result');
test('equal', fastas.getIndex('sample1', 53), 12 + 53 + 1 -1, 'invalid getIndex result');
test('result', 'object test');
