"use strict";
function getBooks(booktitle) {
    var from = rxjs.from;
    var _a = rxjs.operators, map = _a.map, switchMap = _a.switchMap, tap = _a.tap;
    var apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';
    var p = fetch(apiurl + booktitle)
        .then(function (res) { return res.json(); });
    //.then(books => console.log(books))
    from(p)
        .pipe(switchMap(function (data) { return from(data.items || []); }), map(function (ele) {
        var book = {
            title: ele.volumeInfo.title,
            categories: ele.volumeInfo.categories,
            authors: ele.volumeInfo.authors,
            description: ele.volumeInfo.description,
            thumbnail: ele.volumeInfo.imageLinks.thumbnail
        };
        return book;
    }))
        .subscribe(function (book) { return displayBook(book); });
}
function displayBook(book) {
    var bookTpl = "<div class=\"card mb-4 box-shadow\">\n                        <img class=\"card-img-top\" src=\"" + book.thumbnail + "\">\n                        <div class=\"card-body\">\n                            <h5 class=\"card-text\">" + book.title + "</h5>\n                            <div class=\"d-flex justify-content-between align-items-center\">\n                            <div class=\"btn-group\">\n                                <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\">View</button>\n                                <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\">Edit</button>\n                            </div>\n                            <small class=\"text-muted\">9 mins</small>\n                            </div>\n                        </div>\n                        </div>";
    var div = document.createElement('div');
    div.setAttribute('class', "col-md-4");
    div.innerHTML = bookTpl;
    var books = document.querySelector('#books');
    if (books) {
        books.appendChild(div);
    }
}
getBooks('rxjs');
