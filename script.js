var board,
  game = new Chess();

var fullMoves = 0;

function clampNumber(num, a, b) {
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

function sortMoves(moves) {
  moves.sort((a, b) => {
    console.log(a)
    if (a.flags.includes('c')) return -1; // Capture move
    if (b.flags.includes('c')) return 1;  // Capture move
    return 0;  // Non-capture move
  });
}


//function boardPiece(y, x) {
//  let boardY = game.board()[y] ? game.board()[y] : [0, 0, 0, 0, 0, 0, 0, 0];
//  let boardYX = boardY[x] ? boardY[x] : { type: "g", color: 'g' }
//  return boardYX;
//}
function boardPiece(y, x, board) {
  const boardY = board[y] || [0, 0, 0, 0, 0, 0, 0, 0];
  const boardYX = boardY[x] || { type: "g", color: 'g' };
  return boardYX;
}

/*The "AI" part starts here */

var minimaxRoot = function(depth, game, isMaximisingPlayer) {

  //var newGameMoves = game.ugly_moves({verbose: true});
  var newGameMoves = game.ugly_moves();
  //var killerMoves = [];
  // At small depths, killer moves are useless

  // TODO: Implement some kind of capture detection system
  //sortMoves(newGameMoves);
  for ( let move of newGameMoves ) {
    move.importance = 0;
    if (move.flags == 16) {move.importance += 16}
    if (move.flags == 8) {move.importance += 20}
    if (move.flags == 4) {move.importance += 12}
    if (move.flags == 2) {move.importance += 8}
  }

  newGameMoves.sort( ( a, b ) => b.importance - a.importance );

  var bestMove = -9999;
  var bestMoveFound;

  for (var i = 0; i < newGameMoves.length; i++) {
    var newGameMove = newGameMoves[i]
    game.ugly_move(newGameMove);
    var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
    game.undo();
    if (value >= bestMove) {
      bestMove = value;
      bestMoveFound = newGameMove;
    }
  }
  return bestMoveFound;
};

var minimax = function(depth, game, alpha, beta, isMaximisingPlayer) {
  positionCount++;
  if (depth === 0) {
    return -evaluateBoard(game.board());
  }

  //var newGameMoves = game.ugly_moves({verbose: true});
  var newGameMoves = game.ugly_moves();

  for ( let move of newGameMoves ) {
    move.importance = 0;
    if (move.flags == 16) {move.importance += 16}
    if (move.flags == 8) {move.importance += 20}
    if (move.flags == 4) {move.importance += 12}
    if (move.flags == 2) {move.importance += 8}
  }

  newGameMoves.sort( ( a, b ) => b.importance - a.importance );

  if (isMaximisingPlayer) {
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestMove);
      if (beta <= bestMove) {
        //return bestMove;
        break
      }
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.ugly_move(newGameMoves[i]);
      bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      beta = Math.min(beta, bestMove);
      if (bestMove <= alpha) {
        //return bestMove;
        break
      }
    }
    return bestMove;
  }
};

var evaluateBoard = function(board) {
  var totalEvaluation = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
};

var reverseArray = function(array) {
  return array.slice().reverse();
};

var pawnEvalWhite =
  [
    [90, 90, 90, 90, 90, 90, 90, 90],
    [50, 50, 50, 70, 70, 50, 50, 50],
    [10, 10, 30, 55, 55, 30, 10, 10],
    [5, 5, 10, 40, 40, 10, 5, 5],
    [0, 0, 5, 35, 35, 5, 0, 0],
    [2, -35, -10, 25, 25, -10, -35, 2],
    [5, 10, 10, -20, -20, 10, 10, 05],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
  [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50]
]

var bishopEvalWhite = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20]
]

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0]
]

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20]
]

var kingEvalWhite = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20]
]

var kingEvalBlack = reverseArray(kingEvalWhite);

