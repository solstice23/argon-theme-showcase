import got from 'got';
import cheerio from 'cheerio';
import {calcUAByDomain} from './calc-ua.js';
import {getSiteListWithStatus, updateSiteStatus, deleteUnusedJson} from './sitelist.js';

const checkThemeIsArgon = (html) => {
	let keywords = ['argonConfig', 'argon_search_modal', 'argon-theme', 'float_action_buttons'];
	for (let keyword of keywords) {
		if (!html.includes(keyword)) {
			return false;
		}
	}
	return true;
}

const getExtraInfo = (html) => {
	const $ = cheerio.load(html);
	let extraInfo = {};
	//Theme version
	let themeVersion = $('meta[name="theme-version"]').attr('content');
	if (themeVersion) {
		extraInfo['version'] = themeVersion;
	}
	//Columns
	if ($('html').hasClass('single-column')) {
		extraInfo.columns = 1;
	}else if ($('html').hasClass('triple-column')) {
		extraInfo.columns = 3;
	}else{
		extraInfo.columns = 2;
	}
	//Waterflow
	const WaterflowColumns = (html.match(/waterflow_columns: ?"(.*?)",/) ?? [])[1] ?? '1';
	extraInfo.waterflow = WaterflowColumns;
	//Theme color
	extraInfo['themecolor'] = $('meta[name="theme-color"]').attr('content') ?? '#5e72e4';	
	return extraInfo;
}

const checkSite = async (site) => {
	console.log(`⌛ Checking ${site.title} (${site.url})`);
	let response;
	try {
		response = await got(site.url, {
			headers: {
				'User-Agent': calcUAByDomain(site.url),
			},
			method: 'GET',
			timeout: 5000
		});
	} catch (error) {
		//console.log(error);
		if (['ENOTFOUND', 'ERR_TLS_CERT_ALTNAME_INVALID'].includes(error.code) || (error?.response?.statusCode ?? 0) == 403 || (error?.response?.statusCode ?? 0) == 404) {
			console.log(`❌ ${site.title} (${site.url}) is invalid.`, error.code ?? error?.response?.statusCode);
			updateSiteStatus(site.key, {
				"status": "invalid",
				"status-updated": new Date()
			});
			return;
		}
		if (['ESOCKETTIMEDOUT', 'ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENETUNREACH', 'ETIMEDOUT'].includes(error.code) || (error?.response?.statusCode ?? 0) >= 500) {
			console.log(`❌ ${site.title} (${site.url}) is down.`, error.code ?? error?.response?.statusCode);
			updateSiteStatus(site.key, {
				"status": "down",
				"status-updated": new Date()
			});
			return;
		}
		console.log(`❌ ${site.title} (${site.url}) is down.`, error.code ?? error?.response?.statusCode);
		updateSiteStatus(site.key, {
			"status": "down",
			"status-updated": new Date()
		});
		return;
	}

	if (!checkThemeIsArgon(response.body)) {
		console.log(`❌ ${site.title} (${site.url}) is not an Argon site.`);
		updateSiteStatus(site.key, {
			"status": "theme-changed",
			"status-updated": new Date()
		});
		return;
	}

	console.log(`✅ ${site.title} (${site.url}) works fine.`);

	updateSiteStatus(site.key, {
		"status": "fine",
		"status-updated": new Date(),
		"info": getExtraInfo(response.body)
	});
} 

//Get site list
let siteList = getSiteListWithStatus();

console.log(`Get ${siteList.length} sites.\n`);

//Check every site
for (let site of siteList){
	if (new Date() - new Date(site['status-updated']) > 1800 * 1000){
		await checkSite(site);
	}
}

console.log("\nChecking finished.");


//Clear expired jsons
deleteUnusedJson();
