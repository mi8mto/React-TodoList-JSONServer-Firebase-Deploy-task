import { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database'; // Методы для работы с Firebase
import { db } from '../../../firebase'; // Импортируем db из вашего файла с конфигурацией Firebase

import styles from './TodoList.module.css';

// Хук для работы с инпутом
function useInput(defaultValue = '') {
	const [value, setValue] = useState(defaultValue);

	return {
		value,
		onChange: (event) => setValue(event.target.value),
	};
}

export const TodoListFirebase = () => {
	const input = useInput();
	const [todoList, setTodoList] = useState([]); // Список задач
	const [isLoading, setIsLoading] = useState(true); // Статус загрузки
	const [isSorted, setIsSorted] = useState(false); // Статус сортировки
	const [allTasks, setAllTasks] = useState([]); // Все задачи с сервера
	const [nextTaskIndex, setNextTaskIndex] = useState(0); // Индекс следующей задачи для добавления
	const [editingId, setEditingId] = useState(null); // Стейт для отслеживания редактируемой задачи
	const [editingTitle, setEditingTitle] = useState(''); // Стейт для отслеживания нового текста задачи

	useEffect(() => {
		const productDbRef = ref(db, 'todos');

		const unsubscribe = onValue(productDbRef, (snapshot) => {
			const loadedTodos = snapshot.val() || {};
			const todosArray = Object.keys(loadedTodos).map((key) => loadedTodos[key]); // Преобразуем в массив
			setAllTasks(todosArray);
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const addTodoById = () => {
		if (nextTaskIndex < allTasks.length) {
			const taskToAdd = allTasks[nextTaskIndex];
			setTodoList((prevState) => [...prevState, taskToAdd]);
			setNextTaskIndex(nextTaskIndex + 1);
		}
	};

	// Функция для удаления задачи
	const deleteTodo = (id) => {
		const todoRef = ref(db, `todos/${id}`);
		remove(todoRef);
		setTodoList((prevState) => prevState.filter((task) => task.id !== id));
	};

	// Функция для редактирования задачи
	const editTodo = (id, title) => {
		setEditingId(id);
		setEditingTitle(title);
	};

	// Функция для сохранения изменений задачи в Firebase
	const saveEditTodo = () => {
		const todoRef = ref(db, `todos/${editingId}`);
		update(todoRef, {
			title: editingTitle,
		});

		setEditingId(null);
		setEditingTitle('');
	};

	// Моментальное обновление задачи в локальном списке при редактировании
	const handleTitleChange = (id, newTitle) => {
		setTodoList((prevState) =>
			prevState.map((todo) =>
				todo.id === id ? { ...todo, title: newTitle } : todo,
			),
		);
		setEditingTitle(newTitle);
	};

	// Функция для переключения сортировки
	const toggleSort = () => {
		setIsSorted((prevState) => !prevState);
	};

	// Функция для сортировки задач по алфавиту
	const sortedTodos = isSorted
		? [...todoList].sort((a, b) => a.title.localeCompare(b.title))
		: todoList;

	return (
		<div className={styles.app}>
			<h2>Todolist Firebase</h2>

			{/* Кнопка для добавления одной задачи */}
			<button
				onClick={addTodoById}
				className={styles.addButton}
				disabled={nextTaskIndex >= allTasks.length}
			>
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
											onChange={
												(e) =>
													handleTitleChange(id, e.target.value) // Моментально обновляем локальный список
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
