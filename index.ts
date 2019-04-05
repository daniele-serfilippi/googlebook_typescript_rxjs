declare const rxjs: any;

interface GoogleBook {
    totalIteml: number
    kind: string
    items: []
}

interface BookThumbnail {
    smallThumbnail: string
    thumbnail: string
}

interface VolumeInfo {
    authors: []
    description: string
    imageLinks: BookThumbnail
    infoLink: string
    language: string
    previewLink: string
    title: string
    categories: []
}

interface Book {
    authors: []
    description: string
    title: string
    categories: []
    thumbnail: string
}

interface BookItem {
    volumeInfo: VolumeInfo
    id: string
}

function showTotal(total: number) {
    const found = document.querySelector('#found');
    if (found) {
        found.textContent = total.toString();
    }
}

function getBooks(booktitle: string) {
    const { from } = rxjs;
    const { map, switchMap, tap } = rxjs.operators;
    const apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';

    const p = fetch(apiurl + booktitle)
    .then(res => res.json())
    //.then(books => console.log(books))

    return from(p)
    .pipe(
        tap((data: GoogleBook) => showTotal(data.items.length)),
        switchMap((data: GoogleBook) => from(data.items || [])),
        map((ele: BookItem) => {
            const book: Book = {
                title: ele.volumeInfo.title,
                categories: ele.volumeInfo.categories,
                authors: ele.volumeInfo.authors,
                description: ele.volumeInfo.description,
                thumbnail: ele.volumeInfo.imageLinks.thumbnail
            }
            return book;
        }),
        //tap((book: Book) => console.log(book)),
    )
    
}

function displayBook(book: Book) {
    const bookTpl = `<div class="card mb-4 box-shadow">
                        <img class="card-img-top" src="${book.thumbnail}">
                        <div class="card-body">
                            <h5 class="card-text">${book.title}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                            </div>
                        </div>
                        </div>`;

    const div = document.createElement('div');
    div.setAttribute('class', "col-md-4");
    div.innerHTML = bookTpl;
    const books = document.querySelector('#books');
    if (books) {
        books.appendChild(div)
    }
}

function cleanBooks() {
    const books = document.querySelector('#books');
    if (books) {
        books.innerHTML= '';
    }
}

function searchBooks() {
    const searchEle = document.querySelector('#search');
    const { fromEvent } = rxjs;
    const { filter, map, switchMap, debounceTime, tap } = rxjs.operators;
    if (searchEle) {
        fromEvent(searchEle, 'keyup')
            .pipe(
                map((ele: any) => ele.target.value),
                filter((ele: string) => ele.length > 2),
                debounceTime(1200),
                tap(() => cleanBooks()),
                switchMap((ele: string) => getBooks(ele))
            )
            .subscribe((book: Book) => displayBook(book))

        
    }
    
}

function searchByButton() {

    const search: any = document.querySelector('#search');

    if (search) {
        getBooks(search.value)
        .subscribe((book: Book) => displayBook(book))
    }
}

function cleanBooksByButton() {
    document.getElementById('search').value = '';
    document.getElementById('found').textContent = '0';
    cleanBooks();

}

searchBooks();

//getBooks('rxjs');
