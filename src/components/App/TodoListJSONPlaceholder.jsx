import { useState, useEffect } from 'react';

import styles from './TodoList.module.css';

export const TodoList = () => {
	const [todoList, setTodoList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		fetch('https://jsonplaceholder.typicode.com/todos').then((loadedData) =>
			loadedData
				.json()
				.then((loadedTodos) => {
					setTodoList(loadedTodos);
				})
				.finally(() => setIsLoading(false)),
		);
	}, []);

	return (
		<>
			<div className={styles.app}>
				<h2>Todolist JSON Placeholder </h2>
				{isLoading ? (
					<div className={styles.loader}></div>
				) : (
					todoList.map(({ id, title }) => (
						<div key={id} className={styles.todoItem}>
							{title}
						</div>
					))
				)}
			</div>
		</>
	);
};
