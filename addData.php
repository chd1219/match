<?php
	$map = $_POST['map'];
	$moves = $_POST['moves'];	
	$notes = $_POST['notes'];	
	$filename = $_POST['filename'];
	$BillType = $_POST['BillType']+0;
	
	
	
	$path = "./save/";
	if(!file_exists($path))
	{
		mkdir($path);
	}  
	$fp = fopen($path.$filename,'w');	
	if(!$fp)
	{
		echo '?????';
		exit;
	}
	//
	$maplist = explode(' ',$map);
	$moveslist = explode(' ',$moves);
	$noteslist = explode(' ',$notes);
	
	fwrite($fp, "{\"BillType\":");
	fwrite($fp, $BillType);
	
	fwrite($fp, ",\"map\":[");
	for ($index=1;$index<count($maplist);$index+=3){
		fwrite($fp, "{\"cid\":");
		fwrite($fp, $maplist[$index]);
		fwrite($fp, ",\"x\":");
		fwrite($fp, $maplist[$index+1]);
		fwrite($fp, ",\"y\":");
		fwrite($fp, $maplist[$index+2]);
		if($index == count($maplist)-3)
			fwrite($fp, "}");
		else
			fwrite($fp, "},");
	}
	
	if($BillType){
		
		if(count($moveslist) >0){
			fwrite($fp, "],\"moves\":[");
			for ($index=1;$index<count($moveslist);$index+=4){
				fwrite($fp, "{\"step\":\"");			
				fwrite($fp, $moveslist[$index]);
				fwrite($fp, "\",\"id\":");
				fwrite($fp, $moveslist[$index+1]);
				fwrite($fp, ",\"perid\":");
				fwrite($fp, $moveslist[$index+2]);
				fwrite($fp, ",\"index\":");
				fwrite($fp, $moveslist[$index+3]);

				if($index == count($moveslist)-4)
					fwrite($fp, "}");
				else
					fwrite($fp, "},");
			}		
		}		
	}
	else{
		if(count($moveslist) >0){
			fwrite($fp, "],\"moves\":[");
			for ($index=1;$index<count($moveslist);$index+=4){
				fwrite($fp, "{\"src\":");			
				fwrite($fp, "{\"x\":");
				fwrite($fp, $moveslist[$index]);
				fwrite($fp, ",\"y\":");
				fwrite($fp, $moveslist[$index+1]);
				fwrite($fp, "},\"dst\":");
				fwrite($fp, "{\"x\":");
				fwrite($fp, $moveslist[$index+2]);
				fwrite($fp, ",\"y\":");
				fwrite($fp, $moveslist[$index+3]);
				if($index == count($moveslist)-4)
					fwrite($fp, "}}");
				else
					fwrite($fp, "}},");
			}		
		}		
	}
	if(count($noteslist) >0){
	fwrite($fp, "],\"notes\":[");
		for ($index=1;$index<count($noteslist);$index+=2){
			fwrite($fp, "{\"id\":");					
			fwrite($fp, $noteslist[$index]);
			fwrite($fp, ",\"note\":\"");
			fwrite($fp, $noteslist[$index+1]);
			fwrite($fp, "\"");
			if($index == count($noteslist)-2)
				fwrite($fp, "}");
			else
				fwrite($fp, "},");
		}		
	}	
	
	fwrite($fp, "]}");
	fclose($fp);

	
	
?>
