var Dropbox = require('dropbox');
var FileReader = require('filereader');
fs = require('fs');

var dbx = new Dropbox({
  accessToken: 'TFZcuhg5fr4AAAAAAAAWxec1U7jnfS_4sBwYbgGx5qB00rVwKUZmDXOHlzjP4U_n'
});
dbx.filesListFolder({
  path: ''
}).then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error);
});

dbx.filesDownload({
  path: '/test.txt'
}).then(function (response) {
  console.log(Object.keys(response));

  fs.writeFile('test.txt', response.fileBinary, 'utf8', function (err) {
    if (err) {
      console.log('ERROR');
    } else {
      console.log('Success!');
    }
  });

  // var reader = new FileReader();
  // reader.addEventListener('loadend', function () {
  //   fs.writeFileSync('./test.txt', Buffer.from(new Uint8Array(blob)));
  // });
  //reader.readAsText(blob);

}).catch(function (error) {
  console.log(error);
});