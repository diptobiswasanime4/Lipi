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

  const notebook = document.createElement("div");

  notebook.id = name;
  notebook.textContent = "📄 " + name;
  notebook.className = "notebook";

  notebookList.appendChild(notebook);

  const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
  notebooks.push({ name, type, size: notebookSize });
  localStorage.setItem("notebooks", JSON.stringify(notebooks));

  notebookInput.value = "";

  window.location.href = `notebook.html?name=${encodeURIComponent(name)}&type=${type}&size=${notebookSize}`;
}

// load existing notebooks
const saved = JSON.parse(localStorage.getItem("notebooks")) || [];
saved.forEach((item) => {
  console.log(item);

  const notebook = document.createElement("div");
  notebook.id = item.name;
  notebook.textContent = "📄 " + item.name;
  notebook.className = "notebook";

  notebook.addEventListener("click", () => {
    window.location.href = `notebook.html?name=${encodeURIComponent(item.name)}&type=${item.type}&size=${item.size}`;
  });

  notebookList.appendChild(notebook);
});
