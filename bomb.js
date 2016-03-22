var main=document.getElementById('bomb'),
	bbody=document.getElementById('bbody'),
	reset=document.getElementById('reset'),
	pause=document.getElementById('pause'),
	timespan=document.getElementById('timespan'),
	remain=document.getElementById('remain'),
	map=[];
var bombs=[];
var mybomb=0;
var boxleft=0;
var empty=[];
var map2=new Array();
 document.oncontextmenu=noright;
start();
reset.onclick=start;


function start(){
	// 开始游戏，重置地图和炸弹
	boxleft=0;
	map=[];
	map2=[];
	bombs=[];
	bbody.innerHTML='';
	createnode();
	createbomb();
	eventbind(1);
	mybomb=10;
}
function newmap2(){
	for(var i=0;i<10;i++){
		map2[i]=new Array();
	}
}
function eventbind(flag){
	// 绑定每个box的点击事件
	for (var i=0; i < 10; i++){
		for (var j=0; j<10; j++) {

			(function a (num1,num2){
				if(flag){
					// 如果是1则绑定事件
					map[num1][num2].onmousedown=function(){
						if(arguments[0].button==0){
						// 绑定左键
							if(this.innerHTML=='<img src="no.png">'){
							// 如果点到标记
								return 0;
							}
							else if(map2[num2][num1]=="<img src='bomb.png'>"){
							// 如果点到炸弹
								end();
								this.innerHTML=map2[num2][num1];
							}
							else if(map2[num2][num1]!=0&&map2[num2][num1]!="<img src='bomb.png'>"){
							// 如果点到炸弹边缘
								this.innerHTML=map2[num2][num1];
							}
							else if(map2[num2][num1]==''){
							// 如果点到空白
								cb(num2,num1);
								for (var i = empty.length - 1; i >= 0; i--) {
									empty[i].className='box bombresult';
									if(empty[i].num){
										empty[i].innerHTML=map2[empty[i].num.num22][empty[i].num.num11];
									}
								}
							}
							this.className='box bombresult';
							boxnumber();
							if(boxleft==10){
								console.log('You win');
								end();
							}
						}
						if(arguments[0].button==2){
						// 绑定右键
							console.log(this.innerHTML);
							//console.log(this.outerHTML);
							if(this.innerHTML=='<img src="no.png">'){
								this.innerHTML="";
								mybomb++;
								remain.innerHTML=mybomb;
							}
							else if(this.innerHTML==""&&this.className=='box'){
								this.innerHTML='<img src="no.png">';
								mybomb--;
								remain.innerHTML=mybomb;
							}
						}
					};//绑定onclick
				}
				else{//如果是0则取消事件绑定
					map[num1][num2].onmousedown=null;
				}
			})(i,j);
		}
	}
}
function cb(num2,num1){
	console.log(map[num1][num2],num1,num2)
	if(!map[num1][num2].target){
		if(map2[num2][num1]==''){
			map[num1][num2].target=true;
			empty.push(map[num1][num2]);
			if(num2!==9){cb(num2+1,num1);}
			if(num1!==9){cb(num2,num1+1);}
			if(num2!==0){cb(num2-1,num1);}
			if(num1!==0){cb(num2,num1-1);}
			return true;
		}
		else if(map2[num2][num1]!="<img src='bomb.png'>"){
			map[num1][num2].num={num11:num1,num22:num2};
			empty.push(map[num1][num2]);
			return true;
		}
	}
	return false;
}
function boxnumber(){
	boxleft=0;
	for (var i=0; i < 10; i++){
		for (var j=0; j<10; j++) {
			if(map[i][j].className=='box'){
				boxleft++;
			}
		}
	}
}
function createnode(){
	// 创建地图
	for(var i=0;i<10;i++){
		var cols=[];
		for(var j=0;j<10;j++){
			var item=document.createElement('div');
			bbody.appendChild(item);
			item.className='box';
			item.target=false;
			cols.push(item);
		}
		map.push(cols);
	}
}
function createbomb(){
	for(var i=0;i<10;i++){
	//创建十个炸弹
		var x=Math.floor(Math.random()*10);
		var y=Math.floor(Math.random()*10);
		var abomb=[x,y];
		bombs.push(abomb);
	}
		
	// 初始化并计算MAP2
	newmap2();
	for (var i=0; i < 10; i++){
		for (var j=0; j<10; j++) {
			if(che(j,i)){
				map2[i][j]="<img src='bomb.png'>";
			}
			else{
				var number=0;

				number=che(j-1,i-1)+che(j+1,i-1)+che(j-1,i+1)+che(j-1,i)+che(j,i-1)+che(j+1,i)+che(j,i+1)+che(j+1,i+1);
				map2[i][j]=number;
			}
		}
	}
}
function che(x,y){
//检查是不是炸弹
	if(x<0||y<0){
		return 0;
	}
	for(var i=0;i<10;i++){
		if(bombs[i][0]==x&&bombs[i][1]==y){
			return 1;
		}
	}
	return 0;
}
function end (){
	//游戏结束
	console.log('Game over');
	bbody.className='bombresult';
	eventbind(false);
}

function noright(e){
	if (e.button == 2 || e.button == 1){ 
       e.cancelBubble = true ;
       e.stopPropagation();
       e.preventDefault();
       e.returnvalue = false; 
       return false; 
      } 
}

// function ccb(num2,num1){
// 	if(num2>0&&num1>0){
// 		console.log(map[num2][num1]);
// 		if(map2[num2][num1]!=''){
// 			return 0;
// 		}
// 		else{
// 			console.log(num1+','+num2);
// 			map[num1][num2].className='box bombresult';
// 			cb(num2-1,num1-1);
// 			cb(num2-1,num1  );
// 			cb(num2  ,num1-1);
// 			cb(num2+1,num1-1);
// 			cb(num2-1,num1+1);
// 			cb(num2+1,num1  );
// 			cb(num2  ,num1+1);
// 			cb(num2+1,num1+1);
// 		}
// 	}
// }

