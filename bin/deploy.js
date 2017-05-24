const request = require('request').defaults({jar: true});
const settings = require('../.apisettings.json');
const Horseman = require('node-horseman');
const page = new Horseman();

const HttpServer = require('http-server').HttpServer;

const svr = new HttpServer({
    root: './build'
});
svr.listen(8080, () => {
    page
        .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
        .on('error', console.error.bind(console, 'Error'))
        .open('http://localhost:8080')
        .wait(1000)
        .viewport(1920, 1080)
        .screenshot('./build/screenshot.png')
        .close()
        .then(() => {
            svr.close();
        });
});


// (new Promise((resolve, reject) => {
//     request.post(
//         {
//             url: 'https://app.roll20.net/sessions/create',
//             form: {
//                 email: settings.email,
//                 password: settings.pass
//             }
//         },
//         (err, resp, body) => {
//             if(err) {
//                 reject(err);
//             } else {
//                 resolve();
//             }
//         }
//     );
// })).then(() => {
//     request.post(
//         {
//             url: settings.link,
//             form: {
//                 name: 'Loader.js',
//                 content: 'log("stuff");'
//             }
//         },
//         (err, resp, body) => {
//             console.log('error:', err);
//             console.log('statusCode:', resp && resp.statusCode);
//             console.log('body:', body);
//         }
//     );
// });
/*
 axios.post(
 settings.link,
 {
 name: 'Loader.js',

 content: 'log("stuff");'
 },
 { headers: { 'Content-Type': 'multipart/form-data' } }
 ).then((res) => console.log(res.data), console.error.bind(console));
 */