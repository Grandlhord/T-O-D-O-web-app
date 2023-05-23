/*define variable and assign HTML elements to them*/
let form = document.querySelector("form");
let text = document.getElementById("text");
let todoCon = document.querySelector(".todo-con");
let left = document.querySelector(".left");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

/*event listener for submition of todo to list*/
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

/*updating the localstorage and items left*/
function updateLs() {
  localStorage.setItem("todos", JSON.stringify(todos));
  updateItemsLeft();
}

/*adding todo*/
function addTodo() {
  let todotext = text.value;
  if (todotext) {
    let newTodo = {
      text: todotext,
      complete: false
    };
    todos.push(newTodo);
    updateLs();
    renderTodoItem(newTodo);
    text.value = "";
  }
}

/*rendering of todo for one todo item and adding elements such as the cross and check boxes*/
function renderTodoItem(todo) {
  let todoColl = document.createElement("div");
  todoColl.classList.add("todocoll");
  todoColl.draggable = true;

  let completeClass = todo.complete ? "complete" : "";
  todoColl.innerHTML = `
    <div class="todo-li">
      <div class="check ${todo.complete ? "active-check" : ""}"><img src="icon-check.svg" alt=""></div>
      <p class="ptag ${completeClass}">${todo.text}</p>
      <button class="close"><img src="icon-cross.svg" alt=""></button>
    </div>
    <div class="hr"></div>`;

  todoCon.appendChild(todoColl);

  let close = todoColl.querySelector(".close");
  close.addEventListener("click", () => {
    todoColl.remove();
    todos = todos.filter(item => item !== todo);
    updateLs();
    updateItemsLeft();
  });

  let check = todoColl.querySelector(".check");
  check.addEventListener('click', () => {
    todo.complete = !todo.complete;
    check.classList.toggle("active-check");
    todoColl.children[0].children[1].classList.toggle("complete");
    updateLs();
    updateItemsLeft();
  });

  updateItemsLeft();

  todoColl.addEventListener("dragstart", handleDragStart);
  todoColl.addEventListener("dragover", handleDragOver);
  todoColl.addEventListener("drop", handleDrop);
}

/*updating items left function*/
function updateItemsLeft() {
  let activeTodos = todos.filter(todo => !todo.complete);
  let count = activeTodos.length;
  left.innerText = `${count} item${count === 1 ? "" : "s"} left`;
}

/*filtering of todo*/
function filterTodos(filter) {
  let todoItems = todoCon.getElementsByClassName("todocoll");
  Array.from(todoItems).forEach(todoItem => {
    let isCompleted = todoItem.getElementsByClassName("ptag")[0].classList.contains("complete");
    if (filter === "active") {
      todoItem.style.display = "block";
    } else if (filter === "Active") {
      todoItem.style.display = isCompleted ? "none" : "block";
    } else if (filter === "Completed") {
      todoItem.style.display = isCompleted ? "block" : "none";
    }
  });
}

let filterButtons = document.querySelectorAll(".option p");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    let filter = button.classList[0];
    filterTodos(filter);
  });
});

let clear = document.querySelector(".clear");
clear.addEventListener("click", () => {
  todos = todos.filter(todo => !todo.complete);
  let completedItems = todoCon.getElementsByClassName("complete");
  Array.from(completedItems).forEach(item => item.parentElement.parentElement.remove());
  updateLs();
  updateItemsLeft();
});

/*drag and drop function*/
let draggedItem = null;

function handleDragStart() {
  draggedItem = this;
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop() {
  const droppedItem = this;
  const droppedIndex = Array.from(todoCon.children).indexOf(droppedItem);
  const draggedIndex = Array.from(todoCon.children).indexOf(draggedItem);
  const temp = todos[droppedIndex];
  todos[droppedIndex] = todos[draggedIndex];
  todos[draggedIndex] = temp;
  todoCon.insertBefore(draggedItem, droppedItem);
  updateLs();
}

todos.forEach(todo => renderTodoItem(todo));



/* darkmode= document.querySelector('.theme').addEventListener('click',function(){
    var element = document.body;
     element.classList.toggle("dark-mode");
     });*/


 const toggleModeBtn = document.getElementById('toggle-svg');
const contentDivs = document.querySelectorAll('.container');
const image = document.getElementById('image');
//const body = document.getElementById('body');

toggleModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  contentDivs.forEach(div => {
    div.classList.toggle('dark-mode');
  });
  if (image.src.endsWith('bg-desktop-light.jpg')) {
    document.body.style.backgroundColor = 'hsl(235, 21%, 11%)';
    image.src = 'bg-desktop-dark.jpg';
  } else {
    image.src = 'bg-desktop-light.jpg';
    document.body.style.backgroundColor = '#fff';

  }
});