var kingEvalWhiteLate = [
  [30, 40, 40, 50, 50, 40, 40, 30],
  [30, 40, 40, 50, 50, 40, 40, 30],
  [30, 40, 40, 50, 50, 40, 40, 30],
  [30, 40, 40, 50, 50, 40, 40, 30],
  [20, 30, 30, 40, 40, 30, 30, 20],
  [10, 20, 20, 20, 20, 20, 20, 10],
  [-20, -20, 0, 0, 0, 0, -20, -20],
  [-20, -30, -10, 0, 0, -10, -30, -20]
]

var kingEvalBlackLate = reverseArray(kingEvalWhiteLate);

var getPieceValue = function(piece, x, y) {
  if (piece === null) {
    return 0;
  }
  var getAbsoluteValue = function(piece, isWhite, x, y) {
    if (piece.type === 'p') {

      let extraValue = 0;

      //TODO - Add boardPiece(y+1, x+1) for the others

      const b = game.board()

      if (piece.color === 'w') {
        if (boardPiece(y + 1, x + 1, b).type === 'p' && boardPiece(y + 1, x + 1, b).color === 'w') {
          extraValue += 5;
        }
        if (boardPiece(y - 1, x + 1, b).type === 'p' && boardPiece(y - 1, x + 1, b).color === 'w') {
          extraValue += 5;
        }
        if (boardPiece(y + 1, x, b).type === 'p' && boardPiece(y + 1, x, b).color === 'w') {
          extraValue -= 30;
        }
      } else {
        if (boardPiece(y + 1, x + 1, b).type === 'p' && boardPiece(y + 1, x + 1, b).color !== 'w') {
          extraValue += 5;
        }
        if (boardPiece(y - 1, x + 1, b).type === 'p' && boardPiece(y - 1, x + 1, b).color !== 'w') {
          extraValue += 5;
        }
        if (boardPiece(y + 1, x, b).type === 'p' && boardPiece(y + 1, x, b).color !== 'w') {
          extraValue -= 30;
        }
      }

      return 100 + extraValue + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);

    } else if (piece.type === 'r') {
      return 450 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
    } else if (piece.type === 'n') {
      return 300 + knightEval[y][x];
    } else if (piece.type === 'b') {
      return 310 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
    } else if (piece.type === 'q') {
      return 950 + evalQueen[y][x];
    } else if (piece.type === 'k') {
      if (fullMoves <= 26) {
        return 9000 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
      } else {
        return 9000 + (isWhite ? kingEvalWhiteLate[y][x] : kingEvalBlackLate[y][x]);
      }
    }
    throw "Unknown piece type: " + piece.type;
  };

  var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
};


/* board visualization and games state handling */

var onDragStart = function(source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true ||
    piece.search(/^b/) !== -1) {
    return false;
  }
};

var makeBestMove = function() {
  var bestMove = getBestMove(game);
  game.ugly_move(bestMove);
  board.position(game.fen());
  fullMoves += 1;
  renderMoveHistory(game.history());
  if (game.game_over()) {
    alert('Game over');
  }
};


var positionCount;
var getBestMove = function(game) {
  if (game.game_over()) {
    alert('Game over');
  }

  positionCount = 0;
  var depth = parseInt($('#search-depth').find(':selected').text());
  //var depth = 4;

  var d = new Date().getTime();
  var bestMove = minimaxRoot(depth, game, true);
  var d2 = new Date().getTime();
  var moveTime = (d2 - d);
  var positionsPerS = (positionCount * 1000 / moveTime);

  $('#position-count').text(positionCount);
  $('#time').text(moveTime / 1000 + 's');
  $('#positions-per-s').text(positionsPerS);
  return bestMove;
};

var renderMoveHistory = function(moves) {
  var historyElement = $('#move-history').empty();
  historyElement.empty();
  for (var i = 0; i < moves.length; i = i + 2) {
    historyElement.append('<span>' + moves[i] + ' ' + (moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
  }
  historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function(source, target) {

  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  removeGreySquares();
  if (move === null) {
    return 'snapback';
  }

  renderMoveHistory(game.history());
  window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function() {
  board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
  var moves = game.moves({
    square: square,
    verbose: true
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
