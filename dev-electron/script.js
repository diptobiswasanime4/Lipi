const createBtn = document.getElementById("createNotebook");
const notebookInput = document.getElementById("newNotebookName");
const notebookList = document.getElementById("notebookList");

createBtn.addEventListener("click", async () => {
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

  // get existing notebooks from electron
  const notebooks = (await window.electronAPI.getNotebooks()) || [];

  notebooks.push(name);

  // save back using electron
  await window.electronAPI.saveNotebooks(notebooks);

  notebookInput.value = "";
});

// load existing notebooks (same structure as browser code)
(async () => {
  const saved = (await window.electronAPI.getNotebooks()) || [];

  saved.forEach((name) => {
    const notebook = document.createElement("div");

    notebook.id = name;
    notebook.textContent = "📄 " + name;
    notebook.className = "notebook";

    notebook.addEventListener("click", () => {
      // window.location.href = `notebook.html?name=${encodeURIComponent(name)}`;
      window.location.href = `notebook.html`;
    });

    notebookList.appendChild(notebook);
  });
})();
