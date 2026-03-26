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

function addNotebook(type) {
  const name = notebookInput.value.trim();

  if (!name) return;

  const notebook = document.createElement("div");

  notebook.id = name;
  notebook.textContent = "📄 " + name;
  notebook.className = "notebook";

  notebookList.appendChild(notebook);

  const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
  notebooks.push({ name, type });
  localStorage.setItem("notebooks", JSON.stringify(notebooks));

  notebookInput.value = "";
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
    window.location.href = `notebook.html?name=${encodeURIComponent(item.name)}&type=${item.type}`;
  });

  notebookList.appendChild(notebook);
});
