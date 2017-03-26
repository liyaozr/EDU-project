//工具类函数

/**
 * [eventUtil 事件跨浏览器实现]
 * @param  {Object}   element 事件对象
 * @param  {Object}   type 事件类型
 * @param  {Function} handler 事件函数
 */
var eventUtil={
     //添加事件
	 addHandler:function(element,type,handler){
	 	if(element.addEventListener){
	 		element.addEventListener(type,handler,false);
	 	}else if (element.attachEvent) {
	 		element.attachEvent("on"+type,handler);
	 	}else {
	 		element["on"+type]=handler;
	 	}
	 },
	 //删除事件
	 removeHandler:function(element,type,handler){
	 	if(element.removeEventListener){
	 		element.removeEventListener(type,handler,false);
	 	}else if (element.detachEvent) {
	 		element.detachEvent("on"+type,handler);
	 	}else {
	 		element["on"+type]=null;
	 	}
	 },
	 //阻止事件默认行为
	 preventDefault:function(){
	    if (event.preventDefault) {
	        event.preventDefault();
	    } else {
	        event.returnValue=false;
	    }
	 },
	 //取消冒泡
	 stopPropagation:function(){
	    if (event.stopPropagation) {
	        event.stopPropagation();
	    } else {
	        event.cancelBubble=true;
	    }
	 }
};
/**
 *通过类名获取元素,直接使用老师给的封装函数
 * @param   {Object} element 父级对象
 * @param   {String} names 类名
 * @returns {Array}  获取到的节点数组
 */
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName("*");
        var result = [];
        var  childElement,
             classNameStr,
             flag;
        names = names.split(" ");
        for (var i = 0;  childElement = elements[i]; i++) {
            classNameStr = " " +  childElement.className + " ";
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(" " + name + "") == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push( childElement);
            }
        }
        return result;
    }
}
/**
 * 通过id获取元素
 * @param   {string} id 传入的id名
 * @returns {object} 返回获取到的html节点
 */
function $(id) {
    return typeof id === "string" ? document.getElementById(id) : id;
}

/**
 * 设置cookie
 * @param {String} name     设置cookie名
 * @param {String} value    对对应的cookie名
 * @param {Number} expires  过期的时间
 */
function setCookie(name, value, expires) {
	  var exdate=new Date();
	  exdate.setDate(expires+exdate.getDate());
	  document.cookie=name+ "=" +escape(value)+((expires===null) ? "" : ";expires="+exdate.toGMTString());

}
/**
 * 获取cookie
 * @param   {String} name 待寻找的cookie名
 * @returns {String} 返回寻找到的cookie值，没有则为空
 */
function getCookie(name) {
  if (document.cookie.length>0){
      startName=document.cookie.indexOf(name + "=");
      if (startName!=-1){
         startName = startName + name.length+1;
         endName=document.cookie.indexOf(";",startName);
         if (endName == -1) endName = document.cookie.length;
         return unescape(document.cookie.substring(startName,endName));
      }
    }
  return "";
}
/**
 *Ajax函数
 * @param {String}   method  get或者post请求
 * @param {String}   url     请求地址
 * @param {Object}   data    键值对的形式请求数据
 * @param {Function} success 请求成功执行的函数
 */
function ajax(method, url, data, success) {
    //创建ajax对象，兼容IE
    var xhr = null;
    try {
        xhr = new XMLHttpRequest();
    }
    catch (e) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //根据请求方式确认是否需要拼接
    if (method == "get" && data) {
        url += "?" + data;
    }
    xhr.open(method,url,true);
    //根据请求方式确认发送参数
    if (method == "get") {
        xhr.send();
    } else {
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
    //处理返回数据
    xhr.onreadystatechange = function() {

        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 ) {
                success && success(xhr.responseText);
            }
            else {
            	console.log("请求出错"+xhr.status);
            }
        }

    };
}

//工具类函数结束


// 页面逻辑开始

/* 广告 */
//页面加载时检测cookie
(function () {

	if(getCookie("topAd")==="true"){
		$("ad").style.display = "none";
	}
	else{
		$("ad").style.display = "block";
	}
	//关闭广告，设置cookie
	eventUtil.addHandler($("close"),"click",function () {
		$("ad").style.display="none";
		setCookie("topAd","true",7);
	});

})();
/* 广告结束 */

