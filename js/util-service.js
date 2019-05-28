'use strict';
function makeId(length=5) {
    var txt = ''; 
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
 
function saveToStorage(key, value) {
    var strValue = JSON.stringify(value);
    localStorage.setItem(key, strValue);
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

// use for display purpose only
// function getTime() {
//     return new Date(since1970here).toString().split(' ').slice(0, 5).join(' ');
// }

function alphabetSort(a, b) {
    if (a.txt.toLowerCase() > b.txt.toLowerCase()) return 1;
    else return -1;
}

function creationTimeSort(a, b) {
    if (a.createdAt < b.createdAt) return 1;
    else return -1;
}

function importanceSort(a, b) {
    if (a.importance < b.importance) return 1;
    else return -1;
}

// function confirmAction(action) {
//     return confirm(`Are you sure you want to ${action}?`)
// }
