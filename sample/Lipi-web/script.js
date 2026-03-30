const sizeA4 = document.getElementById("sizeA4");
const sizeLandscape = document.getElementById("sizeLandscape");

const createWhiteBtn = document.getElementById("createNotebookWhite");
const createLineBtn = document.getElementById("createNotebookLine");
const createGridBtn = document.getElementById("createNotebookGrid");
const createDotBtn = document.getElementById("createNotebookDot");
const createHanziBtn = document.getElementById("createNotebookHanzi");
const notebookInput = document.getElementById("newNotebookName");
const notebookList = document.getElementById("notebookList");

createWhiteBtn.addEventListener("click", () => addNotebook("white"));
createLineBtn.addEventListener("click", () => addNotebook("line"));
createGridBtn.addEventListener("click", () => addNotebook("grid"));
createDotBtn.addEventListener("click", () => addNotebook("dot"));
createHanziBtn.addEventListener("click", () => addNotebook("hanzi"));

let notebookSize = "Landscape";

sizeA4.addEventListener("click", () => {
  notebookSize = "A4";
  sizeA4.style.background = "lightgray";
  sizeLandscape.style.background = "none";
});

sizeLandscape.addEventListener("click", () => {
  notebookSize = "Landscape";
  sizeLandscape.style.background = "lightgray";
  sizeA4.style.background = "none";
});

function addNotebook(type) {
  const name = notebookInput.value.trim();

  if (!name) return;

  const notebookRow = document.createElement("div");
  notebookRow.className = "notebookRow";

  const notebook = document.createElement("div");
  notebook.id = name;
  notebook.textContent = "📄 " + name;
  notebook.className = "notebook";

  notebook.addEventListener("click", () => {
    window.location.href = `notebook.html?name=${encodeURIComponent(name)}&type=${type}&size=${notebookSize}`;
  });

  /* COPY BUTTON */
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋";

  copyBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const newName = name + "_copy";

    const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
    notebooks.push({ name: newName, type, size: notebookSize });
    localStorage.setItem("notebooks", JSON.stringify(notebooks));

    /* copy notebook data */
    const oldData = localStorage.getItem(name);
    if (oldData) {
      localStorage.setItem(newName, oldData);
    }

    const copyNotebook = document.createElement("div");
    copyNotebook.className = "notebookRow";

    const copyTitle = document.createElement("div");
    copyTitle.textContent = "📄 " + newName;
    copyTitle.className = "notebook";

    copyTitle.addEventListener("click", () => {
      window.location.href = `notebook.html?name=${encodeURIComponent(newName)}&type=${type}&size=${notebookSize}`;
    });

    copyNotebook.appendChild(copyTitle);
    copyNotebook.appendChild(copyBtn.cloneNode(true));
    copyNotebook.appendChild(deleteBtn.cloneNode(true));

    notebookList.appendChild(copyNotebook);
  });

  /* DELETE BUTTON */
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
    const updated = notebooks.filter((n) => n.name !== name);
    localStorage.setItem("notebooks", JSON.stringify(updated));

    localStorage.removeItem(name);

    notebookRow.remove();
  });

  notebookRow.appendChild(notebook);
  notebookRow.appendChild(copyBtn);
  notebookRow.appendChild(deleteBtn);

  notebookList.appendChild(notebookRow);

  const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
  notebooks.push({ name, type, size: notebookSize });
  localStorage.setItem("notebooks", JSON.stringify(notebooks));

  notebookInput.value = "";

  window.location.href = `notebook.html?name=${encodeURIComponent(name)}&type=${type}&size=${notebookSize}`;
}

// load existing notebooks
const saved = JSON.parse(localStorage.getItem("notebooks")) || [];
saved.forEach((item) => {
  const notebookRow = document.createElement("div");
  notebookRow.className = "notebookRow";

  const notebook = document.createElement("div");
  notebook.id = item.name;
  notebook.textContent = "📄 " + item.name;
  notebook.className = "notebook";

  notebook.addEventListener("click", () => {
    window.location.href = `notebook.html?name=${encodeURIComponent(item.name)}&type=${item.type}&size=${item.size}`;
  });

  /* COPY BUTTON */
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋";

  copyBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const newName = item.name + "_copy";

    const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
    notebooks.push({ name: newName, type: item.type, size: item.size });
    localStorage.setItem("notebooks", JSON.stringify(notebooks));

    /* copy notebook data */
    const oldData = localStorage.getItem(item.name);
    if (oldData) {
      localStorage.setItem(newName, oldData);
    }

    const copyNotebook = document.createElement("div");
    copyNotebook.className = "notebookRow";

    const copyTitle = document.createElement("div");
    copyTitle.textContent = "📄 " + newName;
    copyTitle.className = "notebook";

    copyTitle.addEventListener("click", () => {
      window.location.href = `notebook.html?name=${encodeURIComponent(newName)}&type=${item.type}&size=${item.size}`;
    });

    copyNotebook.appendChild(copyTitle);
    copyNotebook.appendChild(copyBtn.cloneNode(true));
    copyNotebook.appendChild(deleteBtn.cloneNode(true));

    notebookList.appendChild(copyNotebook);
  });

  /* DELETE BUTTON */
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
    const updated = notebooks.filter((n) => n.name !== item.name);
    localStorage.setItem("notebooks", JSON.stringify(updated));

    localStorage.removeItem(item.name);

    notebookRow.remove();
  });

  notebookRow.appendChild(notebook);
  notebookRow.appendChild(copyBtn);
  notebookRow.appendChild(deleteBtn);

  notebookList.appendChild(notebookRow);
});
