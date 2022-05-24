var NUM_COLS = 7;
var NUM_ROWS = 6;
var PIECE_DIM; 
var RED = 1;
var BLACK = 2;
var EMPTY = 0;
var curTurn = BLACK;
var gameOver = false;
var board;
var playAgain;
var homescreen = true;


function start(){
    board = new Grid(NUM_ROWS, NUM_COLS);
    addInstructions();
    mouseClickMethod(addPiece);
}

function addInstructions() {
  
}

function startGame() {
    initBoard();
    setPieceDimension();
    drawBoard();
}

//adds a piece in the lowest empty row
//of the column clicked. Increments the turn color
function addPiece(e){
    if(homescreen) {
      homescreen = false;
      removeAll();
      startGame();
    } else if(!gameOver){
        var cir = new Circle(PIECE_DIM/2);
        var color = getTurnColor();
        cir.setColor(color);
        var x_pos=e.getX();
        var col = getColumnClicked(x_pos);
        if (col < 0) {
            col = 0;
        }
        var row = getCurRow(col);
        if (row < 0) {
            row = 0;
        }
        addCircleAtRowColumn(row,col, cir);
        board.set(row,col,curTurn);
        rubi();
        if(checkForWin(row, col)){
            removeAll();
            displayWinner();
            gameOver=true;
        }else{
            incrementTurn();
        }
    }
}

// Displays a message declaring the current player as
//winner 
function displayWinner(){
    var winner;
    if(curTurn == RED){
        winner = "Pink";
    }else{
        winner = "Green";
    }
    var txt = new Text(winner + " wins!", "12pt Comic Sans MS");
    txt.setPosition(10, 100);
    txt.setColor(Color.blue);
    add(txt);
    
    playAgain = new Rectangle(200, 50);
    playAgain.setPosition((getWidth() - 200) / 2, (getHeight() - 50) / 2);               
    playAgain.setColor(Color.purple);
    add(playAgain);

    var playAgainText = new Text("Play again", "5 pt Comic Sans MS");
    playAgainText.setColor(Color.BLACK);
    playAgainText.setPosition(
      playAgain.getX() + 50 - playAgainText.getWidth() / 2,
      playAgain.getY() + playAgainText.getHeight() + 10
    );
    add(playAgainText);
    

    // Petrona and Rubi, add text on top of the blue box
    
    mouseClickMethod(replay);
}

function replay(e) {
    if(getElementAt(e.getX(), e.getY()) == playAgain) {
        gameOver = false;
        removeAll();
        start();
        startGame();
    }
}

//Sets all the values in the grid to zero
function initBoard(){
    for (var row = 0; row < NUM_ROWS; row++){
        for (var col = 0; col < NUM_COLS; col++){
            board.set(row, col, EMPTY);
        }
    }
}

//Calculates the lowest empty row in a given column
function getCurRow(col){
    for (var row = board.numRows() - 1; row >= 0; row--){
        if (board.get(row, col) == EMPTY){
            return row;
            }
        }
    return -1;
}

function checkForWin(row,col){
    if(checkRowForWin(row))
        return true;
    if(checkColForWin(col))
        return true;
    if(checkPosDiagForWin(row,col))
        return true;
    if(checkNegDiagForWin(row,col))
        return true;
    return false;
}
//Scans the given row for a win(four in a row)
function checkRowForWin(row){
    var numInARow = 0;
    var currentColor = EMPTY;
    for (var col = 0; col < NUM_COLS; col++){
        var val = board.get(row, col);
        if (val == currentColor){
            numInARow++;
            if(numInARow == 4 && currentColor != EMPTY){
                println("row");
                return true;
            }
        } else {
            numInARow = 1;
            currentColor=val;
        }
    }
    return false;
}

//Scans the given column for a win(four in a row)
function checkColForWin(col){
    var numInARow = 0;
    var currentColor = EMPTY;
    for (var row = 0; row < NUM_ROWS; row++){
        var val = board.get(row, col);
        if (val == currentColor){
            numInARow++;
            if (numInARow == 4 && currentColor != EMPTY){
                println("col");
                return true;
            }
        } else {
            numInARow = 1;
            currentColor = val;
        }
    }      
    return false;
}

