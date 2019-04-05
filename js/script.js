"use strict";
function showTotal(total) {
    var found = document.querySelector('#found');
    if (found) {
        found.textContent = total.toString();
    }
}
function getBooks(booktitle) {
    var from = rxjs.from;
    var _a = rxjs.operators, map = _a.map, switchMap = _a.switchMap, tap = _a.tap;
    var apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';
    var p = fetch(apiurl + booktitle)
        .then(function (res) { return res.json(); });
    //.then(books => console.log(books))
    return from(p)
        .pipe(tap(function (data) { return showTotal(data.items.length); }), switchMap(function (data) { return from(data.items || []); }), map(function (ele) {
        var book = {
            title: ele.volumeInfo.title,
            categories: ele.volumeInfo.categories,
            authors: ele.volumeInfo.authors,
            description: ele.volumeInfo.description,
            thumbnail: ele.volumeInfo.imageLinks.thumbnail
        };
        return book;
    }));
}
function displayBook(book) {
    var bookTpl = "<div class=\"card mb-4 box-shadow\">\n                        <img class=\"card-img-top\" src=\"" + book.thumbnail + "\">\n                        <div class=\"card-body\">\n                            <h5 class=\"card-text\">" + book.title + "</h5>\n                            <div class=\"d-flex justify-content-between align-items-center\">\n                            </div>\n                        </div>\n                        </div>";
    var div = document.createElement('div');
    div.setAttribute('class', "col-md-4");
    div.innerHTML = bookTpl;
    var books = document.querySelector('#books');
    if (books) {
        books.appendChild(div);
    }
}
function cleanBooks() {
    var books = document.querySelector('#books');
    if (books) {
        books.innerHTML = '';
    }
}
function searchBooks() {
    var searchEle = document.querySelector('#search');
    var fromEvent = rxjs.fromEvent;
    var _a = rxjs.operators, filter = _a.filter, map = _a.map, switchMap = _a.switchMap, debounceTime = _a.debounceTime, tap = _a.tap;
    if (searchEle) {
        fromEvent(searchEle, 'keyup')
            .pipe(map(function (ele) { return ele.target.value; }), filter(function (ele) { return ele.length > 2; }), debounceTime(1200), tap(function () { return cleanBooks(); }), switchMap(function (ele) { return getBooks(ele); }))
            .subscribe(function (book) { return displayBook(book); });
    }
}
function searchByButton() {
    var search = document.querySelector('#search');
    if (search) {
        getBooks(search.value)
            .subscribe(function (book) { return displayBook(book); });
    }
}
function cleanBooksByButton() {
    document.getElementById('search').value = '';
    document.getElementById('found').textContent = '0';
    cleanBooks();
}
searchBooks();
//getBooks('rxjs');
