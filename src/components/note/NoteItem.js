/*global chrome*/
import React from 'react';
import { useDispatch } from 'react-redux';
import { noteActions } from '../../store/note-slice';
import { toast } from 'react-toastify';
import { toastStyle } from '../../config/toastStyle';

import { ListGroup, Button, Stack } from 'react-bootstrap';

const NoteItem = props => {
	const dispatch = useDispatch();
	const timeArr = props.note.split(' ')[0].split(':');
	const time = +timeArr[0] * 60 + +timeArr[1];

	const deleteNoteHandler = () => {
		try {
			dispatch(
				noteActions.deleteNote({
					id: props.id,
				})
			);
			toast.success('Delete note succeed!', toastStyle);
		} catch (e) {}
	};

	const goToTimeHandler = () => {
		function setTime(time) {
			document.querySelector('.html5-main-video').currentTime = time;
		}

		chrome.tabs.query({ active: true }, function (tabs) {
			const tab = tabs[0];

			// when note click, change video to current note timestamp
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: setTime,
				args: [time],
			});
		});
	};

	return (
		<Stack direction="horizontal" gap={3}>
			<ListGroup.Item onClick={goToTimeHandler} action>
				{props.note}
			</ListGroup.Item>
			<Button onClick={deleteNoteHandler} variant="danger">
				DELETE
			</Button>
		</Stack>
	);
};

export default NoteItem;
