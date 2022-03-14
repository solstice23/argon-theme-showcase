import './css/SitePreviewCard.scss';
import Tag from './Tag';
import ProgressiveImage from 'react-progressive-image';
const getScreenshot = (key) => {
	try {
		require(`../status/screenshots/${key}.png`)
	} catch {
		return require(`./static/no-preview.png`);
	}
	return [
		require(`webpack-image-resize-loader!../status/screenshots/${key}.png?width=640&height=360&quality=100`),
		require(`webpack-image-resize-loader!../status/screenshots/${key}.png?width=96&height=54&quality=60`)
	];
};
	
export default (props) => {
	return <div className="site-preview-card" style={{ opacity: props.site.status !== "fine" ? "0.4" : "1" }}>
		<a href={props.site.url} target="_blank">
			<ProgressiveImage
				src={getScreenshot(props.site.key)[0]}
				placeholder={getScreenshot(props.site.key)[1]}
				onDragStart={(e) => e.preventDefault()} >
				{(src, loading) => <img src={src} style={{ filter: loading ? "blur(16px)" : "none" }}/>}
			</ProgressiveImage>
		</a>
		<div className="site-preview-card-title"><a href={props.site.url} target="_blank">{props.site.title}</a></div>
		<div className="site-preview-card-description">{props.site.description}</div>
		<div className="site-preview-card-tags">
			<Tag text={["单栏", "双栏", "三栏"][(props.site?.info?.columns ?? 0) - 1]}/>
		</div>
		<a></a>
	</div>;
}