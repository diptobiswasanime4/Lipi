const createBtn = document.getElementById("createNotebook");
const notebookInput = document.getElementById("newNotebookName");
const notebookList = document.getElementById("notebookList");

createBtn.addEventListener("click", () => {
  const name = notebookInput.value.trim();

  if (!name) return;

  const notebook = document.createElement("div");

  notebook.id = name;
  notebook.textContent = "📄 " + name;
  notebook.className = "notebook";

  notebook.addEventListener("click", () => {
    window.location.href = `notebook.html?name=${encodeURIComponent(name)}`;
  });

  notebookList.appendChild(notebook);

  const notebooks = JSON.parse(localStorage.getItem("notebooks")) || [];
  notebooks.push(name);
  localStorage.setItem("notebooks", JSON.stringify(notebooks));

  notebookInput.value = "";
});

// load existing notebooks
const saved = JSON.parse(localStorage.getItem("notebooks")) || [];
saved.forEach((name) => {
  const notebook = document.createElement("div");
  notebook.id = name;
  notebook.textContent = "📄 " + name;
  notebook.className = "notebook";

  notebook.addEventListener("click", () => {
    window.location.href = `notebook.html?name=${encodeURIComponent(name)}`;
  });

  notebookList.appendChild(notebook);
});
