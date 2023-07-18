const API_URL = "https://www.anapioficeandfire.com/api/books";
const booksContainer = document.getElementById("books-container");
const searchInput = document.getElementById("search-input");

let booksData = []; // Store the fetched books data

// Fetch data from the API
async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
}

// Fetch character details for a book
async function fetchCharacters(urls) {
  try {
    const promises = urls.map(url => fetch(url).then(response => response.json()));
    const characters = await Promise.all(promises);
    return characters.map(character => character.name);
  } catch (error) {
    console.log("Error:", error);
  }
}

// Display book information on the page
async function displayBooks(books) {
  booksContainer.innerHTML = ""; // Clear previous results

  for (const book of books) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const titleElement = document.createElement("h2");
    titleElement.textContent = book.name;

    const isbnElement = document.createElement("p");
    isbnElement.textContent = `ISBN: ${book.isbn}`;

    const pagesElement = document.createElement("p");
    pagesElement.textContent = `Pages: ${book.numberOfPages}`;

    const authorsElement = document.createElement("p");
    authorsElement.textContent = `Authors: ${book.authors.join(", ")}`;

    const publisherElement = document.createElement("p");
    publisherElement.textContent = `Publisher: ${book.publisher}`;

    const releasedElement = document.createElement("p");
    releasedElement.textContent = `Released: ${book.released}`;

    const charactersElement = document.createElement("p");
    const characterNames = await fetchCharacters(book.characters.slice(0, 5));
    charactersElement.textContent = `Characters: ${characterNames.join(", ")}`;

    bookElement.appendChild(titleElement);
    bookElement.appendChild(isbnElement);
    bookElement.appendChild(pagesElement);
    bookElement.appendChild(authorsElement);
    bookElement.appendChild(publisherElement);
    bookElement.appendChild(releasedElement);
    bookElement.appendChild(charactersElement);

    booksContainer.appendChild(bookElement);
  }
}

// Filter books based on search input
function filterBooks(searchText) {
  const filteredBooks = booksData.filter(book => {
    return (
      book.name.toLowerCase().includes(searchText.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchText.toLowerCase()) ||
      book.authors.join(", ").toLowerCase().includes(searchText.toLowerCase()) ||
      book.publisher.toLowerCase().includes(searchText.toLowerCase()) ||
      book.released.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  displayBooks(filteredBooks);
}

// Handle search input changes
searchInput.addEventListener("input", event => {
  const searchText = event.target.value;
  filterBooks(searchText);
});

// Fetch books and display them on the page
async function showBooks() {
  booksData = await fetchBooks();
  if (booksData) {
    displayBooks(booksData.slice(0, 10));
  }
}

// Call the function to start the process
showBooks();