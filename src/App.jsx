import React from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/App/TodoListJSONPlaceholder';
import { TodoListJsonServer } from './components/App/TodoListJSONServer';
import { TodoListFirebase } from './components/App/TodoListFirebase';
import styles from './App.module.css';

export const App = () => {
	return (
		<div>
			{<Header />}
			<div className={styles.container}>
				{<TodoList />}
				{<TodoListJsonServer />}
				{<TodoListFirebase />}
			</div>
		</div>
	);
};
