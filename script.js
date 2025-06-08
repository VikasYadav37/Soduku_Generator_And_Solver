
const grid = document.getElementById("sudoku-grid");
let solutionGrid = [];
let submitted = false;

function createGrid() {
  grid.innerHTML = "";
  for (let row = 0; row < 9; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 9; col++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.dataset.row = row;
      input.dataset.col = col;
      input.addEventListener("input", (e) => {
        const val = e.target.value;
        if (!/^[1-9]?$/.test(val)) e.target.value = "";
      });
      td.appendChild(input);
      tr.appendChild(td);
    }
    grid.appendChild(tr);
  }
}

function getGrid() {
  const data = [];
  const rows = grid.getElementsByTagName("tr");
  for (let row of rows) {
    const cols = row.getElementsByTagName("input");
    const rowData = [];
    for (let input of cols) {
      const val = parseInt(input.value);
      rowData.push(isNaN(val) ? 0 : val);
    }
    data.push(rowData);
  }
  return data;
}

function setGrid(data, disable = false) {
  const rows = grid.getElementsByTagName("tr");
  for (let r = 0; r < 9; r++) {
    const inputs = rows[r].getElementsByTagName("input");
    for (let c = 0; c < 9; c++) {
      inputs[c].value = data[r][c] === 0 ? "" : data[r][c];
      inputs[c].disabled = disable && data[r][c] !== 0;
    }
  }
}

function isSafe(grid, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num || 
        grid[3 * Math.floor(row / 3) + Math.floor(x / 3)]
            [3 * Math.floor(col / 3) + x % 3] === num) {
      return false;
    }
  }
  return true;
}

function solveSudokuHelper(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudokuHelper(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function solveSudoku() {
  if (!submitted) {
    document.getElementById("result-message").textContent = "Please submit your answer first.";
    return;
  }
  const board = JSON.parse(JSON.stringify(solutionGrid));
  setGrid(board, true);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function fillDiagonal(grid) {
  for (let i = 0; i < 9; i += 3) fillBox(grid, i, i);
}

function fillBox(grid, row, col) {
  let num;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      do {
        num = Math.floor(Math.random() * 9 + 1);
      } while (!isSafe(grid, row + i, col + j, num));
      grid[row + i][col + j] = num;
    }
  }
}

function generateSudokuHelper(grid) {
  return solveSudokuHelper(grid);
}

function removeDigits(grid, count = 40) {
  while (count > 0) {
    const i = Math.floor(Math.random() * 9);
    const j = Math.floor(Math.random() * 9);
    if (grid[i][j] !== 0) {
      grid[i][j] = 0;
      count--;
    }
  }
}

function generateSudoku() {
  submitted = false;
  document.getElementById("result-message").textContent = "";
  const gridData = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillDiagonal(gridData);
  generateSudokuHelper(gridData);
  solutionGrid = JSON.parse(JSON.stringify(gridData));
  removeDigits(gridData);
  setGrid(gridData, true);
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("solve-btn").disabled = true;
  document.getElementById("check-btn").disabled = true;
}

function submitAnswer() {
  submitted = true;
  document.getElementById("result-message").textContent = "Answer submitted. You can now check or solve.";
  document.getElementById("solve-btn").disabled = false;
  document.getElementById("check-btn").disabled = false;
  document.getElementById("submit-btn").disabled = true;
}

function checkSolution() {
  if (!submitted) {
    document.getElementById("result-message").textContent = "Please submit your answer first.";
    return;
  }

  const userGrid = getGrid();
  const message = document.getElementById("result-message");

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (userGrid[i][j] !== solutionGrid[i][j]) {
        message.textContent = "❌ Incorrect solution. Try again!";
        message.style.color = "red";
        return;
      }
    }
  }
  message.textContent = "✅ Correct! Well done!";
  message.style.color = "green";
}

createGrid();
