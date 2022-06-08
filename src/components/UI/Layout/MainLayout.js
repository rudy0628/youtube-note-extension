import React from 'react';

import classes from './MainLayout.module.css';

const MainLayout = props => {
	return <div className={classes['main']}>{props.children}</div>;
};

export default MainLayout;