/* 导航关注模块开始 */
(function () {
	//更新状态
	function updateStatus() {
			var oFollowSuc = getCookie("followSuc");
			// 判断关注cookie值的情况
			if (oFollowSuc=="on") {
				$("cover").style.display = "none";
			    $("login").style.display = "none";
			    $("focus").className = "focused";
			    $("fans").innerHTML="46";
			}
			else {
			    $("focus").className = "";
			    $("fans").innerHTML="45";
			}
	}
	updateStatus();//页面加载时更新状态

	//点击关注判断loginSuc是否已设置
	eventUtil.addHandler($("focus"),"click",function () {
		ajax("get", "https://study.163.com/webDev/attention.htm","",function(data) {

				if (data==1) {
					var oLoginSuc = getCookie("loginSuc");
					var oFollowSuc = getCookie("followSuc");
					// 点击关注，先判断是否登录
					if (oLoginSuc == "on") {
						// 如果已登录，则判断关注状态，已关注则取消关注，一般有专门退出登录的接口。所以这里只取消关注，但是不取消登录
						if (oFollowSuc == "on") {
							$("focus").className = "";
						    setCookie("followSuc","off");
						     $("fans").innerHTML="45";
						}
						// 未关注则关注并设置cookie
						else{
							$("focus").className = "focused";
						    setCookie("followSuc","on");
						     $("fans").innerHTML="46";
						}
					}
					// 未登录则先登录
					else{
						$("cover").style.display="block";
			            $("login").style.display="block";
					}
				}

			});
	});

	//登录面板
	var oUsername = $("username");
	var oPassword = $("password");
	var aMess = getElementsByClassName($("login"),"Mess");

	function Login() {
		ajax("get", "https://study.163.com/webDev/login.htm", "userName="+hex_md5(encodeURI(oUsername.value))+"&password=" + hex_md5(oPassword.value), function(data) {
			if (data==1) {
				setCookie("loginSuc","on",10);
				setCookie("followSuc","on",10);
				updateStatus();
			}
		});
	}
	// 提交按钮状态变化
	eventUtil.addHandler($("submit"),"mousedown",function () {
		$("submit").style.background="url(image/icon.png) -5px -240px";
	});
	eventUtil.addHandler($("submit"),"mouseup",function () {
		$("submit").style.background="url(image/icon.png) -5px -152px";
	});
	// 点击提交时检测录入情况
	eventUtil.addHandler($("submit"),"click",function () {
		if (oUsername.value&&oPassword.value){
			Login();
		}
		else{
			if (!oUsername.value) {
				aMess[0].innerHTML="用户名不能为空";
			}
			if (!oPassword.value) {
				aMess[1].innerHTML="密码不能为空";
			}
		}
	});
	// 关闭登录面板
	eventUtil.addHandler($("l-close"),"click",function () {
		$("login").style.display="none";
		$("cover").style.display = "none";
	});

})();
/* 导航关注模块结束 */

/* 轮播图开始 */
function slideShow() {
	var oBannner = $("banner");
	var aImg = oBannner.getElementsByTagName("img");
	var aPointer = oBannner.getElementsByTagName("i");
	var timer=null;
	var play=null;
	var num=0;

    //点击按钮切换图片
	for (var i = 0; i < aPointer.length; i++) {
		var j = i;
		eventUtil.addHandler(aPointer[i],"mouseover",(function (j) {
			return function() {
				show(j);
			};
		})(i));
	}

	//鼠标划过关闭自动播放
	eventUtil.addHandler(oBannner,"mouseover",function () {
		clearInterval(play);
	});
	//鼠标离开开启自动播放
	eventUtil.addHandler(oBannner,"mouseout",autoPlay);

	//自动播放函数
	function autoPlay() {
		clearInterval(play);
		var n = 0;
		play = setInterval(function () {
			n++;
			if(n >= aImg.length){n = 0;}
			show(n);
		},5000);
	}
	autoPlay();

	//切换图片淡入效果
	function show(a){
		num = a;
		var alpha = 0;
		for (var i = 0; i < aImg.length; i++) {
				aImg[i].className="";
				aPointer[i].className="";
		}

		aPointer[num].className="current";
		aImg[num].className="b-active";

		clearInterval(timer);
		timer = setInterval(function () {
			alpha += 0.1;
			if(alpha > 1){alpha =1;}
			aImg[num].style.opacity = alpha;
			aImg[num].style.filter = "alpha(opacity = " + 100*alpha + ")";
			if(alpha == 1){clearInterval(timer);}
		},50);//10次*50ms
	}
}
slideShow();//调用

/* 轮播图结束 */

