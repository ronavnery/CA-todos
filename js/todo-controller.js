'use strict';
const gNoAnyTodoMsg = 'There\'s no Todo\'s in here.<br>Add some above to get started.'
const gNoActiveTodoMsg = 'There\'s no active Todo\'s.'
const gNoCompletedTodoMsg = 'There\'s no completed Todo\'s.'
var gTodoIdToDelete;
var gCurrLang = 'en';

function onInit() {
    createTodos();
    renderTodos();
    onSetLang(gCurrLang);
} 

function renderTodos() {
    var strHtmls;
    var todos = getTodosForDisplay();
    if (!todos.length) {
        if (gFilterBy === 'Completed') strHtmls = [gTranslations['noCompletedTodosMsg'][gCurrLang]]
        else if (gFilterBy === 'Active') strHtmls = [gTranslations['noActiveTodosMsg'][gCurrLang]];
        else strHtmls = [gTranslations['noAnyTodosMsg'][gCurrLang]]
    }
    else {
        strHtmls = todos.map(function (todo, idx) {
            var className = (todo.isCompleted) ? 'completed' : '';
            var elsMoveBtns = '';
            if (gSortBy === 'Custom') {
                var elMoveUpItem = `<img class="move-up icon" onclick="onMoveUpItem(event, '${idx}')" src="img/up.png">`
                var elMoveDownItem = `<img class="move-down icon" onclick="onMoveDownItem(event, '${idx}')" src="img/down.png">`
                if (!idx) elsMoveBtns = elMoveDownItem
                else if (idx === todos.length - 1) elsMoveBtns = elMoveUpItem
                else elsMoveBtns = elMoveDownItem + elMoveUpItem
            }
            var elImportanceStar = `<img class="star-${todo.importance} icon" onclick="onPromoteItem(event, '${todo.id}')" src="img/star-${todo.importance}.png">`
            
            return `<div class="todo-item"> ${elsMoveBtns} 
            <img class="delete icon" onclick="onDeleteTodo(event, '${todo.id}')" src="img/unchecked.png">
            ${elImportanceStar}
            <li class="${className}" onclick="onToggleTodo('${todo.id}')">
            ${todo.txt}
        </li></div>`
        })
    }
    document.querySelector('.todo-list').innerHTML = strHtmls.join('');
    renderRtlExtra()
    renderStats();
}

function renderStats() {
    document.querySelector('.total-count').innerText = getTotalCount();
    document.querySelector('.active-count').innerText = getActiveCount()
}

function onPutInput() {
    var elInput = document.querySelector('.user-input');
    elInput.addEventListener("keyup", function (ev) {
        ev.preventDefault();
        // If used pressed enter and theres any input, add todo.
        if (ev.key === 'Enter' && elInput.value) onAddTodo();
    });
}

function onAddTodo() {
    var txt = document.querySelector('.user-input').value;
    if (!txt) return;
    var imp = parseInt(document.querySelector('.importance').value);
    if (!imp) imp = 1;
    addTodo(txt, imp);
    renderTodos();
    renderClearUserInput();
}

function onDeleteTodo(ev, todoId) {
    ev.stopPropagation();   
    var elConfirmDelete = document.querySelector('.confirm-delete');
    elConfirmDelete.classList.remove('hide');
    gTodoIdToDelete = todoId;
}

function onToggleTodo(todoId) {
    toggleTodo(todoId);
    renderTodos();
}

function onSetFilter(elCriteria) {
    console.log('Filtering by', elCriteria.dataset.filter);
    var elFilters = document.querySelectorAll('.filter');
    elFilters.forEach(function(filter) { filter.classList.remove('filter-selected')});
    elCriteria.classList.add('filter-selected');
    setFilter(elCriteria.dataset.filter);
    renderTodos();
}

function onSetSort(value) {
    console.log('Sorting by', value);
    setSort(value);
    renderTodos();
}

function renderClearUserInput() {
    var elUserInput = document.querySelector('.user-input');
    var elUserImportance = document.querySelector('.importance');
    elUserInput.value = '';
}

function onMoveUpItem(ev, itemIdx) {
    console.log('Moving Up Item', itemIdx)
    ev.stopPropagation();
    moveUpItem(itemIdx);
    renderTodos();
}

function onMoveDownItem(ev, itemIdx) {
    console.log('Moving Down Item', itemIdx)
    ev.stopPropagation();
    moveDownItem(itemIdx);
    renderTodos();
}

function deleteOrKeep(el) {
    var elConfirmDelete = document.querySelector('.confirm-delete');
    if (el.dataset.delete === 'Delete') {
        deleteTodo(gTodoIdToDelete);
        elConfirmDelete.classList.add('hide');
        renderTodos();
    } else elConfirmDelete.classList.add('hide');
}

function onPromoteItem(ev, todoId) {
    ev.stopPropagation();
    promoteItem(todoId);
    renderTodos();
}

function onSetLang(lang) {
    gCurrLang = lang;
    if (lang === 'he') {
        $('body').addClass('rtl');
        $('#hebrew').attr('selected', true)
        $('.set-lang').addClass('set-lang-rtl');
        $('.star-1, .star-2, .star-3').addClass('star-rtl');
        $('.stats-container').addClass('stats-rtl');
        $('.confirm-delete').addClass('confirm-delete-rtl');
        
    }
    else {
        $('body').removeClass('rtl');
        $('.set-lang').removeClass('set-lang-rtl');
        $('.stats-container').removeClass('stats-rtl');
        $('.confirm-delete').removeClass('confirm-delete-rtl');
    }
    saveToStorage();
    doTrans();
}

function renderRtlExtra() {
    if (gCurrLang === 'he') $('.star-1, .star-2, .star-3').addClass('star-rtl');
}