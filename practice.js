const container = document.querySelector('.gallery');
const content = document.querySelector('.cards');
const items = document.querySelectorAll('.item');
const dots = document.querySelectorAll('.dot');
const itemHeight = 200;
const totalItems = items.length;
let isDragging = false;
let startY;
let currentY = 0;
let positions = [0, 1, 2];

function updatePositions() {
    items.forEach((item, index) => {
        const position = positions[index];
        const y = (position - 1) * itemHeight + 200;
        const scale = position === 1 ? 1 : 0.85;
        const opacity = position === 1 ? 1 : 0.7;
        const zIndex = position === 1 ? 3 : 1;
        
        item.style.transform = `
            translateY(${y}px)
            scale(${scale})
        `;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
    });

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', positions[index] === 1);
    });
}

function movePositions(direction) {
    if (direction > 0) {
        positions = positions.map(p => (p - 1 + totalItems) % totalItems);
    } else {
        positions = positions.map(p => (p + 1) % totalItems);
    }
    updatePositions();
}

// Touch events
container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startY = e.touches[0].pageY;
});

container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const deltaY = e.touches[0].pageY - startY;
    
    if (Math.abs(deltaY) >= itemHeight / 3) {
        movePositions(deltaY > 0 ? 1 : -1);
        startY = e.touches[0].pageY;
    }
});

container.addEventListener('touchend', () => {
    isDragging = false;
});

// Mouse events
container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.pageY;
    container.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const deltaY = e.pageY - startY;
    
    if (Math.abs(deltaY) >= itemHeight / 3) {
        movePositions(deltaY > 0 ? 1 : -1);
        startY = e.pageY;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
});

// Prevent content selection while dragging
container.addEventListener('selectstart', (e) => {
    e.preventDefault();
});

// Initialize
updatePositions();