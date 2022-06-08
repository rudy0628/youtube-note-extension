/*global chrome*/
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getData, sendData } from './store/note-slice';
import { authActions } from './store/auth-slice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Spinner, Button } from 'react-bootstrap';
import NoteList from './components/note/NoteList';
import NoteForm from './components/note/NoteForm';
import SignInForm from './components/signIn/SignInForm';
import MainLayout from './components/UI/Layout/MainLayout';

import 'bootstrap/dist/css/bootstrap.min.css';

let logoutTimer;
const calculateRemainingTime = expirationTime => {
	const currentDate = new Date().getTime();
	const expirationDate = new Date(expirationTime).getTime();

	const remainingTime = expirationDate - currentDate;

	return remainingTime;
};

const App = () => {
	const [currentTime, setCurrentTime] = useState('');
	const [currUrl, setCurrUrl] = useState('');
	const [permission, setPermission] = useState(true);

	const dispatch = useDispatch();
	const notes = useSelector(state => state.note.notes);
	const noteIsLoading = useSelector(state => state.note.isLoading);
	const isLogged = useSelector(state => state.auth.isLogged);
	const authIsLoading = useSelector(state => state.auth.isLoading);

	const [userId, setUserId] = useState('');
	const [expirationTime, setExpirationTime] = useState('');
	const [token, setToken] = useState('');

	/////////////////////// chrome tab ////////////////////////

	chrome.tabs.query({ active: true }, function (tabs) {
		const tab = tabs[0];

		// when tab open, get video current time
		chrome.scripting.executeScript(
			{
				target: { tabId: tab.id },
				func: () => {
					return document.querySelector('.ytp-time-current').textContent;
				},
			},
			injectionResults => {
				for (const result of injectionResults) {
					setCurrentTime(result.result);
				}
			}
		);

		// get local storage data
		chrome.scripting.executeScript(
			{
				target: { tabId: tab.id },
				func: () => {
					const userId = localStorage.getItem('userId');
					const expirationTime = localStorage.getItem('expirationTime');
					const token = localStorage.getItem('token');

					return { userId, expirationTime, token };
				},
			},
			injectionResults => {
				for (const result of injectionResults) {
					setUserId(result.result.userId);
					setExpirationTime(result.result.expirationTime);
					setToken(result.result.token);
				}
			}
		);

		// set tab url
		setCurrUrl(tab.url.slice(32, 43));
		setPermission(tab.url.includes('https://www.youtube.com/watch?v'));
	});

	//////////////////////// auth ////////////////////////
	// auto login
	useEffect(() => {
		if (currUrl && userId && expirationTime && token) {
			dispatch(
				authActions.login({
					expirationTime: expirationTime,
					userId: userId,
					token: token,
				})
			);

			// auto logout
			if (logoutTimer) clearTimeout(logoutTimer);
			const remainingTime = calculateRemainingTime(expirationTime);
			logoutTimer = setTimeout(() => {
				dispatch(authActions.logout());
			}, remainingTime);

			dispatch(getData(currUrl, userId, token));
		}
	}, [dispatch, currUrl, userId, expirationTime, token]);

	// update data or login get user data
	useEffect(() => {
		if (currUrl && userId && token) {
			dispatch(sendData(notes, currUrl, userId, token));
		}
	}, [dispatch, notes]);

	// logout
	const logoutHandler = () => {
		dispatch(authActions.logout());
	};

	if (!permission) {
		return (
			<p className="no-permission-text">No permission access this web page.</p>
		);
	}

	return (
		<MainLayout>
			<ToastContainer />
			{(noteIsLoading || authIsLoading) && (
				<div className="center">
					<Spinner animation="border" />
				</div>
			)}
			{!noteIsLoading && !authIsLoading && isLogged && (
				<React.Fragment>
					<Button
						className="btn-logout"
						onClick={logoutHandler}
						variant="primary"
					>
						Logout
					</Button>
					<NoteForm currUrl={currUrl} currentTime={currentTime} />
					<NoteList currUrl={currUrl} />
				</React.Fragment>
			)}
			{!noteIsLoading && !authIsLoading && !isLogged && <SignInForm />}
		</MainLayout>
	);
};

export default App;
