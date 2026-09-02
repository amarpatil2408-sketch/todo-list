// ========================================
// 1. Select HTML elements
// ========================================

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");

const todoList = document.getElementById("todo-list");

const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const completedBtn = document.getElementById("completed-btn");

const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");


// ========================================
// 2. Todo data
// ========================================

let todos = [];

let currentFilter = "all";


// ========================================
// 3. Add Todo
// ========================================

function addTodo() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const todo = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    todos.push(todo);

    taskInput.value = "";

    saveTodos();

    displayTodos();
}


// ========================================
// 4. Display Todos
// ========================================

function displayTodos() {

    todoList.innerHTML = "";

    let filteredTodos = todos;

    // Apply filter
    if (currentFilter === "active") {

        filteredTodos = todos.filter(function(todo) {
            return !todo.completed;
        });

    } else if (currentFilter === "completed") {

        filteredTodos = todos.filter(function(todo) {
            return todo.completed;
        });
    }


    // Create Todo elements
    filteredTodos.forEach(function(todo) {

        const todoItem = document.createElement("div");

        todoItem.innerHTML = `
            <input
                type="checkbox"
                class="todo-checkbox"
                data-id="${todo.id}"
                ${todo.completed ? "checked" : ""}
            >

            <span>${todo.text}</span>

            <button
                class="edit-btn"
                data-id="${todo.id}">
                Edit
            </button>

            <button
                class="delete-btn"
                data-id="${todo.id}">
                Delete
            </button>
        `;

        todoList.appendChild(todoItem);
    });


    // Checkbox listeners
    const checkboxes = document.querySelectorAll(".todo-checkbox");

    checkboxes.forEach(function(checkbox) {

        checkbox.addEventListener("change", toggleTodo);

    });


    // Delete listeners
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function(button) {

        button.addEventListener("click", deleteTodo);

    });


    // Edit listeners
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(function(button) {

        button.addEventListener("click", editTodo);

    });


    updateTaskCount();
}


// ========================================
// 5. Complete / Uncomplete Todo
// ========================================

function toggleTodo(event) {

    const todoId = Number(event.target.dataset.id);

    const todo = todos.find(function(todo) {
        return todo.id === todoId;
    });

    if (!todo) {
        return;
    }

    todo.completed = event.target.checked;

    saveTodos();

    displayTodos();
}


// ========================================
// 6. Delete Todo
// ========================================

function deleteTodo(event) {

    const todoId = Number(event.target.dataset.id);

    todos = todos.filter(function(todo) {
        return todo.id !== todoId;
    });

    saveTodos();

    displayTodos();
}


// ========================================
// 7. Edit Todo
// ========================================

function editTodo(event) {

    const todoId = Number(event.target.dataset.id);

    const todo = todos.find(function(todo) {
        return todo.id === todoId;
    });

    if (!todo) {
        return;
    }

    const newText = prompt("Edit your task:", todo.text);

    if (newText === null) {
        return;
    }

    if (newText.trim() === "") {
        return;
    }

    todo.text = newText.trim();

    saveTodos();

    displayTodos();
}


// ========================================
// 8. Update Task Count
// ========================================

function updateTaskCount() {

    const remainingTasks = todos.filter(function(todo) {
        return !todo.completed;
    }).length;

    taskCount.textContent = `${remainingTasks} tasks remaining`;
}


// ========================================
// 9. Filter Todos
// ========================================

function showAllTodos() {

    currentFilter = "all";

    displayTodos();
}


function showActiveTodos() {

    currentFilter = "active";

    displayTodos();
}


function showCompletedTodos() {

    currentFilter = "completed";

    displayTodos();
}


// ========================================
// 10. Clear Completed Todos
// ========================================

function clearCompleted() {

    todos = todos.filter(function(todo) {
        return !todo.completed;
    });

    saveTodos();

    displayTodos();
}


// ========================================
// 11. Save Todos to localStorage
// ========================================

function saveTodos() {

    localStorage.setItem("todos", JSON.stringify(todos));
}


// ========================================
// 12. Load Todos from localStorage
// ========================================

function loadTodos() {

    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }

    displayTodos();
}


// ========================================
// 13. Event Listeners
// ========================================

addTaskBtn.addEventListener("click", addTodo);

allBtn.addEventListener("click", showAllTodos);

activeBtn.addEventListener("click", showActiveTodos);

completedBtn.addEventListener("click", showCompletedTodos);

clearCompletedBtn.addEventListener("click", clearCompleted);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// ========================================
// 14. Load saved Todos when app starts
// ========================================

loadTodos();