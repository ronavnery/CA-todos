'use strict';
var gTodos;
var gFilterBy = 'All';
var gSortBy;
var gTranslations = {
    'importance-title': {
        en: 'Importance',
        he: 'חשיבות'
    },
    'importance-low': {
        en: 'Low',
        he: 'נמוכה'
    },
    'importance-med': {
        en: 'Medium',
        he: 'בינונית'
    },
    'importance-high': {
        en: 'High',
        he: 'גבוהה'
    },
    'user-input': {
        en: 'Add a task...',
        he: 'משימה חדשה...'
    },
    add: {
        en: 'Add',
        he: 'הוסף'
    },
    'sort-title': {
        en: 'Sort by:',
        he: 'מיין לפי:'
    },
    'sort-abc': {
        en: 'Alphabet',
        he: 'אלפבית'
    },
    'sort-time': {
        en: 'Creation time',
        he: 'תאריך יצירה'
    },
    'sort-imp': {
        en: 'Importance',
        he: 'חשיבות'
    },
    'sort-cus': {
        en: 'Manual',
        he: 'ידנית'
    },
    'filter-all': {
        en: 'All',
        he: 'כל המשימות'
    },
    'filter-act': {
        en: 'Active',
        he: 'לביצוע'
    },
    'filter-com': {
        en: 'Completed',
        he: 'הושלמו'
    },
    'stats-tot': {
        en: 'Total items:',
        he: 'סה"כ משימות:'
    },
    'stats-act': {
        en: 'Active items:',
        he: 'לביצוע:'
    },
    'delete-title': {
        en: ' Are you sure you want to delete?',
        he: 'בטוח למחוק?'
    },
    'delete-yes': {
        en: 'Delete',
        he: 'מחק'
    },
    'delete-no': {
        en: 'Keep',
        he: 'השאר'
    },
    'noAnyTodosMsg': {
        en: 'There\'s no Todo\'s in here.<br>Add some above to get started.',
        he: 'אין כאן משימות, הוסף כמה בשביל להתחיל...'
    },
    'noActiveTodosMsg': {
        en: 'There\'s no active Todo\'s.',
        he: 'אין משימות פעילות.'
    },
    'noCompletedTodosMsg': {
        en: 'There\'s no completed Todo\'s.',
        he: 'אין משימות שבוצעו.'
    }
}

function doTrans() {
    var els = document.querySelectorAll('[data-trans]');
    els.forEach(function(el) {
        var transKey = el.dataset.trans;
        var translatedTxt = getTrans(transKey);
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', translatedTxt);
        } else {
            el.innerText = translatedTxt;
        }
    })
}

function getTrans(key) {
    var toTranslate = gTranslations[key];
    if (!toTranslate) return 'Unknown';
    var translatedOutput = toTranslate[gCurrLang];
    
    if (!translatedOutput) translatedOutput = toTranslate['en'];
    return translatedOutput;
}

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