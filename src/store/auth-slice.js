/*global chrome*/
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { toastStyle } from '../config/toastStyle';

const authInitialState = {
	userId: '',
	token: '',
	isLogged: false,
	isLoading: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState: authInitialState,
	reducers: {
		login(state, action) {
			state.isLogged = true;
			state.userId = action.payload.userId;
			state.token = action.payload.token;

			chrome.tabs.query({ active: true }, function (tabs) {
				const tab = tabs[0];

				// set login userId and expirationTime in local storage
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					func: (userId, expirationTime, token) => {
						localStorage.setItem('userId', userId);
						localStorage.setItem('expirationTime', expirationTime);
						localStorage.setItem('token', token);
					},
					args: [
						action.payload.userId,
						action.payload.expirationTime,
						action.payload.token,
					],
				});
			});
		},
		logout(state) {
			state.isLogged = false;
			state.userId = '';

			chrome.tabs.query({ active: true }, function (tabs) {
				const tab = tabs[0];
				// delete userId and expirationTime in local storage
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					func: () => {
						localStorage.removeItem('userId');
						localStorage.removeItem('expirationTime');
						localStorage.removeItem('token');
					},
				});
			});

			toast.success('GoodBye!', toastStyle);
		},
		setIsLoading(state, action) {
			state.isLoading = action.payload;
		},
	},
});

export const sendUserData = (
	email,
	password = '',
	username = '',
	inputType
) => {
	return async dispatch => {
		// check inputType to different url
		let url;
		if (inputType === 'LOGIN') {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_PRJ_ID}';
		} else if (inputType === 'SIGNUP') {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_PRJ_ID}';
		} else if (inputType === 'FIND') {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={FIREBASE_PRJ_ID}';
		}

		// set different send body for different input type
		let sendBodyData;
		if (inputType === 'FIND') {
			sendBodyData = {
				requestType: 'PASSWORD_RESET',
				email: email,
			};
		} else if (inputType === 'SIGNUP') {
			sendBodyData = {
				displayName: username,
				email: email,
				password: password,
				returnSecureToken: true,
			};
		} else if (inputType === 'LOGIN') {
			sendBodyData = {
				email: email,
				password: password,
				returnSecureToken: true,
			};
		}

		try {
			dispatch(authActions.setIsLoading(true));

			const response = await fetch(url, {
				method: 'POST',
				body: JSON.stringify(sendBodyData),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (response.ok) {
				// if type equals find
				if (inputType === 'FIND') {
					toast.success('Password reset send to your email', toastStyle);
					return;
				}

				const expirationTime = new Date(
					new Date().getTime() + +data.expiresIn * 1000
				);

				dispatch(
					authActions.login({
						expirationTime: expirationTime.toISOString(),
						userId: data.localId,
						token: data.idToken,
					})
				);

				toast.success(`Welcome, ${data.displayName}`, toastStyle);
			} else {
				throw new Error(data.error.message);
			}

			dispatch(authActions.setIsLoading(false));
		} catch (e) {
			toast.error(e.message, toastStyle);
			dispatch(authActions.setIsLoading(false));
		}
	};
};

export default authSlice;
export const authActions = authSlice.actions;
