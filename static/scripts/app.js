
const sidebar = document.querySelector(".sidebar");
const hideSidebar = document.querySelector("#hide-sidebar");
const showSidebar = document.querySelector("#show-sidebar");
const control = document.querySelector(".create-control"); // + button and menu combined
const button = document.querySelector("#create-button");
const menu = document.querySelector("#create-menu");

button.addEventListener("click", () => { // for touch 
    menu.hidden = false;
});
document.addEventListener("click", (event) => { 
    if (!control.contains(event.target)) {
        menu.hidden = true;
    }
});

control.addEventListener("pointerenter", (event) => { // for mouse
    if (event.pointerType !== "mouse" || !menu.hidden) return;
    menu.hidden = false;
});
control.addEventListener("pointerleave", () => {
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