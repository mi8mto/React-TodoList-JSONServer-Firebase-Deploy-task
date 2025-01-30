import { useState, useEffect } from 'react';

import styles from './TodoList.module.css';

// Хук для работы с инпутом
function useInput(defaultValue = '') {
	const [value, setValue] = useState(defaultValue);

	return {
		value,
		onChange: (event) => setValue(event.target.value),
	};
}

export const TodoListJsonServer = () => {
	const input = useInput();
	const [todoList, setTodoList] = useState([]); // Список добавленных задач
	const [allTodos, setAllTodos] = useState([]); // Все задачи, загруженные с сервера
	const [isLoading, setIsLoading] = useState(false); // Стейт для загрузки
	const [currentTodoIndex, setCurrentTodoIndex] = useState(0); // Индекс текущей задачи для добавления
	const [isSorted, setIsSorted] = useState(false); // Стейт для включения сортировки
	const [editingId, setEditingId] = useState(null); // Стейт для отслеживания редактируемой задачи
	const [editingTitle, setEditingTitle] = useState(''); // Стейт для отслеживания нового текста задачи

	// Загружаем данные с сервера при монтировании компонента
	useEffect(() => {
		setIsLoading(true);
		fetch('http://localhost:3009/todos')
			.then((response) => response.json())
			.then((data) => {
				setAllTodos(data);
			})
			.finally(() => setIsLoading(false));
	}, []);

	// Функция для добавления задачи по одному из массива
	const addTodoById = () => {
		if (currentTodoIndex < allTodos.length) {
			const todoToAdd = allTodos[currentTodoIndex];
			setTodoList((prevList) => [...prevList, todoToAdd]);
			setCurrentTodoIndex((prevIndex) => prevIndex + 1);
			if (currentTodoIndex + 1 === allTodos.length) {
				console.log('Все задачи были добавлены!');
			}
		}
	};

	// Функция для переключения сортировки
	const toggleSort = () => {
		setIsSorted((prevState) => !prevState);
	};

	// Функция для сортировки задач по алфавиту
	const sortedTodos = isSorted
		? [...todoList].sort((a, b) => a.title.localeCompare(b.title))
		: todoList;

	// Функция для удаления задачи
	const deleteTodo = (id) => {
		setTodoList((prevList) => prevList.filter((todo) => todo.id !== id));
	};

	// Функция для редактирования задачи
	const editTodo = (id, title) => {
		setEditingId(id);
		setEditingTitle(title);
	};

	// Функция для сохранения изменений задачи
	const saveEditTodo = () => {
		setTodoList((prevList) =>
			prevList.map((todo) =>
				todo.id === editingId ? { ...todo, title: editingTitle } : todo,
			),
		);
		setEditingId(null);
		setEditingTitle('');
	};

	return (
		<div className={styles.app}>
			<h2>Todolist JSON Server</h2>
			{/* Кнопка для добавления задачи из массива по ID */}
			<button onClick={addTodoById} className={styles.addButton}>
				Добавить задачу
			</button>
			{/* Кнопка для включения/выключения сортировки */}
			<button onClick={toggleSort} className={styles.sortButton}>
				{isSorted ? 'Отключить сортировку' : 'Включить сортировку'}
			</button>
			{/* Поле для поиска задач */}
			<input type="text" className="control" {...input} />
			{/* Отображаем состояние загрузки или список задач */}
			{isLoading ? (
				<div className={styles.loader}></div>
			) : (
				<div className={styles.taskList}>
					{sortedTodos
						.filter((todo) =>
							todo.title.toLowerCase().includes(input.value.toLowerCase()),
						)
						.map(({ id, title }) => (
							<div key={id} className={styles.todoItem}>
								{/* Если задача редактируется, показываем инпут */}
								{editingId === id ? (
									<>
										<input
											className={styles.changeInput}
											type="text"
											value={editingTitle}
											onChange={(e) =>
												setEditingTitle(e.target.value)
											}
										/>
										<button
											className={styles.editButton}
											onClick={saveEditTodo}
										>
											ок
										</button>
									</>
								) : (
									<>
										<span>{title}</span>
										<div className={styles.buttonContainer}>
											{/* Кнопка для редактирования задачи */}
											<button
												onClick={() => editTodo(id, title)}
												className={styles.editButton}
											>
												Ред
											</button>
											{/* Кнопка для удаления задачи */}
											<button
												onClick={() => deleteTodo(id)}
												className={styles.deleteButton}
											>
												х
											</button>
										</div>
									</>
								)}
							</div>
						))}
				</div>
			)}
		</div>
	);
};
