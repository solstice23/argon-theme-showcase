import SitePreviewCard from './SitePreviewCard.js';
import './css/ShowcaseSection.scss';

const ShowcaseSection = (props) => {
	if (props.siteList.length === 0) {
		return "";
	}
	return <div className="showcase-section">
		{props.title && <div className="showcase-section-title">{props.title}</div>}
		<div className="showcase-section-list">
			{
				props.siteList.map((site) =>
					<SitePreviewCard key={site.key} site={site} />
				)
			}
		</div>
	</div>;
};

export default ShowcaseSection;