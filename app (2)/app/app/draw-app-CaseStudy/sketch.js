// Global variables to store the toolbox, color palette, and helpers
var toolbox = null;
var colourP = null;
var helpers = null;



// Spray can object literal
var sprayCan = {
    name: "sprayCanTool",
    icon: "assets/sprayCan.jpg",
    points: 13,
    spread: 10,
    thickness: 1,
    draw: function() {
        if (mouseIsPressed) {
            for (var i = 0; i < this.points; i++) {
                stroke(colourP.selectedColour);
                strokeWeight(1);
                point(random(mouseX - this.spread, mouseX + this.spread),
                    random(mouseY - this.spread, mouseY + this.spread));
            }
        }
    }
};

// Pen tool
var penTool = {
    name: "penTool",
    icon: "assets/pentool.png",
    isDrawing: false,
    prevX: 0,
    prevY: 0,
    strokeWeight: 2,
    thickness: 2,
    draw: function() {
        if (mouseIsPressed) {
            stroke(colourP.selectedColour);
            strokeWeight(this.strokeWeight);
            if (!this.isDrawing) {
                beginShape();
                vertex(mouseX, mouseY);
                this.isDrawing = true;
            } else {
                line(this.prevX, this.prevY, mouseX, mouseY);
            }
            this.prevX = mouseX;
            this.prevY = mouseY;
        } else {
            if (this.isDrawing) {
                endShape();
                this.isDrawing = false;
            }
        }
    }
};

// Highlighter tool
var highlighterTool = {
    name: "highlighterTool",
    icon: "assets/highlightertool.png",
    size: 10,
    thickness: 20, 
    draw: function() {
        if (mouseIsPressed) {
            stroke(colourP.selectedColour);
            strokeWeight(20);
            line(pmouseX, pmouseY, mouseX, mouseY);
        }
    }
};

// Create Charcoal Tool
var charcoalTool = {
    name: "Charcoal Tool",
    icon: "assets/charcoalTool.png",
    size: 8,
    thickness: 8,
    color: [50, 50, 50],
    draw: function() {
        if (mouseIsPressed) {
            stroke(this.color);
            strokeWeight(this.size);
            line(pmouseX + random(-3, 3), pmouseY + random(-3, 3), mouseX + random(-3, 3), mouseY + random(-3, 3));
        }
    }
};

// Create Airbrush Tool
var airbrushTool = {
    name: "Airbrush Tool",
    icon: "assets/airbrushTool.png",
    size: 7,
    color: [150, 150, 150],
    thickness: 7,
    draw: function() {
        if (mouseIsPressed) {
            stroke(this.color);
            strokeWeight(this.size);
            point(mouseX, mouseY);
        }
    }
};

// Triangle tool
var triangleTool = {
    name: "triangleTool",
    icon: "assets/triangleTool.png",
    thickness: 2,
    vertices: [],

    draw: function() {
        stroke(colourP.selectedColour);
        strokeWeight(this.thickness);

        if (mouseIsPressed) {
            // Capture the first vertex when the mouse is pressed
            if (this.vertices.length === 0) {
                this.vertices.push(createVector(mouseX, mouseY));
            } else {
                // Draw a line from the last captured vertex to the current mouse position
                line(this.vertices[this.vertices.length - 1].x, this.vertices[this.vertices.length - 1].y, mouseX, mouseY);

                // If three vertices are captured, draw a triangle and reset the vertices array
                if (this.vertices.length === 2) {
                    line(this.vertices[0].x, this.vertices[0].y, mouseX, mouseY);
                    line(this.vertices[0].x, this.vertices[0].y, this.vertices[1].x, this.vertices[1].y);
                    this.vertices = [];
                } else {
                    // Capture additional vertices
                    this.vertices.push(createVector(mouseX, mouseY));
                }
            }
        }
    }
};

// Square tool
var squareTool = {
    name: "squareTool",
    icon: "assets/square.png",
    thickness: 2,
    startVertex: null,

    draw: function() {
        stroke(colourP.selectedColour);
        strokeWeight(this.thickness);

        if (mouseIsPressed) {
            // Capture the starting vertex when the mouse is pressed
            if (this.startVertex === null) {
                this.startVertex = createVector(mouseX, mouseY);
            } else {
                // Calculate the width and height based on the starting vertex
                var width = mouseX - this.startVertex.x;
                var height = mouseY - this.startVertex.y;

                // Draw the square
                rect(this.startVertex.x, this.startVertex.y, width, height);
            }
        } else {
            // Reset the starting vertex when the mouse is released
            this.startVertex = null;
        }
    }
};

// PaintBrush tool
var paintBrushTool = {
    name: "paintBrushTool",
    icon: "assets/brush.png",
    size: 5,
    thickness: 5,
    draw: function() {
        if (mouseIsPressed) {
            stroke(colourP.selectedColour);
            strokeWeight(this.size);
            line(pmouseX, pmouseY, mouseX, mouseY);
        }
    }
};



// Initialize the current tool
var currentTool = markerTool;

function setup() {
    // Create a canvas to fill the content div from index.html
    canvasContainer = select('#content');
    var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    c.parent("content");

    // Create helper functions and the color palette
    helpers = new HelperFunctions();  // Replace with your actual HelperFunctions class
    colourP = new ColourPalette();    // Replace with your actual ColourPalette class

    // Create a toolbox for storing the tools
    toolbox = new Toolbox();

    // Add the tools to the toolbox.
    toolbox.addTool(new FreehandTool());  // Replace with your actual FreehandTool class
    toolbox.addTool(new LineToTool());     // Replace with your actual LineToTool class
    toolbox.addTool(charcoalTool);
    toolbox.addTool(highlighterTool);
    toolbox.addTool(penTool);
    toolbox.addTool(paintBrushTool);
    toolbox.addTool(airbrushTool);
    toolbox.addTool(triangleTool);
    toolbox.addTool(squareTool);
    toolbox.addTool(sprayCan);
    toolbox.addTool(new mirrorDrawTool());  // Replace with your actual mirrorDrawTool class
    

    // Add event listener for the thickness slider
    var thicknessSlider = select('#thicknessSlider');
    thicknessSlider.input(function() {
        if (toolbox.selectedTool.hasOwnProperty("thickness")) {
            toolbox.selectedTool.thickness = int(thicknessSlider.value());
        }
    });

    background(255);
}

function draw() {
    // Call the draw function from the selected tool.
    // hasOwnProperty is a JavaScript function that tests
    // if an object contains a particular method or property
    // If there isn't a draw method, the app will alert the user
    if (toolbox.selectedTool.hasOwnProperty("draw")) {
        toolbox.selectedTool.draw();
    } else {
        alert("It doesn't look like your tool has a draw method!");
    }
}
