import logo from "./logo.svg";
import "./css/App.scss";
import getSiteList from './sitelist';
import ShowcaseSection from './ShowcaseSection';

function App() {
	const [siteList, siteListThemeChanged] = getSiteList();
	console.log(siteList);
	return (
		<div className="App">
			<header className="header">
				Argon Theme Showcase
			</header>
			<main>
				<div className="container">
					<ShowcaseSection siteList={siteList}></ShowcaseSection>
				</div>
			</main>
		</div>
	);
}

export default App;
