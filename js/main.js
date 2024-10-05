// стрелочная ф-ия

// let sum = (a, b) => {  // фигурная скобка, открывающая тело многострочной функции
//   let result = a + b;
//   return result; // если мы используем фигурные скобки, то нам нужно явно указать "return"
// };

// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
   tasks = JSON.parse(localStorage.getItem('tasks'));
   tasks.forEach(function (task) {
      renderTask(task);
   });
}

// tasks.forEach(function (task) {
//    renderTask(task);
// });

checkEmptyList();

// Так лучше не делать
// if (localStorage.getItem('tasksHTML')) {
//    tasksList.innerHTML = localStorage.getItem('tasksHTML');
// }

// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

// Функции, рефакторинг
function addTask(event) {
   // Отменяем отправку формы
   event.preventDefault();

   // Достаем текст задачи из поля ввода
   const taskText = taskInput.value;

   // Описываем задачу в виде объекта
   const newTask = {
      id: Date.now(),
      text: taskText,
      done: false,
   };

   // Добавляем задачу в массив с задачами
   tasks.push(newTask);

   // Сохраняем список задач в хранилище браузера LocalStorage
   saveToLocalStorage();

   renderTask(newTask);

   // // Формируем CSS класс
   // const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';

   // // Формируем разметку для новой задачи
   // const taskHTML = `
   //              <li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
   //              <span class="${cssClass}">${newTask.text}</span>
   //              <div class="task-item__buttons">
   //                <button type="button" data-action="done" class="btn-action">
   //                  <img src="./img/tick.svg" alt="Done" width="18" height="18">
   //                </button>
   //                <button type="button" data-action="delete" class="btn-action">
   //                  <img src="./img/cross.svg" alt="Done" width="18" height="18">
   //                </button>
   //              </div>
   //            </li>`;
   // // const taskHTML = `
   // //              <li class="list-group-item d-flex justify-content-between task-item">
   // //              <span class="task-title">${taskText}</span>
   // //              <div class="task-item__buttons">
   // //                <button type="button" data-action="done" class="btn-action">
   // //                  <img src="./img/tick.svg" alt="Done" width="18" height="18">
   // //                </button>
   // //                <button type="button" data-action="delete" class="btn-action">
   // //                  <img src="./img/cross.svg" alt="Done" width="18" height="18">
   // //                </button>
   // //              </div>
   // //            </li>`;

   // // Добавляем задачу на страницу
   // tasksList.insertAdjacentHTML('beforeend', taskHTML);

   // Очищаем поле ввода и возвращаем на него фокус
   taskInput.value = '';
   taskInput.focus();

   // Проверка. Если в списке задач более 1-го элемента, скрываем блок "Список дел пуст"
   // if (tasksList.children.length > 1) {
   //    emptyList.classList.add('none');
   // }
   // saveHTMLtoLS();
   checkEmptyList();
}

function deleteTask(event) {
   // Проверяем что клик был НЕ по кнопке "удалить задачу"
   if (event.target.dataset.action !== 'delete') return;

   //  Проверяем что клик был по кнопке "удалить задачу"
   const parentNode = event.target.closest('.list-group-item');

   // Определяем ID задачи
   const id = Number(parentNode.id);

   // Находим индекс задачи в массиве(короткая запись, ниже полная)
   const index = tasks.findIndex((task) => task.id === id);
   // const index = tasks.findIndex(function (task) {
   //    return task.id === id;

   //    if (task.id === id) {
   //       return true;
   //    }
   // });

   // Удаляем задачу из массива с задачами
   tasks.splice(index, 1);

   // Сохраняем список задач в хранилище браузера LocalStorage
   saveToLocalStorage();

   // Удаляем задачу из массива с задачами через filter (2 вариант)
   // tasks = tasks.filter(function (task) {
   //    if (task.id === id) {
   //       return false;
   //    } else {
   //       return true;
   //    }
   // });
   // Более короткая запись
   // tasks = tasks.filter((task) => task.id !== id);

   // Удаляем задачу из разметки
   parentNode.remove();
   checkEmptyList();

   // Проверка. Если в списке задач 1 элемент, показываем блок "Список дел пуст"
   // if (tasksList.children.length === 1) {
   //    emptyList.classList.remove('none');
   // }

   // saveHTMLtoLS();

   // Проверяем что клик был по кнопке "удалить задачу"
   //  if (event.target.dataset.action === 'delete') {
   //     const parentNode = event.target.closest('.list-group-item');
   //     parentNode.remove();
   //  }
   // Проверка. Если в списке задач 1 элемент, показываем блок "Список дел пуст"
   //  if (tasksList.children.length === 1) {
   //     emptyList.classList.remove('none');
   //  }
}

function doneTask(event) {
   // Проверяем что клик был по кнопке "задача выполнена"
   if (event.target.dataset.action !== 'done') return;

   // Проверяем что клик был по кнопке "задача выполнена"
   const parentNode = event.target.closest('.list-group-item');

   // Определяем ID задачи
   const id = Number(parentNode.id);
   const task = tasks.find(function (task) {
      if (task.id === id) {
         return true;
      }
   });
   task.done = !task.done;

   // Сохраняем список задач в хранилище браузера LocalStorage
   saveToLocalStorage();

   const taskTitle = parentNode.querySelector('.task-title');
   taskTitle.classList.toggle('task-title--done');

   // saveHTMLtoLS();

   // if (event.target.dataset.action === 'done') {
   //    // Проверяем что клик был по кнопке "задача выполнена"
   //    const parentNode = event.target.closest('.list-group-item');
   //    const taskTitle = parentNode.querySelector('.task-title');
   //    taskTitle.classList.toggle('task-title--done');

   // }
}

function checkEmptyList() {
   if (tasks.length === 0) {
      const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
      <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
      <div class="empty-list__title">Список дел пуст</div>
   </li>`;
      tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
   }

   if (tasks.length > 0) {
      const emptyListEl = document.querySelector('#emptyList');
      emptyListEl ? emptyListEl.remove() : null;
   }
}

function saveToLocalStorage() {
   localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
   // Формируем CSS класс
   const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

   // Формируем разметку для новой задачи
   const taskHTML = `
                      <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                      <span class="${cssClass}">${task.text}</span>
                      <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                          <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                          <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                      </div>
                    </li>`;

   // Добавляем задачу на страницу
   tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

// Так лучше не делать
// function saveHTMLtoLS() {
//    localStorage.setItem('tasksHTML', tasksList.innerHTML);
// }
