import fs from 'fs';
import path from 'path';
import Pageres from 'pageres';

const getSiteList = () => {
	const siteList = fs.readdirSync(path.resolve(process.cwd(), '../site-list')).filter((file) => {
		return file.endsWith('.json');
	}).map((file) => {
		return {
			...JSON.parse(fs.readFileSync(path.join(process.cwd(), "../site-list/" + file)), 'utf8'),
			"json-file-name": file,
			"key": file.substring(0, file.length - 5)
		};
	});
	return siteList;
}

const getSiteStatus = (siteList) => {
	const statusKeys = fs.readdirSync(path.resolve(process.cwd(), '../status')).filter((file) => {
		return file.endsWith('.json');
	});
	for (let i in siteList) {
		if (statusKeys.includes(siteList[i]["json-file-name"])) {
			siteList[i] = {...siteList[i], ...JSON.parse(fs.readFileSync(path.join(process.cwd(), "../status/" + siteList[i]["json-file-name"])), 'utf8') };
		}else{
			siteList[i].status = "unknown";
		}
	}
	return siteList;
}


//Get site list
let siteList = getSiteList();
siteList = getSiteStatus(siteList);

let updateList = [];

for (let site of siteList){
	if (new Date() - site["screenshot-updated"] > 86400 && site.status != "down") {
		updateList.push(site);
	}
}

//Capture
(async () => {
	let browser = new Pageres({
			delay: 2,
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 ArgonBot',
			launchOptions: {args: ['--autoplay-policy=no-user-gesture-required']
	}}).dest("../screenshots");

	for (let site of updateList){
		browser.src(site.url, ['1920x1080'], {
			crop: true,
			filename: '../status/screenshots/' + site.key,
			script: `
				Date.prototype.getHours = () => {
					return 12;
				};
				document.documentElement.classList.remove("darkmode")
			;`
		});
		site["screenshot-updated"] = new Date();
		fs.writeFileSync(path.join(process.cwd(), "../status/" + site["json-file-name"]), JSON.stringify(site, null, '\t'));
	}

	await browser.run();

	console.log('Finished generating screenshots!');
})();