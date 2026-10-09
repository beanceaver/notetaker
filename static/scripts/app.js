
const sidebar = document.querySelector(".sidebar");
const hideSidebar = document.querySelector("#hide-sidebar");
const showSidebar = document.querySelector("#show-sidebar");
const group = document.querySelector(".plus-group"); // + button and menu combined
const button = document.querySelector("#plus-button");
const menu = document.querySelector("#menu");
const newFolder = document.querySelector("#new-folder");
const newNote = document.querySelector("#new-note");

button.addEventListener("click", () => { // for touch, tap
    menu.hidden = false;
});
document.addEventListener("click", (event) => { 
    if (!group.contains(event.target)) {
        menu.hidden = true;
    }
});

group.addEventListener("pointerenter", (event) => { // for mouse, hover
    if (event.pointerType !== "mouse" || !menu.hidden) return;
    menu.hidden = false;
});
group.addEventListener("pointerleave", () => {
    menu.hidden = true;
});

hideSidebar.addEventListener("click", () => {
    sidebar.style.display = "none";
    document.body.style.gridTemplateColumns = "minmax(0, 1fr)";
    showSidebar.hidden = false;
});
showSidebar.addEventListener("click", () => {
    sidebar.style.display = "";
    document.body.style.gridTemplateColumns = "";
    showSidebar.hidden = true;
});

const fileList = document.querySelector(".files");

newFolder.addEventListener("click", async () => {
    const folder = document.createElement("details");
    const heading = document.createElement("summary");
    const label = document.createElement("span");
    const chevron = document.createElement("img");

    chevron.src = "/static/img/folder-chevron.svg";
    chevron.className = "folder-chevron";

    label.textContent = "Folder";
    heading.append(chevron, label);
    folder.append(heading);
    fileList.append(folder);

    menu.hidden = true;

    try {
        const response = await fetch("/folders", {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error(`Folder request failed: ${response.status}`);
        }

        const savedFolder = await response.json();

        folder.dataset.id = savedFolder.id;
        label.textContent = savedFolder.name;
    } catch (error) {
        folder.remove();
        console.error(error);
        alert("Could not confirm folder creation.");
    }
});

newNote.addEventListener("click", async () => {
    const note = document.createElement("button");

    note.type = "button";
    note.className = "note";
    note.textContent = "Note";

    fileList.append(note);
    menu.hidden = true;

    try {
        const response = await fetch("/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folder_id: null }),
        });

        if (!response.ok) {
            throw new Error(`Note request failed: ${response.status}`);
        }

        const savedNote = await response.json();

        note.dataset.id = savedNote.id;
        note.draggable = true;
        note.textContent = savedNote.name;
    } catch (error) {
        note.remove();
        console.error(error);
        alert("Could not confirm note creation.");
    }
});

let draggedNote = null;

fileList.addEventListener("dragstart", (event) => {
    const note = event.target.closest(".note");

    if (!note || !note.dataset.id || !note.draggable) {
        event.preventDefault();
        return;
    }

    draggedNote = note;
    event.dataTransfer.setData("text/plain", note.dataset.id);
    event.dataTransfer.effectAllowed = "move";
});

fileList.addEventListener("dragend", () => {
    draggedNote = null;
});

fileList.addEventListener("dragover", (event) => {
    if (!draggedNote) return;

    const folder = event.target.closest("details");

    if (folder && !folder.dataset.id) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
});

fileList.addEventListener("drop", async (event) => {
    if (!draggedNote) return;

    event.preventDefault();

    const note = draggedNote;
    draggedNote = null;

    const folder = event.target.closest("details");

    if (folder && !folder.dataset.id) return;

    const destination = folder || fileList;
    const folderId = folder ? Number(folder.dataset.id) : null;

    if (note.parentElement === destination) return;

    note.draggable = false;

    try {
        const response = await fetch(`/notes/${note.dataset.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folder_id: folderId }),
        });

        if (!response.ok) {
            throw new Error(`Note move failed: ${response.status}`);
        }

        destination.append(note);

        if (folder) {
            folder.open = true;
        }
    } catch (error) {
        console.error(error);
        alert("Could not confirm the note's move.");
    } finally {
        note.draggable = true;
    }
});