/*global chrome*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/index';

chrome.tabs.query({ active: true }, function (tabs) {
	const tab = tabs[0];

	if (tab.url.includes('https://www.youtube.com/watch?v')) {
		// when tab open, video click(pause)
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: () => {
				document.querySelector('#movie_player').click();
			},
		});
	}
});

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
