import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { toastStyle } from '../config/toastStyle';

const noteInitialState = {
	notes: [],
	isLoading: false,
};

const noteSlice = createSlice({
	name: 'note',
	initialState: noteInitialState,
	reducers: {
		replaceNotes(state, action) {
			state.notes = action.payload || [];
		},
		addNote(state, action) {
			const newNote = {
				note: action.payload.note,
				id: uuidv4(),
			};

			state.notes.push(newNote);
		},
		deleteNote(state, action) {
			const updatedNotes = state.notes.filter(
				note => note.id !== action.payload.id
			);

			state.notes = updatedNotes;
		},
		setIsLoading(state, action) {
			state.isLoading = action.payload;
		},
	},
});

export const sendData = (notes, id, userId, token) => {
	return async dispatch => {
		dispatch(noteActions.setIsLoading(true));

		try {
			const response = await fetch(
				`https://youtube-note-345904-default-rtdb.asia-southeast1.firebasedatabase.app/${userId}/${id}.json?auth=${token}`,
				{
					method: 'PUT',
					body: JSON.stringify(notes),
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			dispatch(noteActions.setIsLoading(false));
			if (!response.ok) {
				throw new Error();
			}
		} catch (e) {
			dispatch(noteActions.setIsLoading(false));
			toast.error('Update note failed!', toastStyle);
			throw new Error();
		}
	};
};

export const getData = (id, userId, token) => {
	return async dispatch => {
		dispatch(noteActions.setIsLoading(true));

		try {
			const response = await fetch(
				`https://youtube-note-345904-default-rtdb.asia-southeast1.firebasedatabase.app/${userId}/${id}.json?auth=${token}`
			);
			const data = await response.json();

			if (!response.ok) {
				throw new Error();
			}

			dispatch(noteActions.replaceNotes(data));
			dispatch(noteActions.setIsLoading(false));
		} catch (e) {
			dispatch(noteActions.setIsLoading(false));
			toast.error('Load notes failed!', toastStyle);
		}
	};
};

export default noteSlice;
export const noteActions = noteSlice.actions;
