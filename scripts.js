let gridScale = 1;
let gridSize = 10; // Example size of grid

function updateGrid() {
    const grid = document.getElementById("gridContainer");
    grid.innerHTML = ""; // Clear previous grid content

    // Define grid size dynamically based on the input or desired scale
    const cellSize = 40 * gridScale; // Each cell's size changes with zoom

    grid.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

    // Add new grid cells
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);

        // Add circle or blob to each cell
        if (i % 2 === 0) {
            const circle = document.createElement("div");
            circle.classList.add("circle");
            circle.style.width = `${20 * gridScale}px`;  // Circle size adjusted to zoom
            circle.style.height = `${20 * gridScale}px`;
            circle.style.borderRadius = "50%";
            circle.style.backgroundColor = "blue";
            cell.appendChild(circle);
        } else {
            const blob = document.createElement("div");
            blob.classList.add("blob");
            blob.style.width = `${25 * gridScale}px`;  // Blob size adjusted to zoom
            blob.style.height = `${25 * gridScale}px`;
            blob.style.borderRadius = "50%";
            blob.style.backgroundColor = "green";
            cell.appendChild(blob);
        }
    }

    // Reapply textboxes positions after zoom
    const textboxes = grid.querySelectorAll(".draggable");
    textboxes.forEach(textbox => {
        const rect = textbox.getBoundingClientRect();
        // Correctly adjust the position based on zoom and grid scale
        textbox.style.left = `${rect.left}px`;
        textbox.style.top = `${rect.top}px`;

        // Update size based on the new scale
        textbox.style.width = `${rect.width * gridScale}px`;
        textbox.style.height = `${rect.height * gridScale}px`;
    });
}

function zoomGrid(event) {
    gridScale += event.deltaY > 0 ? -0.1 : 0.1;
    gridScale = Math.max(0.1, Math.min(gridScale, 10)); // Limit the zoom scale to avoid extreme scaling
    updateGrid();
    event.preventDefault();
}

function addTextbox() {
    const textbox = document.createElement("div");
    textbox.classList.add("draggable", "textarea");
    textbox.contentEditable = true;
    textbox.style.position = "absolute"; // Still absolute to allow movement within grid
    textbox.style.border = "2px solid black";
    textbox.style.backgroundColor = "#fff";
    textbox.style.padding = "5px";
    textbox.textContent = "Click to edit!";
    
    // Append to grid container
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.appendChild(textbox);

    // Initial size and position adjustments based on zoom
    const initialSize = 100 * gridScale; // Example size for the textbox
    textbox.style.width = `${initialSize}px`;
    textbox.style.height = `${initialSize}px`;

    // Handle positioning: place it where the user clicked, for example
    textbox.style.left = `${50 * gridScale}px`;
    textbox.style.top = `${50 * gridScale}px`;

    makeTransformable(textbox);
}

function makeTransformable(element) {
    let offsetX, offsetY;

    // Make the element draggable within the grid
    element.onmousedown = function(e) {
        e.preventDefault();

        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;

        document.onmousemove = function(e) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

// Add event listeners for zooming
document.getElementById("gridContainer").addEventListener("wheel", zoomGrid);

// Initialize grid and elements
updateGrid();
