const request = require('request').defaults({jar: true});
const settings = require('../../.apisettings.json');

const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');
const PNGCrop = require('png-crop');

let width = 1750;
let gridWidth = 1600;
let height = 875;
let keyHeight = 270;

const zoom = 1.25;

width = Math.floor(width * zoom);
gridWidth = Math.floor(gridWidth * zoom);
height = Math.floor(height * zoom);
keyHeight = Math.floor(keyHeight * zoom);

const chrome = childProcess.spawn(
	settings.chrome,
	[
		'--headless',
		'--hide-scrollbars',
		'--remote-debugging-port=9222',
		'--disable-gpu',
		'--window-position=0,0',
		`--window-size=${width},${height}`,
		'--user-data-dir=' + path.join(__dirname, '../build/profile' )
	]
);

chrome.stdout.on('data', (data) => {
  console.log(`chrome stdout: ${data}`);
});

chrome.stderr.on('data', (data) => {
  console.log(`chrome stderr: ${data}`);
});

chrome.on('close', (code) => {
  console.log(`chrome process exited with code ${code}`);
});

const HttpServer = require('http-server').HttpServer;

const svr = new HttpServer({
    root: './build'
});
svr.listen(8080, () => {
	// Start the Chrome Debugging Protocol
	CDP(function(client) {
	  // Extract used DevTools domains.
	  const {DOM, Emulation, Network, Page, Runtime} = client;
	  
	  
	  const deviceMetrics = {
		width: width,
		height: height,
		deviceScaleFactor: 0,
		scale: zoom,
		mobile: false,
		fitWindow: false,
	  };

	  // Enable events on domains we are interested in.
	  Page.enable()
		.then(() => DOM.enable())
		.then(() => Network.enable())
		.then(() => Emulation.setDeviceMetricsOverride(deviceMetrics))
		.then(() => Emulation.setVisibleSize({width: width, height: height}))
		.then(() => Page.navigate({url: 'http://localhost:8080?party=0'}))
		.then(() => Page.loadEventFired(() => {
			setTimeout(function() {
			  Page.captureScreenshot({format: 'png', fromSurface: true}).then((screenshot) => {
				  const buffer = new Buffer(screenshot.data, 'base64');
				  PNGCrop.cropToStream(buffer, {width: gridWidth, height: height}, function(err, outputStream) {
					if (err) throw err;
					outputStream.pipe(fs.createWriteStream(path.join(__dirname, '../build/map.png')))
					.on('finish', () => {
					    PNGCrop.cropToStream(buffer, {left: gridWidth, width: (width - gridWidth), height: (keyHeight)}, function(err, outputStream) {
							if (err) throw err;
							outputStream.pipe(fs.createWriteStream(path.join(__dirname, '../build/key.png')))
							.on('finish', () => {
								fs.writeFile(path.join(__dirname, '../build/full.png'), buffer, 'base64', function(err) {
									if (err) {
									  console.error(err);
									}
									client.close();
									chrome.kill();
									process.exit();
								});
							});
						});
					});
				  });
			  });
			}, 1000);
		}));
	}).on('error', err => {
	  console.error('Cannot connect to browser:', err);
	  chrome.kill();
	  process.exit();
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