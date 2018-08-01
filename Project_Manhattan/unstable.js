
//
(function(chess){

	var NONE = -1;
	var KING = 5;
	var QUEEN = 4;
	var KNIGHT = 3;
	var BISHOP = 2;
	var ROOK = 1;
	var PAWN = 0;

	var BLACK = 1;
	var WHITE = 0;

	var BROWN = "#ffb366";
	var LBROWN = "#804000";

	var SPACE = 32;
	var LEFT = 37;
	var UP = 38;
	var RIGHT = 39;
	var DOWN = 40;

	var turn = 0;

	var whitepieces = [];
	var blackpieces = [];

	var cvs = document.getElementById('main');
	var ctx = document.getElementById('main').getContext('2d');

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

	//pair definition
	var pair = function(first,second){
		this.first = first;
		this.second = second;
	}
	//end pair def

	//position def
	var Position = function(x,y,selected,color,lineWidth){
		this.pos = new pair(x,y);
		this.selected = selected;
		this.color = color;
		this.lineWidth = lineWidth;
	}

	Position.prototype.draw = function() {
		ctx.beginPath();
		ctx.lineWidth= this.lineWidth;
		ctx.strokeStyle= this.color;
		ctx.rect(80*this.pos.first,80*this.pos.second,80,80);
		ctx.stroke();
	}

	Position.prototype.move_right = function() {
		if( this.pos.first < 7 ){
			this.pos.first += 1;
		}
	};

	Position.prototype.move_left = function() {
		if( this.pos.first > 0){
			this.pos.first -= 1;
		}
	};

	Position.prototype.move_up = function() {
		if( this.pos.second > 0 ){
			this.pos.second -= 1;
		}
	};

	Position.prototype.move_down = function() {
		if( this.pos.second < 7){
			this.pos.second += 1;
		}
	};
	//end pos def
	var current = new Position(1,1,false,"red","6");
	var past = new Position(1,1,false,"red","6");
	var possible = [];

	//chess piece definition
	var ChessPiece = function(id,team,moved){
		this.id = id;
		this.team = team;
		this.moved = moved;
		this.getId = function(){ return this.id ;}
		this.getTeam = function(){ return this.team ;}
		this.hasMoved = function(){ return this.moved ;}
	};
	ChessPiece.prototype.getId = function(){ return this.id ;}
	ChessPiece.prototype.getTeam = function(){ return this.team ;}
	ChessPiece.prototype.hasMoved = function(){ return this.moved ;}
	//fin chess piece definition

	//board tile class def
	var BoardTile = function(id,team,moved){
		this.piece = new ChessPiece(id,team,moved);
	};

	BoardTile.prototype.setPiece = function(value,team,moved){//add team {
		if(arguments.length == 3){
			this.piece = new ChessPiece(value,team,moved);
		}
		if(arguments.length == 2){
			this.piece = new ChessPiece(value,team,false);
		}
		if(arguments.length == 1){
			this.setPiece( value.id, value.team, value.moved);
		}
	};

	BoardTile.prototype.getPiece = function(){
		return this.piece;
	}

	BoardTile.prototype.getPossibleMoves = function( cur ) {
		var pos = [];
		var poscount = 0;
		var auxT = 0;
		var ycurr = cur.pos.second;
		var xcurr = cur.pos.first;
		var yplus = ( cur.pos.second < 7)? cur.pos.second+1: -1;
		var xplus = ( cur.pos.first < 7)? cur.pos.first+1: -1;
		var yminus = ( cur.pos.second > 0)? cur.pos.second-1: -1;
		var xminus = ( cur.pos.first > 0)? cur.pos.first-1: -1;
		//calculate and store some way
		switch( this.piece.id ){
			case KING:
				return king(cur,this.piece.team,board);
			break;
			case QUEEN:
				return queen(cur,this.piece.team,board);
			break;
			case KNIGHT:
				return knight(cur,this.piece.team,board);
			break;
			case BISHOP:
				return bishop(cur,this.piece.team,board);
			break;
			case ROOK:
				return rook(cur,this.piece.team,board);
			break;
			case PAWN:
				if( this.piece.team == BLACK){
					//CHECK FRONT
					if( yplus != -1){
						auxT = board[xcurr][yplus].piece.team;
						if( auxT == NONE){
							pos[poscount] = new Position( xcurr , yplus , true, "green","4");
							poscount++;
							if( !this.piece.hasMoved() ){
								auxT = board[xcurr][yplus+1].piece.team;
								if( auxT == NONE ){
									pos[poscount] = new Position( xcurr , yplus+1 , true, "green","4");
									poscount++;
								}
							}
						}
					}
					//TNORF

					//CHECK ATTACK
					if( xplus != -1 && yplus != -1){
						auxT = board[xplus][yplus].piece.team;
						if( auxT != this.piece.team && auxT != NONE ){
							pos[poscount] = new Position( xplus , yplus , true,"green","4");
							poscount++;
						}
					}

					if( xminus != -1 && yplus != -1){
						auxT = board[xminus][yplus].piece.team;
						if( auxT != this.piece.team  && auxT != NONE){
							pos[poscount] = new Position( xminus , yplus , true, "green","4");
							poscount++;
						}
					}
					//KCATTA

				}else if( this.piece.team == WHITE ){ //team is white
					//CHECK SIGUIENTE Y PRIMER
					if( yminus != -1){
						auxT = board[xcurr][yminus].piece.team;
						if( auxT == NONE ){
							pos[poscount] = new Position(xcurr,yminus,true,"green","4");
							poscount++;
							if(!this.piece.hasMoved()){
								auxT = board[xcurr][yminus-1].piece.team;
								if(auxT == NONE){
									pos[poscount] = new Position(xcurr,yminus-1,true,"green","4");
									poscount++;
								}
							}
						}
					}
					//CHECK ATAQUE A IZQUIERDA
					if( xminus != -1 && yminus != -1){
						auxT = board[xminus][yminus].piece.team;
						if( auxT != this.piece.team && auxT != NONE ){
							pos[poscount] = new Position(xminus,yminus,true,"green","4");
							poscount++;
						}
					}
					//CHECK ATAQUE A DERECHA
					if( xplus != -1 && yminus != -1){
						auxT = board[xplus][yminus].piece.team;
						if( auxT != this.piece.team && auxT != NONE ){
							pos[poscount] = new Position(xplus,yminus,true,"green","4");
							poscount++;
						}
					}
				}
			break;
		}

		return pos;
	}

	function validTile(x,y){
		if( x < 8 && x >= 0 && y < 8 && y >= 0)
			return true;
		return false;
	}

	function occupied(x,y,team){
		if( arguments.length == 2){
			if( board[x][y].getPiece().getId() != NONE)
				return true;
			return false;
		}
		if( arguments.length == 3){
			if( board[x][y].getPiece().getTeam() != team)
				return false;
			return true;
		}
	}

	function isCheck(x,y,team){
		//var x = cur.pos.frst;
		//var y = cur.pos.second;
		cur = new Position(x,y);
		var pos = [];
		if( team == BLACK){
			//pawn
			if( validTile(x+1,y+1) ){
				if( board[x+1][y+1].piece.getId() == PAWN && board[x+1][y+1].piece.getTeam() != BLACK ){
					return true;
				}
			}
			if( validTile(x-1,y+1) ){
				if( board[x-1][y+1].piece.getId() == PAWN && board[x-1][y+1].piece.getTeam() != BLACK ){
					return true;
				}
			}
		}else{
			//pawn
			if( validTile(x-1,y-1) ){
				if( board[x-1][y-1].piece.getId() == PAWN && board[x-1][y-1].piece.getTeam() != WHITE ){
					return true;
				}
			}
			if( validTile(x+1,y-1) ){
				if( board[x+1][y-1].piece.getId() == PAWN && board[x+1][y-1].piece.getTeam() != WHITE ){
					return true;
				}
			}
		}
		//knight
		var xa = 0;
		var ya = 0;
		pos = knight(cur,team);
		for( i = 0 ; i < pos.length ; i++ ){
			xa = pos[i].pos.first;
			ya = pos[i].pos.second;
			if( board[xa][ya].piece.getId() == KNIGHT )
				return true;
		}
		//bishop - queen
		pos = bishop(cur,team);
		for( i = 0 ; i < pos.length ; i++ ){
			xa = pos[i].pos.first;
			ya = pos[i].pos.second;
			if( board[xa][ya].piece.getId() == BISHOP || board[xa][ya].piece.getId() == QUEEN )
				return true;
		}
		//rook - queen
		pos = rook(cur,team);
		for( i = 0 ; i < pos.length ; i++ ){
			xa = pos[i].pos.first;
			ya = pos[i].pos.second;
			if( board[xa][ya].piece.getId() == ROOK || board[xa][ya].piece.getId() == QUEEN ){
				return true;
			}
		}
		//king
		pos = rook(cur,team);
		pos = pos.concat( bishop(cur,team) );
		for( i = 0 ; i < pos.length ; i++ ){
			xa = pos[i].pos.first;
			ya = pos[i].pos.second;
			if( board[xa][ya].piece.getId() == KING && Math.sqrt( Math.pow( (x-xa) ,2) + Math.pow( (y-ya) ,2) ) < 2  ){
				return true;
			}

		}
		return false;
	}

	function knight(cur,team){
		var pos = [];
		var poscount = 0;

		var xhorseplusA = (cur.pos.first+2 <= 7)? cur.pos.first+2 : -1;
		var xhorseminusA = (cur.pos.first-2 >= 0)? cur.pos.first-2 : -1;
		var xhorseplusB = (cur.pos.first+1 <= 7)? cur.pos.first+1 : -1;
		var xhorseminusB = (cur.pos.first-1 >= 0)? cur.pos.first-1 : -1;
		var yhorseplusA = (cur.pos.second+1 <= 7)? cur.pos.second+1 : -1;
		var yhorseminusA = (cur.pos.second-1 >= 0)? cur.pos.second-1 : -1;
		var yhorseplusB = (cur.pos.second+2 <= 7)? cur.pos.second+2 : -1;
		var yhorseminusB = (cur.pos.second-2 >= 0)? cur.pos.second-2 : -1;

		if( xhorseplusA != -1 && yhorseminusA != -1){
			auxT = board[xhorseplusA][yhorseminusA].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseplusA,yhorseminusA,true,"green","4");
				poscount++;
			}
		}
		if( xhorseplusA != -1 && yhorseplusA != -1){
			auxT = board[xhorseplusA][yhorseplusA].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseplusA,yhorseplusA,true,"green","4");
				poscount++;
			}
		}
		if( xhorseminusA != -1 && yhorseminusA != -1){
			auxT = board[xhorseminusA][yhorseminusA].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseminusA,yhorseminusA,true,"green","4");
				poscount++;
			}
		}
		if( xhorseminusA != -1 && yhorseplusA !=-1){
			auxT = board[xhorseminusA][yhorseplusA].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseminusA,yhorseplusA,true,"green","4");
				poscount++;
			}
		}
		if( xhorseplusB != -1 && yhorseminusB !=-1){
			auxT = board[xhorseplusB][yhorseminusB].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseplusB,yhorseminusB,true,"green","4");
				poscount++;
			}
		}
		if( xhorseplusB != -1 && yhorseplusB !=-1){
			auxT = board[xhorseplusB][yhorseplusB].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseplusB,yhorseplusB,true,"green","4");
				poscount++;
			}
		}
		if( xhorseminusB != -1 && yhorseminusB !=-1){
			auxT = board[xhorseminusB][yhorseminusB].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseminusB,yhorseminusB,true,"green","4");
				poscount++;
			}
		}
		if( xhorseminusB != -1 && yhorseplusB !=-1){
			auxT = board[xhorseminusB][yhorseplusB].piece.team;
			if(auxT != team ){
				pos[poscount] = new Position(xhorseminusB,yhorseplusB,true,"green","4");
				poscount++;
			}
		}
		return pos;
	}

	function bishop(cur,team){
		var pos = [];
		var poscount = 0;
		//diagonal abajo derecha
		var i = 1;
		while( validTile(cur.pos.first+i , cur.pos.second+i) && !(occupied(cur.pos.first+i , cur.pos.second+i,team)) ){
			pos[poscount] = new Position(cur.pos.first+i , cur.pos.second+i,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first+i , cur.pos.second+i) )
		if( board[cur.pos.first+i][cur.pos.second+i].piece.team != team){
			pos[poscount] = new Position(cur.pos.first+i , cur.pos.second+i,true,"green","4");
			poscount++;
		}
		//diagonal abajo izquierda
		i = 1;
		while( validTile(cur.pos.first-i , cur.pos.second+i) && !(occupied(cur.pos.first-i , cur.pos.second+i,team)) ){
			pos[poscount] = new Position(cur.pos.first-i , cur.pos.second+i,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first-i , cur.pos.second+i) )
		if( board[cur.pos.first-i][cur.pos.second+i].piece.team != team){
			pos[poscount] = new Position(cur.pos.first-i , cur.pos.second+i,true,"green","4");
			poscount++;
		}
		//diagonal arriba derecha
		i = 1;
		while( validTile(cur.pos.first+i , cur.pos.second-i) && !(occupied(cur.pos.first+i , cur.pos.second-i,team)) ){
			pos[poscount] = new Position(cur.pos.first+i , cur.pos.second-i,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first+i , cur.pos.second-i) )
		if( board[cur.pos.first+i][cur.pos.second-i].piece.team != team) {
			pos[poscount] = new Position(cur.pos.first+i , cur.pos.second-i,true,"green","4");
			poscount++;
		}
		//diagonal arriba izquierda
		i = 1;
		while( validTile(cur.pos.first-i , cur.pos.second-i) && !(occupied(cur.pos.first-i , cur.pos.second-i,team)) ){
			pos[poscount] = new Position(cur.pos.first-i , cur.pos.second-i,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first-i , cur.pos.second-i) )
		if( board[cur.pos.first-i][cur.pos.second-i].piece.team != team){
			pos[poscount] = new Position(cur.pos.first-i , cur.pos.second-i,true,"green","4");
			poscount++;
		}
		return pos;
	}

	function rook(cur,team){
		var pos = [];
		var poscount = 0;
		//up
		var i = 1;
		while( validTile(cur.pos.first,cur.pos.second-i) && !(occupied(cur.pos.first,cur.pos.second-i,team)) ){
			pos[poscount] = new Position(cur.pos.first,cur.pos.second-i,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first,cur.pos.second-i) ){
			if( board[cur.pos.first][cur.pos.second-i].piece.team != team ){
				pos[poscount] = new Position(cur.pos.first,cur.pos.second-i,true,"green","4");
				poscount++;
			}
		}
		//down
		i = 1;
		while( validTile(cur.pos.first,cur.pos.second+i) && !(occupied(cur.pos.first,cur.pos.second+i,team)) ){
			pos[poscount] = new Position(cur.pos.first,cur.pos.second+i,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first,cur.pos.second+i) ){
			if( board[cur.pos.first][cur.pos.second+i].piece.team != team ){
				pos[poscount] = new Position(cur.pos.first,cur.pos.second+i,true,"green","4");
				poscount++;
			}
		}
		//left
		i = 1;
		while( validTile(cur.pos.first-i,cur.pos.second) && !(occupied(cur.pos.first-i,cur.pos.second,team)) ){
			pos[poscount] = new Position(cur.pos.first-i,cur.pos.second,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first-i,cur.pos.second) ){
			if( board[cur.pos.first-i][cur.pos.second].piece.team != team ){
				pos[poscount] = new Position(cur.pos.first-i,cur.pos.second,true,"green","4");
				poscount++;
			}
		}
		//right
		i = 1;
		while( validTile(cur.pos.first+i,cur.pos.second) && !(occupied(cur.pos.first+i,cur.pos.second,team)) ){
			pos[poscount] = new Position(cur.pos.first+i,cur.pos.second,true,"green","4");
			poscount++;
			i++;
		}
		if( validTile(cur.pos.first+i,cur.pos.second) ){
			if( board[cur.pos.first+i][cur.pos.second].piece.team != team ){
				pos[poscount] = new Position(cur.pos.first+i,cur.pos.second,true,"green","4");
				poscount++;
			}
		}

		return pos;
	}

	function queen(cur,team){
		pos = [];
		pos = pos.concat(bishop(cur,team));
		pos = pos.concat(rook(cur,team));
		return pos;
	}

	function king(cur,team){
		var pos = [];
		var poscount = 0;
		//check 8 pos
		var x = cur.pos.first;
		var y = cur.pos.second;
		if( validTile(x,y-1) ){
			if( !occupied(x,y-1,team) && !isCheck(x,y-1,team)){
				pos[poscount] = new Position(x,y-1,true,"green","4");
				poscount++;
			}
		}
		if( validTile(x,y+1) ){
			if( !occupied(x,y+1,team) && !isCheck(x,y+1,team)){
				pos[poscount] = new Position(x,y+1,true,"green","4");
				poscount++;
			}
		}
		if( validTile(x-1,y) ){
			if( !occupied(x-1,y,team) && !isCheck(x-1,y,team)){
				pos[poscount] = new Position(x-1,y,true,"green","4");
				poscount++;
			}
		}
		if( validTile(x+1,y) ){
			if( !occupied(x+1,y,team) && !isCheck(x+1,y,team)){
				pos[poscount] = new Position(x+1,y,true,"green","4");
				poscount++;
			}
		}
		if( validTile(x-1,y-1) ){
			if( !occupied(x-1,y-1,team) && !isCheck(x-1,y-1,team)){
				pos[poscount] = new Position(x-1,y-1,true,"green","4");
				poscount++;
			}
		}
		if( validTile(x-1,y+1) ){
			if( !occupied(x-1,y+1,team) && !isCheck(x-1,y+1,team)){
				pos[poscount] = new Position(x-1,y+1,true,"green","4");
				poscount++;
			}
		}
		if( validTile(x+1,y-1) ){
			if( !occupied(x+1,y-1,team) && !isCheck(x+1,y-1,team)){
				pos[poscount] = new Position(x+1,y-1,true,"green","4");
				poscount++;
			}
		}
		if( validTile(x+1,y+1) ){
			if( !occupied(x+1,y+1,team) && !isCheck(x+1,y+1,team)){
				pos[poscount] = new Position(x+1,y+1,true,"green","4");
				poscount++;
			}
		}
		return pos;
	}

	function loadImg(){
		var whiteTileSrc = ["./files/whitepawn.png","./files/whiterook.png","./files/whitebishop.png","./files/whiteknight.png","./files/whitequeen.png","./files/whiteking.png"];
		var blackTileSrc = ["./files/blackpawn.png","./files/blackrook.png","./files/blackbishop.png","./files/blackknight.png","./files/blackqueen.png","./files/blackking.png"];
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
		ctx.clearRect(0, 0, 641, 641);
		for( i = 0 ; i < 8 ; i++ )
		{
			for( j = 0 ; j < 8 ; j++ )
			{
				//draw tile
				if( (i+j)%2 == 0){
					ctx.fillStyle = BROWN;
				}
				else{
					ctx.fillStyle = LBROWN;
				}
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
		ctx.beginPath();
		ctx.lineWidth="1";
		ctx.strokeStyle="black";
		ctx.rect(0,0,640,640);
		ctx.stroke();

		current.draw();
		for( i = 0 ; i < possible.length ; i++ ){
			possible[i].draw();
		}

	}

	function setBoard(){
		for( i = 0 ; i < 8 ; i++)
		{
			for( j = 0 ; j < 8 ; j++)
			{
				if( (j+i)%2 == 0 ){
					board[i][j] = new BoardTile(NONE,NONE,false);
				}else{
					board[i][j] = new BoardTile(NONE,NONE,false);
				}
			}
		}
		for( i = 0 ; i < 8 ; i++ ){
			board[i][1].setPiece(PAWN , BLACK);
			board[i][6].setPiece(PAWN , WHITE);
			//place everything else
		}
		//TESTING PIECES
		//board[2][2].setPiece(PAWN , WHITE);
		//board[4][2].setPiece(PAWN , WHITE);
		//board[2][2].piece.moved = true;
		//board[4][2].piece.moved = true;

		//board[2][5].setPiece(PAWN , BLACK);
		//board[4][5].setPiece(PAWN , BLACK);
		//board[2][5].piece.moved = true;
		//board[4][5].piece.moved = true;

		//board[3][3].setPiece(KNIGHT , BLACK);
		//board[4][4].setPiece(KNIGHT , WHITE);

		//TESTING IECES END
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
		board[1][7].setPiece(KNIGHT,WHITE);
		board[6][7].setPiece(KNIGHT,WHITE);
		board[1][0].setPiece(KNIGHT,BLACK);
		board[6][0].setPiece(KNIGHT,BLACK);
		//QUEENS
		board[4][7].setPiece(QUEEN,WHITE);
		board[4][0].setPiece(QUEEN,BLACK);
		//KINGS
		board[3][7].setPiece(KING,WHITE);
		board[3][0].setPiece(KING,BLACK);
	}

	function init(){
		document.getElementById("reset").addEventListener("click",function(){
			possible = [];
			setBoard();
			drawMap();
		});
		chess.removeEventListener('load',init);
		setBoard();
		loadImg();
		drawMap();
		cvs.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(cvs, evt);
        	current.pos.first = Math.floor(mousePos.x/80);
        	current.pos.second = Math.floor(mousePos.y/80);
        	drawMap();
        });
        cvs.addEventListener("click",function( ){keyMove(SPACE)} );
		window.addEventListener('keydown', function(e){ keyMove(e.keyCode); } );

	function getMousePosition( canvas ){
		var rect = canvas.getBoundingClientRect();
		return new Position( rect.left, rect.top , true, "red","6");
	}

	function keyMove(e){
		switch(e){
				case LEFT:
				current.move_left();
				break;
				case RIGHT:
				current.move_right();
				break;
				case UP:
				current.move_up();
				break;
				case DOWN:
				current.move_down();
				break;
				case SPACE:
				if( turn%2 == board[current.pos.first][current.pos.second].piece.team || ( board[current.pos.first][current.pos.second].piece.team != turn%2 && possible.length != 0)){
					var inSelection = false;
					if( possible.length != 0){
						for( i = 0 ; i < possible.length ; i++ ){
							if(possible[i].pos.first == current.pos.first && possible[i].pos.second == current.pos.second){
								inSelection = true
							}
						}
					}
					if( inSelection == false ){
						possible = board[current.pos.first][current.pos.second].getPossibleMoves(current);
						past.pos.first = current.pos.first;
						past.pos.second = current.pos.second;
					}else{
						board[current.pos.first][current.pos.second].setPiece(board[past.pos.first][past.pos.second].piece.getId(),board[past.pos.first][past.pos.second].piece.getTeam(),true);
						board[past.pos.first][past.pos.second].setPiece(NONE,NONE,false);
						possible = [];
						turn++;
					}
				}
				break;
			}

			drawMap();
		}
	}

	function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }

	chess.addEventListener('load',init);
	console.log(chess);


})(this);
