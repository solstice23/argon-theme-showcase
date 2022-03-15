import crypto from 'crypto';

export const calcUAByDomain = (domain) => {
	const UAKey = process.env.UA_KEY ?? "";
	const extraCode = crypto.createHash('sha256').update(domain + UAKey).digest('hex').toLowerCase().substring(0, 16);
	return "ArgonBot " + extraCode;
}
