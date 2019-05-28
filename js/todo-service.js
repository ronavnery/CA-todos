'use strict';
var gTodos;
var gFilterBy = 'All';
var gSortBy;

function createTodos() {
    var todos = loadFromStorage('todos')
    if (!todos || !todos.length) {
        todos = [
            createTodo('Learn JS', 2),
            createTodo('Master CSS', 3),
            createTodo('Live good', 1),
        ]
    }
    gTodos = todos;
    saveTodos();
}
 
function createTodo(txt, imp) {
    return {
        id: makeId(),
        txt: txt,
        isCompleted: false,
        createdAt: Date.now(),
        importance: imp
    }
}

function getTodosForDisplay() {
    if (gFilterBy === 'All') return gTodos;
    return gTodos.filter(function (todo) {
        return (todo.isCompleted && gFilterBy === 'Completed') ||
            (!todo.isCompleted && gFilterBy === 'Active')
    })
}

function addTodo(txt, imp) {
    var todo = createTodo(txt, imp);
    gTodos.unshift(todo);
    saveTodos();
}

function deleteTodo(todoId) {
    var todoIdx = gTodos.findIndex(function (todo) { return todo.id === todoId });
    gTodos.splice(todoIdx, 1);
    saveTodos();
}

function toggleTodo(todoId) {
    var todo = gTodos.find(function (todo) { return todo.id === todoId });
    todo.isCompleted = !todo.isCompleted;
    saveTodos();
}

function setFilter(criteria) {
    gFilterBy = criteria;
}

function setSort(criteria) {
    gSortBy = criteria
    if (criteria === 'Alphabet') gTodos = gTodos.sort(alphabetSort);
    else if (criteria === 'Creation time') gTodos = gTodos.sort(creationTimeSort);
    else gTodos = gTodos.sort(importanceSort);
}

function getTotalCount() {
    return gTodos.length
}

function getActiveCount() {
    var activeTodos = gTodos.filter(function (todo) { return !todo.isCompleted })
    return activeTodos.length;
}

function saveTodos() {
    saveToStorage('todos', gTodos)
}

function moveUpItem(itemIdx) {
    var valueAtDst = gTodos[itemIdx - 1]
    gTodos[itemIdx - 1] = gTodos[itemIdx]
    gTodos[itemIdx] = valueAtDst
    console.table(gTodos)
}

function moveDownItem(itemIdx) {
    itemIdx = parseInt(itemIdx)
    var valueAtDst = gTodos[itemIdx + 1]
    gTodos[itemIdx + 1] = gTodos[itemIdx]
    gTodos[itemIdx] = valueAtDst
}

function promoteItem(itemId) {
    var todoIdx = gTodos.findIndex(function (todo) { return todo.id === itemId });
    if (gTodos[todoIdx].importance === 3) gTodos[todoIdx].importance -= 2;
    else gTodos[todoIdx].importance++;
}