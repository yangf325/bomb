var main=document.getElementById('bomb'),
	bbody=document.getElementById('bbody'),
	reset=document.getElementById('reset'),
	record=document.getElementById('record'),
	timespan=document.getElementById('timespan'),
	remain=document.getElementById('remain'),
	mid=document.getElementById('mid'),
	easy=document.getElementById('primary'),
	drag=document.getElementById('drag'),
	map=[];
var bombs=[];
var mybomb=0;
var boxleft=0;
var empty=[];
var thistime;
var map2=new Array();
var record1=999999;
var record2=999999;
var starttime;
var nowtime;
var thisrecord;
var atime;
var nodenum,
	bombnum;
document.oncontextmenu=noright;
reset.onclick=start;
tostart(0)();
mid.onclick=tostart(1);
easy.onclick=tostart(0);
reset.onclick=tostart(0);
function tostart(flag){
	return function(){
	if(!flag){
		bbody.style.width='300px';
		nodenum=10;
		bombnum=10;
		start();
	}
	else{
		bbody.style.width='600px';
		nodenum=20;
		bombnum=60;
		start();
		
	}
}
}
function start(){
	// 开始游戏，重置地图和炸弹
	boxleft=0;
	map=[];
	map2=[];
	thistime=0;
	bombs=[];
	bbody.innerHTML='';
	mytime(1);
	createnode();
	createbomb();
	eventbind(1);
	mybomb=bombnum;
}
function mytime(tflag){//计算游戏开始时间
	if(tflag){
		nowtime=null;
		starttime=null;
		starttime=new Date();
		atime=setInterval(function(){
			nowtime=new Date();
			thistime=nowtime-starttime;
			timespan.innerHTML=Math.floor(thistime/1000/60)+':'+Math.floor(thistime/1000%60);
		},1000);
	}
	else{
		clearInterval(atime);
	}
}
function newmap2(){
	for(var i=0;i<nodenum;i++){
		map2[i]=new Array();
	}
}
function eventbind(flag){
	// 绑定每个box的点击事件
	for (var i=0; i < nodenum; i++){
		for (var j=0; j<nodenum; j++) {
			(function a (num1,num2){
				if(flag){
					// 如果是1则绑定事件
					map[num1][num2].onmouseup=function(){
						if(arguments[0].button==0){
						// 绑定左键
							if(this.innerHTML=='<img src="no.png">'){
							// 如果点到标记
								return 0;
							}
							else if(map2[num2][num1]=="<img src='bomb.png'>"){
							// 如果点到炸弹
								end(0);
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
									if(empty[i].innerHTML==''){
										empty[i].className='box bombresult';
										if(empty[i].num){
											empty[i].innerHTML=map2[empty[i].num.num22][empty[i].num.num11];
										}
									}
								}
							}
							this.className='box bombresult';
							boxnumber();
							if(boxleft<=bombnum){
								end(1);
							}
						}
						if(arguments[0].button==2){
						// 绑定右键
							if(this.innerHTML=='<img src="no.png">'){
							// 如果是标记就取消标记
								this.innerHTML="";
								mybomb++;
								remain.innerHTML=mybomb;
							}
							else if(mybomb>0){
							// 有剩余标记的情况下
								if(this.innerHTML==""&&this.className=='box'){
								// 如果是空就添加标记
									this.innerHTML='<img src="no.png">';
									mybomb--;
									remain.innerHTML=mybomb;
								}
							}
						}
					};//绑定onclick
				}
				else{//如果是0则取消事件绑定
					map[num1][num2].onmouseup=null;
				}
			})(i,j);
		}
	}
}
function cb(num2,num1){
	if(!map[num1][num2].target){//检测是否检查过 检查过就标记Target
		if(map2[num2][num1]==''){//如果没有地雷没有数字则递归检查上下左右
			map[num1][num2].target=true;
			empty.push(map[num1][num2]);//把本节点推入empty数组以备递归结束后统一修改
			if(num2!==nodenum-1){cb(num2+1,num1);}
			if(num1!==nodenum-1){cb(num2,num1+1);}
			if(num2!==0){cb(num2-1,num1);}
			if(num1!==0){cb(num2,num1-1);}
			return true;
		}
		else if(map2[num2][num1]!="<img src='bomb.png'>"){//如果是数字则推入本节点但不递归
			map[num1][num2].num={num11:num1,num22:num2};
			empty.push(map[num1][num2]);
			return true;
		}
	}
	return false;
}
function boxnumber(){
	// 统计剩下的空盒子；
	boxleft=0;
	for (var i=0; i < nodenum; i++){
		for (var j=0; j<nodenum; j++) {
			if(map[i][j].className=='box'){
				boxleft++;
			}
		}
	}
}
function createnode(){
	// 创建地图
	for(var i=0;i<nodenum;i++){
		var cols=[];
		for(var j=0;j<nodenum;j++){
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
	for(var i=0;i<bombnum;i++){
	//创建十个炸弹
		var x=Math.floor(Math.random()*nodenum);
		var y=Math.floor(Math.random()*nodenum);
		var abomb=[x,y];
		bombs.push(abomb);
	}
	// 初始化并计算MAP2
	newmap2();
	for (var i=0; i < nodenum; i++){
		for (var j=0; j<nodenum; j++) {
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
	for(var i=0;i<bombnum;i++){
		if(bombs[i][0]==x&&bombs[i][1]==y){
			return 1;
		}
	}
	return 0;
}
function end (ifwin){
	//游戏结束
	if(ifwin){
		alert('You win');
		if(nodenum==20){
			if(thistime<record2){
				record2=thistime;
				alert('new record!畜生');
			}
		}
		else if(nodenum==10){
			console.log(thistime,nowtime,record1);
			if(thistime<record1){
				record1=thistime;
				alert('new record!神人');
			}
		}
		mytime(0);
	}
	else{
		alert('Game over');
		mytime(0);
	}
	eventbind(false);
}

function noright(e){
	// 禁用右键菜单
	if (e.button == 2 || e.button == 1){ 
       e.cancelBubble = true ;
       e.stopPropagation();
       e.preventDefault();
       e.returnvalue = false; 
       return false; 
      } 
}
record.onclick=function(){
	alert('人类记录： '+record1/1000+' 秒，畜生记录'+record2/1000+'秒');
}



drag.onmousedown=function(){
	document.onmousemove=function(){
		if(arguments[0].clientX+parseInt(bbody.style.width)<document.body.clientWidth){
			drag.style.top=bbody.style.top=arguments[0].clientY+10+'px';
			drag.style.left=bbody.style.left=arguments[0].clientX+10+'px';
		}
	}
}
document.onmouseup=function(){
	document.onmousemove=null;
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

