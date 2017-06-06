
let test = 'I am test';
let request = require('request');
// sync
new Promise((resolve, reject) => {
    request({
        url: process.argv[2],//'http://www.boohee.com/shiwu/mantou_junzhi',
        method: 'get'
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
        //    resolve(res.statusCode + ' ok!');
         resolve(body);
        } else {
            reject(' error - -');
        }
    });
}).then(result => {
    test = result;
    console.log( test);//"outside request: " +
}).catch(err => {
    console.log("error: " + err);
});



