import { useState, useRef } from "react";

import "./_TaskItem.scss";
import Button from "./UI/Button";
import AttachIcon from "../svg/AttachIcon";
import EditIcon from "../svg/EditIcon";
import DeleteIcon from "../svg/DeleteIcon";
import InfoIcon from "../svg/InfoIcon";
import dayjs from "dayjs";

const TaskItem = (props) => {
  const [taskCompleted, setTaskCompleted] = useState(props.status);
  const [attachmentIsShow, setAttachmentIsShown] = useState(false);
  const [descriptionIsShow, setDescriptiontIsShown] = useState(false);
  const [editTaskIsShow, setEditTaskIsShow] = useState(false);

  const titleRef = useRef();
  const descriptionRef = useRef();
  const deadlineRef = useRef();

  /**
   * Смена статуса задачи и обновление данной информации на сервере
   * @param {object} event стандартное событие при onChange
   */
  const changeTaskStatusHandler = (event) => {
    setTaskCompleted(event.target.checked);

    fetch(
      `https://todo-list-fwu-default-rtdb.firebaseio.com/tasksList/${event.target.id}/taskStatus.json`,
      {
        method: "PUT",
        body: JSON.stringify(event.target.checked),
      }
    );
  };

  const showAttachmentToggle = () => {
    setAttachmentIsShown(!attachmentIsShow);
  };
  const showDescriptionToggle = () => {
    setDescriptiontIsShown(!descriptionIsShow);
  };
  const showEditTaskToggle = () => {
    setEditTaskIsShow(!editTaskIsShow);
  };

  const deleteTaskHandler = () => {
    props.onDelete(props.id);
  };
/**
 * Формарование объекта с обновленными полями задачи и дальнейшая передача его родителю для обновления на сервере
 * @param {object} event стандартное событие при Submit
 */
  const updateTaskHandler = (event) => {
    event.preventDefault();

    const updatedTaskData = {
      id: props.id,
      taskTitle: titleRef.current.value,
      taskDescription: descriptionRef.current.value,
      taskDeadline: deadlineRef.current.value,
    };

    props.onUpdateTask(updatedTaskData);
    setEditTaskIsShow(!editTaskIsShow);
  };
/** Форма для корректировки задачи */
  const editTask = (
    <form className="new-task-form" onSubmit={updateTaskHandler}>
      <div className="new-task-form__line">
        <label htmlFor="taskTitle">Заголовок задачи</label>
        <input ref={titleRef} type="text" id="taskTitle" defaultValue={props.title} />
      </div>

      <div className="new-task-form__line">
        <label htmlFor="taskText">Описание задачи</label>
        <textarea
          ref={descriptionRef}
          rows="5"
          cols="40"
          name="text"
          id="taskText"
          defaultValue={props.description}
        />
      </div>

      <div className="new-task-form__line">
        <label htmlFor="taskDate">Дата завершения задачи</label>
        <input ref={deadlineRef} type="date" id="taskDate" defaultValue={props.deadline} />
      </div>

      <div className="new-task-form__btns-area">
        <Button className="new-task-btn_darkblue">Обновить задачу</Button>
      </div>
    </form>
  );

  return (
    <li className="task">
      <div className="task__title">
        <div className="title-text">
          <div>
            <input
              type="checkbox"
              className="task__status"
              id={props.id}
              onChange={changeTaskStatusHandler}
              checked={taskCompleted}
            />
          </div>
          <div>
            <label className="task__title-name" htmlFor={props.id}>
              {props.title}
            </label>
          </div>
        </div>
        <div className="title-icons">
          <span className="task__edit-icon tooltip">
            <EditIcon onClick={showEditTaskToggle} />
            <span className="tooltiptext">Редактировать задачу</span>
          </span>
          <span className="task__delete-icon tooltip">
            <DeleteIcon onClick={deleteTaskHandler} />
            <span className="tooltiptext">Удалить задачу</span>
          </span>
          {props.files && (
            <span className="task__attach-icon tooltip">
              <AttachIcon onClick={showAttachmentToggle} />
              <span className="tooltiptext">Приерепленные файлы</span>
            </span>
          )}
          {props.description !== "" && (
            <span className="task__info-icon tooltip">
              <InfoIcon onClick={showDescriptionToggle} />
              <span className="tooltiptext">Показать описание</span>
            </span>
          )}
        </div>
      </div>
      {props.description !== "" && descriptionIsShow && (
        <div className="task__description">
          <p>{props.description}</p>
        </div>
      )}
      {props.files && attachmentIsShow && (
        <ol className="task__attachments">
          {props.files.map((file) => (
            <li key={Math.random()}>
              <a href={file} target="blank">
                Файл
              </a>
            </li>
          ))}
        </ol>
      )}
      <div className="task__deadline">
        {props.deadline !== "" && (
          <p>Дата завершения: {dayjs(props.deadline).format("DD.MM.YYYY")}</p>
        )}
        {!taskCompleted && dayjs(props.deadline) < dayjs() && (
          <p>( просрочено! )</p>
        )}
        {taskCompleted && <p>( выполнено )</p>}
        {editTaskIsShow && editTask}
      </div>
    </li>
  );
};

export default TaskItem;
