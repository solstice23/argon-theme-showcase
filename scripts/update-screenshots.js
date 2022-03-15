import {getSiteListWithStatus, updateSiteStatus} from './sitelist.js';
import Pageres from 'pageres';

process.on('unhandledRejection', (reason, p) => {
	console.log('Promise: ', p, 'Reason: ', reason)
	process.exit(1);
})

//Get site list
let siteList = getSiteListWithStatus();

console.log(`Get ${siteList.length} sites.\n`);

let updateList = [];

console.log("Update list:");

for (let site of siteList){
	if (new Date() - new Date(site["screenshot-updated"]) > 86400 * 1000 && site.status != "down") {
		updateList.push(site);
		console.log(`${site.title} (${site.url})`);
	}
}


console.log("\nCapturing screenshots...");

//Capture
(async () => {
	let browser = new Pageres({
			delay: 3,
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 ArgonBot',
			launchOptions: {args: ['--autoplay-policy=no-user-gesture-required']
	}}).dest("../status/screenshots/");

	for (let site of updateList){
		browser.src(site.url, ['1920x1080'], {
			crop: true,
			filename: site.key,
			script: `
				Date.prototype.getHours = () => {
					return 12;
				};
				if ((darkmodeAutoSwitch || "time") != "alwayson") {
					document.documentElement.classList.remove("darkmode")
				}
			;`,
			delay: 2,
		});
		updateSiteStatus(site.key, {
			"screenshot-updated": new Date()
		});
	}

	await browser.run();

	console.log('Finished capturing screenshots!');
})();