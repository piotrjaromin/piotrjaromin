'use strict';

const print = console.log;
var L = 4;
var H = 5;
var T = "@";

const rows = [];
rows[0] = "#  ##   ## ##  ### ###  ## # # ###  ## # # #   # # ###  #  ##   #  ##   ## ### # # # # # # # # # # ### ### " 
rows[1] = "# # # # #   # # #   #   #   # #  #    # # # #   ### # # # # # # # # # # #    #  # # # # # # # # # #   #   #" 
rows[2] = "### ##  #   # # ##  ##  # # ###  #    # ##  #   ### # # # # ##  # # ##   #   #  # # # # ###  #   #   #   ##" 
rows[3] = "# # # # #   # # #   #   # # # #  #  # # # # #   # # # # # # #    ## # #   #  #  # # # # ### # #  #  #      " 
rows[4] = "# # ##   ## ##  ### #    ## # # ###  #  # # ### # # # #  #  #     # # # ##   #  ###  #  # # # #  #  ###  # " 

const unknowLetterIndex = (rows[0].length / L)- 1; 

function getLetterNo(letter) {
    return letter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
}

function printLetterAt(index, width, height, rows) {
    
    const letterRows = [];
    for( let h = 0; h < height; h++){ 
        
        letterRows[h] = [];
        for ( let w = 0; w < width; w++) {
            const c = rows[h][width * index + w]
            
            letterRows[h][w] = c; 
        }
    }
    return letterRows;
}



function printAllLetters(letters, height) {
    
    for( let h = 0; h < height; h++) {
        
        let row = "";
        for( let i = 0; i < letters.length; i++ ) {
        
            const letterRow = letters[i][h];
            
            for (let w = 0; w < letterRow.length; w++ ) {
                row += letterRow[w];
            }
        }
        
        print(row);
    }
}


const asciOutput = [];
for ( let i = 0; i < T.length; i++ ) {
    
    let index = getLetterNo(T[i]);

    if ( index < 0 || index > 26 ) {
        index = unknowLetterIndex;
        console.log(index);
    }

    const letterASCI = printLetterAt(index, L, H, rows);

    asciOutput.push(letterASCI);
}

printAllLetters(asciOutput, H);