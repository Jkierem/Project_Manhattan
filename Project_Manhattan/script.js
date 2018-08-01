
//
(function(chess){

	var NONE = -1;
	var KING = 5;   //change to 0
	var QUEEN = 4;   //change to 1
	var KNIGHT = 3; //change 2
	var BISHOP = 2; //change to 3 when testing ends
	var ROOK = 1; //change to 4 when testin ends
	var PAWN = 0; //change to 5 when testing ends

	var BLACK = 0;
	var WHITE = 1;

	var BROWN = "#ffb366";
	var LBROWN = "#804000";

	var whitepieces = [];
	var blackpieces = [];

	var pair = function(y,x){
		this.first = y;
		this.second = x;
	}

	var ChessPiece = function(id,team){
		this.id = id;
		this.team = team;
	};

	ChessPiece.prototype.setPiece = function(value) {
		this.id = value;
	};

	ChessPiece.prototype.setTeam = function(team) {
		this.team = team;
	};

	ChessPiece.prototype.getPossibleMoves = function( yValue , xValue ) {
		var pos = [];
		//calculate and store some way
		switch( this.id ){
			case KING:
			break;
			case QUEEN:
			break;
			case KNIGHT:
			break;
			case BISHOP:
			break;
			case ROOK:
			break;
			case PAWN:
				if( this.team == BLACK){
					//check front
				}else{ //team is white
					//check front
				}
			break;
		}
		return pos;
	};

	var BoardTile = function(id,team,color){
		this.piece = new ChessPiece(id,team);
		this.color = color;
		this.selected = false; //for future interactions;
		this.possible = false;
	};

	BoardTile.prototype.setPiece = function(value,team){//add team {
		this.piece.setPiece(value);
		this.piece.setTeam(team);
	};

	BoardTile.prototype.isSelected = function() {
		return this.selected;
	};

	BoardTile.prototype.isPossible = function() {
		return this.possible;
	};

	var board = [
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0]
	];

	function loadImg(){
		var whiteTileSrc = ["./files/whitepawn.png","./files/whiterook.png","./files/whitebishop.png"];
		var blackTileSrc = ["./files/blackpawn.png","./files/blackrook.png","./files/blackbishop.png"];
		var count = 0;
		for( i = 0 ; i < blackTileSrc.length ; i++){
			blackpieces[i] = new Image();
			blackpieces[i].src = blackTileSrc[i];
			blackpieces[i].onload = function(){
				count++;
				if( count == (whiteTileSrc.length + blackTileSrc.length) ){
					drawMap();
				}
			}
		}
		for( i = 0 ; i < whiteTileSrc.length ; i++ ){
			whitepieces[i] = new Image();
			whitepieces[i].src = whiteTileSrc[i];
			whitepieces[i].onload = function(){
				count++;
				if( count == (whiteTileSrc.length + blackTileSrc.length) ){
					drawMap();
				}
			}
		}
		
	}

	function drawMap(){
		var ctx = document.getElementById('main').getContext('2d');
		ctx.clearRect(0, 0, 641, 641);
		for( i = 0 ; i < 8 ; i++ )
		{
			for( j = 0 ; j < 8 ; j++ )
			{
				//draw tile
				ctx.fillStyle = board[i][j].color;
				ctx.fillRect(i*80,j*80,80,80);
				//draw piece
				if( board[i][j].piece.id != NONE ){
					if( board[i][j].piece.team == WHITE){
						ctx.drawImage( whitepieces[ board[i][j].piece.id ] , 5+(i*80) , 5+(j*80) );
					}else{
						ctx.drawImage( blackpieces[ board[i][j].piece.id ] , 5+(i*80) , 5+(j*80) );
					}
				}
			}
		}
		ctx.rect(0,0,640,640);
		ctx.stroke();
	}

	function setBoard(){
		for( i = 0 ; i < 8 ; i++)
		{
			for( j = 0 ; j < 8 ; j++)
			{
				if( (j+i)%2 == 0 ){
					board[i][j] = new BoardTile(NONE,NONE,LBROWN);
				}else{
					board[i][j] = new BoardTile(NONE,NONE,BROWN);
				}
			}
		}
		for( i = 0 ; i < 8 ; i++ ){
			board[i][1].setPiece(PAWN , BLACK);
			board[i][6].setPiece(PAWN , WHITE);
			//place everything else
		}
		//ROOKS
		board[7][7].setPiece(ROOK,WHITE);
		board[0][7].setPiece(ROOK,WHITE);
		board[7][0].setPiece(ROOK,BLACK); //black
		board[0][0].setPiece(ROOK,BLACK); //black
		//BISHOPS
		board[2][7].setPiece(BISHOP,WHITE);
		board[5][7].setPiece(BISHOP,WHITE);
		board[2][0].setPiece(BISHOP,BLACK); //black
		board[5][0].setPiece(BISHOP,BLACK); //black
		//KNIGHTS
		//board[1][7].setPiece(KNIGHT,WHITE);
		//board[6][7].setPiece(KNIGHT,WHITE);
		//board[1][0].setPiece(KNIGHT,BLACK);
		//board[6][0].setPiece(KNIGHT,BLACK);
		//QUEENS
		//board[4][7].setPiece(QUEEN,WHITE);
		//board[4][0].setPiece(QUEEN,BLACK);
		//KINGS
		//board[3][7].setPiece(KING,WHITE);
		//board[3][0].setPiece(KING,BLACK);
	}

	function init(){
		chess.removeEventListener('load',init);
		setBoard();
		loadImg();
		drawMap();
	}

	chess.addEventListener('load',init);

})(this);