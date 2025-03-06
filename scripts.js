function updateGrid() {
    const size = document.getElementById("gridSize").value;
    const grid = document.getElementById("gridContainer");
    grid.innerHTML = "";

    grid.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    grid.style.gridTemplateRows = `repeat(${size}, 40px)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
    }

    grid.style.transform = `scale(${gridScale})`;
    grid.style.transformOrigin = "top left";  // Ensures grid zooms from the top left

    const allShapes = document.querySelectorAll(".draggable");
    allShapes.forEach(shape => {
        shape.style.transform = `scale(${gridScale})`;
        // Reposition textboxes if necessary after zooming
        const rect = shape.getBoundingClientRect();
        shape.style.left = `${rect.left}px`;
        shape.style.top = `${rect.top}px`;
    });
}

function addTextbox() {
    // Create the textbox div
    const textbox = document.createElement("div");
    textbox.classList.add("draggable", "textarea");
    textbox.style.position = "absolute";
    textbox.style.border = "2px solid #000";
    textbox.style.backgroundColor = "#fff";
    textbox.style.padding = "5px";
    textbox.contentEditable = true; // Make the textbox editable

    // Add some initial content to show resize based on content
    textbox.textContent = "Resize me based on my content!";
    
    // Append the textbox to the grid container
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.appendChild(textbox);

    // Automatically resize the textbox based on content
    resizeTextbox(textbox);

    // Observe changes in the content and resize the box
    const observer = new MutationObserver(() => resizeTextbox(textbox));
    observer.observe(textbox, { childList: true, subtree: true });

    // Make the textbox transformable (draggable and resizable)
    makeTransformable(textbox);
    
    // Update position after zoom
    textbox.style.left = `${textbox.offsetLeft}px`;
    textbox.style.top = `${textbox.offsetTop}px`;
}

function zoomGrid(event) {
    gridScale += event.deltaY > 0 ? -0.1 : 0.1;
    gridScale = Math.max(0.1, Math.min(gridScale, 10)); 
    updateGrid();
    event.preventDefault();
}
