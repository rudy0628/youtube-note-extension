import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useInput from '../../hooks/use-input';
import { isNotEmpty, isEmail, isPassword } from '../../config/validators';
import { sendUserData } from '../../store/auth-slice';

import { Form, Button } from 'react-bootstrap';
import { BiErrorCircle } from 'react-icons/bi';

const SignInForm = () => {
	// [LOGIN, SIGNUP, FIND]
	const [inputType, setInputType] = useState('LOGIN');
	const dispatch = useDispatch();

	const inputReset = () => {
		emailReset();
		passwordReset();
		nameReset();
	};

	const {
		value: emailValue,
		isValid: emailIsValid,
		hasError: emailHasError,
		inputChangeHandler: emailChangeHandler,
		inputBlurHandler: emailBlurHandler,
		reset: emailReset,
	} = useInput(isEmail);
	const {
		value: passwordValue,
		isValid: passwordIsValid,
		hasError: passwordHasError,
		inputChangeHandler: passwordChangeHandler,
		inputBlurHandler: passwordBlurHandler,
		reset: passwordReset,
	} = useInput(isPassword);
	const {
		value: nameValue,
		isValid: nameIsValid,
		hasError: nameHasError,
		inputChangeHandler: nameChangeHandler,
		inputBlurHandler: nameBlurHandler,
		reset: nameReset,
	} = useInput(isNotEmpty);

	let formIsValid;
	if (inputType === 'FIND') {
		formIsValid = emailIsValid;
	} else if (inputType === 'SIGNUP') {
		formIsValid = emailIsValid && passwordIsValid && nameIsValid;
	} else if (inputType === 'LOGIN') {
		formIsValid = emailIsValid && passwordIsValid;
	}

	const changeAuthModeHandler = () => {
		if (inputType === 'LOGIN') {
			setInputType('SIGNUP');
		} else {
			setInputType('LOGIN');
		}

		inputReset();
	};

	const forgetPasswordHandler = () => {
		setInputType('FIND');
		inputReset();
	};

	const submitHandler = e => {
		e.preventDefault();

		if (!formIsValid) return;

		dispatch(sendUserData(emailValue, passwordValue, nameValue, inputType));

		inputReset();
	};

	// login form text
	let headerText, formBtnText, changeModeText;
	if (inputType === 'LOGIN') {
		headerText = 'Sign In';
		formBtnText = 'Login';
		changeModeText = "Haven't account? Create Here!";
	} else if (inputType === 'SIGNUP') {
		headerText = 'Sign Up';
		formBtnText = 'Submit';
		changeModeText = 'Have account? Sign In!';
	} else {
		headerText = 'Find Password';
		formBtnText = 'Send Email';
		changeModeText = 'Have account? Sign In!';
	}

	return (
		<Form onSubmit={submitHandler}>
			<h2>{headerText}</h2>
			<Form.Group className="mb-3">
				<Form.Label>Email</Form.Label>
				<Form.Control
					value={emailValue}
					onChange={emailChangeHandler}
					onBlur={emailBlurHandler}
					type="email"
					placeholder="name@example.com"
					className="mb-2"
				/>
				{emailHasError && (
					<p className="error-text">
						<BiErrorCircle className="error-text__icon" />
						Invalid email
					</p>
				)}
			</Form.Group>
			{inputType !== 'FIND' && (
				<Form.Group className="mb-3">
					<Form.Label>Password</Form.Label>
					<Form.Control
						value={passwordValue}
						onChange={passwordChangeHandler}
						onBlur={passwordBlurHandler}
						type="password"
						placeholder="8 ~ 16 characters"
						className="mb-2"
					/>
					{passwordHasError && (
						<p className="error-text">
							<BiErrorCircle className="error-text__icon" />
							Invalid password
						</p>
					)}
				</Form.Group>
			)}
			{inputType === 'SIGNUP' && (
				<Form.Group className="mb-3">
					<Form.Label>Name</Form.Label>
					<Form.Control
						value={nameValue}
						onChange={nameChangeHandler}
						onBlur={nameBlurHandler}
						type="text"
						placeholder="username"
						className="mb-2"
					/>
					{nameHasError && (
						<p className="error-text">
							<BiErrorCircle className="error-text__icon" />
							Invalid name
						</p>
					)}
				</Form.Group>
			)}
			<Button
				type="submit"
				className="mb-2"
				variant="primary"
				disabled={!formIsValid}
			>
				{formBtnText}
			</Button>
			<br />
			<Button onClick={changeAuthModeHandler} variant="link">
				{changeModeText}
			</Button>
			{inputType !== 'FIND' && (
				<Button onClick={forgetPasswordHandler} variant="link">
					Find Password
				</Button>
			)}
		</Form>
	);
};

export default SignInForm;
