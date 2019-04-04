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


function getBooks(booktitle: string) {
    const { from } = rxjs;
    const { map, switchMap, tap } = rxjs.operators;
    const apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';

    const p = fetch(apiurl + booktitle)
    .then(res => res.json())
    //.then(books => console.log(books))

    from(p)
    .pipe(
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
    .subscribe((book: Book) => displayBook(book))
}

function displayBook(book: Book) {
    const bookTpl = `<div class="card mb-4 box-shadow">
                        <img class="card-img-top" src="${book.thumbnail}">
                        <div class="card-body">
                            <h5 class="card-text">${book.title}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                            </div>
                            <small class="text-muted">9 mins</small>
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

getBooks('rxjs');