/* 场景秀开始 */
function scroll() {
    var oShow = document.getElementById("m-show");
    var oUl = oShow.getElementsByTagName("ul")[0];
    var aLi = oUl.getElementsByTagName("li");
    var str = oUl.innerHTML + oUl.innerHTML;
    var roll = null;
    oUl.innerHTML = str;
    oUl.style.width = aLi[0].offsetWidth * aLi.length + "px";
    // 无缝滚动函数
    function showPic() {
    	roll = setInterval(function() {
		     var l=oUl.offsetLeft;
		     if (l <= -oUl.offsetWidth / 2) {
		         l = "0";
		     }
		      oUl.style.left = l-2+"px";
	    }, 30);
    }
    showPic();
    // 鼠标移入停止滚动
    eventUtil.addHandler(oShow,"mouseover",function () {
		clearInterval(roll);
	});
	// 鼠标移开开始滚动
	eventUtil.addHandler(oShow,"mouseout",function () {
		clearInterval(roll);
		showPic();
	});
}
setTimeout(scroll,100);//调用

/* 播放视频 */
eventUtil.addHandler($("v-img"),"click",function () {
	$("cover").style.display="block";
	$("videoPop").style.display="block";
});
eventUtil.addHandler($("v-close"),"click",function () {
	$("cover").style.display="none";
	$("videoPop").style.display="none";
	$("video").pause();
});

/* 课程列表开始 */
(function(){
		var oLesson = getElementsByClassName(document,"m-lesson")[0];
        var oMpage = $("m-page");

	    //创建课程内容
		function creatLesson(data,wrap) {
			var oPrice = data.price+".00";
			wrap.innerHTML="<div class='preview'>\
							    <img src="+data.middlePhotoUrl+">\
							    <span class='poster'></span>\
							    <p>"+data.name+"</p>\
							    <p class='provider'>"+data.provider+"</p>\
							    <span class='learner'>"+data.learnerCount+"</span>\
							    <p class='price'>￥"+oPrice+"</p>\
							 </div>\
							 <div class='detail'>\
							    <div class='infor'>\
		 							<img src="+data.middlePhotoUrl+">\
		 							<div class='introduce'>\
		 							      <h3>"+data.name+"</h3>\
		 							      <span class='learn'><span></span>"+data.learnerCount+"人在学</span><br>\
		 							      <span>发布者："+data.provider+"</span><br>\
		 							      <span>分类："+data.categoryName+"</span><br>\
		 							</div>\
		 						</div>\
	 							<div class='description'>"+data.description+"</div>\
	 						 </div>";
			oLesson.appendChild(wrap);
		}
		// 获取课程内容
		function getLesson(data) {
				var oLesson = getElementsByClassName(document,"m-lesson")[0];
				oLesson.innerHTML="";//每次调用的时候保证上一次的数据已经清空
				for (var n=0; n<data.length; n++) {
					var oProduct=document.createElement("div");
					oProduct.className="l-wrap";
					creatLesson(data[n] , oProduct);
				}

  			    var aLwrap = getElementsByClassName(oLesson,"l-wrap");
				// 课程内容hover效果
				for (var i = 0; i < aLwrap.length; i++) {
					aLwrap[i].index=i;
					eventUtil.addHandler(aLwrap[i],"mousemove",(function (obj) {
						return function () {
							var oPrev=getElementsByClassName(obj,"preview")[0];
						    var oDetail=getElementsByClassName(obj,"detail")[0];
							oPrev.style.display="none";
							oDetail.style.display="block";
						};
			       })(aLwrap[i]));
					eventUtil.addHandler(aLwrap[i],"mouseout",(function (obj) {
						return function () {
							var oPrev=getElementsByClassName(obj,"preview")[0];
					        var oDetail=getElementsByClassName(obj,"detail")[0];
							oPrev.style.display="block";
							oDetail.style.display="none";
					    };
					})(aLwrap[i]));
				}
		}
		//通过ajax获取数据
		function changeLesson(iPage,iType) {
			if (document.body.clientWidth>1205) {
				iPsize=20;
			}else{
				iPsize=15;
			}
			ajax("get", "https://study.163.com/webDev/couresByCategory.htm", "pageNo="+iPage+"&psize="+iPsize+"&type="+iType,function(data) {
				var oData = JSON.parse(data);
				var aList = oData.list;

				getLesson(aList);

				oMpage.innerHTML=""; //每次加载时保证上一次内容已清空

				//页面加载时创建分页数据
				page({
					id:"m-page",
			    	pageNow:oData.pagination.pageIndex,
			    	pageAll:Math.ceil(oData.totalCount/iPsize),
				});
			});
	    }

		changeLesson(1,10); //页面加载时

        var flag = true;
		//课程切换
		var Mtab = getElementsByClassName(document,"m-tab")[0];
		var aLeson = Mtab.getElementsByTagName("li");
		eventUtil.addHandler(Mtab,"click",function (e) {
			for (var i = 0; i < aLeson.length; i++) {
				aLeson[i].className="";
			}
			e = e||window.event;
			var target = e.target||e.srcElement;
			if (target&&target.nodeName.toUpperCase()=="LI") {
				target.className="t-active";
				oMpage.innerHTML="";
				var index = target.getAttribute("index");
				if (index == "10") {
					changeLesson(1,10);
					flag = true;
				}else{
					changeLesson(1,20);
					flag = false;
				}
			}
		});

		//分页 参考妙味-原官网分页特效
		function page(opt){
	        if(!opt.id){
	            return false;
	        }
	        var obj = document.getElementById(opt.id);
	        var pageNow = opt.pageNow || 1;
	        var pageAll = opt.pageAll;
	        var childLen = 5; //分页列表最多显示5项
	        var callBack = opt.callBack||function () {};
	        var pageList = Math.ceil(childLen/2) + 1;
	        // 页数生成
	        function creatPage(i){
	            var oA = document.createElement("a");
	            oA.href = "#"+i;
	            oA.className = "page";
	            oA.innerHTML = i;
	            if(pageNow == i){
	                oA.className="page page-active";
	            }
	            return oA;
	        }
	        //当前页不等于1时上一页可选
	        var oA = document.createElement("a");
	        oA.innerHTML = "&lt;";
	        oA.href = "#"+(pageNow-1);
	        if(pageNow != 1){
	            oA.className = "prv";
	        }else{
	            oA.className = "prv disable";
	        }
	        obj.appendChild(oA);

	        //生成具体页数
	        if(pageAll < childLen){
        		for(var i=1; i <= pageAll; i++){
        	        oA = creatPage(i);
        	        obj.appendChild(oA);
        	    }
	        }else{
            	for(var i=1; i <= childLen; i++){
                    if(pageNow < pageList){
                        oA = creatPage(i);
                    }
                    else if(pageAll - pageNow <= pageList){
	                    oA = creatPage(pageAll - childLen +i);
	                }
	                else{
	                    oA = creatPage(pageNow - pageList + i);
	                }
                    obj.appendChild(oA);
                }
	        }

	        //当前页不是最后一页时显示下一页
	        var oA = document.createElement("a");
	        oA.innerHTML = "&gt;";
	        oA.href = "#"+(pageNow+1);
	        if( pageNow!=pageAll ){
	            oA.className = "nxt";
	        }else{
	            oA.className = "nxt disable";
	        }
	        obj.appendChild(oA);
	        callBack(pageNow);
	        var aA = obj.getElementsByTagName("a");
	        for(var n=0;n<aA.length;n++){
	        	eventUtil.addHandler(aA[n],"click",(function (object) {
	        		return function(){
	        			var pageNow = parseInt(object.getAttribute("href").substring(1));
	        			obj.innerHTML="";
	        			page({
	        			    id:opt.id,
	        			    pageNow:pageNow,
	        			    pageAll:pageAll,
	        			    callBack:function (pageNow) {
	        			    	if (flag) {
	        			    		changeLesson(pageNow,10);
	        			    	}else{
	        			    		changeLesson(pageNow,20);
	        			    	}
	        			    }
	        			});
	        			eventUtil.preventDefault();
	        		};
	        	})(aA[n]));
	        }
		}

})();



