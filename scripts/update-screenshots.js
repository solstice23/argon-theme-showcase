import {getSiteListWithStatus, updateSiteStatus} from './sitelist.js';
import {calcUAByDomain} from './calc-ua.js';
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

	for (let site of updateList){
		let browser = new Pageres({
				delay: 3,
				launchOptions: {args: ['--autoplay-policy=no-user-gesture-required']
		}}).dest("../status/screenshots/");
		browser.src(site.url, ['1920x1080'], {
			crop: true,
			filename: site.key,
			userAgent: calcUAByDomain(site.url),
			script: `
				Date.prototype.getHours = () => {
					return 12;
				};
				if ((darkmodeAutoSwitch || "time") != "alwayson") {
					document.documentElement.classList.remove("darkmode")
				}
			;`,
			delay: 3,
		});
		await browser.run()
			.catch(error => console.log(error.message))
			.then(() => {
				console.log(`✅ ${site.title} (${site.url}) screenshot updated.`);
				updateSiteStatus(site.key, "screenshot-updated", new Date());
			});
	}

	console.log('Finished capturing screenshots!');
	process.exit(0);
})();
