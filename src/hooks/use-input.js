import { useReducer } from 'react';

const initialInputState = {
	value: '',
	inputIsTouched: false,
};

const inputStateReducer = (state, action) => {
	if (action.type === 'INPUT') {
		return { value: action.value, inputIsTouched: state.inputIsTouched };
	}

	if (action.type === 'BLUR') {
		return { value: state.value, inputIsTouched: true };
	}

	if (action.type === 'RESET') {
		return { value: '', inputIsTouched: false };
	}
	return initialInputState;
};

const useInput = (validateInput, defaultValue = '') => {
	const [inputState, dispatch] = useReducer(inputStateReducer, {
		value: defaultValue,
		inputIsTouched: false,
	});

	const isValid = validateInput(inputState.value);
	const hasError = !isValid && inputState.inputIsTouched;

	const inputChangeHandler = e => {
		dispatch({ type: 'INPUT', value: e.target.value });
	};

	const inputBlurHandler = () => {
		dispatch({ type: 'BLUR' });
	};

	const reset = () => {
		dispatch({ type: 'RESET' });
	};

	return {
		value: inputState.value,
		isValid,
		hasError,
		inputChangeHandler,
		inputBlurHandler,
		reset,
	};
};

export default useInput;
