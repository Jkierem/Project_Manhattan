//x+2 y+1
			if( validTile(x+2,y+1) && board[x+2][y+1].getPiece().getId() == KNIGHT && board[x+2][y+1].getPiece().getTeam() == WHITE){
				return true;
			}
			//x+2 y-1
			if( validTile(x+2,y-1) && board[x+2][y-1].getPiece().getId() == KNIGHT && board[x+2][y-1].getPiece().getTeam() == WHITE){
				return true;
			}
			//x-2 y+1
			if( validTile(x-2,y+1) && board[x-2][y+1].getPiece().getId() == KNIGHT && board[x-2][y+1].getPiece().getTeam() == WHITE){
				return true;
			}
			//x-2 y-1
			if( validTile(x-2,y-1) && board[x-2][y-1].getPiece().getId() == KNIGHT && board[x-2][y-1].getPiece().getTeam() == WHITE){
				return true;
			}
			//x-1 y+2
			if( validTile(x-1,y+2) && board[x-1][y+2].getPiece().getId() == KNIGHT && board[x-1][y+2].getPiece().getTeam() == WHITE){
				return true;
			}
			//x+1 y+2
			if( validTile(x+1,y+2) && board[x+1][y+2].getPiece().getId() == KNIGHT && board[x+1][y+2].getPiece().getTeam() == WHITE){
				return true;
			}
			//x-1 y-2
			if( validTile(x-1,y-2) && board[x-1][y-2].getPiece().getId() == KNIGHT && board[x-1][y-2].getPiece().getTeam() == WHITE){
				return true;
			}
			//x+1 y-2
			if( validTile(x+1,y-2) && board[x+1][y-2].getPiece().getId() == KNIGHT && board[x+1][y-2].getPiece().getTeam() == WHITE){
				return true;
			}


				