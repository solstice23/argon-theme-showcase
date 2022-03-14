import SitePreviewCard from './SitePreviewCard.js';
import './css/ShowcaseSection.scss';
export default (props) => {
	return <div className="showcase-section">
		{
			props.siteList.map((site) =>
				<SitePreviewCard key={site.key} site={site} />
			)
		}
	</div>;
}