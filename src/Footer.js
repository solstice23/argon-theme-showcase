import './css/Footer.scss';
import preval from 'preval.macro'
const Footer = (prop) => {
	return (
		<footer>
			<div className="container">
				<div className="row">
					Build Time: {new Date(preval`module.exports = + new Date()`).toLocaleString()}
				</div>
				<div className="row">
					Total {prop.siteCount} Sites
				</div>
			</div>
		</footer>
	);
};

export default Footer;