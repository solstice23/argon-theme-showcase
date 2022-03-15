import fs from 'fs';
import path from 'path';
export const getSiteList = () => {
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

export const getSiteListWithStatus = (siteList = null) => {
	if (siteList == null) {
		siteList = getSiteList();
	}
	const statusKeys = fs.readdirSync(path.resolve(process.cwd(), '../status')).filter((file) => {
		return file.endsWith('.json');
	});
	let siteListWithStatus = [];
	for (let site of siteList) {
		if (statusKeys.includes(site["json-file-name"])) {
			siteListWithStatus.push({
				...site, ...JSON.parse(fs.readFileSync(path.join(process.cwd(), "../status/" + site["json-file-name"])), 'utf8')
			});
		} else {
			const defaultStatus = {
				"status": "unknown",
				"status-updated": new Date(0),
				"screenshot-updated": new Date(0)
			};
			siteListWithStatus.push({...site, ...defaultStatus});
			updateSiteStatus(site.key, defaultStatus);
		}
	}
	return siteListWithStatus;
}

export const updateSiteStatus = (key, newJson) => {
	let oldJson = {
		"status": "unknown",
		"status-updated": new Date(0),
		"screenshot-updated": new Date(0)
	};
	try {
		oldJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "../status/" + key + ".json"), 'utf8'));
	} catch (e) {}
	
	fs.writeFileSync(path.join(process.cwd(), "../status/" + key + ".json"), JSON.stringify({...oldJson, ...newJson}, null, '\t'));
}

export const deleteUnusedJson = () => {
	let siteFiles = fs.readdirSync('../site-list/');
	let statusFiles = fs.readdirSync('../status/');
	let screenshots = fs.readdirSync('../status/screenshots/');
	for (let statusFile of statusFiles) {
		if (!statusFile.endsWith('.json')) {
			continue;
		}
		if (!siteFiles.includes(statusFile)) {
			fs.unlinkSync('../status/' + statusFile);
			console.log("Delete unused " + statusFile);
		}
	}
	for (let screenshot of screenshots) {
		if (!siteFiles.includes(screenshot.replace('.png', '.json'))) {
			fs.unlinkSync('../status/screenshots/' + screenshot);
			console.log("Delete unused " + screenshot);
		}
	}
}