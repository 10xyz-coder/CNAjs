let bookMoves = [
  ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'], // Italian Game
  ['d4', 'd5', 'c4', 'e6', 'Nc3'], // Queen's Gambit Declined
  ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3'], // Sicilian Defense
  ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'], // Ruy Lopez
  ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O'], // Queen's Gambit Declined, Exchange Variation
  ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Bd7'], // Philidor Defense
  ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'], // Sicilian Defense, Dragon Variation
  ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bc5'], // Scotch Game
  ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'c3'], // Danish Gambit
  ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bb4+'], // Vienna Game
  ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'Nf3', 'Nd7', 'Bd3', 'Bxd3', 'Qxd3'], // Caro-Kann Defense
  ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nd7', 'Bc4', 'c6', 'O-O', 'Be7', 'dxe5', 'dxe5', 'Nc3', 'Ngf6', 'Qe2'], // Philidor Defense, Hanham Variation
  ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3', 'bxc3', 'Bg7', 'Nf3', 'O-O', 'Be2'], // King's Indian Defense, Fianchetto Variation
  ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'c3', 'd5', 'exd5', 'Qxd5', 'cxd4', 'Bb4+', 'Nc3', 'Nge7', 'Be2'], // Petrov's Defense
  ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'dxc4', 'a4', 'Bf5', 'Ne5', 'Nbd7', 'Nxc4', 'Qc7', 'g3'], // Slav Defense
  ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Bg4', 'dxe5', 'Bxf3', 'Qxf3', 'dxe5', 'Bc4', 'Nf6', 'Qb3', 'Qe7', 'Nc3'], // Philidor Defense, Exchange Variation
  ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be2', 'e6', 'O-O', 'Be7', 'f4'], // Sicilian Defense, Najdorf Variation
  ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3'], // Ruy Lopez, Closed Variation
  ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O', 'Bd3', 'd5', 'Nf3', 'c5', 'O-O', 'Nc6', 'a3', 'Bxc3', 'bxc3', 'dxc4', 'Bxc4', 'Qc7'], // Nimzo-Indian Defense
];


function findNextBookMove(prevMoves, bookMoves) {
  // generate all possible permutations of previous moves
  let prevMovesPermutations = permute(prevMoves);

  // check if each permutation is a subarray of a book move
  for (let i = 0; i < bookMoves.length; i++) {
    let bookMove = bookMoves[i];
    for (let j = 0; j < prevMovesPermutations.length; j++) {
      let prevMovesCopy = [...prevMovesPermutations[j]];

      // check if previous moves are a subarray of the current book move
      let start = bookMove.indexOf(prevMovesCopy[0]);
      if (start === -1) {
        continue;
      }
      let subarray = bookMove.slice(start, start + prevMovesCopy.length);
      if (prevMovesCopy.join(',') === subarray.join(',')) {

        // check if the next move is valid
        if (start + prevMovesCopy.length === bookMove.length) {
          return "No more book moves!";
        } else if (prevMoves.length % 2 === 0) {
          return bookMove[start + prevMovesCopy.length + 1];
        } else {
          return bookMove[start + prevMovesCopy.length];
        }
      }
    }
  }
  return false;
}


// helper function to generate all permutations of an array
function permute(arr) {
  if (arr.length === 1) {
    return [arr];
  }
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i];
    let remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    let remainingPermutations = permute(remaining);
    for (let j = 0; j < remainingPermutations.length; j++) {
      result.push([element].concat(remainingPermutations[j]));
    }
  }
  return result;
}
