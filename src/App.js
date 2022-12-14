import { useState, useRef, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDatabase,
  ref as ref_database,
  remove,
  child,
} from "firebase/database";
import { v4 } from "uuid";

import TaskItem from "./components/TaskItem";
import Button from "./components/UI/Button";
import { storage } from "./firebase";
import "./App.scss";

const isEmpty = (value) => value.trim() === "";

function App() {
  const [taskFormIsShown, setTaskFormIsShown] = useState(false);
  const [fetchedTasks, setFetchedTasks] = useState([]);
  const [updateApp, setUpdateApp] = useState(0);

  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [filesUrls, setFilesUrls] = useState([]);

  const titleRef = useRef();
  const descriptionRef = useRef();
  const deadlineRef = useRef();

  /**
   * Отправка данных о задаче на сервер
   * @param {object} event стандартное событие при нажатии submit
   */
  const addTaskHandler = (event) => {
    event.preventDefault();

    if (isEmpty(titleRef.current.value)) {
      alert("Загоовок задачи - обязательное поле. Заполните его, пожалуйста.");
      return;
    }

    const newTask = {
      taskTitle: titleRef.current.value,
      taskDescription: descriptionRef.current.value,
      taskDeadline: deadlineRef.current.value,
      taskFiles: filesUrls,
      taskStatus: false,
    };

    fetch("https://todo-list-fwu-default-rtdb.firebaseio.com/tasksList.json", {
      method: "POST",
      body: JSON.stringify(newTask),
    });

    setFilesUrls([]);
    setTaskFormIsShown(false);
    setUpdateApp(Math.random());
  };
  /**
   * Удаление задачи с сервера
   * @param {string} id Id/Key задачи
   */
  const deleteTaskHandler = (id) => {
    const db = getDatabase();
    remove(child(ref_database(db), `/tasksList/${id}`));

    setTimeout(() => {
      setUpdateApp(Math.random());
    }, 300);
  };
  /**
   * Обновление задачи на сервере
   * @param {object} updatedData Объект с обновленной информацией о задаче
   */
  const updateTaskHandler = (updatedData) => {
    fetch(
      `https://todo-list-fwu-default-rtdb.firebaseio.com/tasksList/${updatedData.id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(updatedData),
      }
    );

    setTimeout(() => {
      setUpdateApp(Math.random());
    }, 300);
  }; 
/** Автоматически подгружает вновь добаваленые и обновленные задачи с сервера */
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://todo-list-fwu-default-rtdb.firebaseio.com/tasksList.json"
      );

      if (!response.ok) {
        throw new Error("Что-то пошло не так. Скоро мы это исправим.");
      }

      const data = await response.json();

      const tasksList = [];

      for (const key in data) {
        tasksList.push({
          id: key,
          taskTitle: data[key].taskTitle,
          taskDescription: data[key].taskDescription,
          taskDeadline: data[key].taskDeadline,
          taskFiles: data[key].taskFiles,
          taskStatus: data[key].taskStatus,
        });
      }
      setFetchedTasks(tasksList);
    };

    fetchData().catch((error) => {
      alert(error.message);
    });
  }, [updateApp]);

  const showTaskFormHandler = () => {
    setTaskFormIsShown(true);
  };
  const closeTaskFormHandler = () => {
    setTaskFormIsShown(false);
  };
/**
 * Формирует список прикрепляемых к задаче файлов
 * @param {object} event данные о прикрепленных файлах
 */
  const filesListHandler = (event) => {
    for (let i = 0; i < event.target.files.length; i++) {
      const newFile = event.target.files[i];
      newFile["id"] = Math.random();
      setUploadingFiles((prevState) => [...prevState, newFile]);
    }
  };
/**
 * Загружает прикрепленные задачи на сервер и определяет ссылки на них.
 */
  const uploadFilesHandler = () => {
    if (uploadingFiles.length === 0) return;

    const promises = [];
    const folderId = v4();
    uploadingFiles.map((file) => {
      const fileRef = ref(storage, `${folderId}/${file.name}`);
      const uploadTask = uploadBytes(fileRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setFilesUrls((prevState) => [...prevState, url]);
        });
      });
      return promises.push(uploadTask);
    });

    Promise.all(promises)
      .then(() => alert("Файлы прикреплены"))
      .catch((err) => console.log(err));
  };
/** Форма для добавления новой задачи */
  const taskForm = (
    <form className="new-task-form" onSubmit={addTaskHandler}>
      <div className="new-task-form__line">
        <label htmlFor="taskTitle">Заголовок задачи</label>
        <input ref={titleRef} type="text" id="taskTitle" />
      </div>

      <div className="new-task-form__line">
        <label htmlFor="taskText">Описание задачи</label>
        <textarea
          ref={descriptionRef}
          rows="5"
          cols="40"
          name="text"
          id="taskText"
        ></textarea>
      </div>

      <div className="new-task-form__line">
        <label htmlFor="taskDate">Дата завершения задачи</label>
        <input ref={deadlineRef} type="date" id="taskDate" />
      </div>

      <div className="new-task-form__line">
        <label htmlFor="taskFile">Приерепить файл</label>
        <input type="file" id="taskFile" onChange={filesListHandler} multiple />
        <button type="button" onClick={uploadFilesHandler}>
          Прикрепить
        </button>
      </div>
      <div className="new-task-form__btns-area">
        <Button className="new-task-btn_red">Добавить задачу</Button>
        <Button
          type="button"
          className="new-task-btn_darkblue"
          onClick={closeTaskFormHandler}
        >
          Отменить
        </Button>
      </div>
    </form>
  );

  return (
    <section className="todo-wrapper">
      <header className="todo-header">
        <h1 className="todo-header__title">ToDo-Лист</h1>

        {!taskFormIsShown && (
          <Button className="new-task-btn_red" onClick={showTaskFormHandler}>
            Новая задача
          </Button>
        )}
        {taskFormIsShown && taskForm}
      </header>

      <ul>
        {fetchedTasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.taskTitle}
            description={task.taskDescription}
            files={task.taskFiles}
            status={task.taskStatus}
            deadline={task.taskDeadline}
            onDelete={deleteTaskHandler}
            onUpdateTask={updateTaskHandler}
          />
        ))}
      </ul>
    </section>
  );
}

export default App;
