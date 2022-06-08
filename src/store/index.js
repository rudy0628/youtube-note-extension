import { configureStore } from '@reduxjs/toolkit';
import noteSlice from './note-slice';
import authSlice from './auth-slice';

const store = configureStore({
	reducer: {
		note: noteSlice.reducer,
		auth: authSlice.reducer,
	},
});

export default store;
