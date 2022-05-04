import "./css/App.scss";
import getSiteList from './sitelist';
import Header from './Header';
import Background from './Background';
import ShowcaseSection from './ShowcaseSection';
import Footer from './Footer';
import FloatActionButton from './FloatActionButton';

function App() {
	const [siteList, siteListDown] = getSiteList();
	console.log(siteList);
	return (
		<div className="App">
			<Background />
			<Header />
			<main>
				<div className="container">
					<ShowcaseSection siteList={siteList}></ShowcaseSection>
					<ShowcaseSection title="已失效站点" siteList={siteListDown}></ShowcaseSection>
				</div>
			</main>
			<Footer siteCount={[...siteList, ...siteListDown].length}/>
			<FloatActionButton />
		</div>
	);
}

export default App;
