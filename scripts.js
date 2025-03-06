// Grid-related functions
let gridScale = 1;

function updateGrid() {
    const size = document.getElementById("gridSize").value;
    const grid = document.getElementById("gridContainer");
    grid.innerHTML = ""; // Clear the grid before adding new cells

    // Set grid layout
    grid.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    grid.style.gridTemplateRows = `repeat(${size}, 40px)`;

    // Add grid cells
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
    }

    // Apply scale transform to grid and draggable shapes
    grid.style.transform = `scale(${gridScale})`;
    document.querySelectorAll(".draggable").forEach(shape => {
        shape.style.transform = `scale(${gridScale})`;
    });
}

function zoomGrid(event) {
    gridScale += event.deltaY > 0 ? -0.1 : 0.1;
    gridScale = Math.max(0.1, Math.min(gridScale, 10)); 
    updateGrid();
    event.preventDefault();
}

// Textbox resizing function
function resizeTextbox(textbox) {
    // Set width and height to auto for natural content size
    textbox.style.width = "auto";
    textbox.style.height = "auto";
    textbox.style.width = `${textbox.scrollWidth + 10}px`;
    textbox.style.height = `${textbox.scrollHeight + 10}px`;
}

// Make an element transformable (draggable and resizable)
function makeTransformable(element) {
    let offsetX, offsetY;

    // Create bounding box for resizing
    const boundingBox = createBoundingBox(element);
    element.appendChild(boundingBox);

    // Make element resizable with resize dots
    createResizeDots(boundingBox, element);

    // Make element draggable
    element.onmousedown = function(event) {
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        document.onmousemove = function(event) {
            element.style.left = event.clientX - offsetX + 'px';
            element.style.top = event.clientY - offsetY + 'px';
            updateBoundingBox(element, boundingBox);
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

// Create bounding box for resizing
function createBoundingBox(element) {
    const boundingBox = document.createElement("div");
    boundingBox.classList.add("bounding-box");
    boundingBox.style.position = "absolute";
    boundingBox.style.border = "2px dashed #000";
    boundingBox.style.pointerEvents = "none"; // Prevent bounding box from capturing events
    updateBoundingBox(element, boundingBox);
    return boundingBox;
}

// Update bounding box to follow element's size and position
function updateBoundingBox(element, boundingBox) {
    boundingBox.style.width = `${element.offsetWidth}px`;
    boundingBox.style.height = `${element.offsetHeight}px`;
    boundingBox.style.top = `${element.offsetTop}px`;
    boundingBox.style.left = `${element.offsetLeft}px`;
}

// Create resize dots for the corners of the bounding box
function createResizeDots(boundingBox, element) {
    const resizeDots = ["top-left", "top-right", "bottom-left", "bottom-right"];
    resizeDots.forEach(position => {
        const resizeDot = document.createElement("div");
        resizeDot.classList.add("resize-dot", position);
        resizeDot.style.position = "absolute";
        resizeDot.style.width = "10px";
        resizeDot.style.height = "10px";
        resizeDot.style.backgroundColor = "blue";  // Visible color for dots
        boundingBox.appendChild(resizeDot);

        // Add resizing behavior
        resizeDot.onmousedown = (e) => handleResize(e, position, element);
    });
}

// Handle resizing of element based on drag direction
function handleResize(event, position, element) {
    const initialWidth = element.offsetWidth;
    const initialHeight = element.offsetHeight;
    const initialX = event.clientX;
    const initialY = event.clientY;
    const initialLeft = element.offsetLeft;
    const initialTop = element.offsetTop;

    document.onmousemove = (e) => {
        const dx = e.clientX - initialX;
        const dy = e.clientY - initialY;

        // Resize logic based on direction
        if (position === "top-left") {
            element.style.width = Math.max(20, initialWidth - dx) + "px";
            element.style.height = Math.max(20, initialHeight - dy) + "px";
            element.style.left = initialLeft + dx + "px";
            element.style.top = initialTop + dy + "px";
        } else if (position === "top-right") {
            element.style.width = Math.max(20, initialWidth + dx) + "px";
            element.style.height = Math.max(20, initialHeight - dy) + "px";
            element.style.top = initialTop + dy + "px";
        } else if (position === "bottom-left") {
            element.style.width = Math.max(20, initialWidth - dx) + "px";
            element.style.height = Math.max(20, initialHeight + dy) + "px";
            element.style.left = initialLeft + dx + "px";
        } else if (position === "bottom-right") {
            element.style.width = Math.max(20, initialWidth + dx) + "px";
            element.style.height = Math.max(20, initialHeight + dy) + "px";
        }

        updateBoundingBox(element, element.querySelector(".bounding-box"));
    };

    document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
    };
}

// Function to add a new textbox to the grid
function addTextbox() {
    const textbox = document.createElement("div");
    textbox.classList.add("draggable", "textarea");
    textbox.style.position = "absolute";
    textbox.style.border = "2px solid #000";
    textbox.style.backgroundColor = "#fff";
    textbox.style.padding = "1px";
    textbox.contentEditable = true;
    textbox.textContent = "Edit";

    // Append textbox to grid and make it resizable and draggable
    const gridContainer = document.getElementById("gridContainer");
    gridContainer.appendChild(textbox);
    resizeTextbox(textbox);

    const observer = new MutationObserver(() => resizeTextbox(textbox));
    observer.observe(textbox, { childList: true, subtree: true });

    makeTransformable(textbox);
}

// Function to add a new shape to the grid
function addShape(type) {
    const shape = document.createElement("div");
    shape.classList.add("draggable", type);
    shape.style.position = "absolute";
    document.body.appendChild(shape);
    makeTransformable(shape);
    shape.style.transform = `scale(${gridScale})`;  
}

// Initialize the grid
updateGrid();
