import './css/Tag.scss';
	
export default (props) => {
	return <div className="tag" style={{ backgroundColor: props.color ?? "#5e72e4" }}>{props.text}</div>
}