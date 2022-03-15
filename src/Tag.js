import './css/Tag.scss';

const Tag = (props) => {
	return <div
		className={'tag ' + (props.className ?? "")}
		style={{
			backgroundColor: props.background ?? "#e1e4f9",
			color: props.color ?? "#2643e9" }}
		title={props.title}
	>{props.text}</div>
};

export default Tag;