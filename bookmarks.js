let bookmarks = []

const bookmarksFromLocalStorage = JSON.parse( localStorage.getItem("myBookmarks") )

const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")
const inputBtn = document.getElementById("input-btn")
const deleteBtn = document.getElementById("delete-btn")
const saveTabBtn = document.getElementById("tab-btn")
const exportTabBtn = document.getElementById("export-btn")

if (bookmarksFromLocalStorage) {
    bookmarks = bookmarksFromLocalStorage
    render(bookmarks)
}

inputBtn.addEventListener("click", function() {
    if (inputEl.value) {
        bookmarks.push(inputEl.value)
        inputEl.value = ""
        saveToLocalStorage("myBookmarks", bookmarks)
        inputEl.focus()
    }
})

deleteBtn.addEventListener("click", function() {
    const answer = confirm("Are you sure?")
    if (answer) {
        localStorage.clear()
        bookmarks = []
        render(bookmarks)
    }
})

saveTabBtn.addEventListener("click", function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        bookmarks.push(tabs[0].url)
        saveToLocalStorage("myBookmarks", bookmarks)
    })
})

function refresh () {
    document.querySelectorAll('.remove').forEach(item => {
        item.addEventListener('click', event => {
           bookmarks.splice(item.id, 1);
           saveToLocalStorage("myBookmarks", bookmarks)
        })
     })
}

function render (items) {
    let listItems = ""
    for (let i = 0; i < items.length; i++) {
        listItems += `
        <li>
            <a target='_blank' href='${items[i]}'>${items[i]}</a>
            <a title="Remove" href="" class="remove"" id='${i}'> [x] </a>
        </li>
        `
    }
    ulEl.innerHTML = listItems
    refresh ()
}

function saveToLocalStorage (objectName, object) {
    localStorage.setItem( objectName, JSON.stringify( object ) )
    render(bookmarks)
}

exportTabBtn.addEventListener("click", () => {
        const str = JSON.stringify( bookmarks )
        const blob = new Blob( [ str ], {
          type: 'application/json'
        })

        const element = document.createElement("a")
        element.href = URL.createObjectURL( blob )
        element.download = "bookmarks.json"
        document.body.appendChild( element )
        element.click()
})
