import React from 'react';
import { useSelector } from 'react-redux';

import NoteItem from './NoteItem';
import { ListGroup } from 'react-bootstrap';

const NoteList = props => {
	const notes = useSelector(state => state.note.notes);

	let sortList = [...notes].sort((a, b) => {
		const timeArrA = a.note.split(' ')[0].split(':');
		const timeArrB = b.note.split(' ')[0].split(':');
		const secondA = +timeArrA[0] * 60 + +timeArrA[1];
		const secondB = +timeArrB[0] * 60 + +timeArrB[1];

		if (secondA < secondB) return -1;
		if (secondA > secondB) return 1;

		return 0;
	});

	const noteList = sortList.map(note => (
		<NoteItem
			key={note.id}
			id={note.id}
			note={note.note}
			currUrl={props.currUrl}
		/>
	));

	return <ListGroup>{noteList || []}</ListGroup>;
};

export default NoteList;
