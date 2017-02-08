<?php

switch ($op){
    case 'display':{
        include $this->template('publish');
    }break;
    case 'main':{
        include $this->template('publish_main');
    }break;
	case 'save':{
		//保存棋谱
		
		$map = $_GPC['map'];
		$moves = $_GPC['moves'];	
		$notes = $_GPC['notes'];	
		$filename = $_GPC['filename'];
		$BillType = $_GPC['BillType']+0;
		$maplist = explode(' ',$map);
		$moveslist = explode(' ',$moves);
		$noteslist = explode(' ',$notes);
		$chessdata = '';
		
		$chessdata .= '{"BillType":'.$BillType;	
		$chessdata .= ',"map":[';
		for ($index=1;$index<count($maplist);$index+=3){
			$chessdata .= '{"cid":';
			$chessdata .= $maplist[$index];
			$chessdata .= ',"x":';
			$chessdata .= $maplist[$index+1];
			$chessdata .= ',"y":';
			$chessdata .= $maplist[$index+2];
			if($index == count($maplist)-3)
				$chessdata .= '}';
			else
				$chessdata .= '},';
		}
		
		if($BillType){
			
			if(count($moveslist) >0){
				$chessdata .= '],"moves":[';
				for ($index=1;$index<count($moveslist);$index+=4){
					$chessdata .= '{"step":"';			
					$chessdata .= $moveslist[$index];
					$chessdata .= '","id":';
					$chessdata .= $moveslist[$index+1];
					$chessdata .= ',"perid":';
					$chessdata .= $moveslist[$index+2];
					$chessdata .= ',"index":';
					$chessdata .= $moveslist[$index+3];
	
					if($index == count($moveslist)-4)
						$chessdata .= '}';
					else
						$chessdata .= '},';
				}		
			}		
		}
		else{
			if(count($moveslist) >0){
				$chessdata .= '],"moves":[';
				for ($index=1;$index<count($moveslist);$index+=4){
					$chessdata .= '{"src":';			
					$chessdata .= '{"x":';
					$chessdata .= $moveslist[$index];
					$chessdata .= ',"y":';
					$chessdata .= $moveslist[$index+1];
					$chessdata .= '},"dst":';
					$chessdata .= '{"x":';
					$chessdata .= $moveslist[$index+2];
					$chessdata .= ',"y":';
					$chessdata .= $moveslist[$index+3];
					if($index == count($moveslist)-4)
						$chessdata .= '}}';
					else
						$chessdata .= '}},';
				}		
			}		
		}
		if(count($noteslist) >0){
			$chessdata .= '],"notes":[';
			for ($index=1;$index<count($noteslist);$index+=2){
				$chessdata .= '{"id":';					
				$chessdata .= $noteslist[$index];
				$chessdata .= ',"note":"';
				$chessdata .= $noteslist[$index+1];
				$chessdata .= '"';
				if($index == count($noteslist)-2)
					$chessdata .= '}';
				else
					$chessdata .= '},';
			}		
		}	
		
		$chessdata .= ']}';
		
		$data['filename'] = $filename;
		$data['chessdata'] = $chessdata;
		$data['uniacid'] = $_W['uniacid'];
		$data['openid'] = $openid;
		$data['addtime'] = time();
		pdo_insert($this->table_chess,$data);
	}break;
	case 'replay':{
		$condition['uniacid'] = $_W['uniacid'];
		$condition['filename'] = $_GPC['file'];
		$chess = pdo_get($this->table_chess,$condition);
		$chessdata = $chess['chessdata'];
		
		include $this->template('publish_replay');
	}break;
	case 'test':{
		$condition['uniacid'] = $_W['uniacid'];
		$list =  pdo_getall($this->table_chess,$condition);
		print_r($list);
	}
}



