import './css/SitePreviewCard.scss';
import Tag from './Tag';
import ProgressiveImage from 'react-progressive-image';
const getScreenshot = (key) => {
	try {
		require(`../status/screenshots/${key}.png`)
	} catch {
		return [
			require(`webpack-image-resize-loader!./static/no-preview.png?width=640&height=360&quality=100`),
			require(`webpack-image-resize-loader!./static/no-preview.png?width=96&height=54&quality=60`)
		];
	}
	return [
		require(`webpack-image-resize-loader!../status/screenshots/${key}.png?width=640&height=360&quality=100`),
		require(`webpack-image-resize-loader!../status/screenshots/${key}.png?width=96&height=54&quality=60`)
	];
};

const SitePreviewCard = (props) => {
	return <div className={`site-preview-card status-${props.site.status}`}>
		<a href={props.site.url} target="_blank" rel="noreferrer" className="site-preview-card-image">
			<ProgressiveImage
				src={getScreenshot(props.site.key)[0]}
				placeholder={getScreenshot(props.site.key)[1]}
				onDragStart={(e) => e.preventDefault()} >
				{(src, loading) => <img src={src} style={{ filter: loading ? "blur(16px)" : "none" }} alt="screenshot"/>}
			</ProgressiveImage>
		</a>
		<div className="site-preview-card-body">
			<div className="site-preview-card-title"><a href={props.site.url} target="_blank" rel="noreferrer">{props.site.title}</a></div>
			<div className="site-preview-card-description">{props.site.description}</div>
			<div className="site-preview-card-tags">
				{props.site?.info?.version && <Tag className="tag-color-mark" background={(props.site?.info?.themecolor ?? "#5e72e4")} title={"主题色 " + (props.site?.info?.themecolor ?? "#5e72e4")}/>}
				{props.site.status === "down" && <Tag background="#f9d3dd" color="#f80031" text="无法访问"  title="站点似乎宕机了 (Timeout、500 等)"/>}
				{props.site.status === "invalid" && <Tag background="#f9d3dd" color="#f80031" text="无法访问" title="站点似乎已不存在 (404、403 等)"/>}
				{props.site.status === "theme-changed" && <Tag background="#f9d3dd" color="#f80031" text="主题已更换" title="主题似乎已不是 Argon"/>}
				{props.site?.info?.version && <Tag text={"v" + props.site?.info?.version} title="主题版本"/>}
				{props.site?.info?.columns && <Tag text={["单栏", "双栏", "三栏"][props.site?.info?.columns - 1]} title="页面布局"/>}
			</div>
		</div>
	</div>;
};

export default SitePreviewCard;