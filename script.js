// Get the canvas element and context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let distanceToInitial = 1000;
let initialPoint;
let imageSelected = false;
let color = 'rgba(0, 0, 0, 0.3)';
let transparency = 0.5;
// Array to store points
let points = [];
const imageInput = document.getElementById('imagePicker');

const sizeSlider = document.querySelector("#size-slider"),
    colorPicker = document.querySelector("#color-picker"),
    transparencySlider = document.querySelector("#transparency-slider");

let pointSize = 5;
let select
// Event listener for canvas click
canvas.addEventListener('click', handleCanvasClick);
canvas.addEventListener('mousemove', handleCanvasHover);
//Event listener for 
imageInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        imageSelected = true;
    }
}
function handleCanvasClick(event) {
    if(imageSelected){
        // Get the mouse coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (initialPoint) {
            distanceToInitial = Math.sqrt(
                Math.pow(mouseX - initialPoint.x, 2) + Math.pow(mouseY - initialPoint.y, 2)
            );
        }
        // If the distance is small enough, consider it a click on the initial point
        if (distanceToInitial < 10 && points.length > 2) {
            // Stop drawing and connect the last point to the initial point
            drawLine(points[points.length - 1], initialPoint);
            drawEnclosedArea(points);
            points = []; // Clear the points array for a new drawing
            initialPoint = undefined;
        } else {
            // Add the point to the array
            points.push({ x: mouseX, y: mouseY });
            initialPoint = initialPoint ?? points[0];
            // Draw the point
            drawPoint({ x: mouseX, y: mouseY });
            // Connect consecutive points with lines
            if (points.length > 1) {
                const lastIndex = points.length - 1;
                drawLine(points[lastIndex - 1], points[lastIndex]);
            }
        }
    }
    else{
        alert('No Images Have Been Uploaded Yet. Please Upload An Image First.')
    }
}
function handleCanvasHover(event) {
    if (initialPoint)
    {
        // Get the mouse coordinates relative to the canvas
        const rectHover = canvas.getBoundingClientRect();
        const mouseXHover = event.clientX - rectHover.left;
        const mouseYHover = event.clientY - rectHover.top;
        distanceToInitial = Math.sqrt(
            Math.pow(mouseXHover - initialPoint.x, 2) + Math.pow(mouseYHover - initialPoint.y, 2)
        );
        if (distanceToInitial < 10 && points.length > 0) {
            
        } else {
        }
    }
    // If the distance is small enough, show the tooltip
}
// Function to draw a point on the canvas
function drawPoint(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
// Function to draw a line between two points on the canvas
function drawLine(startPoint, endPoint) {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}
// Function to draw the enclosed area
function drawEnclosedArea(points) {
    if (points.length < 3) {
        return; // Need at least 3 points to enclose an area
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);   
    }

    ctx.fillStyle = color; 
    ctx.fill();
    ctx.closePath();
}
// Function to clear the canvas
function clearCanvas() {
    if (imageSelected) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
        initialPoint = undefined;
        distanceToInitial = 1000;
        imageSelected = false;
    } else {
        alert('Nothing To Clear')
    }
}
// Function to download the canvas
function downloadCanvas() {
    if(imageSelected){
        const canvas = document.getElementById('myCanvas');
        const dataURL = canvas.toDataURL(); // Get the data URL of the canvas

        // Create an anchor element and set its href attribute to the data URL
        const link = document.createElement('a');
        link.href = dataURL;

        // Set the download attribute to specify the filename
        link.download = 'canvas_image.png';

        // Append the link to the document and trigger a click event to start the download
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
    } else {
        alert('No Images Have Been Uploaded Yet. Please Upload An Image First.')
    }
}


sizeSlider.addEventListener("change", () => pointSize = sizeSlider.value); // passing slider value as pointSize

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    color= hexToRgba(colorPicker.value)
});

transparencySlider.addEventListener("change", () => {
    transparency = transparencySlider.value/10;
    color = updateAlpha(color, transparency);
}); // passing slider value as transparency


function hexToRgba(hex) {
    // Remove the hash symbol if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values for R, G, B
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Return the rgba format
    return `rgba(${r}, ${g}, ${b}, ${transparency})`;
}

function updateAlpha(rgbaColor, newAlpha) {
    const match = rgbaColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    const [, r, g, b, currentAlpha] = match;
    const updatedRgbaColor = `rgba(${r}, ${g}, ${b}, ${newAlpha})`;
    return updatedRgbaColor;
}