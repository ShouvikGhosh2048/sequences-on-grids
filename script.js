document.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementsByTagName('canvas')[0];
    let ctx = canvas.getContext('2d');

    let form = document.getElementsByTagName('form')[0];
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let size_field = document.getElementById('size');
        let size = Number(size_field.value);

        let grid_type_field = document.getElementById('grid_type');
        let grid_type = grid_type_field.value;

        let sequence_type_field = document.getElementById('sequence_type');
        let sequence_type = sequence_type_field.value;

        let sequence;
        switch(sequence_type) {
            case 'primes':
                sequence = createPrimes(size);
                break;
            case 'squares':
                sequence = createSquares(size);
                break;
            case 'fibonacci': {
                sequence = createFibonacci(size);
                break;
            }
        };

        let grid;
        switch (grid_type) {
            case 'rows': {
                grid = createRowsGrid(size, sequence);
                break;
            }
            case 'rows_alternate': {
                grid = createRowsAlternateGrid(size, sequence);
                break;
            }
            case 'spiral': {
                grid = createSpiralGrid(size, sequence);
            }
        }

        drawGrid(grid, 300, 300, ctx);
    });
});

function isPrime(number) {
    if (number <= 1) {
        return false;
    }
    for(let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i == 0) {
            return false;
        }
    }
    return true;
}

function createPrimes(grid_size) {
    let sequence = [];
    for (let i = 1; i <= grid_size * grid_size; i++) {
        if (isPrime(i)) {
            sequence.push(i);
        }
    }
    return sequence;
}

function createSquares(grid_size) {
    let sequence = [];
    for (let i = 1; i <= grid_size * grid_size; i++) {
        if (Math.sqrt(i) === Math.floor(Math.sqrt(i))) {
            sequence.push(i);
        }
    }
    return sequence;
}

function createFibonacci(grid_size) {
    let sequence = [];
    let a = 1;
    let b = 1;
    while (b <= grid_size * grid_size) {
        sequence.push(b);
        let temp = b;
        b += a;
        a = temp;
    }
    return sequence;
}

function createRowsGrid(grid_size, sequence) {
    let grid = [];
    for (let i = 0; i < grid_size; i++) {
        let row = [];
        for (let j = 0; j < grid_size; j++){ 
            row.push(false);
        }
        grid.push(row);
    }
    sequence.forEach(elem => {
        grid[Math.floor((elem - 1) / grid_size)][(elem - 1) % grid_size] = true;
    });
    return grid;
}

function createRowsAlternateGrid(grid_size, sequence) {
    let grid = [];
    for (let i = 0; i < grid_size; i++) {
        let row = [];
        for (let j = 0; j < grid_size; j++){ 
            row.push(false);
        }
        grid.push(row);
    }
    sequence.forEach(elem => {
        let j = Math.floor((elem - 1) / grid_size);
        if (j % 2 == 0) {
            grid[j][(elem - 1) % grid_size] = true;
        }
        else {
            grid[j][grid_size - 1 - ((elem - 1) % grid_size)] = true;
        }
    });
    return grid;
}

function createSpiralGrid(grid_size, sequence) {
    // We will go through the spiral starting from 1 in iterations.
    // In the ith iteration we will consider numbers from i^2 + 1 to (i+1)^2 in each iteration.
    // If i is even, we will go one step right, then i-1 steps up and then i-1 steps left.
    // If i is odd, we will go one step left, then i-1 steps down and then i-1 steps right.

    let grid = [];
    for (let i = 0; i < grid_size; i++) {
        let row = [];
        for (let j = 0; j < grid_size; j++){ 
            row.push(false);
        }
        grid.push(row);
    }

    //The position of 1 on the grid.
    let i_start = Math.floor(grid_size / 2);
    let j_start = Math.floor(grid_size / 2);
    if (grid_size % 2 === 0) {
        i_start -= 1;
    }

    let current_i = i_start;
    let current_j = j_start;
    let current_val = 1;
    
    //We will go through the sequence, we keep track of the index of the current sequence element to consider.
    let current_sequence_index = 0;

    //Check if current_val lies in the sequence.
    if (current_sequence_index < sequence.length && sequence[current_sequence_index] === current_val) {
        grid[j_start][i_start] = true;
        current_sequence_index++;
    }

    for (let iter = 2; iter <= grid_size; iter++) {
        if (iter % 2 === 0) {
            current_i++;
            current_val++;
            if (current_sequence_index < sequence.length && sequence[current_sequence_index] === current_val) {
                grid[current_j][current_i] = true;
                current_sequence_index++;
            }

            for (let i = 0; i < iter-1; i++) {
                current_j--;
                current_val++;
                if (current_sequence_index < sequence.length && sequence[current_sequence_index] === current_val) {
                    grid[current_j][current_i] = true;
                    current_sequence_index++;
                }
            }

            for (let i = 0; i < iter-1; i++) {
                current_i--;
                current_val++;
                if (current_sequence_index < sequence.length && sequence[current_sequence_index] === current_val) {
                    grid[current_j][current_i] = true;
                    current_sequence_index++;
                }
            }
        }
        else {
            current_i--;
            current_val++;
            if (current_sequence_index < sequence.length && sequence[current_sequence_index] === current_val) {
                grid[current_j][current_i] = true;
                current_sequence_index++;
            }

            for (let i = 0; i < iter-1; i++) {
                current_j++;
                current_val++;
                if (current_sequence_index < sequence.length && sequence[current_sequence_index] === current_val) {
                    grid[current_j][current_i] = true;
                    current_sequence_index++;
                }
            }

            for (let i = 0; i < iter-1; i++) {
                current_i++;
                current_val++;
                if (current_sequence_index < sequence.length && sequence[current_sequence_index] === current_val) {
                    grid[current_j][current_i] = true;
                    current_sequence_index++;
                }
            }
        }
    }

    return grid;
}

function drawGrid(grid, width, height, ctx) {
    let grid_size = grid.length;
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = 'black';
    let x_min = 10;
    let x_max = width - 10;
    let y_min = 10;
    let y_max = height - 10;
    for (let j = 0; j < grid_size; j++) {
        for (let i = 0; i < grid_size; i++) {
            if (grid[j][i]) {
                ctx.beginPath();
                let x = Math.floor(x_min + (x_max - x_min) * ((grid_size === 1) ? 0.5 : (i/(grid_size - 1))));
                let y = Math.floor(y_min + (y_max - y_min) * ((grid_size === 1) ? 0.5 : (j/(grid_size - 1))));
                ctx.arc(x, y, 3, 0, 2 * Math.PI, false);
                ctx.fill();
            }
        }
    }
}