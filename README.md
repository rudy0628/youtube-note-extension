# Youtube note extension
1. Install all dependencies in command  
`` npm i ``  
2. In src/store/auth-slice.js, change FIREBASE_PRJ_API to your [firebase](https://firebase.google.com/) api  
`` 
    ...
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
    ...
``  
3. Run npm build in command to produce build folder  
`` npm run build ``  
4. Go to[chrome extension](chrome://extensions/) click top right toggle button to enter developer mode, and click top left button Load unpacked load build folder into it.
