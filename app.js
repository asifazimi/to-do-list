// ***** SELECT ITEMS *****
const form = document.querySelector(".dolist-form");
const alert = document.querySelector(".alert");
const search = document.querySelector(".dolist-input");
const submitBtn = document.querySelector(".dolist-submit");
const container = document.querySelector(".items");
const list = document.querySelector(".item-list");
const clearBtns = document.querySelector(".clearBtns");

// OPTIONS
let editElement;
let editFlag = false;
let editID = "";

// ***** EVEN LISTENER *****
form.addEventListener("submit", addItem);
clearBtns.addEventListener("click", removeItem);
window.addEventListener("DOMContentLoaded", setupItems);

// FUNCTIONS
function addItem(e) {
  e.preventDefault();
  let value = search.value;
  let id = new Date().getTime();
  toString();
  if (value && !editFlag) {
    setElement(id, value);
    // display alert
    displayMessage("item added successfully!", "success");
    // show items
    container.classList.add("show-items");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    const editedValue = (editElement.innerHTML = value);
    displayMessage(`item has been edited to ${editedValue}`, "success");
    // edit from local storage
    // editFromLocalStorage(id, value);
    setBackToDefault();
  } else {
    displayMessage("please add an item!", "success");
  }
}

// show alert message
function displayMessage(message, action) {
  alert.style.opacity = 1;
  alert.classList.add(`alert-${action}`);
  alert.textContent = message;

  // remove alert message
  setTimeout(function () {
    alert.style.opacity = 0;
    alert.textContent = message;
  }, 2000);
}

// remove items
function removeItem() {
  const items = document.querySelectorAll(".item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-items");
  displayMessage("all items deleted!", "success");
  setBackToDefault();
  localStorage.removeItem("list");
}

// remove item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-items");
  }
  displayMessage("item deleted!", "success");
  setBackToDefault();
  // to remove from local storage
  removeFromLocalStorage(id);
}

// edit item
function editItem(e) {
  const element = e.currentTarget.parentNode.parentNode;
  editElement = e.currentTarget.parentNode.previousElementSibling;
  search.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.value = "Edit";
  // editLocalStorage(editID);
}

// set back to default
function setBackToDefault() {
  search.value = "";
  editFlag = false;
  editID = "";
  submitBtn.value = "add";
}

// **** LOCAL STORAGE *****
function addToLocalStorage(id, value) {
  const search = { id: id, value: value };
  const items = getLocalStorage();
  items.push(search);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

function editFromLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function editLocalStorage(editID, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }

    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

// **** SETUP ITEMS ****
function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items = items.forEach(function (item) {
      setElement(item.id, item.value);
    });

    container.classList.add("show-items");
  }
}

function setElement(id, value) {
  const element = document.createElement("div");
  // add class
  element.classList.add("item");
  // add id
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="item-title">${value}</p>
  <div class="item-content">
    <button type="button" class="btn-edit">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="btn-delete">
      <i class="fas fa-trash"></i>
    </button>
  </div>`;
  list.appendChild(element);
  const deleteBtn = element.querySelector(".btn-delete");
  const editBtn = element.querySelector(".btn-edit");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
}

// localStorage API
// setItem
// getItem
// save as strings
// localStorage.setItem(
//   "apple",
//   JSON.stringify(["asif", "arif", "sakhi", "setayseh", "danial"])
// );
// const apples = JSON.parse(localStorage.getItem("apple"));
// console.log(apples);
// localStorage.removeItem("apple");
