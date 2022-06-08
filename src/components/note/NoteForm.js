import React from 'react';
import { useDispatch } from 'react-redux';
import { noteActions } from '../../store/note-slice';
import useInput from '../../hooks/use-input';
import { isNotEmpty } from '../../config/validators';
import { toast } from 'react-toastify';
import { toastStyle } from '../../config/toastStyle';

import { BiErrorCircle } from 'react-icons/bi';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

const NoteForm = props => {
	const dispatch = useDispatch();
	const {
		value: noteValue,
		isValid: noteIsValid,
		hasError: noteHasError,
		inputChangeHandler: noteChangeHandler,
		inputBlurHandler: noteBlurHandler,
		reset: noteReset,
	} = useInput(isNotEmpty);

	const addNoteHandler = () => {
		if (!noteIsValid) {
			return;
		}

		try {
			dispatch(
				noteActions.addNote({
					note: `${props.currentTime} ${noteValue}`,
				})
			);
			toast.success('Add new note succeed!', toastStyle);
		} catch (e) {}

		noteReset();
	};

	return (
		<React.Fragment>
			<InputGroup className="mb-3">
				<InputGroup.Text id="inputGroup-sizing-default">
					{props.currentTime || '0:00'}
				</InputGroup.Text>
				<FormControl
					value={noteValue}
					onChange={noteChangeHandler}
					onBlur={noteBlurHandler}
					aria-label="Default"
					aria-describedby="inputGroup-sizing-default"
				/>
				<Button onClick={addNoteHandler} variant="primary">
					ADD
				</Button>
			</InputGroup>
			{noteHasError && (
				<p className="error-text">
					<BiErrorCircle className="error-text__icon" />
					Invalid note
				</p>
			)}
		</React.Fragment>
	);
};

export default NoteForm;
