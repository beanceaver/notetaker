
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