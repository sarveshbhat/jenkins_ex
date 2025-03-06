let gridScale = 1;

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

function zoomGrid(event) {
    gridScale += event.deltaY > 0 ? -0.1 : 0.1;
    gridScale = Math.max(0.1, Math.min(gridScale, 10)); 
    updateGrid();
    event.preventDefault();
}


function resizeTextbox(textbox) {
    // Set the width to fit content
    textbox.style.width = "auto";
    textbox.style.height = "auto";

    // Get the natural size based on content
    const contentWidth = textbox.scrollWidth;
    const contentHeight = textbox.scrollHeight;

    // Apply the new size to the textbox
    textbox.style.width = `${contentWidth + 10}px`; // Adding padding
    textbox.style.height = `${contentHeight + 10}px`; // Adding padding
}

function makeTransformable(element) {
    let offsetX, offsetY;

    // Create the bounding box for resizing
    const boundingBox = document.createElement("div");
    boundingBox.classList.add("bounding-box");
    boundingBox.style.position = "absolute";
    boundingBox.style.border = "2px dashed #000";
    boundingBox.style.pointerEvents = "none"; // Bounding box should not capture events
    element.appendChild(boundingBox);

    // Add the resizing dots
    const resizeDots = ["top-left", "top-right", "bottom-left", "bottom-right"];
    resizeDots.forEach(position => {
        const resizeDot = document.createElement("div");
        resizeDot.classList.add("resize-dot", position);
        resizeDot.style.position = "absolute";
        boundingBox.appendChild(resizeDot);

        // Dragging behavior for resizing
        resizeDot.onmousedown = function(e) {
            e.stopPropagation(); // Prevent event from bubbling

            const initialWidth = element.offsetWidth;
            const initialHeight = element.offsetHeight;
            const initialLeft = element.offsetLeft;
            const initialTop = element.offsetTop;

            const initialX = e.clientX;
            const initialY = e.clientY;

            document.onmousemove = function(e) {
                const dx = e.clientX - initialX;
                const dy = e.clientY - initialY;

                // Adjust the element size based on the direction of the resize handle
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

                // Update the bounding box position and size to match the element
                updateBoundingBox(element);
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    });

    // Update the bounding box to match the size of the element
    function updateBoundingBox(element) {
        boundingBox.style.width = element.offsetWidth + "px";
        boundingBox.style.height = element.offsetHeight + "px";
        boundingBox.style.top = 0;
        boundingBox.style.left = 0;
    }

    // Initial update for the bounding box
    updateBoundingBox(element);

    // Add dragging functionality to the element
    element.onmousedown = function(event) {
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        document.onmousemove = function(event) {
            element.style.left = event.clientX - offsetX + 'px';
            element.style.top = event.clientY - offsetY + 'px';
            updateBoundingBox(element);
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
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
    textbox.textContent = "edit";
    
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

function addShape(type) {
    const shape = document.createElement("div");
    shape.classList.add("draggable", type);
    shape.style.position = "absolute";
    document.body.appendChild(shape);
    makeTransformable(shape);
    shape.style.transform = `scale(${gridScale})`;  
}


function makeResizable(element) {
    let initialWidth, initialHeight, initialX, initialY;

    // Create the bounding box for resizing
    const boundingBox = document.createElement("div");
    boundingBox.classList.add("bounding-box");
    boundingBox.style.position = "absolute";
    boundingBox.style.border = "2px dashed #000";
    boundingBox.style.pointerEvents = "none"; // Bounding box should not capture events
    element.appendChild(boundingBox);

    // Add the resizing dots at the corners
    const resizeDots = ["top-left", "top-right", "bottom-left", "bottom-right"];
    resizeDots.forEach(position => {
        const resizeDot = document.createElement("div");
        resizeDot.classList.add("resize-dot", position);
        resizeDot.style.position = "absolute";
        resizeDot.style.width = "10px";
        resizeDot.style.height = "10px";
        resizeDot.style.backgroundColor = "blue";  // Just for visibility
        boundingBox.appendChild(resizeDot);

        // Resizing logic for each corner
        resizeDot.onmousedown = function(e) {
            e.stopPropagation(); // Prevent event from bubbling

            initialWidth = element.offsetWidth;
            initialHeight = element.offsetHeight;
            initialX = e.clientX;
            initialY = e.clientY;

            document.onmousemove = function(e) {
                const dx = e.clientX - initialX;
                const dy = e.clientY - initialY;

                // Adjust the element's size based on which corner is being dragged
                if (position === "top-left") {
                    element.style.width = Math.max(20, initialWidth - dx) + "px";
                    element.style.height = Math.max(20, initialHeight - dy) + "px";
                    element.style.left = element.offsetLeft + dx + "px";
                    element.style.top = element.offsetTop + dy + "px";
                } else if (position === "top-right") {
                    element.style.width = Math.max(20, initialWidth + dx) + "px";
                    element.style.height = Math.max(20, initialHeight - dy) + "px";
                    element.style.top = element.offsetTop + dy + "px";
                } else if (position === "bottom-left") {
                    element.style.width = Math.max(20, initialWidth - dx) + "px";
                    element.style.height = Math.max(20, initialHeight + dy) + "px";
                    element.style.left = element.offsetLeft + dx + "px";
                } else if (position === "bottom-right") {
                    element.style.width = Math.max(20, initialWidth + dx) + "px";
                    element.style.height = Math.max(20, initialHeight + dy) + "px";
                }

                updateBoundingBox();
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    });

    // Update the bounding box to follow the element's size and position
    function updateBoundingBox() {
        boundingBox.style.left = `${element.offsetLeft}px`;
        boundingBox.style.top = `${element.offsetTop}px`;
        boundingBox.style.width = `${element.offsetWidth}px`;
        boundingBox.style.height = `${element.offsetHeight}px`;
    }

    // Dragging functionality for the whole shape (including the bounding box)
    let offsetX, offsetY;
    element.onmousedown = function(event) {
        offsetX = event.clientX - element.offsetLeft;
        offsetY = event.clientY - element.offsetTop;
        document.onmousemove = function(event) {
            element.style.left = event.clientX - offsetX + 'px';
            element.style.top = event.clientY - offsetY + 'px';
            updateBoundingBox();
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    // Initial bounding box update
    updateBoundingBox();
}



updateGrid();