// 最热排行
(function () {
	var oHotWrap = getElementsByClassName(document,"m-hot")[0];
	var oHotUl = getElementsByClassName(document,"hot-ul")[0];
    // 创建列表
	function getList(data,wrap) {
		wrap.innerHTML="<img src="+data.smallPhotoUrl+"><p class='hotname'>"+data.name+"</p><span class='num'>"+data.learnerCount+"</span>";
		oHotUl.appendChild(wrap);
	}
	// 获取列表数据
	function changeList() {
		ajax("get", "https://study.163.com/webDev/hotcouresByCategory.htm", "",function(data) {
			var oData = JSON.parse(data);
			for (var n=0; n<oData.length; n++) {
				var oHotLi=document.createElement("li");
				getList(oData[n] , oHotLi);
			}
		});

	}
	changeList();

    var aLi = oHotUl.getElementsByTagName('li');
    var hotRoll = null;
    var stri;
	stri = oHotUl.innerHTML+oHotUl.innerHTML;
	oHotUl.innerHTML = stri;
    // 每5秒滚动一次
    function hotScoll() {
    	hotRoll = setInterval(function() {
		     var t=oHotUl.offsetTop;
		     if (t <= -oHotUl.offsetHeight/2) {
		         t=0;
		     }
		     oHotUl.style.top = t-70+"px";
	    }, 5000);
    }
    hotScoll();
    // 鼠标移入停止滚动
    eventUtil.addHandler(oHotUl,"mouseover",function () {
		clearInterval(hotRoll);
	});
	// 鼠标移除开始滚动
	eventUtil.addHandler(oHotUl,"mouseout",function () {
		clearInterval(hotRoll);
		hotScoll();
	});
})();