const getSiteList = () => {
	// Get all jsons
	let context = require.context('../site-list', true, /\.(json)$/);
	let siteList = [];
	context.keys().forEach((filename) => {
		siteList.push({
			...context(filename),
			"json-file-name": filename.substr(2),
			"key": filename.substr(2).substr(0, filename.substr(2).length - 5)
		});
	});

	// Read site status
	context = require.context('../status', true, /\.(json)$/);
	const statusKeys = context.keys();
	for (let i in siteList) {
		if (statusKeys.includes("./" + siteList[i]["json-file-name"])) {
			siteList[i] = {...siteList[i], ...context("./" + siteList[i]["json-file-name"]) };
		}else{
			siteList[i].status = "unknown";
		}
	}

	// Sort
	siteList = siteList.sort((a, b) => {
		if ((a.priority ?? 0) !== (b.priority ?? 0)) return ((a.priority ?? 0) < (b.priority ?? 0) ? 1 : -1);
		if (a.status === b.status) return a.title.localeCompare(b.title);
		else {
			const a_level = ["theme-changed", "invalid", "unknown", "down", "fine"].indexOf(a.status);
			const b_level = ["theme-changed", "invalid", "unknown", "down", "fine"].indexOf(b.status);
			return (a_level < b_level ? 1 : -1);
		}
	});

	// Filter out "fine" status
	const siteListDown = siteList.filter((site) => {
		return site.status !== "fine";
	});
	siteList = siteList.filter((site) => {
		return site.status === "fine";
	});

	return [siteList, siteListDown];
};

export default getSiteList;