export const isNotEmpty = value => value.trim().length !== 0;
export const isEmail = value =>
	value.trim().length !== 0 && value.includes('@');
export const isPassword = value =>
	value.trim().length !== 0 && value.length >= 8 && value.length <= 16;