//Scans positive diagonal for a win(four in a row)
function checkPosDiagForWin(row, col){
    var cur_row = row;
    var cur_col = col;
    var currentColor = board.get(row, col);
    var last = currentColor;
    var up = 0;
    var down = 0;
    while (cur_row < NUM_ROWS && cur_col < NUM_COLS && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            up++;
        }
        cur_row++;
        cur_col++;
    }
    cur_row = row;
    cur_col = col;
    last = board.get(cur_row, cur_col)
    while (cur_row > 0 && cur_col > 0 && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            down++;
        }
        cur_row--;
        cur_col--;
    }
    if (up + down > 4){
        println("posDiag");
        return true;
    }
    return false;
}

//Scans negative diagonal for a win(four in a row)
function checkNegDiagForWin(row, col){
    var cur_row = row;
    var cur_col = col;
    var currentColor = board.get(row,col);
    var last = currentColor;
    var up = 0;
    var down = 0;
    while(cur_row < NUM_ROWS && cur_col > 0 && last == currentColor){
        last = board.get(cur_row, cur_col);
        if(last == currentColor){
            up++;
        }
        cur_row++;
        cur_col--;
    }
    cur_row = row;
    cur_col = col;
    last = board.get(cur_row, cur_col)
    while (cur_row > 0 && cur_col < NUM_COLS && last == currentColor){
        last = board.get(cur_row, cur_col);
        if (last==currentColor){
            down++;
        }
        cur_row--;
        cur_col++;
    }
    if (up + down > 4){
        println("negDiag");
        return true;
    }
    return false;
}


//returns the color associated with this turn
function getTurnColor(){
    if (curTurn == BLACK){
        return new Color(163, 232, 114);
    }    
    return new Color(232, 114, 151);
}

//toggles curTurn
function incrementTurn(){
    if (curTurn == BLACK){
        curTurn = RED;
    } else {
        curTurn = BLACK;
    }
}

//returns the column where the click occured
function getColumnClicked(x){
    var column = (x - x % PIECE_DIM) / PIECE_DIM;
    return column
}

//draws the background and adds
//white "holes" in a grid
function drawBoard(){
    drawBoardBackground();
    for (var row = 0; row < NUM_ROWS; row++){
        for (var col=0; col < NUM_COLS; col++){
            var cir = new Circle(PIECE_DIM / 2);
            cir.setColor(new Color(0, 166, 255));
            addCircleAtRowColumn(row, col, cir);
        }
    }
}

//sets the piece dimension based 
//on the largest possible given canvas
//and board dimensions
function setPieceDimension(){
    var height = getHeight();
    var width = getWidth();
    if (width / NUM_COLS < height / NUM_ROWS){
        PIECE_DIM = width / NUM_COLS;
    }else{
        PIECE_DIM = height / NUM_ROWS;
    }
}

function addCircleAtRowColumn(row, col, cir){
    var half = PIECE_DIM / 2;
    var x = col * PIECE_DIM + half;
    var y = row * PIECE_DIM + half;
    cir.setPosition(x, y);
    add(cir);
}

//Draws a blue square at 0,0 that is as 
//big as the limiting canvas dimension allows
function drawBoardBackground(){
    var board_width = NUM_COLS * PIECE_DIM;
    var board_height = NUM_ROWS * PIECE_DIM;
    var rect = new Rectangle(board_width, board_height);
    rect.setPosition(0, 0);
    rect.setColor (new Color (212, 0, 123));
    add(rect);
}
function rubi(){
   var divisor = Randomizer.nextInt(4,3);
    var answer = Randomizer.nextInt(2,5);
    var dividend = divisor * answer;

    var response = parseInt(prompt("What is " + dividend  + "/" +  divisor));
    while(response != answer) {
        response = parseInt(prompt("Try again: what is " + dividend  + "/" +  divisor));
    }
 
}
  

