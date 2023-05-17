(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global=global||self,global.CodeMirror=factory())}(this,(function(){'use strict';var userAgent=navigator.userAgent;var platform=navigator.platform;var gecko=/gecko\/\d/i.test(userAgent);var ie_upto10=/MSIE \d/.test(userAgent);var ie_11up=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);var edge=/Edge\/(\d+)/.exec(userAgent);var ie=ie_upto10||ie_11up||edge;var ie_version=ie&&(ie_upto10?document.documentMode||6:+(edge||ie_11up)[1]);var webkit=!edge&&/WebKit\//.test(userAgent);var qtwebkit=webkit&&/Qt\/\d+\.\d+/.test(userAgent);var chrome=!edge&&/Chrome\/(\d+)/.exec(userAgent);var chrome_version=chrome&&+chrome[1];var presto=/Opera\//.test(userAgent);var safari=/Apple Computer/.test(navigator.vendor);var mac_geMountainLion=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);var phantom=/PhantomJS/.test(userAgent);var ios=safari&&(/Mobile\/\w+/.test(userAgent)||navigator.maxTouchPoints>2);var android=/Android/.test(userAgent);var mobile=ios||android||/webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);var mac=ios||/Mac/.test(platform);var chromeOS=/\bCrOS\b/.test(userAgent);var windows=/win/i.test(platform);var presto_version=presto&&userAgent.match(/Version\/(\d*\.\d*)/);if(presto_version){presto_version=Number(presto_version[1])}
if(presto_version&&presto_version>=15){presto=!1;webkit=!0}
var flipCtrlCmd=mac&&(qtwebkit||presto&&(presto_version==null||presto_version<12.11));var captureRightClick=gecko||(ie&&ie_version>=9);function classTest(cls){return new RegExp("(^|\\s)"+cls+"(?:$|\\s)\\s*")}
var rmClass=function(node,cls){var current=node.className;var match=classTest(cls).exec(current);if(match){var after=current.slice(match.index+match[0].length);node.className=current.slice(0,match.index)+(after?match[1]+after:"")}};function removeChildren(e){for(var count=e.childNodes.length;count>0;--count){e.removeChild(e.firstChild)}
return e}
function removeChildrenAndAdd(parent,e){return removeChildren(parent).appendChild(e)}
function elt(tag,content,className,style){var e=document.createElement(tag);if(className){e.className=className}
if(style){e.style.cssText=style}
if(typeof content=="string"){e.appendChild(document.createTextNode(content))}else if(content){for(var i=0;i<content.length;++i){e.appendChild(content[i])}}
return e}
function eltP(tag,content,className,style){var e=elt(tag,content,className,style);e.setAttribute("role","presentation");return e}
var range;if(document.createRange){range=function(node,start,end,endNode){var r=document.createRange();r.setEnd(endNode||node,end);r.setStart(node,start);return r}}else{range=function(node,start,end){var r=document.body.createTextRange();try{r.moveToElementText(node.parentNode)}catch(e){return r}
r.collapse(!0);r.moveEnd("character",end);r.moveStart("character",start);return r}}
function contains(parent,child){if(child.nodeType==3){child=child.parentNode}
if(parent.contains){return parent.contains(child)}
do{if(child.nodeType==11){child=child.host}
if(child==parent){return!0}}while(child=child.parentNode)}
function activeElt(doc){var activeElement;try{activeElement=doc.activeElement}catch(e){activeElement=doc.body||null}
while(activeElement&&activeElement.shadowRoot&&activeElement.shadowRoot.activeElement){activeElement=activeElement.shadowRoot.activeElement}
return activeElement}
function addClass(node,cls){var current=node.className;if(!classTest(cls).test(current)){node.className+=(current?" ":"")+cls}}
function joinClasses(a,b){var as=a.split(" ");for(var i=0;i<as.length;i++){if(as[i]&&!classTest(as[i]).test(b)){b+=" "+as[i]}}
return b}
var selectInput=function(node){node.select()};if(ios){selectInput=function(node){node.selectionStart=0;node.selectionEnd=node.value.length}}else if(ie){selectInput=function(node){try{node.select()}catch(_e){}}}
function doc(cm){return cm.display.wrapper.ownerDocument}
function win(cm){return doc(cm).defaultView}
function bind(f){var args=Array.prototype.slice.call(arguments,1);return function(){return f.apply(null,args)}}
function copyObj(obj,target,overwrite){if(!target){target={}}
for(var prop in obj){if(obj.hasOwnProperty(prop)&&(overwrite!==!1||!target.hasOwnProperty(prop))){target[prop]=obj[prop]}}
return target}
function countColumn(string,end,tabSize,startIndex,startValue){if(end==null){end=string.search(/[^\s\u00a0]/);if(end==-1){end=string.length}}
for(var i=startIndex||0,n=startValue||0;;){var nextTab=string.indexOf("\t",i);if(nextTab<0||nextTab>=end){return n+(end-i)}
n+=nextTab-i;n+=tabSize-(n%tabSize);i=nextTab+1}}
var Delayed=function(){this.id=null;this.f=null;this.time=0;this.handler=bind(this.onTimeout,this)};Delayed.prototype.onTimeout=function(self){self.id=0;if(self.time<=+new Date){self.f()}else{setTimeout(self.handler,self.time- +new Date)}};Delayed.prototype.set=function(ms,f){this.f=f;var time=+new Date+ms;if(!this.id||time<this.time){clearTimeout(this.id);this.id=setTimeout(this.handler,ms);this.time=time}};function indexOf(array,elt){for(var i=0;i<array.length;++i){if(array[i]==elt){return i}}
return-1}
var scrollerGap=50;var Pass={toString:function(){return"CodeMirror.Pass"}};var sel_dontScroll={scroll:!1},sel_mouse={origin:"*mouse"},sel_move={origin:"+move"};function findColumn(string,goal,tabSize){for(var pos=0,col=0;;){var nextTab=string.indexOf("\t",pos);if(nextTab==-1){nextTab=string.length}
var skipped=nextTab-pos;if(nextTab==string.length||col+skipped>=goal){return pos+Math.min(skipped,goal-col)}
col+=nextTab-pos;col+=tabSize-(col%tabSize);pos=nextTab+1;if(col>=goal){return pos}}}
var spaceStrs=[""];function spaceStr(n){while(spaceStrs.length<=n){spaceStrs.push(lst(spaceStrs)+" ")}
return spaceStrs[n]}
function lst(arr){return arr[arr.length-1]}
function map(array,f){var out=[];for(var i=0;i<array.length;i++){out[i]=f(array[i],i)}
return out}
function insertSorted(array,value,score){var pos=0,priority=score(value);while(pos<array.length&&score(array[pos])<=priority){pos++}
array.splice(pos,0,value)}
function nothing(){}
function createObj(base,props){var inst;if(Object.create){inst=Object.create(base)}else{nothing.prototype=base;inst=new nothing()}
if(props){copyObj(props,inst)}
return inst}
var nonASCIISingleCaseWordChar=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;function isWordCharBasic(ch){return/\w/.test(ch)||ch>"\x80"&&(ch.toUpperCase()!=ch.toLowerCase()||nonASCIISingleCaseWordChar.test(ch))}
function isWordChar(ch,helper){if(!helper){return isWordCharBasic(ch)}
if(helper.source.indexOf("\\w")>-1&&isWordCharBasic(ch)){return!0}
return helper.test(ch)}
function isEmpty(obj){for(var n in obj){if(obj.hasOwnProperty(n)&&obj[n]){return!1}}
return!0}
var extendingChars=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;function isExtendingChar(ch){return ch.charCodeAt(0)>=768&&extendingChars.test(ch)}
function skipExtendingChars(str,pos,dir){while((dir<0?pos>0:pos<str.length)&&isExtendingChar(str.charAt(pos))){pos+=dir}
return pos}
function findFirst(pred,from,to){var dir=from>to?-1:1;for(;;){if(from==to){return from}
var midF=(from+to)/2,mid=dir<0?Math.ceil(midF):Math.floor(midF);if(mid==from){return pred(mid)?from:to}
if(pred(mid)){to=mid}else{from=mid+dir}}}
function iterateBidiSections(order,from,to,f){if(!order){return f(from,to,"ltr",0)}
var found=!1;for(var i=0;i<order.length;++i){var part=order[i];if(part.from<to&&part.to>from||from==to&&part.to==from){f(Math.max(part.from,from),Math.min(part.to,to),part.level==1?"rtl":"ltr",i);found=!0}}
if(!found){f(from,to,"ltr")}}
var bidiOther=null;function getBidiPartAt(order,ch,sticky){var found;bidiOther=null;for(var i=0;i<order.length;++i){var cur=order[i];if(cur.from<ch&&cur.to>ch){return i}
if(cur.to==ch){if(cur.from!=cur.to&&sticky=="before"){found=i}else{bidiOther=i}}
if(cur.from==ch){if(cur.from!=cur.to&&sticky!="before"){found=i}else{bidiOther=i}}}
return found!=null?found:bidiOther}
var bidiOrdering=(function(){var lowTypes="bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";var arabicTypes="nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";function charType(code){if(code<=0xf7){return lowTypes.charAt(code)}else if(0x590<=code&&code<=0x5f4){return"R"}else if(0x600<=code&&code<=0x6f9){return arabicTypes.charAt(code-0x600)}else if(0x6ee<=code&&code<=0x8ac){return"r"}else if(0x2000<=code&&code<=0x200b){return"w"}else if(code==0x200c){return"b"}else{return"L"}}
var bidiRE=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;var isNeutral=/[stwN]/,isStrong=/[LRr]/,countsAsLeft=/[Lb1n]/,countsAsNum=/[1n]/;function BidiSpan(level,from,to){this.level=level;this.from=from;this.to=to}
return function(str,direction){var outerType=direction=="ltr"?"L":"R";if(str.length==0||direction=="ltr"&&!bidiRE.test(str)){return!1}
var len=str.length,types=[];for(var i=0;i<len;++i){types.push(charType(str.charCodeAt(i)))}
for(var i$1=0,prev=outerType;i$1<len;++i$1){var type=types[i$1];if(type=="m"){types[i$1]=prev}else{prev=type}}
for(var i$2=0,cur=outerType;i$2<len;++i$2){var type$1=types[i$2];if(type$1=="1"&&cur=="r"){types[i$2]="n"}else if(isStrong.test(type$1)){cur=type$1;if(type$1=="r"){types[i$2]="R"}}}
for(var i$3=1,prev$1=types[0];i$3<len-1;++i$3){var type$2=types[i$3];if(type$2=="+"&&prev$1=="1"&&types[i$3+1]=="1"){types[i$3]="1"}else if(type$2==","&&prev$1==types[i$3+1]&&(prev$1=="1"||prev$1=="n")){types[i$3]=prev$1}
prev$1=type$2}
for(var i$4=0;i$4<len;++i$4){var type$3=types[i$4];if(type$3==","){types[i$4]="N"}else if(type$3=="%"){var end=(void 0);for(end=i$4+1;end<len&&types[end]=="%";++end){}
var replace=(i$4&&types[i$4-1]=="!")||(end<len&&types[end]=="1")?"1":"N";for(var j=i$4;j<end;++j){types[j]=replace}
i$4=end-1}}
for(var i$5=0,cur$1=outerType;i$5<len;++i$5){var type$4=types[i$5];if(cur$1=="L"&&type$4=="1"){types[i$5]="L"}else if(isStrong.test(type$4)){cur$1=type$4}}
for(var i$6=0;i$6<len;++i$6){if(isNeutral.test(types[i$6])){var end$1=(void 0);for(end$1=i$6+1;end$1<len&&isNeutral.test(types[end$1]);++end$1){}
var before=(i$6?types[i$6-1]:outerType)=="L";var after=(end$1<len?types[end$1]:outerType)=="L";var replace$1=before==after?(before?"L":"R"):outerType;for(var j$1=i$6;j$1<end$1;++j$1){types[j$1]=replace$1}
i$6=end$1-1}}
var order=[],m;for(var i$7=0;i$7<len;){if(countsAsLeft.test(types[i$7])){var start=i$7;for(++i$7;i$7<len&&countsAsLeft.test(types[i$7]);++i$7){}
order.push(new BidiSpan(0,start,i$7))}else{var pos=i$7,at=order.length,isRTL=direction=="rtl"?1:0;for(++i$7;i$7<len&&types[i$7]!="L";++i$7){}
for(var j$2=pos;j$2<i$7;){if(countsAsNum.test(types[j$2])){if(pos<j$2){order.splice(at,0,new BidiSpan(1,pos,j$2));at+=isRTL}
var nstart=j$2;for(++j$2;j$2<i$7&&countsAsNum.test(types[j$2]);++j$2){}
order.splice(at,0,new BidiSpan(2,nstart,j$2));at+=isRTL;pos=j$2}else{++j$2}}
if(pos<i$7){order.splice(at,0,new BidiSpan(1,pos,i$7))}}}
if(direction=="ltr"){if(order[0].level==1&&(m=str.match(/^\s+/))){order[0].from=m[0].length;order.unshift(new BidiSpan(0,0,m[0].length))}
if(lst(order).level==1&&(m=str.match(/\s+$/))){lst(order).to-=m[0].length;order.push(new BidiSpan(0,len-m[0].length,len))}}
return direction=="rtl"?order.reverse():order}})();function getOrder(line,direction){var order=line.order;if(order==null){order=line.order=bidiOrdering(line.text,direction)}
return order}
var noHandlers=[];var on=function(emitter,type,f){if(emitter.addEventListener){emitter.addEventListener(type,f,!1)}else if(emitter.attachEvent){emitter.attachEvent("on"+type,f)}else{var map=emitter._handlers||(emitter._handlers={});map[type]=(map[type]||noHandlers).concat(f)}};function getHandlers(emitter,type){return emitter._handlers&&emitter._handlers[type]||noHandlers}
function off(emitter,type,f){if(emitter.removeEventListener){emitter.removeEventListener(type,f,!1)}else if(emitter.detachEvent){emitter.detachEvent("on"+type,f)}else{var map=emitter._handlers,arr=map&&map[type];if(arr){var index=indexOf(arr,f);if(index>-1){map[type]=arr.slice(0,index).concat(arr.slice(index+1))}}}}
function signal(emitter,type){var handlers=getHandlers(emitter,type);if(!handlers.length){return}
var args=Array.prototype.slice.call(arguments,2);for(var i=0;i<handlers.length;++i){handlers[i].apply(null,args)}}
function signalDOMEvent(cm,e,override){if(typeof e=="string"){e={type:e,preventDefault:function(){this.defaultPrevented=!0}}}
signal(cm,override||e.type,cm,e);return e_defaultPrevented(e)||e.codemirrorIgnore}
function signalCursorActivity(cm){var arr=cm._handlers&&cm._handlers.cursorActivity;if(!arr){return}
var set=cm.curOp.cursorActivityHandlers||(cm.curOp.cursorActivityHandlers=[]);for(var i=0;i<arr.length;++i){if(indexOf(set,arr[i])==-1){set.push(arr[i])}}}
function hasHandler(emitter,type){return getHandlers(emitter,type).length>0}
function eventMixin(ctor){ctor.prototype.on=function(type,f){on(this,type,f)};ctor.prototype.off=function(type,f){off(this,type,f)}}
function e_preventDefault(e){if(e.preventDefault){e.preventDefault()}else{e.returnValue=!1}}
function e_stopPropagation(e){if(e.stopPropagation){e.stopPropagation()}else{e.cancelBubble=!0}}
function e_defaultPrevented(e){return e.defaultPrevented!=null?e.defaultPrevented:e.returnValue==!1}
function e_stop(e){e_preventDefault(e);e_stopPropagation(e)}
function e_target(e){return e.target||e.srcElement}
function e_button(e){var b=e.which;if(b==null){if(e.button&1){b=1}else if(e.button&2){b=3}else if(e.button&4){b=2}}
if(mac&&e.ctrlKey&&b==1){b=3}
return b}
var dragAndDrop=function(){if(ie&&ie_version<9){return!1}
var div=elt('div');return"draggable" in div||"dragDrop" in div}();var zwspSupported;function zeroWidthElement(measure){if(zwspSupported==null){var test=elt("span","\u200b");removeChildrenAndAdd(measure,elt("span",[test,document.createTextNode("x")]));if(measure.firstChild.offsetHeight!=0){zwspSupported=test.offsetWidth<=1&&test.offsetHeight>2&&!(ie&&ie_version<8)}}
var node=zwspSupported?elt("span","\u200b"):elt("span","\u00a0",null,"display: inline-block; width: 1px; margin-right: -1px");node.setAttribute("cm-text","");return node}
var badBidiRects;function hasBadBidiRects(measure){if(badBidiRects!=null){return badBidiRects}
var txt=removeChildrenAndAdd(measure,document.createTextNode("A\u062eA"));var r0=range(txt,0,1).getBoundingClientRect();var r1=range(txt,1,2).getBoundingClientRect();removeChildren(measure);if(!r0||r0.left==r0.right){return!1}
return badBidiRects=(r1.right-r0.right<3)}
var splitLinesAuto="\n\nb".split(/\n/).length!=3?function(string){var pos=0,result=[],l=string.length;while(pos<=l){var nl=string.indexOf("\n",pos);if(nl==-1){nl=string.length}
var line=string.slice(pos,string.charAt(nl-1)=="\r"?nl-1:nl);var rt=line.indexOf("\r");if(rt!=-1){result.push(line.slice(0,rt));pos+=rt+1}else{result.push(line);pos=nl+1}}
return result}:function(string){return string.split(/\r\n?|\n/)};var hasSelection=window.getSelection?function(te){try{return te.selectionStart!=te.selectionEnd}catch(e){return!1}}:function(te){var range;try{range=te.ownerDocument.selection.createRange()}catch(e){}
if(!range||range.parentElement()!=te){return!1}
return range.compareEndPoints("StartToEnd",range)!=0};var hasCopyEvent=(function(){var e=elt("div");if("oncopy" in e){return!0}
e.setAttribute("oncopy","return;");return typeof e.oncopy=="function"})();var badZoomedRects=null;function hasBadZoomedRects(measure){if(badZoomedRects!=null){return badZoomedRects}
var node=removeChildrenAndAdd(measure,elt("span","x"));var normal=node.getBoundingClientRect();var fromRange=range(node,0,1).getBoundingClientRect();return badZoomedRects=Math.abs(normal.left-fromRange.left)>1}
var modes={},mimeModes={};function defineMode(name,mode){if(arguments.length>2){mode.dependencies=Array.prototype.slice.call(arguments,2)}
modes[name]=mode}
function defineMIME(mime,spec){mimeModes[mime]=spec}
function resolveMode(spec){if(typeof spec=="string"&&mimeModes.hasOwnProperty(spec)){spec=mimeModes[spec]}else if(spec&&typeof spec.name=="string"&&mimeModes.hasOwnProperty(spec.name)){var found=mimeModes[spec.name];if(typeof found=="string"){found={name:found}}
spec=createObj(found,spec);spec.name=found.name}else if(typeof spec=="string"&&/^[\w\-]+\/[\w\-]+\+xml$/.test(spec)){return resolveMode("application/xml")}else if(typeof spec=="string"&&/^[\w\-]+\/[\w\-]+\+json$/.test(spec)){return resolveMode("application/json")}
if(typeof spec=="string"){return{name:spec}}else{return spec||{name:"null"}}}
function getMode(options,spec){spec=resolveMode(spec);var mfactory=modes[spec.name];if(!mfactory){return getMode(options,"text/plain")}
var modeObj=mfactory(options,spec);if(modeExtensions.hasOwnProperty(spec.name)){var exts=modeExtensions[spec.name];for(var prop in exts){if(!exts.hasOwnProperty(prop)){continue}
if(modeObj.hasOwnProperty(prop)){modeObj["_"+prop]=modeObj[prop]}
modeObj[prop]=exts[prop]}}
modeObj.name=spec.name;if(spec.helperType){modeObj.helperType=spec.helperType}
if(spec.modeProps){for(var prop$1 in spec.modeProps){modeObj[prop$1]=spec.modeProps[prop$1]}}
return modeObj}
var modeExtensions={};function extendMode(mode,properties){var exts=modeExtensions.hasOwnProperty(mode)?modeExtensions[mode]:(modeExtensions[mode]={});copyObj(properties,exts)}
function copyState(mode,state){if(state===!0){return state}
if(mode.copyState){return mode.copyState(state)}
var nstate={};for(var n in state){var val=state[n];if(val instanceof Array){val=val.concat([])}
nstate[n]=val}
return nstate}
function innerMode(mode,state){var info;while(mode.innerMode){info=mode.innerMode(state);if(!info||info.mode==mode){break}
state=info.state;mode=info.mode}
return info||{mode:mode,state:state}}
function startState(mode,a1,a2){return mode.startState?mode.startState(a1,a2):!0}
var StringStream=function(string,tabSize,lineOracle){this.pos=this.start=0;this.string=string;this.tabSize=tabSize||8;this.lastColumnPos=this.lastColumnValue=0;this.lineStart=0;this.lineOracle=lineOracle};StringStream.prototype.eol=function(){return this.pos>=this.string.length};StringStream.prototype.sol=function(){return this.pos==this.lineStart};StringStream.prototype.peek=function(){return this.string.charAt(this.pos)||undefined};StringStream.prototype.next=function(){if(this.pos<this.string.length){return this.string.charAt(this.pos++)}};StringStream.prototype.eat=function(match){var ch=this.string.charAt(this.pos);var ok;if(typeof match=="string"){ok=ch==match}else{ok=ch&&(match.test?match.test(ch):match(ch))}
if(ok){++this.pos;return ch}};StringStream.prototype.eatWhile=function(match){var start=this.pos;while(this.eat(match)){}
return this.pos>start};StringStream.prototype.eatSpace=function(){var start=this.pos;while(/[\s\u00a0]/.test(this.string.charAt(this.pos))){++this.pos}
return this.pos>start};StringStream.prototype.skipToEnd=function(){this.pos=this.string.length};StringStream.prototype.skipTo=function(ch){var found=this.string.indexOf(ch,this.pos);if(found>-1){this.pos=found;return!0}};StringStream.prototype.backUp=function(n){this.pos-=n};StringStream.prototype.column=function(){if(this.lastColumnPos<this.start){this.lastColumnValue=countColumn(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue);this.lastColumnPos=this.start}
return this.lastColumnValue-(this.lineStart?countColumn(this.string,this.lineStart,this.tabSize):0)};StringStream.prototype.indentation=function(){return countColumn(this.string,null,this.tabSize)-(this.lineStart?countColumn(this.string,this.lineStart,this.tabSize):0)};StringStream.prototype.match=function(pattern,consume,caseInsensitive){if(typeof pattern=="string"){var cased=function(str){return caseInsensitive?str.toLowerCase():str};var substr=this.string.substr(this.pos,pattern.length);if(cased(substr)==cased(pattern)){if(consume!==!1){this.pos+=pattern.length}
return!0}}else{var match=this.string.slice(this.pos).match(pattern);if(match&&match.index>0){return null}
if(match&&consume!==!1){this.pos+=match[0].length}
return match}};StringStream.prototype.current=function(){return this.string.slice(this.start,this.pos)};StringStream.prototype.hideFirstChars=function(n,inner){this.lineStart+=n;try{return inner()}finally{this.lineStart-=n}};StringStream.prototype.lookAhead=function(n){var oracle=this.lineOracle;return oracle&&oracle.lookAhead(n)};StringStream.prototype.baseToken=function(){var oracle=this.lineOracle;return oracle&&oracle.baseToken(this.pos)};function getLine(doc,n){n-=doc.first;if(n<0||n>=doc.size){throw new Error("There is no line "+(n+doc.first)+" in the document.")}
var chunk=doc;while(!chunk.lines){for(var i=0;;++i){var child=chunk.children[i],sz=child.chunkSize();if(n<sz){chunk=child;break}
n-=sz}}
return chunk.lines[n]}
function getBetween(doc,start,end){var out=[],n=start.line;doc.iter(start.line,end.line+1,function(line){var text=line.text;if(n==end.line){text=text.slice(0,end.ch)}
if(n==start.line){text=text.slice(start.ch)}
out.push(text);++n});return out}
function getLines(doc,from,to){var out=[];doc.iter(from,to,function(line){out.push(line.text)});return out}
function updateLineHeight(line,height){var diff=height-line.height;if(diff){for(var n=line;n;n=n.parent){n.height+=diff}}}
function lineNo(line){if(line.parent==null){return null}
var cur=line.parent,no=indexOf(cur.lines,line);for(var chunk=cur.parent;chunk;cur=chunk,chunk=chunk.parent){for(var i=0;;++i){if(chunk.children[i]==cur){break}
no+=chunk.children[i].chunkSize()}}
return no+cur.first}
function lineAtHeight(chunk,h){var n=chunk.first;outer:do{for(var i$1=0;i$1<chunk.children.length;++i$1){var child=chunk.children[i$1],ch=child.height;if(h<ch){chunk=child;continue outer}
h-=ch;n+=child.chunkSize()}
return n}while(!chunk.lines)
var i=0;for(;i<chunk.lines.length;++i){var line=chunk.lines[i],lh=line.height;if(h<lh){break}
h-=lh}
return n+i}
function isLine(doc,l){return l>=doc.first&&l<doc.first+doc.size}
function lineNumberFor(options,i){return String(options.lineNumberFormatter(i+options.firstLineNumber))}
function Pos(line,ch,sticky){if(sticky===void 0)sticky=null;if(!(this instanceof Pos)){return new Pos(line,ch,sticky)}
this.line=line;this.ch=ch;this.sticky=sticky}
function cmp(a,b){return a.line-b.line||a.ch-b.ch}
function equalCursorPos(a,b){return a.sticky==b.sticky&&cmp(a,b)==0}
function copyPos(x){return Pos(x.line,x.ch)}
function maxPos(a,b){return cmp(a,b)<0?b:a}
function minPos(a,b){return cmp(a,b)<0?a:b}
function clipLine(doc,n){return Math.max(doc.first,Math.min(n,doc.first+doc.size-1))}
function clipPos(doc,pos){if(pos.line<doc.first){return Pos(doc.first,0)}
var last=doc.first+doc.size-1;if(pos.line>last){return Pos(last,getLine(doc,last).text.length)}
return clipToLen(pos,getLine(doc,pos.line).text.length)}
function clipToLen(pos,linelen){var ch=pos.ch;if(ch==null||ch>linelen){return Pos(pos.line,linelen)}else if(ch<0){return Pos(pos.line,0)}else{return pos}}
function clipPosArray(doc,array){var out=[];for(var i=0;i<array.length;i++){out[i]=clipPos(doc,array[i])}
return out}
var SavedContext=function(state,lookAhead){this.state=state;this.lookAhead=lookAhead};var Context=function(doc,state,line,lookAhead){this.state=state;this.doc=doc;this.line=line;this.maxLookAhead=lookAhead||0;this.baseTokens=null;this.baseTokenPos=1};Context.prototype.lookAhead=function(n){var line=this.doc.getLine(this.line+n);if(line!=null&&n>this.maxLookAhead){this.maxLookAhead=n}
return line};Context.prototype.baseToken=function(n){if(!this.baseTokens){return null}
while(this.baseTokens[this.baseTokenPos]<=n){this.baseTokenPos+=2}
var type=this.baseTokens[this.baseTokenPos+1];return{type:type&&type.replace(/( |^)overlay .*/,""),size:this.baseTokens[this.baseTokenPos]-n}};Context.prototype.nextLine=function(){this.line++;if(this.maxLookAhead>0){this.maxLookAhead--}};Context.fromSaved=function(doc,saved,line){if(saved instanceof SavedContext){return new Context(doc,copyState(doc.mode,saved.state),line,saved.lookAhead)}else{return new Context(doc,copyState(doc.mode,saved),line)}};Context.prototype.save=function(copy){var state=copy!==!1?copyState(this.doc.mode,this.state):this.state;return this.maxLookAhead>0?new SavedContext(state,this.maxLookAhead):state};function highlightLine(cm,line,context,forceToEnd){var st=[cm.state.modeGen],lineClasses={};runMode(cm,line.text,cm.doc.mode,context,function(end,style){return st.push(end,style)},lineClasses,forceToEnd);var state=context.state;var loop=function(o){context.baseTokens=st;var overlay=cm.state.overlays[o],i=1,at=0;context.state=!0;runMode(cm,line.text,overlay.mode,context,function(end,style){var start=i;while(at<end){var i_end=st[i];if(i_end>end){st.splice(i,1,end,st[i+1],i_end)}
i+=2;at=Math.min(end,i_end)}
if(!style){return}
if(overlay.opaque){st.splice(start,i-start,end,"overlay "+style);i=start+2}else{for(;start<i;start+=2){var cur=st[start+1];st[start+1]=(cur?cur+" ":"")+"overlay "+style}}},lineClasses);context.state=state;context.baseTokens=null;context.baseTokenPos=1};for(var o=0;o<cm.state.overlays.length;++o)loop(o);return{styles:st,classes:lineClasses.bgClass||lineClasses.textClass?lineClasses:null}}
function getLineStyles(cm,line,updateFrontier){if(!line.styles||line.styles[0]!=cm.state.modeGen){var context=getContextBefore(cm,lineNo(line));var resetState=line.text.length>cm.options.maxHighlightLength&&copyState(cm.doc.mode,context.state);var result=highlightLine(cm,line,context);if(resetState){context.state=resetState}
line.stateAfter=context.save(!resetState);line.styles=result.styles;if(result.classes){line.styleClasses=result.classes}else if(line.styleClasses){line.styleClasses=null}
if(updateFrontier===cm.doc.highlightFrontier){cm.doc.modeFrontier=Math.max(cm.doc.modeFrontier,++cm.doc.highlightFrontier)}}
return line.styles}
function getContextBefore(cm,n,precise){var doc=cm.doc,display=cm.display;if(!doc.mode.startState){return new Context(doc,!0,n)}
var start=findStartLine(cm,n,precise);var saved=start>doc.first&&getLine(doc,start-1).stateAfter;var context=saved?Context.fromSaved(doc,saved,start):new Context(doc,startState(doc.mode),start);doc.iter(start,n,function(line){processLine(cm,line.text,context);var pos=context.line;line.stateAfter=pos==n-1||pos%5==0||pos>=display.viewFrom&&pos<display.viewTo?context.save():null;context.nextLine()});if(precise){doc.modeFrontier=context.line}
return context}
function processLine(cm,text,context,startAt){var mode=cm.doc.mode;var stream=new StringStream(text,cm.options.tabSize,context);stream.start=stream.pos=startAt||0;if(text==""){callBlankLine(mode,context.state)}
while(!stream.eol()){readToken(mode,stream,context.state);stream.start=stream.pos}}
function callBlankLine(mode,state){if(mode.blankLine){return mode.blankLine(state)}
if(!mode.innerMode){return}
var inner=innerMode(mode,state);if(inner.mode.blankLine){return inner.mode.blankLine(inner.state)}}
function readToken(mode,stream,state,inner){for(var i=0;i<10;i++){if(inner){inner[0]=innerMode(mode,state).mode}
var style=mode.token(stream,state);if(stream.pos>stream.start){return style}}
throw new Error("Mode "+mode.name+" failed to advance stream.")}
var Token=function(stream,type,state){this.start=stream.start;this.end=stream.pos;this.string=stream.current();this.type=type||null;this.state=state};function takeToken(cm,pos,precise,asArray){var doc=cm.doc,mode=doc.mode,style;pos=clipPos(doc,pos);var line=getLine(doc,pos.line),context=getContextBefore(cm,pos.line,precise);var stream=new StringStream(line.text,cm.options.tabSize,context),tokens;if(asArray){tokens=[]}
while((asArray||stream.pos<pos.ch)&&!stream.eol()){stream.start=stream.pos;style=readToken(mode,stream,context.state);if(asArray){tokens.push(new Token(stream,style,copyState(doc.mode,context.state)))}}
return asArray?tokens:new Token(stream,style,context.state)}
function extractLineClasses(type,output){if(type){for(;;){var lineClass=type.match(/(?:^|\s+)line-(background-)?(\S+)/);if(!lineClass){break}
type=type.slice(0,lineClass.index)+type.slice(lineClass.index+lineClass[0].length);var prop=lineClass[1]?"bgClass":"textClass";if(output[prop]==null){output[prop]=lineClass[2]}else if(!(new RegExp("(?:^|\\s)"+lineClass[2]+"(?:$|\\s)")).test(output[prop])){output[prop]+=" "+lineClass[2]}}}
return type}
function runMode(cm,text,mode,context,f,lineClasses,forceToEnd){var flattenSpans=mode.flattenSpans;if(flattenSpans==null){flattenSpans=cm.options.flattenSpans}
var curStart=0,curStyle=null;var stream=new StringStream(text,cm.options.tabSize,context),style;var inner=cm.options.addModeClass&&[null];if(text==""){extractLineClasses(callBlankLine(mode,context.state),lineClasses)}
while(!stream.eol()){if(stream.pos>cm.options.maxHighlightLength){flattenSpans=!1;if(forceToEnd){processLine(cm,text,context,stream.pos)}
stream.pos=text.length;style=null}else{style=extractLineClasses(readToken(mode,stream,context.state,inner),lineClasses)}
if(inner){var mName=inner[0].name;if(mName){style="m-"+(style?mName+" "+style:mName)}}
if(!flattenSpans||curStyle!=style){while(curStart<stream.start){curStart=Math.min(stream.start,curStart+5000);f(curStart,curStyle)}
curStyle=style}
stream.start=stream.pos}
while(curStart<stream.pos){var pos=Math.min(stream.pos,curStart+5000);f(pos,curStyle);curStart=pos}}
function findStartLine(cm,n,precise){var minindent,minline,doc=cm.doc;var lim=precise?-1:n-(cm.doc.mode.innerMode?1000:100);for(var search=n;search>lim;--search){if(search<=doc.first){return doc.first}
var line=getLine(doc,search-1),after=line.stateAfter;if(after&&(!precise||search+(after instanceof SavedContext?after.lookAhead:0)<=doc.modeFrontier)){return search}
var indented=countColumn(line.text,null,cm.options.tabSize);if(minline==null||minindent>indented){minline=search-1;minindent=indented}}
return minline}
function retreatFrontier(doc,n){doc.modeFrontier=Math.min(doc.modeFrontier,n);if(doc.highlightFrontier<n-10){return}
var start=doc.first;for(var line=n-1;line>start;line--){var saved=getLine(doc,line).stateAfter;if(saved&&(!(saved instanceof SavedContext)||line+saved.lookAhead<n)){start=line+1;break}}
doc.highlightFrontier=Math.min(doc.highlightFrontier,start)}
var sawReadOnlySpans=!1,sawCollapsedSpans=!1;function seeReadOnlySpans(){sawReadOnlySpans=!0}
function seeCollapsedSpans(){sawCollapsedSpans=!0}
function MarkedSpan(marker,from,to){this.marker=marker;this.from=from;this.to=to}
function getMarkedSpanFor(spans,marker){if(spans){for(var i=0;i<spans.length;++i){var span=spans[i];if(span.marker==marker){return span}}}}
function removeMarkedSpan(spans,span){var r;for(var i=0;i<spans.length;++i){if(spans[i]!=span){(r||(r=[])).push(spans[i])}}
return r}
function addMarkedSpan(line,span,op){var inThisOp=op&&window.WeakSet&&(op.markedSpans||(op.markedSpans=new WeakSet));if(inThisOp&&line.markedSpans&&inThisOp.has(line.markedSpans)){line.markedSpans.push(span)}else{line.markedSpans=line.markedSpans?line.markedSpans.concat([span]):[span];if(inThisOp){inThisOp.add(line.markedSpans)}}
span.marker.attachLine(line)}
function markedSpansBefore(old,startCh,isInsert){var nw;if(old){for(var i=0;i<old.length;++i){var span=old[i],marker=span.marker;var startsBefore=span.from==null||(marker.inclusiveLeft?span.from<=startCh:span.from<startCh);if(startsBefore||span.from==startCh&&marker.type=="bookmark"&&(!isInsert||!span.marker.insertLeft)){var endsAfter=span.to==null||(marker.inclusiveRight?span.to>=startCh:span.to>startCh);(nw||(nw=[])).push(new MarkedSpan(marker,span.from,endsAfter?null:span.to))}}}
return nw}
function markedSpansAfter(old,endCh,isInsert){var nw;if(old){for(var i=0;i<old.length;++i){var span=old[i],marker=span.marker;var endsAfter=span.to==null||(marker.inclusiveRight?span.to>=endCh:span.to>endCh);if(endsAfter||span.from==endCh&&marker.type=="bookmark"&&(!isInsert||span.marker.insertLeft)){var startsBefore=span.from==null||(marker.inclusiveLeft?span.from<=endCh:span.from<endCh);(nw||(nw=[])).push(new MarkedSpan(marker,startsBefore?null:span.from-endCh,span.to==null?null:span.to-endCh))}}}
return nw}
function stretchSpansOverChange(doc,change){if(change.full){return null}
var oldFirst=isLine(doc,change.from.line)&&getLine(doc,change.from.line).markedSpans;var oldLast=isLine(doc,change.to.line)&&getLine(doc,change.to.line).markedSpans;if(!oldFirst&&!oldLast){return null}
var startCh=change.from.ch,endCh=change.to.ch,isInsert=cmp(change.from,change.to)==0;var first=markedSpansBefore(oldFirst,startCh,isInsert);var last=markedSpansAfter(oldLast,endCh,isInsert);var sameLine=change.text.length==1,offset=lst(change.text).length+(sameLine?startCh:0);if(first){for(var i=0;i<first.length;++i){var span=first[i];if(span.to==null){var found=getMarkedSpanFor(last,span.marker);if(!found){span.to=startCh}else if(sameLine){span.to=found.to==null?null:found.to+offset}}}}
if(last){for(var i$1=0;i$1<last.length;++i$1){var span$1=last[i$1];if(span$1.to!=null){span$1.to+=offset}
if(span$1.from==null){var found$1=getMarkedSpanFor(first,span$1.marker);if(!found$1){span$1.from=offset;if(sameLine){(first||(first=[])).push(span$1)}}}else{span$1.from+=offset;if(sameLine){(first||(first=[])).push(span$1)}}}}
if(first){first=clearEmptySpans(first)}
if(last&&last!=first){last=clearEmptySpans(last)}
var newMarkers=[first];if(!sameLine){var gap=change.text.length-2,gapMarkers;if(gap>0&&first){for(var i$2=0;i$2<first.length;++i$2){if(first[i$2].to==null){(gapMarkers||(gapMarkers=[])).push(new MarkedSpan(first[i$2].marker,null,null))}}}
for(var i$3=0;i$3<gap;++i$3){newMarkers.push(gapMarkers)}
newMarkers.push(last)}
return newMarkers}
function clearEmptySpans(spans){for(var i=0;i<spans.length;++i){var span=spans[i];if(span.from!=null&&span.from==span.to&&span.marker.clearWhenEmpty!==!1){spans.splice(i--,1)}}
if(!spans.length){return null}
return spans}
function removeReadOnlyRanges(doc,from,to){var markers=null;doc.iter(from.line,to.line+1,function(line){if(line.markedSpans){for(var i=0;i<line.markedSpans.length;++i){var mark=line.markedSpans[i].marker;if(mark.readOnly&&(!markers||indexOf(markers,mark)==-1)){(markers||(markers=[])).push(mark)}}}});if(!markers){return null}
var parts=[{from:from,to:to}];for(var i=0;i<markers.length;++i){var mk=markers[i],m=mk.find(0);for(var j=0;j<parts.length;++j){var p=parts[j];if(cmp(p.to,m.from)<0||cmp(p.from,m.to)>0){continue}
var newParts=[j,1],dfrom=cmp(p.from,m.from),dto=cmp(p.to,m.to);if(dfrom<0||!mk.inclusiveLeft&&!dfrom){newParts.push({from:p.from,to:m.from})}
if(dto>0||!mk.inclusiveRight&&!dto){newParts.push({from:m.to,to:p.to})}
parts.splice.apply(parts,newParts);j+=newParts.length-3}}
return parts}
function detachMarkedSpans(line){var spans=line.markedSpans;if(!spans){return}
for(var i=0;i<spans.length;++i){spans[i].marker.detachLine(line)}
line.markedSpans=null}
function attachMarkedSpans(line,spans){if(!spans){return}
for(var i=0;i<spans.length;++i){spans[i].marker.attachLine(line)}
line.markedSpans=spans}
function extraLeft(marker){return marker.inclusiveLeft?-1:0}
function extraRight(marker){return marker.inclusiveRight?1:0}
function compareCollapsedMarkers(a,b){var lenDiff=a.lines.length-b.lines.length;if(lenDiff!=0){return lenDiff}
var aPos=a.find(),bPos=b.find();var fromCmp=cmp(aPos.from,bPos.from)||extraLeft(a)-extraLeft(b);if(fromCmp){return-fromCmp}
var toCmp=cmp(aPos.to,bPos.to)||extraRight(a)-extraRight(b);if(toCmp){return toCmp}
return b.id-a.id}
function collapsedSpanAtSide(line,start){var sps=sawCollapsedSpans&&line.markedSpans,found;if(sps){for(var sp=(void 0),i=0;i<sps.length;++i){sp=sps[i];if(sp.marker.collapsed&&(start?sp.from:sp.to)==null&&(!found||compareCollapsedMarkers(found,sp.marker)<0)){found=sp.marker}}}
return found}
function collapsedSpanAtStart(line){return collapsedSpanAtSide(line,!0)}
function collapsedSpanAtEnd(line){return collapsedSpanAtSide(line,!1)}
function collapsedSpanAround(line,ch){var sps=sawCollapsedSpans&&line.markedSpans,found;if(sps){for(var i=0;i<sps.length;++i){var sp=sps[i];if(sp.marker.collapsed&&(sp.from==null||sp.from<ch)&&(sp.to==null||sp.to>ch)&&(!found||compareCollapsedMarkers(found,sp.marker)<0)){found=sp.marker}}}
return found}
function conflictingCollapsedRange(doc,lineNo,from,to,marker){var line=getLine(doc,lineNo);var sps=sawCollapsedSpans&&line.markedSpans;if(sps){for(var i=0;i<sps.length;++i){var sp=sps[i];if(!sp.marker.collapsed){continue}
var found=sp.marker.find(0);var fromCmp=cmp(found.from,from)||extraLeft(sp.marker)-extraLeft(marker);var toCmp=cmp(found.to,to)||extraRight(sp.marker)-extraRight(marker);if(fromCmp>=0&&toCmp<=0||fromCmp<=0&&toCmp>=0){continue}
if(fromCmp<=0&&(sp.marker.inclusiveRight&&marker.inclusiveLeft?cmp(found.to,from)>=0:cmp(found.to,from)>0)||fromCmp>=0&&(sp.marker.inclusiveRight&&marker.inclusiveLeft?cmp(found.from,to)<=0:cmp(found.from,to)<0)){return!0}}}}
function visualLine(line){var merged;while(merged=collapsedSpanAtStart(line)){line=merged.find(-1,!0).line}
return line}
function visualLineEnd(line){var merged;while(merged=collapsedSpanAtEnd(line)){line=merged.find(1,!0).line}
return line}
function visualLineContinued(line){var merged,lines;while(merged=collapsedSpanAtEnd(line)){line=merged.find(1,!0).line;(lines||(lines=[])).push(line)}
return lines}
function visualLineNo(doc,lineN){var line=getLine(doc,lineN),vis=visualLine(line);if(line==vis){return lineN}
return lineNo(vis)}
function visualLineEndNo(doc,lineN){if(lineN>doc.lastLine()){return lineN}
var line=getLine(doc,lineN),merged;if(!lineIsHidden(doc,line)){return lineN}
while(merged=collapsedSpanAtEnd(line)){line=merged.find(1,!0).line}
return lineNo(line)+1}
function lineIsHidden(doc,line){var sps=sawCollapsedSpans&&line.markedSpans;if(sps){for(var sp=(void 0),i=0;i<sps.length;++i){sp=sps[i];if(!sp.marker.collapsed){continue}
if(sp.from==null){return!0}
if(sp.marker.widgetNode){continue}
if(sp.from==0&&sp.marker.inclusiveLeft&&lineIsHiddenInner(doc,line,sp)){return!0}}}}
function lineIsHiddenInner(doc,line,span){if(span.to==null){var end=span.marker.find(1,!0);return lineIsHiddenInner(doc,end.line,getMarkedSpanFor(end.line.markedSpans,span.marker))}
if(span.marker.inclusiveRight&&span.to==line.text.length){return!0}
for(var sp=(void 0),i=0;i<line.markedSpans.length;++i){sp=line.markedSpans[i];if(sp.marker.collapsed&&!sp.marker.widgetNode&&sp.from==span.to&&(sp.to==null||sp.to!=span.from)&&(sp.marker.inclusiveLeft||span.marker.inclusiveRight)&&lineIsHiddenInner(doc,line,sp)){return!0}}}
function heightAtLine(lineObj){lineObj=visualLine(lineObj);var h=0,chunk=lineObj.parent;for(var i=0;i<chunk.lines.length;++i){var line=chunk.lines[i];if(line==lineObj){break}else{h+=line.height}}
for(var p=chunk.parent;p;chunk=p,p=chunk.parent){for(var i$1=0;i$1<p.children.length;++i$1){var cur=p.children[i$1];if(cur==chunk){break}else{h+=cur.height}}}
return h}
function lineLength(line){if(line.height==0){return 0}
var len=line.text.length,merged,cur=line;while(merged=collapsedSpanAtStart(cur)){var found=merged.find(0,!0);cur=found.from.line;len+=found.from.ch-found.to.ch}
cur=line;while(merged=collapsedSpanAtEnd(cur)){var found$1=merged.find(0,!0);len-=cur.text.length-found$1.from.ch;cur=found$1.to.line;len+=cur.text.length-found$1.to.ch}
return len}
function findMaxLine(cm){var d=cm.display,doc=cm.doc;d.maxLine=getLine(doc,doc.first);d.maxLineLength=lineLength(d.maxLine);d.maxLineChanged=!0;doc.iter(function(line){var len=lineLength(line);if(len>d.maxLineLength){d.maxLineLength=len;d.maxLine=line}})}
var Line=function(text,markedSpans,estimateHeight){this.text=text;attachMarkedSpans(this,markedSpans);this.height=estimateHeight?estimateHeight(this):1};Line.prototype.lineNo=function(){return lineNo(this)};eventMixin(Line);function updateLine(line,text,markedSpans,estimateHeight){line.text=text;if(line.stateAfter){line.stateAfter=null}
if(line.styles){line.styles=null}
if(line.order!=null){line.order=null}
detachMarkedSpans(line);attachMarkedSpans(line,markedSpans);var estHeight=estimateHeight?estimateHeight(line):1;if(estHeight!=line.height){updateLineHeight(line,estHeight)}}
function cleanUpLine(line){line.parent=null;detachMarkedSpans(line)}
var styleToClassCache={},styleToClassCacheWithMode={};function interpretTokenStyle(style,options){if(!style||/^\s*$/.test(style)){return null}
var cache=options.addModeClass?styleToClassCacheWithMode:styleToClassCache;return cache[style]||(cache[style]=style.replace(/\S+/g,"cm-$&"))}
function buildLineContent(cm,lineView){var content=eltP("span",null,null,webkit?"padding-right: .1px":null);var builder={pre:eltP("pre",[content],"CodeMirror-line"),content:content,col:0,pos:0,cm:cm,trailingSpace:!1,splitSpaces:cm.getOption("lineWrapping")};lineView.measure={};for(var i=0;i<=(lineView.rest?lineView.rest.length:0);i++){var line=i?lineView.rest[i-1]:lineView.line,order=(void 0);builder.pos=0;builder.addToken=buildToken;if(hasBadBidiRects(cm.display.measure)&&(order=getOrder(line,cm.doc.direction))){builder.addToken=buildTokenBadBidi(builder.addToken,order)}
builder.map=[];var allowFrontierUpdate=lineView!=cm.display.externalMeasured&&lineNo(line);insertLineContent(line,builder,getLineStyles(cm,line,allowFrontierUpdate));if(line.styleClasses){if(line.styleClasses.bgClass){builder.bgClass=joinClasses(line.styleClasses.bgClass,builder.bgClass||"")}
if(line.styleClasses.textClass){builder.textClass=joinClasses(line.styleClasses.textClass,builder.textClass||"")}}
if(builder.map.length==0){builder.map.push(0,0,builder.content.appendChild(zeroWidthElement(cm.display.measure)))}
if(i==0){lineView.measure.map=builder.map;lineView.measure.cache={}}else{(lineView.measure.maps||(lineView.measure.maps=[])).push(builder.map);(lineView.measure.caches||(lineView.measure.caches=[])).push({})}}
if(webkit){var last=builder.content.lastChild;if(/\bcm-tab\b/.test(last.className)||(last.querySelector&&last.querySelector(".cm-tab"))){builder.content.className="cm-tab-wrap-hack"}}
signal(cm,"renderLine",cm,lineView.line,builder.pre);if(builder.pre.className){builder.textClass=joinClasses(builder.pre.className,builder.textClass||"")}
return builder}
function defaultSpecialCharPlaceholder(ch){var token=elt("span","\u2022","cm-invalidchar");token.title="\\u"+ch.charCodeAt(0).toString(16);token.setAttribute("aria-label",token.title);return token}
function buildToken(builder,text,style,startStyle,endStyle,css,attributes){if(!text){return}
var displayText=builder.splitSpaces?splitSpaces(text,builder.trailingSpace):text;var special=builder.cm.state.specialChars,mustWrap=!1;var content;if(!special.test(text)){builder.col+=text.length;content=document.createTextNode(displayText);builder.map.push(builder.pos,builder.pos+text.length,content);if(ie&&ie_version<9){mustWrap=!0}
builder.pos+=text.length}else{content=document.createDocumentFragment();var pos=0;while(!0){special.lastIndex=pos;var m=special.exec(text);var skipped=m?m.index-pos:text.length-pos;if(skipped){var txt=document.createTextNode(displayText.slice(pos,pos+skipped));if(ie&&ie_version<9){content.appendChild(elt("span",[txt]))}else{content.appendChild(txt)}
builder.map.push(builder.pos,builder.pos+skipped,txt);builder.col+=skipped;builder.pos+=skipped}
if(!m){break}
pos+=skipped+1;var txt$1=(void 0);if(m[0]=="\t"){var tabSize=builder.cm.options.tabSize,tabWidth=tabSize-builder.col%tabSize;txt$1=content.appendChild(elt("span",spaceStr(tabWidth),"cm-tab"));txt$1.setAttribute("role","presentation");txt$1.setAttribute("cm-text","\t");builder.col+=tabWidth}else if(m[0]=="\r"||m[0]=="\n"){txt$1=content.appendChild(elt("span",m[0]=="\r"?"\u240d":"\u2424","cm-invalidchar"));txt$1.setAttribute("cm-text",m[0]);builder.col+=1}else{txt$1=builder.cm.options.specialCharPlaceholder(m[0]);txt$1.setAttribute("cm-text",m[0]);if(ie&&ie_version<9){content.appendChild(elt("span",[txt$1]))}else{content.appendChild(txt$1)}
builder.col+=1}
builder.map.push(builder.pos,builder.pos+1,txt$1);builder.pos++}}
builder.trailingSpace=displayText.charCodeAt(text.length-1)==32;if(style||startStyle||endStyle||mustWrap||css||attributes){var fullStyle=style||"";if(startStyle){fullStyle+=startStyle}
if(endStyle){fullStyle+=endStyle}
var token=elt("span",[content],fullStyle,css);if(attributes){for(var attr in attributes){if(attributes.hasOwnProperty(attr)&&attr!="style"&&attr!="class"){token.setAttribute(attr,attributes[attr])}}}
return builder.content.appendChild(token)}
builder.content.appendChild(content)}
function splitSpaces(text,trailingBefore){if(text.length>1&&!/  /.test(text)){return text}
var spaceBefore=trailingBefore,result="";for(var i=0;i<text.length;i++){var ch=text.charAt(i);if(ch==" "&&spaceBefore&&(i==text.length-1||text.charCodeAt(i+1)==32)){ch="\u00a0"}
result+=ch;spaceBefore=ch==" "}
return result}
function buildTokenBadBidi(inner,order){return function(builder,text,style,startStyle,endStyle,css,attributes){style=style?style+" cm-force-border":"cm-force-border";var start=builder.pos,end=start+text.length;for(;;){var part=(void 0);for(var i=0;i<order.length;i++){part=order[i];if(part.to>start&&part.from<=start){break}}
if(part.to>=end){return inner(builder,text,style,startStyle,endStyle,css,attributes)}
inner(builder,text.slice(0,part.to-start),style,startStyle,null,css,attributes);startStyle=null;text=text.slice(part.to-start);start=part.to}}}
function buildCollapsedSpan(builder,size,marker,ignoreWidget){var widget=!ignoreWidget&&marker.widgetNode;if(widget){builder.map.push(builder.pos,builder.pos+size,widget)}
if(!ignoreWidget&&builder.cm.display.input.needsContentAttribute){if(!widget){widget=builder.content.appendChild(document.createElement("span"))}
widget.setAttribute("cm-marker",marker.id)}
if(widget){builder.cm.display.input.setUneditable(widget);builder.content.appendChild(widget)}
builder.pos+=size;builder.trailingSpace=!1}
function insertLineContent(line,builder,styles){var spans=line.markedSpans,allText=line.text,at=0;if(!spans){for(var i$1=1;i$1<styles.length;i$1+=2){builder.addToken(builder,allText.slice(at,at=styles[i$1]),interpretTokenStyle(styles[i$1+1],builder.cm.options))}
return}
var len=allText.length,pos=0,i=1,text="",style,css;var nextChange=0,spanStyle,spanEndStyle,spanStartStyle,collapsed,attributes;for(;;){if(nextChange==pos){spanStyle=spanEndStyle=spanStartStyle=css="";attributes=null;collapsed=null;nextChange=Infinity;var foundBookmarks=[],endStyles=(void 0);for(var j=0;j<spans.length;++j){var sp=spans[j],m=sp.marker;if(m.type=="bookmark"&&sp.from==pos&&m.widgetNode){foundBookmarks.push(m)}else if(sp.from<=pos&&(sp.to==null||sp.to>pos||m.collapsed&&sp.to==pos&&sp.from==pos)){if(sp.to!=null&&sp.to!=pos&&nextChange>sp.to){nextChange=sp.to;spanEndStyle=""}
if(m.className){spanStyle+=" "+m.className}
if(m.css){css=(css?css+";":"")+m.css}
if(m.startStyle&&sp.from==pos){spanStartStyle+=" "+m.startStyle}
if(m.endStyle&&sp.to==nextChange){(endStyles||(endStyles=[])).push(m.endStyle,sp.to)}
if(m.title){(attributes||(attributes={})).title=m.title}
if(m.attributes){for(var attr in m.attributes){(attributes||(attributes={}))[attr]=m.attributes[attr]}}
if(m.collapsed&&(!collapsed||compareCollapsedMarkers(collapsed.marker,m)<0)){collapsed=sp}}else if(sp.from>pos&&nextChange>sp.from){nextChange=sp.from}}
if(endStyles){for(var j$1=0;j$1<endStyles.length;j$1+=2){if(endStyles[j$1+1]==nextChange){spanEndStyle+=" "+endStyles[j$1]}}}
if(!collapsed||collapsed.from==pos){for(var j$2=0;j$2<foundBookmarks.length;++j$2){buildCollapsedSpan(builder,0,foundBookmarks[j$2])}}
if(collapsed&&(collapsed.from||0)==pos){buildCollapsedSpan(builder,(collapsed.to==null?len+1:collapsed.to)-pos,collapsed.marker,collapsed.from==null);if(collapsed.to==null){return}
if(collapsed.to==pos){collapsed=!1}}}
if(pos>=len){break}
var upto=Math.min(len,nextChange);while(!0){if(text){var end=pos+text.length;if(!collapsed){var tokenText=end>upto?text.slice(0,upto-pos):text;builder.addToken(builder,tokenText,style?style+spanStyle:spanStyle,spanStartStyle,pos+tokenText.length==nextChange?spanEndStyle:"",css,attributes)}
if(end>=upto){text=text.slice(upto-pos);pos=upto;break}
pos=end;spanStartStyle=""}
text=allText.slice(at,at=styles[i++]);style=interpretTokenStyle(styles[i++],builder.cm.options)}}}
function LineView(doc,line,lineN){this.line=line;this.rest=visualLineContinued(line);this.size=this.rest?lineNo(lst(this.rest))-lineN+1:1;this.node=this.text=null;this.hidden=lineIsHidden(doc,line)}
function buildViewArray(cm,from,to){var array=[],nextPos;for(var pos=from;pos<to;pos=nextPos){var view=new LineView(cm.doc,getLine(cm.doc,pos),pos);nextPos=pos+view.size;array.push(view)}
return array}
var operationGroup=null;function pushOperation(op){if(operationGroup){operationGroup.ops.push(op)}else{op.ownsGroup=operationGroup={ops:[op],delayedCallbacks:[]}}}
function fireCallbacksForOps(group){var callbacks=group.delayedCallbacks,i=0;do{for(;i<callbacks.length;i++){callbacks[i].call(null)}
for(var j=0;j<group.ops.length;j++){var op=group.ops[j];if(op.cursorActivityHandlers){while(op.cursorActivityCalled<op.cursorActivityHandlers.length){op.cursorActivityHandlers[op.cursorActivityCalled++].call(null,op.cm)}}}}while(i<callbacks.length)}
function finishOperation(op,endCb){var group=op.ownsGroup;if(!group){return}
try{fireCallbacksForOps(group)}finally{operationGroup=null;endCb(group)}}
var orphanDelayedCallbacks=null;function signalLater(emitter,type){var arr=getHandlers(emitter,type);if(!arr.length){return}
var args=Array.prototype.slice.call(arguments,2),list;if(operationGroup){list=operationGroup.delayedCallbacks}else if(orphanDelayedCallbacks){list=orphanDelayedCallbacks}else{list=orphanDelayedCallbacks=[];setTimeout(fireOrphanDelayed,0)}
var loop=function(i){list.push(function(){return arr[i].apply(null,args)})};for(var i=0;i<arr.length;++i)
loop(i);}
function fireOrphanDelayed(){var delayed=orphanDelayedCallbacks;orphanDelayedCallbacks=null;for(var i=0;i<delayed.length;++i){delayed[i]()}}
function updateLineForChanges(cm,lineView,lineN,dims){for(var j=0;j<lineView.changes.length;j++){var type=lineView.changes[j];if(type=="text"){updateLineText(cm,lineView)}else if(type=="gutter"){updateLineGutter(cm,lineView,lineN,dims)}else if(type=="class"){updateLineClasses(cm,lineView)}else if(type=="widget"){updateLineWidgets(cm,lineView,dims)}}
lineView.changes=null}
function ensureLineWrapped(lineView){if(lineView.node==lineView.text){lineView.node=elt("div",null,null,"position: relative");if(lineView.text.parentNode){lineView.text.parentNode.replaceChild(lineView.node,lineView.text)}
lineView.node.appendChild(lineView.text);if(ie&&ie_version<8){lineView.node.style.zIndex=2}}
return lineView.node}
function updateLineBackground(cm,lineView){var cls=lineView.bgClass?lineView.bgClass+" "+(lineView.line.bgClass||""):lineView.line.bgClass;if(cls){cls+=" CodeMirror-linebackground"}
if(lineView.background){if(cls){lineView.background.className=cls}else{lineView.background.parentNode.removeChild(lineView.background);lineView.background=null}}else if(cls){var wrap=ensureLineWrapped(lineView);lineView.background=wrap.insertBefore(elt("div",null,cls),wrap.firstChild);cm.display.input.setUneditable(lineView.background)}}
function getLineContent(cm,lineView){var ext=cm.display.externalMeasured;if(ext&&ext.line==lineView.line){cm.display.externalMeasured=null;lineView.measure=ext.measure;return ext.built}
return buildLineContent(cm,lineView)}
function updateLineText(cm,lineView){var cls=lineView.text.className;var built=getLineContent(cm,lineView);if(lineView.text==lineView.node){lineView.node=built.pre}
lineView.text.parentNode.replaceChild(built.pre,lineView.text);lineView.text=built.pre;if(built.bgClass!=lineView.bgClass||built.textClass!=lineView.textClass){lineView.bgClass=built.bgClass;lineView.textClass=built.textClass;updateLineClasses(cm,lineView)}else if(cls){lineView.text.className=cls}}
function updateLineClasses(cm,lineView){updateLineBackground(cm,lineView);if(lineView.line.wrapClass){ensureLineWrapped(lineView).className=lineView.line.wrapClass}else if(lineView.node!=lineView.text){lineView.node.className=""}
var textClass=lineView.textClass?lineView.textClass+" "+(lineView.line.textClass||""):lineView.line.textClass;lineView.text.className=textClass||""}
function updateLineGutter(cm,lineView,lineN,dims){if(lineView.gutter){lineView.node.removeChild(lineView.gutter);lineView.gutter=null}
if(lineView.gutterBackground){lineView.node.removeChild(lineView.gutterBackground);lineView.gutterBackground=null}
if(lineView.line.gutterClass){var wrap=ensureLineWrapped(lineView);lineView.gutterBackground=elt("div",null,"CodeMirror-gutter-background "+lineView.line.gutterClass,("left: "+(cm.options.fixedGutter?dims.fixedPos:-dims.gutterTotalWidth)+"px; width: "+(dims.gutterTotalWidth)+"px"));cm.display.input.setUneditable(lineView.gutterBackground);wrap.insertBefore(lineView.gutterBackground,lineView.text)}
var markers=lineView.line.gutterMarkers;if(cm.options.lineNumbers||markers){var wrap$1=ensureLineWrapped(lineView);var gutterWrap=lineView.gutter=elt("div",null,"CodeMirror-gutter-wrapper",("left: "+(cm.options.fixedGutter?dims.fixedPos:-dims.gutterTotalWidth)+"px"));gutterWrap.setAttribute("aria-hidden","true");cm.display.input.setUneditable(gutterWrap);wrap$1.insertBefore(gutterWrap,lineView.text);if(lineView.line.gutterClass){gutterWrap.className+=" "+lineView.line.gutterClass}
if(cm.options.lineNumbers&&(!markers||!markers["CodeMirror-linenumbers"])){lineView.lineNumber=gutterWrap.appendChild(elt("div",lineNumberFor(cm.options,lineN),"CodeMirror-linenumber CodeMirror-gutter-elt",("left: "+(dims.gutterLeft["CodeMirror-linenumbers"])+"px; width: "+(cm.display.lineNumInnerWidth)+"px")))}
if(markers){for(var k=0;k<cm.display.gutterSpecs.length;++k){var id=cm.display.gutterSpecs[k].className,found=markers.hasOwnProperty(id)&&markers[id];if(found){gutterWrap.appendChild(elt("div",[found],"CodeMirror-gutter-elt",("left: "+(dims.gutterLeft[id])+"px; width: "+(dims.gutterWidth[id])+"px")))}}}}}
function updateLineWidgets(cm,lineView,dims){if(lineView.alignable){lineView.alignable=null}
var isWidget=classTest("CodeMirror-linewidget");for(var node=lineView.node.firstChild,next=(void 0);node;node=next){next=node.nextSibling;if(isWidget.test(node.className)){lineView.node.removeChild(node)}}
insertLineWidgets(cm,lineView,dims)}
function buildLineElement(cm,lineView,lineN,dims){var built=getLineContent(cm,lineView);lineView.text=lineView.node=built.pre;if(built.bgClass){lineView.bgClass=built.bgClass}
if(built.textClass){lineView.textClass=built.textClass}
updateLineClasses(cm,lineView);updateLineGutter(cm,lineView,lineN,dims);insertLineWidgets(cm,lineView,dims);return lineView.node}
function insertLineWidgets(cm,lineView,dims){insertLineWidgetsFor(cm,lineView.line,lineView,dims,!0);if(lineView.rest){for(var i=0;i<lineView.rest.length;i++){insertLineWidgetsFor(cm,lineView.rest[i],lineView,dims,!1)}}}
function insertLineWidgetsFor(cm,line,lineView,dims,allowAbove){if(!line.widgets){return}
var wrap=ensureLineWrapped(lineView);for(var i=0,ws=line.widgets;i<ws.length;++i){var widget=ws[i],node=elt("div",[widget.node],"CodeMirror-linewidget"+(widget.className?" "+widget.className:""));if(!widget.handleMouseEvents){node.setAttribute("cm-ignore-events","true")}
positionLineWidget(widget,node,lineView,dims);cm.display.input.setUneditable(node);if(allowAbove&&widget.above){wrap.insertBefore(node,lineView.gutter||lineView.text)}else{wrap.appendChild(node)}
signalLater(widget,"redraw")}}
function positionLineWidget(widget,node,lineView,dims){if(widget.noHScroll){(lineView.alignable||(lineView.alignable=[])).push(node);var width=dims.wrapperWidth;node.style.left=dims.fixedPos+"px";if(!widget.coverGutter){width-=dims.gutterTotalWidth;node.style.paddingLeft=dims.gutterTotalWidth+"px"}
node.style.width=width+"px"}
if(widget.coverGutter){node.style.zIndex=5;node.style.position="relative";if(!widget.noHScroll){node.style.marginLeft=-dims.gutterTotalWidth+"px"}}}
function widgetHeight(widget){if(widget.height!=null){return widget.height}
var cm=widget.doc.cm;if(!cm){return 0}
if(!contains(document.body,widget.node)){var parentStyle="position: relative;";if(widget.coverGutter){parentStyle+="margin-left: -"+cm.display.gutters.offsetWidth+"px;"}
if(widget.noHScroll){parentStyle+="width: "+cm.display.wrapper.clientWidth+"px;"}
removeChildrenAndAdd(cm.display.measure,elt("div",[widget.node],null,parentStyle))}
return widget.height=widget.node.parentNode.offsetHeight}
function eventInWidget(display,e){for(var n=e_target(e);n!=display.wrapper;n=n.parentNode){if(!n||(n.nodeType==1&&n.getAttribute("cm-ignore-events")=="true")||(n.parentNode==display.sizer&&n!=display.mover)){return!0}}}
function paddingTop(display){return display.lineSpace.offsetTop}
function paddingVert(display){return display.mover.offsetHeight-display.lineSpace.offsetHeight}
function paddingH(display){if(display.cachedPaddingH){return display.cachedPaddingH}
var e=removeChildrenAndAdd(display.measure,elt("pre","x","CodeMirror-line-like"));var style=window.getComputedStyle?window.getComputedStyle(e):e.currentStyle;var data={left:parseInt(style.paddingLeft),right:parseInt(style.paddingRight)};if(!isNaN(data.left)&&!isNaN(data.right)){display.cachedPaddingH=data}
return data}
function scrollGap(cm){return scrollerGap-cm.display.nativeBarWidth}
function displayWidth(cm){return cm.display.scroller.clientWidth-scrollGap(cm)-cm.display.barWidth}
function displayHeight(cm){return cm.display.scroller.clientHeight-scrollGap(cm)-cm.display.barHeight}
function ensureLineHeights(cm,lineView,rect){var wrapping=cm.options.lineWrapping;var curWidth=wrapping&&displayWidth(cm);if(!lineView.measure.heights||wrapping&&lineView.measure.width!=curWidth){var heights=lineView.measure.heights=[];if(wrapping){lineView.measure.width=curWidth;var rects=lineView.text.firstChild.getClientRects();for(var i=0;i<rects.length-1;i++){var cur=rects[i],next=rects[i+1];if(Math.abs(cur.bottom-next.bottom)>2){heights.push((cur.bottom+next.top)/2-rect.top)}}}
heights.push(rect.bottom-rect.top)}}
function mapFromLineView(lineView,line,lineN){if(lineView.line==line){return{map:lineView.measure.map,cache:lineView.measure.cache}}
if(lineView.rest){for(var i=0;i<lineView.rest.length;i++){if(lineView.rest[i]==line){return{map:lineView.measure.maps[i],cache:lineView.measure.caches[i]}}}
for(var i$1=0;i$1<lineView.rest.length;i$1++){if(lineNo(lineView.rest[i$1])>lineN){return{map:lineView.measure.maps[i$1],cache:lineView.measure.caches[i$1],before:!0}}}}}
function updateExternalMeasurement(cm,line){line=visualLine(line);var lineN=lineNo(line);var view=cm.display.externalMeasured=new LineView(cm.doc,line,lineN);view.lineN=lineN;var built=view.built=buildLineContent(cm,view);view.text=built.pre;removeChildrenAndAdd(cm.display.lineMeasure,built.pre);return view}
function measureChar(cm,line,ch,bias){return measureCharPrepared(cm,prepareMeasureForLine(cm,line),ch,bias)}
function findViewForLine(cm,lineN){if(lineN>=cm.display.viewFrom&&lineN<cm.display.viewTo){return cm.display.view[findViewIndex(cm,lineN)]}
var ext=cm.display.externalMeasured;if(ext&&lineN>=ext.lineN&&lineN<ext.lineN+ext.size){return ext}}
function prepareMeasureForLine(cm,line){var lineN=lineNo(line);var view=findViewForLine(cm,lineN);if(view&&!view.text){view=null}else if(view&&view.changes){updateLineForChanges(cm,view,lineN,getDimensions(cm));cm.curOp.forceUpdate=!0}
if(!view){view=updateExternalMeasurement(cm,line)}
var info=mapFromLineView(view,line,lineN);return{line:line,view:view,rect:null,map:info.map,cache:info.cache,before:info.before,hasHeights:!1}}
function measureCharPrepared(cm,prepared,ch,bias,varHeight){if(prepared.before){ch=-1}
var key=ch+(bias||""),found;if(prepared.cache.hasOwnProperty(key)){found=prepared.cache[key]}else{if(!prepared.rect){prepared.rect=prepared.view.text.getBoundingClientRect()}
if(!prepared.hasHeights){ensureLineHeights(cm,prepared.view,prepared.rect);prepared.hasHeights=!0}
found=measureCharInner(cm,prepared,ch,bias);if(!found.bogus){prepared.cache[key]=found}}
return{left:found.left,right:found.right,top:varHeight?found.rtop:found.top,bottom:varHeight?found.rbottom:found.bottom}}
var nullRect={left:0,right:0,top:0,bottom:0};function nodeAndOffsetInLineMap(map,ch,bias){var node,start,end,collapse,mStart,mEnd;for(var i=0;i<map.length;i+=3){mStart=map[i];mEnd=map[i+1];if(ch<mStart){start=0;end=1;collapse="left"}else if(ch<mEnd){start=ch-mStart;end=start+1}else if(i==map.length-3||ch==mEnd&&map[i+3]>ch){end=mEnd-mStart;start=end-1;if(ch>=mEnd){collapse="right"}}
if(start!=null){node=map[i+2];if(mStart==mEnd&&bias==(node.insertLeft?"left":"right")){collapse=bias}
if(bias=="left"&&start==0){while(i&&map[i-2]==map[i-3]&&map[i-1].insertLeft){node=map[(i-=3)+2];collapse="left"}}
if(bias=="right"&&start==mEnd-mStart){while(i<map.length-3&&map[i+3]==map[i+4]&&!map[i+5].insertLeft){node=map[(i+=3)+2];collapse="right"}}
break}}
return{node:node,start:start,end:end,collapse:collapse,coverStart:mStart,coverEnd:mEnd}}
function getUsefulRect(rects,bias){var rect=nullRect;if(bias=="left"){for(var i=0;i<rects.length;i++){if((rect=rects[i]).left!=rect.right){break}}}else{for(var i$1=rects.length-1;i$1>=0;i$1--){if((rect=rects[i$1]).left!=rect.right){break}}}
return rect}
function measureCharInner(cm,prepared,ch,bias){var place=nodeAndOffsetInLineMap(prepared.map,ch,bias);var node=place.node,start=place.start,end=place.end,collapse=place.collapse;var rect;if(node.nodeType==3){for(var i$1=0;i$1<4;i$1++){while(start&&isExtendingChar(prepared.line.text.charAt(place.coverStart+start))){--start}
while(place.coverStart+end<place.coverEnd&&isExtendingChar(prepared.line.text.charAt(place.coverStart+end))){++end}
if(ie&&ie_version<9&&start==0&&end==place.coverEnd-place.coverStart){rect=node.parentNode.getBoundingClientRect()}else{rect=getUsefulRect(range(node,start,end).getClientRects(),bias)}
if(rect.left||rect.right||start==0){break}
end=start;start=start-1;collapse="right"}
if(ie&&ie_version<11){rect=maybeUpdateRectForZooming(cm.display.measure,rect)}}else{if(start>0){collapse=bias="right"}
var rects;if(cm.options.lineWrapping&&(rects=node.getClientRects()).length>1){rect=rects[bias=="right"?rects.length-1:0]}else{rect=node.getBoundingClientRect()}}
if(ie&&ie_version<9&&!start&&(!rect||!rect.left&&!rect.right)){var rSpan=node.parentNode.getClientRects()[0];if(rSpan){rect={left:rSpan.left,right:rSpan.left+charWidth(cm.display),top:rSpan.top,bottom:rSpan.bottom}}else{rect=nullRect}}
var rtop=rect.top-prepared.rect.top,rbot=rect.bottom-prepared.rect.top;var mid=(rtop+rbot)/2;var heights=prepared.view.measure.heights;var i=0;for(;i<heights.length-1;i++){if(mid<heights[i]){break}}
var top=i?heights[i-1]:0,bot=heights[i];var result={left:(collapse=="right"?rect.right:rect.left)-prepared.rect.left,right:(collapse=="left"?rect.left:rect.right)-prepared.rect.left,top:top,bottom:bot};if(!rect.left&&!rect.right){result.bogus=!0}
if(!cm.options.singleCursorHeightPerLine){result.rtop=rtop;result.rbottom=rbot}
return result}
function maybeUpdateRectForZooming(measure,rect){if(!window.screen||screen.logicalXDPI==null||screen.logicalXDPI==screen.deviceXDPI||!hasBadZoomedRects(measure)){return rect}
var scaleX=screen.logicalXDPI/screen.deviceXDPI;var scaleY=screen.logicalYDPI/screen.deviceYDPI;return{left:rect.left*scaleX,right:rect.right*scaleX,top:rect.top*scaleY,bottom:rect.bottom*scaleY}}
function clearLineMeasurementCacheFor(lineView){if(lineView.measure){lineView.measure.cache={};lineView.measure.heights=null;if(lineView.rest){for(var i=0;i<lineView.rest.length;i++){lineView.measure.caches[i]={}}}}}
function clearLineMeasurementCache(cm){cm.display.externalMeasure=null;removeChildren(cm.display.lineMeasure);for(var i=0;i<cm.display.view.length;i++){clearLineMeasurementCacheFor(cm.display.view[i])}}
function clearCaches(cm){clearLineMeasurementCache(cm);cm.display.cachedCharWidth=cm.display.cachedTextHeight=cm.display.cachedPaddingH=null;if(!cm.options.lineWrapping){cm.display.maxLineChanged=!0}
cm.display.lineNumChars=null}
function pageScrollX(doc){if(chrome&&android){return-(doc.body.getBoundingClientRect().left-parseInt(getComputedStyle(doc.body).marginLeft))}
return doc.defaultView.pageXOffset||(doc.documentElement||doc.body).scrollLeft}
function pageScrollY(doc){if(chrome&&android){return-(doc.body.getBoundingClientRect().top-parseInt(getComputedStyle(doc.body).marginTop))}
return doc.defaultView.pageYOffset||(doc.documentElement||doc.body).scrollTop}
function widgetTopHeight(lineObj){var ref=visualLine(lineObj);var widgets=ref.widgets;var height=0;if(widgets){for(var i=0;i<widgets.length;++i){if(widgets[i].above){height+=widgetHeight(widgets[i])}}}
return height}
function intoCoordSystem(cm,lineObj,rect,context,includeWidgets){if(!includeWidgets){var height=widgetTopHeight(lineObj);rect.top+=height;rect.bottom+=height}
if(context=="line"){return rect}
if(!context){context="local"}
var yOff=heightAtLine(lineObj);if(context=="local"){yOff+=paddingTop(cm.display)}else{yOff-=cm.display.viewOffset}
if(context=="page"||context=="window"){var lOff=cm.display.lineSpace.getBoundingClientRect();yOff+=lOff.top+(context=="window"?0:pageScrollY(doc(cm)));var xOff=lOff.left+(context=="window"?0:pageScrollX(doc(cm)));rect.left+=xOff;rect.right+=xOff}
rect.top+=yOff;rect.bottom+=yOff;return rect}
function fromCoordSystem(cm,coords,context){if(context=="div"){return coords}
var left=coords.left,top=coords.top;if(context=="page"){left-=pageScrollX(doc(cm));top-=pageScrollY(doc(cm))}else if(context=="local"||!context){var localBox=cm.display.sizer.getBoundingClientRect();left+=localBox.left;top+=localBox.top}
var lineSpaceBox=cm.display.lineSpace.getBoundingClientRect();return{left:left-lineSpaceBox.left,top:top-lineSpaceBox.top}}
function charCoords(cm,pos,context,lineObj,bias){if(!lineObj){lineObj=getLine(cm.doc,pos.line)}
return intoCoordSystem(cm,lineObj,measureChar(cm,lineObj,pos.ch,bias),context)}
function cursorCoords(cm,pos,context,lineObj,preparedMeasure,varHeight){lineObj=lineObj||getLine(cm.doc,pos.line);if(!preparedMeasure){preparedMeasure=prepareMeasureForLine(cm,lineObj)}
function get(ch,right){var m=measureCharPrepared(cm,preparedMeasure,ch,right?"right":"left",varHeight);if(right){m.left=m.right}else{m.right=m.left}
return intoCoordSystem(cm,lineObj,m,context)}
var order=getOrder(lineObj,cm.doc.direction),ch=pos.ch,sticky=pos.sticky;if(ch>=lineObj.text.length){ch=lineObj.text.length;sticky="before"}else if(ch<=0){ch=0;sticky="after"}
if(!order){return get(sticky=="before"?ch-1:ch,sticky=="before")}
function getBidi(ch,partPos,invert){var part=order[partPos],right=part.level==1;return get(invert?ch-1:ch,right!=invert)}
var partPos=getBidiPartAt(order,ch,sticky);var other=bidiOther;var val=getBidi(ch,partPos,sticky=="before");if(other!=null){val.other=getBidi(ch,other,sticky!="before")}
return val}
function estimateCoords(cm,pos){var left=0;pos=clipPos(cm.doc,pos);if(!cm.options.lineWrapping){left=charWidth(cm.display)*pos.ch}
var lineObj=getLine(cm.doc,pos.line);var top=heightAtLine(lineObj)+paddingTop(cm.display);return{left:left,right:left,top:top,bottom:top+lineObj.height}}
function PosWithInfo(line,ch,sticky,outside,xRel){var pos=Pos(line,ch,sticky);pos.xRel=xRel;if(outside){pos.outside=outside}
return pos}
function coordsChar(cm,x,y){var doc=cm.doc;y+=cm.display.viewOffset;if(y<0){return PosWithInfo(doc.first,0,null,-1,-1)}
var lineN=lineAtHeight(doc,y),last=doc.first+doc.size-1;if(lineN>last){return PosWithInfo(doc.first+doc.size-1,getLine(doc,last).text.length,null,1,1)}
if(x<0){x=0}
var lineObj=getLine(doc,lineN);for(;;){var found=coordsCharInner(cm,lineObj,lineN,x,y);var collapsed=collapsedSpanAround(lineObj,found.ch+(found.xRel>0||found.outside>0?1:0));if(!collapsed){return found}
var rangeEnd=collapsed.find(1);if(rangeEnd.line==lineN){return rangeEnd}
lineObj=getLine(doc,lineN=rangeEnd.line)}}
function wrappedLineExtent(cm,lineObj,preparedMeasure,y){y-=widgetTopHeight(lineObj);var end=lineObj.text.length;var begin=findFirst(function(ch){return measureCharPrepared(cm,preparedMeasure,ch-1).bottom<=y},end,0);end=findFirst(function(ch){return measureCharPrepared(cm,preparedMeasure,ch).top>y},begin,end);return{begin:begin,end:end}}
function wrappedLineExtentChar(cm,lineObj,preparedMeasure,target){if(!preparedMeasure){preparedMeasure=prepareMeasureForLine(cm,lineObj)}
var targetTop=intoCoordSystem(cm,lineObj,measureCharPrepared(cm,preparedMeasure,target),"line").top;return wrappedLineExtent(cm,lineObj,preparedMeasure,targetTop)}
function boxIsAfter(box,x,y,left){return box.bottom<=y?!1:box.top>y?!0:(left?box.left:box.right)>x}
function coordsCharInner(cm,lineObj,lineNo,x,y){y-=heightAtLine(lineObj);var preparedMeasure=prepareMeasureForLine(cm,lineObj);var widgetHeight=widgetTopHeight(lineObj);var begin=0,end=lineObj.text.length,ltr=!0;var order=getOrder(lineObj,cm.doc.direction);if(order){var part=(cm.options.lineWrapping?coordsBidiPartWrapped:coordsBidiPart)(cm,lineObj,lineNo,preparedMeasure,order,x,y);ltr=part.level!=1;begin=ltr?part.from:part.to-1;end=ltr?part.to:part.from-1}
var chAround=null,boxAround=null;var ch=findFirst(function(ch){var box=measureCharPrepared(cm,preparedMeasure,ch);box.top+=widgetHeight;box.bottom+=widgetHeight;if(!boxIsAfter(box,x,y,!1)){return!1}
if(box.top<=y&&box.left<=x){chAround=ch;boxAround=box}
return!0},begin,end);var baseX,sticky,outside=!1;if(boxAround){var atLeft=x-boxAround.left<boxAround.right-x,atStart=atLeft==ltr;ch=chAround+(atStart?0:1);sticky=atStart?"after":"before";baseX=atLeft?boxAround.left:boxAround.right}else{if(!ltr&&(ch==end||ch==begin)){ch++}
sticky=ch==0?"after":ch==lineObj.text.length?"before":(measureCharPrepared(cm,preparedMeasure,ch-(ltr?1:0)).bottom+widgetHeight<=y)==ltr?"after":"before";var coords=cursorCoords(cm,Pos(lineNo,ch,sticky),"line",lineObj,preparedMeasure);baseX=coords.left;outside=y<coords.top?-1:y>=coords.bottom?1:0}
ch=skipExtendingChars(lineObj.text,ch,1);return PosWithInfo(lineNo,ch,sticky,outside,x-baseX)}
function coordsBidiPart(cm,lineObj,lineNo,preparedMeasure,order,x,y){var index=findFirst(function(i){var part=order[i],ltr=part.level!=1;return boxIsAfter(cursorCoords(cm,Pos(lineNo,ltr?part.to:part.from,ltr?"before":"after"),"line",lineObj,preparedMeasure),x,y,!0)},0,order.length-1);var part=order[index];if(index>0){var ltr=part.level!=1;var start=cursorCoords(cm,Pos(lineNo,ltr?part.from:part.to,ltr?"after":"before"),"line",lineObj,preparedMeasure);if(boxIsAfter(start,x,y,!0)&&start.top>y){part=order[index-1]}}
return part}
function coordsBidiPartWrapped(cm,lineObj,_lineNo,preparedMeasure,order,x,y){var ref=wrappedLineExtent(cm,lineObj,preparedMeasure,y);var begin=ref.begin;var end=ref.end;if(/\s/.test(lineObj.text.charAt(end-1))){end--}
var part=null,closestDist=null;for(var i=0;i<order.length;i++){var p=order[i];if(p.from>=end||p.to<=begin){continue}
var ltr=p.level!=1;var endX=measureCharPrepared(cm,preparedMeasure,ltr?Math.min(end,p.to)-1:Math.max(begin,p.from)).right;var dist=endX<x?x-endX+1e9:endX-x;if(!part||closestDist>dist){part=p;closestDist=dist}}
if(!part){part=order[order.length-1]}
if(part.from<begin){part={from:begin,to:part.to,level:part.level}}
if(part.to>end){part={from:part.from,to:end,level:part.level}}
return part}
var measureText;function textHeight(display){if(display.cachedTextHeight!=null){return display.cachedTextHeight}
if(measureText==null){measureText=elt("pre",null,"CodeMirror-line-like");for(var i=0;i<49;++i){measureText.appendChild(document.createTextNode("x"));measureText.appendChild(elt("br"))}
measureText.appendChild(document.createTextNode("x"))}
removeChildrenAndAdd(display.measure,measureText);var height=measureText.offsetHeight/50;if(height>3){display.cachedTextHeight=height}
removeChildren(display.measure);return height||1}
function charWidth(display){if(display.cachedCharWidth!=null){return display.cachedCharWidth}
var anchor=elt("span","xxxxxxxxxx");var pre=elt("pre",[anchor],"CodeMirror-line-like");removeChildrenAndAdd(display.measure,pre);var rect=anchor.getBoundingClientRect(),width=(rect.right-rect.left)/10;if(width>2){display.cachedCharWidth=width}
return width||10}
function getDimensions(cm){var d=cm.display,left={},width={};var gutterLeft=d.gutters.clientLeft;for(var n=d.gutters.firstChild,i=0;n;n=n.nextSibling,++i){var id=cm.display.gutterSpecs[i].className;left[id]=n.offsetLeft+n.clientLeft+gutterLeft;width[id]=n.clientWidth}
return{fixedPos:compensateForHScroll(d),gutterTotalWidth:d.gutters.offsetWidth,gutterLeft:left,gutterWidth:width,wrapperWidth:d.wrapper.clientWidth}}
function compensateForHScroll(display){return display.scroller.getBoundingClientRect().left-display.sizer.getBoundingClientRect().left}
function estimateHeight(cm){var th=textHeight(cm.display),wrapping=cm.options.lineWrapping;var perLine=wrapping&&Math.max(5,cm.display.scroller.clientWidth/charWidth(cm.display)-3);return function(line){if(lineIsHidden(cm.doc,line)){return 0}
var widgetsHeight=0;if(line.widgets){for(var i=0;i<line.widgets.length;i++){if(line.widgets[i].height){widgetsHeight+=line.widgets[i].height}}}
if(wrapping){return widgetsHeight+(Math.ceil(line.text.length/perLine)||1)*th}else{return widgetsHeight+th}}}
function estimateLineHeights(cm){var doc=cm.doc,est=estimateHeight(cm);doc.iter(function(line){var estHeight=est(line);if(estHeight!=line.height){updateLineHeight(line,estHeight)}})}
function posFromMouse(cm,e,liberal,forRect){var display=cm.display;if(!liberal&&e_target(e).getAttribute("cm-not-content")=="true"){return null}
var x,y,space=display.lineSpace.getBoundingClientRect();try{x=e.clientX-space.left;y=e.clientY-space.top}catch(e$1){return null}
var coords=coordsChar(cm,x,y),line;if(forRect&&coords.xRel>0&&(line=getLine(cm.doc,coords.line).text).length==coords.ch){var colDiff=countColumn(line,line.length,cm.options.tabSize)-line.length;coords=Pos(coords.line,Math.max(0,Math.round((x-paddingH(cm.display).left)/charWidth(cm.display))-colDiff))}
return coords}
function findViewIndex(cm,n){if(n>=cm.display.viewTo){return null}
n-=cm.display.viewFrom;if(n<0){return null}
var view=cm.display.view;for(var i=0;i<view.length;i++){n-=view[i].size;if(n<0){return i}}}
function regChange(cm,from,to,lendiff){if(from==null){from=cm.doc.first}
if(to==null){to=cm.doc.first+cm.doc.size}
if(!lendiff){lendiff=0}
var display=cm.display;if(lendiff&&to<display.viewTo&&(display.updateLineNumbers==null||display.updateLineNumbers>from)){display.updateLineNumbers=from}
cm.curOp.viewChanged=!0;if(from>=display.viewTo){if(sawCollapsedSpans&&visualLineNo(cm.doc,from)<display.viewTo){resetView(cm)}}else if(to<=display.viewFrom){if(sawCollapsedSpans&&visualLineEndNo(cm.doc,to+lendiff)>display.viewFrom){resetView(cm)}else{display.viewFrom+=lendiff;display.viewTo+=lendiff}}else if(from<=display.viewFrom&&to>=display.viewTo){resetView(cm)}else if(from<=display.viewFrom){var cut=viewCuttingPoint(cm,to,to+lendiff,1);if(cut){display.view=display.view.slice(cut.index);display.viewFrom=cut.lineN;display.viewTo+=lendiff}else{resetView(cm)}}else if(to>=display.viewTo){var cut$1=viewCuttingPoint(cm,from,from,-1);if(cut$1){display.view=display.view.slice(0,cut$1.index);display.viewTo=cut$1.lineN}else{resetView(cm)}}else{var cutTop=viewCuttingPoint(cm,from,from,-1);var cutBot=viewCuttingPoint(cm,to,to+lendiff,1);if(cutTop&&cutBot){display.view=display.view.slice(0,cutTop.index).concat(buildViewArray(cm,cutTop.lineN,cutBot.lineN)).concat(display.view.slice(cutBot.index));display.viewTo+=lendiff}else{resetView(cm)}}
var ext=display.externalMeasured;if(ext){if(to<ext.lineN){ext.lineN+=lendiff}else if(from<ext.lineN+ext.size){display.externalMeasured=null}}}
function regLineChange(cm,line,type){cm.curOp.viewChanged=!0;var display=cm.display,ext=cm.display.externalMeasured;if(ext&&line>=ext.lineN&&line<ext.lineN+ext.size){display.externalMeasured=null}
if(line<display.viewFrom||line>=display.viewTo){return}
var lineView=display.view[findViewIndex(cm,line)];if(lineView.node==null){return}
var arr=lineView.changes||(lineView.changes=[]);if(indexOf(arr,type)==-1){arr.push(type)}}
function resetView(cm){cm.display.viewFrom=cm.display.viewTo=cm.doc.first;cm.display.view=[];cm.display.viewOffset=0}
function viewCuttingPoint(cm,oldN,newN,dir){var index=findViewIndex(cm,oldN),diff,view=cm.display.view;if(!sawCollapsedSpans||newN==cm.doc.first+cm.doc.size){return{index:index,lineN:newN}}
var n=cm.display.viewFrom;for(var i=0;i<index;i++){n+=view[i].size}
if(n!=oldN){if(dir>0){if(index==view.length-1){return null}
diff=(n+view[index].size)-oldN;index++}else{diff=n-oldN}
oldN+=diff;newN+=diff}
while(visualLineNo(cm.doc,newN)!=newN){if(index==(dir<0?0:view.length-1)){return null}
newN+=dir*view[index-(dir<0?1:0)].size;index+=dir}
return{index:index,lineN:newN}}
function adjustView(cm,from,to){var display=cm.display,view=display.view;if(view.length==0||from>=display.viewTo||to<=display.viewFrom){display.view=buildViewArray(cm,from,to);display.viewFrom=from}else{if(display.viewFrom>from){display.view=buildViewArray(cm,from,display.viewFrom).concat(display.view)}else if(display.viewFrom<from){display.view=display.view.slice(findViewIndex(cm,from))}
display.viewFrom=from;if(display.viewTo<to){display.view=display.view.concat(buildViewArray(cm,display.viewTo,to))}else if(display.viewTo>to){display.view=display.view.slice(0,findViewIndex(cm,to))}}
display.viewTo=to}
function countDirtyView(cm){var view=cm.display.view,dirty=0;for(var i=0;i<view.length;i++){var lineView=view[i];if(!lineView.hidden&&(!lineView.node||lineView.changes)){++dirty}}
return dirty}
function updateSelection(cm){cm.display.input.showSelection(cm.display.input.prepareSelection())}
function prepareSelection(cm,primary){if(primary===void 0)primary=!0;var doc=cm.doc,result={};var curFragment=result.cursors=document.createDocumentFragment();var selFragment=result.selection=document.createDocumentFragment();var customCursor=cm.options.$customCursor;if(customCursor){primary=!0}
for(var i=0;i<doc.sel.ranges.length;i++){if(!primary&&i==doc.sel.primIndex){continue}
var range=doc.sel.ranges[i];if(range.from().line>=cm.display.viewTo||range.to().line<cm.display.viewFrom){continue}
var collapsed=range.empty();if(customCursor){var head=customCursor(cm,range);if(head){drawSelectionCursor(cm,head,curFragment)}}else if(collapsed||cm.options.showCursorWhenSelecting){drawSelectionCursor(cm,range.head,curFragment)}
if(!collapsed){drawSelectionRange(cm,range,selFragment)}}
return result}
function drawSelectionCursor(cm,head,output){var pos=cursorCoords(cm,head,"div",null,null,!cm.options.singleCursorHeightPerLine);var cursor=output.appendChild(elt("div","\u00a0","CodeMirror-cursor"));cursor.style.left=pos.left+"px";cursor.style.top=pos.top+"px";cursor.style.height=Math.max(0,pos.bottom-pos.top)*cm.options.cursorHeight+"px";if(/\bcm-fat-cursor\b/.test(cm.getWrapperElement().className)){var charPos=charCoords(cm,head,"div",null,null);var width=charPos.right-charPos.left;cursor.style.width=(width>0?width:cm.defaultCharWidth())+"px"}
if(pos.other){var otherCursor=output.appendChild(elt("div","\u00a0","CodeMirror-cursor CodeMirror-secondarycursor"));otherCursor.style.display="";otherCursor.style.left=pos.other.left+"px";otherCursor.style.top=pos.other.top+"px";otherCursor.style.height=(pos.other.bottom-pos.other.top)*.85+"px"}}
function cmpCoords(a,b){return a.top-b.top||a.left-b.left}
function drawSelectionRange(cm,range,output){var display=cm.display,doc=cm.doc;var fragment=document.createDocumentFragment();var padding=paddingH(cm.display),leftSide=padding.left;var rightSide=Math.max(display.sizerWidth,displayWidth(cm)-display.sizer.offsetLeft)-padding.right;var docLTR=doc.direction=="ltr";function add(left,top,width,bottom){if(top<0){top=0}
top=Math.round(top);bottom=Math.round(bottom);fragment.appendChild(elt("div",null,"CodeMirror-selected",("position: absolute; left: "+left+"px;\n                             top: "+top+"px; width: "+(width==null?rightSide-left:width)+"px;\n                             height: "+(bottom-top)+"px")))}
function drawForLine(line,fromArg,toArg){var lineObj=getLine(doc,line);var lineLen=lineObj.text.length;var start,end;function coords(ch,bias){return charCoords(cm,Pos(line,ch),"div",lineObj,bias)}
function wrapX(pos,dir,side){var extent=wrappedLineExtentChar(cm,lineObj,null,pos);var prop=(dir=="ltr")==(side=="after")?"left":"right";var ch=side=="after"?extent.begin:extent.end-(/\s/.test(lineObj.text.charAt(extent.end-1))?2:1);return coords(ch,prop)[prop]}
var order=getOrder(lineObj,doc.direction);iterateBidiSections(order,fromArg||0,toArg==null?lineLen:toArg,function(from,to,dir,i){var ltr=dir=="ltr";var fromPos=coords(from,ltr?"left":"right");var toPos=coords(to-1,ltr?"right":"left");var openStart=fromArg==null&&from==0,openEnd=toArg==null&&to==lineLen;var first=i==0,last=!order||i==order.length-1;if(toPos.top-fromPos.top<=3){var openLeft=(docLTR?openStart:openEnd)&&first;var openRight=(docLTR?openEnd:openStart)&&last;var left=openLeft?leftSide:(ltr?fromPos:toPos).left;var right=openRight?rightSide:(ltr?toPos:fromPos).right;add(left,fromPos.top,right-left,fromPos.bottom)}else{var topLeft,topRight,botLeft,botRight;if(ltr){topLeft=docLTR&&openStart&&first?leftSide:fromPos.left;topRight=docLTR?rightSide:wrapX(from,dir,"before");botLeft=docLTR?leftSide:wrapX(to,dir,"after");botRight=docLTR&&openEnd&&last?rightSide:toPos.right}else{topLeft=!docLTR?leftSide:wrapX(from,dir,"before");topRight=!docLTR&&openStart&&first?rightSide:fromPos.right;botLeft=!docLTR&&openEnd&&last?leftSide:toPos.left;botRight=!docLTR?rightSide:wrapX(to,dir,"after")}
add(topLeft,fromPos.top,topRight-topLeft,fromPos.bottom);if(fromPos.bottom<toPos.top){add(leftSide,fromPos.bottom,null,toPos.top)}
add(botLeft,toPos.top,botRight-botLeft,toPos.bottom)}
if(!start||cmpCoords(fromPos,start)<0){start=fromPos}
if(cmpCoords(toPos,start)<0){start=toPos}
if(!end||cmpCoords(fromPos,end)<0){end=fromPos}
if(cmpCoords(toPos,end)<0){end=toPos}});return{start:start,end:end}}
var sFrom=range.from(),sTo=range.to();if(sFrom.line==sTo.line){drawForLine(sFrom.line,sFrom.ch,sTo.ch)}else{var fromLine=getLine(doc,sFrom.line),toLine=getLine(doc,sTo.line);var singleVLine=visualLine(fromLine)==visualLine(toLine);var leftEnd=drawForLine(sFrom.line,sFrom.ch,singleVLine?fromLine.text.length+1:null).end;var rightStart=drawForLine(sTo.line,singleVLine?0:null,sTo.ch).start;if(singleVLine){if(leftEnd.top<rightStart.top-2){add(leftEnd.right,leftEnd.top,null,leftEnd.bottom);add(leftSide,rightStart.top,rightStart.left,rightStart.bottom)}else{add(leftEnd.right,leftEnd.top,rightStart.left-leftEnd.right,leftEnd.bottom)}}
if(leftEnd.bottom<rightStart.top){add(leftSide,leftEnd.bottom,null,rightStart.top)}}
output.appendChild(fragment)}
function restartBlink(cm){if(!cm.state.focused){return}
var display=cm.display;clearInterval(display.blinker);var on=!0;display.cursorDiv.style.visibility="";if(cm.options.cursorBlinkRate>0){display.blinker=setInterval(function(){if(!cm.hasFocus()){onBlur(cm)}
display.cursorDiv.style.visibility=(on=!on)?"":"hidden"},cm.options.cursorBlinkRate)}else if(cm.options.cursorBlinkRate<0){display.cursorDiv.style.visibility="hidden"}}
function ensureFocus(cm){if(!cm.hasFocus()){cm.display.input.focus();if(!cm.state.focused){onFocus(cm)}}}
function delayBlurEvent(cm){cm.state.delayingBlurEvent=!0;setTimeout(function(){if(cm.state.delayingBlurEvent){cm.state.delayingBlurEvent=!1;if(cm.state.focused){onBlur(cm)}}},100)}
function onFocus(cm,e){if(cm.state.delayingBlurEvent&&!cm.state.draggingText){cm.state.delayingBlurEvent=!1}
if(cm.options.readOnly=="nocursor"){return}
if(!cm.state.focused){signal(cm,"focus",cm,e);cm.state.focused=!0;addClass(cm.display.wrapper,"CodeMirror-focused");if(!cm.curOp&&cm.display.selForContextMenu!=cm.doc.sel){cm.display.input.reset();if(webkit){setTimeout(function(){return cm.display.input.reset(!0)},20)}}
cm.display.input.receivedFocus()}
restartBlink(cm)}
function onBlur(cm,e){if(cm.state.delayingBlurEvent){return}
if(cm.state.focused){signal(cm,"blur",cm,e);cm.state.focused=!1;rmClass(cm.display.wrapper,"CodeMirror-focused")}
clearInterval(cm.display.blinker);setTimeout(function(){if(!cm.state.focused){cm.display.shift=!1}},150)}
function updateHeightsInViewport(cm){var display=cm.display;var prevBottom=display.lineDiv.offsetTop;var viewTop=Math.max(0,display.scroller.getBoundingClientRect().top);var oldHeight=display.lineDiv.getBoundingClientRect().top;var mustScroll=0;for(var i=0;i<display.view.length;i++){var cur=display.view[i],wrapping=cm.options.lineWrapping;var height=(void 0),width=0;if(cur.hidden){continue}
oldHeight+=cur.line.height;if(ie&&ie_version<8){var bot=cur.node.offsetTop+cur.node.offsetHeight;height=bot-prevBottom;prevBottom=bot}else{var box=cur.node.getBoundingClientRect();height=box.bottom-box.top;if(!wrapping&&cur.text.firstChild){width=cur.text.firstChild.getBoundingClientRect().right-box.left-1}}
var diff=cur.line.height-height;if(diff>.005||diff<-.005){if(oldHeight<viewTop){mustScroll-=diff}
updateLineHeight(cur.line,height);updateWidgetHeight(cur.line);if(cur.rest){for(var j=0;j<cur.rest.length;j++){updateWidgetHeight(cur.rest[j])}}}
if(width>cm.display.sizerWidth){var chWidth=Math.ceil(width/charWidth(cm.display));if(chWidth>cm.display.maxLineLength){cm.display.maxLineLength=chWidth;cm.display.maxLine=cur.line;cm.display.maxLineChanged=!0}}}
if(Math.abs(mustScroll)>2){display.scroller.scrollTop+=mustScroll}}
function updateWidgetHeight(line){if(line.widgets){for(var i=0;i<line.widgets.length;++i){var w=line.widgets[i],parent=w.node.parentNode;if(parent){w.height=parent.offsetHeight}}}}
function visibleLines(display,doc,viewport){var top=viewport&&viewport.top!=null?Math.max(0,viewport.top):display.scroller.scrollTop;top=Math.floor(top-paddingTop(display));var bottom=viewport&&viewport.bottom!=null?viewport.bottom:top+display.wrapper.clientHeight;var from=lineAtHeight(doc,top),to=lineAtHeight(doc,bottom);if(viewport&&viewport.ensure){var ensureFrom=viewport.ensure.from.line,ensureTo=viewport.ensure.to.line;if(ensureFrom<from){from=ensureFrom;to=lineAtHeight(doc,heightAtLine(getLine(doc,ensureFrom))+display.wrapper.clientHeight)}else if(Math.min(ensureTo,doc.lastLine())>=to){from=lineAtHeight(doc,heightAtLine(getLine(doc,ensureTo))-display.wrapper.clientHeight);to=ensureTo}}
return{from:from,to:Math.max(to,from+1)}}
function maybeScrollWindow(cm,rect){if(signalDOMEvent(cm,"scrollCursorIntoView")){return}
var display=cm.display,box=display.sizer.getBoundingClientRect(),doScroll=null;var doc=display.wrapper.ownerDocument;if(rect.top+box.top<0){doScroll=!0}else if(rect.bottom+box.top>(doc.defaultView.innerHeight||doc.documentElement.clientHeight)){doScroll=!1}
if(doScroll!=null&&!phantom){var scrollNode=elt("div","\u200b",null,("position: absolute;\n                         top: "+(rect.top-display.viewOffset-paddingTop(cm.display))+"px;\n                         height: "+(rect.bottom-rect.top+scrollGap(cm)+display.barHeight)+"px;\n                         left: "+(rect.left)+"px; width: "+(Math.max(2,rect.right-rect.left))+"px;"));cm.display.lineSpace.appendChild(scrollNode);scrollNode.scrollIntoView(doScroll);cm.display.lineSpace.removeChild(scrollNode)}}
function scrollPosIntoView(cm,pos,end,margin){if(margin==null){margin=0}
var rect;if(!cm.options.lineWrapping&&pos==end){end=pos.sticky=="before"?Pos(pos.line,pos.ch+1,"before"):pos;pos=pos.ch?Pos(pos.line,pos.sticky=="before"?pos.ch-1:pos.ch,"after"):pos}
for(var limit=0;limit<5;limit++){var changed=!1;var coords=cursorCoords(cm,pos);var endCoords=!end||end==pos?coords:cursorCoords(cm,end);rect={left:Math.min(coords.left,endCoords.left),top:Math.min(coords.top,endCoords.top)-margin,right:Math.max(coords.left,endCoords.left),bottom:Math.max(coords.bottom,endCoords.bottom)+margin};var scrollPos=calculateScrollPos(cm,rect);var startTop=cm.doc.scrollTop,startLeft=cm.doc.scrollLeft;if(scrollPos.scrollTop!=null){updateScrollTop(cm,scrollPos.scrollTop);if(Math.abs(cm.doc.scrollTop-startTop)>1){changed=!0}}
if(scrollPos.scrollLeft!=null){setScrollLeft(cm,scrollPos.scrollLeft);if(Math.abs(cm.doc.scrollLeft-startLeft)>1){changed=!0}}
if(!changed){break}}
return rect}
function scrollIntoView(cm,rect){var scrollPos=calculateScrollPos(cm,rect);if(scrollPos.scrollTop!=null){updateScrollTop(cm,scrollPos.scrollTop)}
if(scrollPos.scrollLeft!=null){setScrollLeft(cm,scrollPos.scrollLeft)}}
function calculateScrollPos(cm,rect){var display=cm.display,snapMargin=textHeight(cm.display);if(rect.top<0){rect.top=0}
var screentop=cm.curOp&&cm.curOp.scrollTop!=null?cm.curOp.scrollTop:display.scroller.scrollTop;var screen=displayHeight(cm),result={};if(rect.bottom-rect.top>screen){rect.bottom=rect.top+screen}
var docBottom=cm.doc.height+paddingVert(display);var atTop=rect.top<snapMargin,atBottom=rect.bottom>docBottom-snapMargin;if(rect.top<screentop){result.scrollTop=atTop?0:rect.top}else if(rect.bottom>screentop+screen){var newTop=Math.min(rect.top,(atBottom?docBottom:rect.bottom)-screen);if(newTop!=screentop){result.scrollTop=newTop}}
var gutterSpace=cm.options.fixedGutter?0:display.gutters.offsetWidth;var screenleft=cm.curOp&&cm.curOp.scrollLeft!=null?cm.curOp.scrollLeft:display.scroller.scrollLeft-gutterSpace;var screenw=displayWidth(cm)-display.gutters.offsetWidth;var tooWide=rect.right-rect.left>screenw;if(tooWide){rect.right=rect.left+screenw}
if(rect.left<10){result.scrollLeft=0}else if(rect.left<screenleft){result.scrollLeft=Math.max(0,rect.left+gutterSpace-(tooWide?0:10))}else if(rect.right>screenw+screenleft-3){result.scrollLeft=rect.right+(tooWide?0:10)-screenw}
return result}
function addToScrollTop(cm,top){if(top==null){return}
resolveScrollToPos(cm);cm.curOp.scrollTop=(cm.curOp.scrollTop==null?cm.doc.scrollTop:cm.curOp.scrollTop)+top}
function ensureCursorVisible(cm){resolveScrollToPos(cm);var cur=cm.getCursor();cm.curOp.scrollToPos={from:cur,to:cur,margin:cm.options.cursorScrollMargin}}
function scrollToCoords(cm,x,y){if(x!=null||y!=null){resolveScrollToPos(cm)}
if(x!=null){cm.curOp.scrollLeft=x}
if(y!=null){cm.curOp.scrollTop=y}}
function scrollToRange(cm,range){resolveScrollToPos(cm);cm.curOp.scrollToPos=range}
function resolveScrollToPos(cm){var range=cm.curOp.scrollToPos;if(range){cm.curOp.scrollToPos=null;var from=estimateCoords(cm,range.from),to=estimateCoords(cm,range.to);scrollToCoordsRange(cm,from,to,range.margin)}}
function scrollToCoordsRange(cm,from,to,margin){var sPos=calculateScrollPos(cm,{left:Math.min(from.left,to.left),top:Math.min(from.top,to.top)-margin,right:Math.max(from.right,to.right),bottom:Math.max(from.bottom,to.bottom)+margin});scrollToCoords(cm,sPos.scrollLeft,sPos.scrollTop)}
function updateScrollTop(cm,val){if(Math.abs(cm.doc.scrollTop-val)<2){return}
if(!gecko){updateDisplaySimple(cm,{top:val})}
setScrollTop(cm,val,!0);if(gecko){updateDisplaySimple(cm)}
startWorker(cm,100)}
function setScrollTop(cm,val,forceScroll){val=Math.max(0,Math.min(cm.display.scroller.scrollHeight-cm.display.scroller.clientHeight,val));if(cm.display.scroller.scrollTop==val&&!forceScroll){return}
cm.doc.scrollTop=val;cm.display.scrollbars.setScrollTop(val);if(cm.display.scroller.scrollTop!=val){cm.display.scroller.scrollTop=val}}
function setScrollLeft(cm,val,isScroller,forceScroll){val=Math.max(0,Math.min(val,cm.display.scroller.scrollWidth-cm.display.scroller.clientWidth));if((isScroller?val==cm.doc.scrollLeft:Math.abs(cm.doc.scrollLeft-val)<2)&&!forceScroll){return}
cm.doc.scrollLeft=val;alignHorizontally(cm);if(cm.display.scroller.scrollLeft!=val){cm.display.scroller.scrollLeft=val}
cm.display.scrollbars.setScrollLeft(val)}
function measureForScrollbars(cm){var d=cm.display,gutterW=d.gutters.offsetWidth;var docH=Math.round(cm.doc.height+paddingVert(cm.display));return{clientHeight:d.scroller.clientHeight,viewHeight:d.wrapper.clientHeight,scrollWidth:d.scroller.scrollWidth,clientWidth:d.scroller.clientWidth,viewWidth:d.wrapper.clientWidth,barLeft:cm.options.fixedGutter?gutterW:0,docHeight:docH,scrollHeight:docH+scrollGap(cm)+d.barHeight,nativeBarWidth:d.nativeBarWidth,gutterWidth:gutterW}}
var NativeScrollbars=function(place,scroll,cm){this.cm=cm;var vert=this.vert=elt("div",[elt("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar");var horiz=this.horiz=elt("div",[elt("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");vert.tabIndex=horiz.tabIndex=-1;place(vert);place(horiz);on(vert,"scroll",function(){if(vert.clientHeight){scroll(vert.scrollTop,"vertical")}});on(horiz,"scroll",function(){if(horiz.clientWidth){scroll(horiz.scrollLeft,"horizontal")}});this.checkedZeroWidth=!1;if(ie&&ie_version<8){this.horiz.style.minHeight=this.vert.style.minWidth="18px"}};NativeScrollbars.prototype.update=function(measure){var needsH=measure.scrollWidth>measure.clientWidth+1;var needsV=measure.scrollHeight>measure.clientHeight+1;var sWidth=measure.nativeBarWidth;if(needsV){this.vert.style.display="block";this.vert.style.bottom=needsH?sWidth+"px":"0";var totalHeight=measure.viewHeight-(needsH?sWidth:0);this.vert.firstChild.style.height=Math.max(0,measure.scrollHeight-measure.clientHeight+totalHeight)+"px"}else{this.vert.scrollTop=0;this.vert.style.display="";this.vert.firstChild.style.height="0"}
if(needsH){this.horiz.style.display="block";this.horiz.style.right=needsV?sWidth+"px":"0";this.horiz.style.left=measure.barLeft+"px";var totalWidth=measure.viewWidth-measure.barLeft-(needsV?sWidth:0);this.horiz.firstChild.style.width=Math.max(0,measure.scrollWidth-measure.clientWidth+totalWidth)+"px"}else{this.horiz.style.display="";this.horiz.firstChild.style.width="0"}
if(!this.checkedZeroWidth&&measure.clientHeight>0){if(sWidth==0){this.zeroWidthHack()}
this.checkedZeroWidth=!0}
return{right:needsV?sWidth:0,bottom:needsH?sWidth:0}};NativeScrollbars.prototype.setScrollLeft=function(pos){if(this.horiz.scrollLeft!=pos){this.horiz.scrollLeft=pos}
if(this.disableHoriz){this.enableZeroWidthBar(this.horiz,this.disableHoriz,"horiz")}};NativeScrollbars.prototype.setScrollTop=function(pos){if(this.vert.scrollTop!=pos){this.vert.scrollTop=pos}
if(this.disableVert){this.enableZeroWidthBar(this.vert,this.disableVert,"vert")}};NativeScrollbars.prototype.zeroWidthHack=function(){var w=mac&&!mac_geMountainLion?"12px":"18px";this.horiz.style.height=this.vert.style.width=w;this.horiz.style.visibility=this.vert.style.visibility="hidden";this.disableHoriz=new Delayed;this.disableVert=new Delayed};NativeScrollbars.prototype.enableZeroWidthBar=function(bar,delay,type){bar.style.visibility="";function maybeDisable(){var box=bar.getBoundingClientRect();var elt=type=="vert"?document.elementFromPoint(box.right-1,(box.top+box.bottom)/2):document.elementFromPoint((box.right+box.left)/2,box.bottom-1);if(elt!=bar){bar.style.visibility="hidden"}else{delay.set(1000,maybeDisable)}}
delay.set(1000,maybeDisable)};NativeScrollbars.prototype.clear=function(){var parent=this.horiz.parentNode;parent.removeChild(this.horiz);parent.removeChild(this.vert)};var NullScrollbars=function(){};NullScrollbars.prototype.update=function(){return{bottom:0,right:0}};NullScrollbars.prototype.setScrollLeft=function(){};NullScrollbars.prototype.setScrollTop=function(){};NullScrollbars.prototype.clear=function(){};function updateScrollbars(cm,measure){if(!measure){measure=measureForScrollbars(cm)}
var startWidth=cm.display.barWidth,startHeight=cm.display.barHeight;updateScrollbarsInner(cm,measure);for(var i=0;i<4&&startWidth!=cm.display.barWidth||startHeight!=cm.display.barHeight;i++){if(startWidth!=cm.display.barWidth&&cm.options.lineWrapping){updateHeightsInViewport(cm)}
updateScrollbarsInner(cm,measureForScrollbars(cm));startWidth=cm.display.barWidth;startHeight=cm.display.barHeight}}
function updateScrollbarsInner(cm,measure){var d=cm.display;var sizes=d.scrollbars.update(measure);d.sizer.style.paddingRight=(d.barWidth=sizes.right)+"px";d.sizer.style.paddingBottom=(d.barHeight=sizes.bottom)+"px";d.heightForcer.style.borderBottom=sizes.bottom+"px solid transparent";if(sizes.right&&sizes.bottom){d.scrollbarFiller.style.display="block";d.scrollbarFiller.style.height=sizes.bottom+"px";d.scrollbarFiller.style.width=sizes.right+"px"}else{d.scrollbarFiller.style.display=""}
if(sizes.bottom&&cm.options.coverGutterNextToScrollbar&&cm.options.fixedGutter){d.gutterFiller.style.display="block";d.gutterFiller.style.height=sizes.bottom+"px";d.gutterFiller.style.width=measure.gutterWidth+"px"}else{d.gutterFiller.style.display=""}}
var scrollbarModel={"native":NativeScrollbars,"null":NullScrollbars};function initScrollbars(cm){if(cm.display.scrollbars){cm.display.scrollbars.clear();if(cm.display.scrollbars.addClass){rmClass(cm.display.wrapper,cm.display.scrollbars.addClass)}}
cm.display.scrollbars=new scrollbarModel[cm.options.scrollbarStyle](function(node){cm.display.wrapper.insertBefore(node,cm.display.scrollbarFiller);on(node,"mousedown",function(){if(cm.state.focused){setTimeout(function(){return cm.display.input.focus()},0)}});node.setAttribute("cm-not-content","true")},function(pos,axis){if(axis=="horizontal"){setScrollLeft(cm,pos)}else{updateScrollTop(cm,pos)}},cm);if(cm.display.scrollbars.addClass){addClass(cm.display.wrapper,cm.display.scrollbars.addClass)}}
var nextOpId=0;function startOperation(cm){cm.curOp={cm:cm,viewChanged:!1,startHeight:cm.doc.height,forceUpdate:!1,updateInput:0,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,focus:!1,id:++nextOpId,markArrays:null};pushOperation(cm.curOp)}
function endOperation(cm){var op=cm.curOp;if(op){finishOperation(op,function(group){for(var i=0;i<group.ops.length;i++){group.ops[i].cm.curOp=null}
endOperations(group)})}}
function endOperations(group){var ops=group.ops;for(var i=0;i<ops.length;i++){endOperation_R1(ops[i])}
for(var i$1=0;i$1<ops.length;i$1++){endOperation_W1(ops[i$1])}
for(var i$2=0;i$2<ops.length;i$2++){endOperation_R2(ops[i$2])}
for(var i$3=0;i$3<ops.length;i$3++){endOperation_W2(ops[i$3])}
for(var i$4=0;i$4<ops.length;i$4++){endOperation_finish(ops[i$4])}}
function endOperation_R1(op){var cm=op.cm,display=cm.display;maybeClipScrollbars(cm);if(op.updateMaxLine){findMaxLine(cm)}
op.mustUpdate=op.viewChanged||op.forceUpdate||op.scrollTop!=null||op.scrollToPos&&(op.scrollToPos.from.line<display.viewFrom||op.scrollToPos.to.line>=display.viewTo)||display.maxLineChanged&&cm.options.lineWrapping;op.update=op.mustUpdate&&new DisplayUpdate(cm,op.mustUpdate&&{top:op.scrollTop,ensure:op.scrollToPos},op.forceUpdate)}
function endOperation_W1(op){op.updatedDisplay=op.mustUpdate&&updateDisplayIfNeeded(op.cm,op.update)}
function endOperation_R2(op){var cm=op.cm,display=cm.display;if(op.updatedDisplay){updateHeightsInViewport(cm)}
op.barMeasure=measureForScrollbars(cm);if(display.maxLineChanged&&!cm.options.lineWrapping){op.adjustWidthTo=measureChar(cm,display.maxLine,display.maxLine.text.length).left+3;cm.display.sizerWidth=op.adjustWidthTo;op.barMeasure.scrollWidth=Math.max(display.scroller.clientWidth,display.sizer.offsetLeft+op.adjustWidthTo+scrollGap(cm)+cm.display.barWidth);op.maxScrollLeft=Math.max(0,display.sizer.offsetLeft+op.adjustWidthTo-displayWidth(cm))}
if(op.updatedDisplay||op.selectionChanged){op.preparedSelection=display.input.prepareSelection()}}
function endOperation_W2(op){var cm=op.cm;if(op.adjustWidthTo!=null){cm.display.sizer.style.minWidth=op.adjustWidthTo+"px";if(op.maxScrollLeft<cm.doc.scrollLeft){setScrollLeft(cm,Math.min(cm.display.scroller.scrollLeft,op.maxScrollLeft),!0)}
cm.display.maxLineChanged=!1}
var takeFocus=op.focus&&op.focus==activeElt(doc(cm));if(op.preparedSelection){cm.display.input.showSelection(op.preparedSelection,takeFocus)}
if(op.updatedDisplay||op.startHeight!=cm.doc.height){updateScrollbars(cm,op.barMeasure)}
if(op.updatedDisplay){setDocumentHeight(cm,op.barMeasure)}
if(op.selectionChanged){restartBlink(cm)}
if(cm.state.focused&&op.updateInput){cm.display.input.reset(op.typing)}
if(takeFocus){ensureFocus(op.cm)}}
function endOperation_finish(op){var cm=op.cm,display=cm.display,doc=cm.doc;if(op.updatedDisplay){postUpdateDisplay(cm,op.update)}
if(display.wheelStartX!=null&&(op.scrollTop!=null||op.scrollLeft!=null||op.scrollToPos)){display.wheelStartX=display.wheelStartY=null}
if(op.scrollTop!=null){setScrollTop(cm,op.scrollTop,op.forceScroll)}
if(op.scrollLeft!=null){setScrollLeft(cm,op.scrollLeft,!0,!0)}
if(op.scrollToPos){var rect=scrollPosIntoView(cm,clipPos(doc,op.scrollToPos.from),clipPos(doc,op.scrollToPos.to),op.scrollToPos.margin);maybeScrollWindow(cm,rect)}
var hidden=op.maybeHiddenMarkers,unhidden=op.maybeUnhiddenMarkers;if(hidden){for(var i=0;i<hidden.length;++i){if(!hidden[i].lines.length){signal(hidden[i],"hide")}}}
if(unhidden){for(var i$1=0;i$1<unhidden.length;++i$1){if(unhidden[i$1].lines.length){signal(unhidden[i$1],"unhide")}}}
if(display.wrapper.offsetHeight){doc.scrollTop=cm.display.scroller.scrollTop}
if(op.changeObjs){signal(cm,"changes",cm,op.changeObjs)}
if(op.update){op.update.finish()}}
function runInOp(cm,f){if(cm.curOp){return f()}
startOperation(cm);try{return f()}finally{endOperation(cm)}}
function operation(cm,f){return function(){if(cm.curOp){return f.apply(cm,arguments)}
startOperation(cm);try{return f.apply(cm,arguments)}finally{endOperation(cm)}}}
function methodOp(f){return function(){if(this.curOp){return f.apply(this,arguments)}
startOperation(this);try{return f.apply(this,arguments)}finally{endOperation(this)}}}
function docMethodOp(f){return function(){var cm=this.cm;if(!cm||cm.curOp){return f.apply(this,arguments)}
startOperation(cm);try{return f.apply(this,arguments)}finally{endOperation(cm)}}}
function startWorker(cm,time){if(cm.doc.highlightFrontier<cm.display.viewTo){cm.state.highlight.set(time,bind(highlightWorker,cm))}}
function highlightWorker(cm){var doc=cm.doc;if(doc.highlightFrontier>=cm.display.viewTo){return}
var end=+new Date+cm.options.workTime;var context=getContextBefore(cm,doc.highlightFrontier);var changedLines=[];doc.iter(context.line,Math.min(doc.first+doc.size,cm.display.viewTo+500),function(line){if(context.line>=cm.display.viewFrom){var oldStyles=line.styles;var resetState=line.text.length>cm.options.maxHighlightLength?copyState(doc.mode,context.state):null;var highlighted=highlightLine(cm,line,context,!0);if(resetState){context.state=resetState}
line.styles=highlighted.styles;var oldCls=line.styleClasses,newCls=highlighted.classes;if(newCls){line.styleClasses=newCls}else if(oldCls){line.styleClasses=null}
var ischange=!oldStyles||oldStyles.length!=line.styles.length||oldCls!=newCls&&(!oldCls||!newCls||oldCls.bgClass!=newCls.bgClass||oldCls.textClass!=newCls.textClass);for(var i=0;!ischange&&i<oldStyles.length;++i){ischange=oldStyles[i]!=line.styles[i]}
if(ischange){changedLines.push(context.line)}
line.stateAfter=context.save();context.nextLine()}else{if(line.text.length<=cm.options.maxHighlightLength){processLine(cm,line.text,context)}
line.stateAfter=context.line%5==0?context.save():null;context.nextLine()}
if(+new Date>end){startWorker(cm,cm.options.workDelay);return!0}});doc.highlightFrontier=context.line;doc.modeFrontier=Math.max(doc.modeFrontier,context.line);if(changedLines.length){runInOp(cm,function(){for(var i=0;i<changedLines.length;i++){regLineChange(cm,changedLines[i],"text")}})}}
var DisplayUpdate=function(cm,viewport,force){var display=cm.display;this.viewport=viewport;this.visible=visibleLines(display,cm.doc,viewport);this.editorIsHidden=!display.wrapper.offsetWidth;this.wrapperHeight=display.wrapper.clientHeight;this.wrapperWidth=display.wrapper.clientWidth;this.oldDisplayWidth=displayWidth(cm);this.force=force;this.dims=getDimensions(cm);this.events=[]};DisplayUpdate.prototype.signal=function(emitter,type){if(hasHandler(emitter,type)){this.events.push(arguments)}};DisplayUpdate.prototype.finish=function(){for(var i=0;i<this.events.length;i++){signal.apply(null,this.events[i])}};function maybeClipScrollbars(cm){var display=cm.display;if(!display.scrollbarsClipped&&display.scroller.offsetWidth){display.nativeBarWidth=display.scroller.offsetWidth-display.scroller.clientWidth;display.heightForcer.style.height=scrollGap(cm)+"px";display.sizer.style.marginBottom=-display.nativeBarWidth+"px";display.sizer.style.borderRightWidth=scrollGap(cm)+"px";display.scrollbarsClipped=!0}}
function selectionSnapshot(cm){if(cm.hasFocus()){return null}
var active=activeElt(doc(cm));if(!active||!contains(cm.display.lineDiv,active)){return null}
var result={activeElt:active};if(window.getSelection){var sel=win(cm).getSelection();if(sel.anchorNode&&sel.extend&&contains(cm.display.lineDiv,sel.anchorNode)){result.anchorNode=sel.anchorNode;result.anchorOffset=sel.anchorOffset;result.focusNode=sel.focusNode;result.focusOffset=sel.focusOffset}}
return result}
function restoreSelection(snapshot){if(!snapshot||!snapshot.activeElt||snapshot.activeElt==activeElt(snapshot.activeElt.ownerDocument)){return}
snapshot.activeElt.focus();if(!/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName)&&snapshot.anchorNode&&contains(document.body,snapshot.anchorNode)&&contains(document.body,snapshot.focusNode)){var doc=snapshot.activeElt.ownerDocument;var sel=doc.defaultView.getSelection(),range=doc.createRange();range.setEnd(snapshot.anchorNode,snapshot.anchorOffset);range.collapse(!1);sel.removeAllRanges();sel.addRange(range);sel.extend(snapshot.focusNode,snapshot.focusOffset)}}
function updateDisplayIfNeeded(cm,update){var display=cm.display,doc=cm.doc;if(update.editorIsHidden){resetView(cm);return!1}
if(!update.force&&update.visible.from>=display.viewFrom&&update.visible.to<=display.viewTo&&(display.updateLineNumbers==null||display.updateLineNumbers>=display.viewTo)&&display.renderedView==display.view&&countDirtyView(cm)==0){return!1}
if(maybeUpdateLineNumberWidth(cm)){resetView(cm);update.dims=getDimensions(cm)}
var end=doc.first+doc.size;var from=Math.max(update.visible.from-cm.options.viewportMargin,doc.first);var to=Math.min(end,update.visible.to+cm.options.viewportMargin);if(display.viewFrom<from&&from-display.viewFrom<20){from=Math.max(doc.first,display.viewFrom)}
if(display.viewTo>to&&display.viewTo-to<20){to=Math.min(end,display.viewTo)}
if(sawCollapsedSpans){from=visualLineNo(cm.doc,from);to=visualLineEndNo(cm.doc,to)}
var different=from!=display.viewFrom||to!=display.viewTo||display.lastWrapHeight!=update.wrapperHeight||display.lastWrapWidth!=update.wrapperWidth;adjustView(cm,from,to);display.viewOffset=heightAtLine(getLine(cm.doc,display.viewFrom));cm.display.mover.style.top=display.viewOffset+"px";var toUpdate=countDirtyView(cm);if(!different&&toUpdate==0&&!update.force&&display.renderedView==display.view&&(display.updateLineNumbers==null||display.updateLineNumbers>=display.viewTo)){return!1}
var selSnapshot=selectionSnapshot(cm);if(toUpdate>4){display.lineDiv.style.display="none"}
patchDisplay(cm,display.updateLineNumbers,update.dims);if(toUpdate>4){display.lineDiv.style.display=""}
display.renderedView=display.view;restoreSelection(selSnapshot);removeChildren(display.cursorDiv);removeChildren(display.selectionDiv);display.gutters.style.height=display.sizer.style.minHeight=0;if(different){display.lastWrapHeight=update.wrapperHeight;display.lastWrapWidth=update.wrapperWidth;startWorker(cm,400)}
display.updateLineNumbers=null;return!0}
function postUpdateDisplay(cm,update){var viewport=update.viewport;for(var first=!0;;first=!1){if(!first||!cm.options.lineWrapping||update.oldDisplayWidth==displayWidth(cm)){if(viewport&&viewport.top!=null){viewport={top:Math.min(cm.doc.height+paddingVert(cm.display)-displayHeight(cm),viewport.top)}}
update.visible=visibleLines(cm.display,cm.doc,viewport);if(update.visible.from>=cm.display.viewFrom&&update.visible.to<=cm.display.viewTo){break}}else if(first){update.visible=visibleLines(cm.display,cm.doc,viewport)}
if(!updateDisplayIfNeeded(cm,update)){break}
updateHeightsInViewport(cm);var barMeasure=measureForScrollbars(cm);updateSelection(cm);updateScrollbars(cm,barMeasure);setDocumentHeight(cm,barMeasure);update.force=!1}
update.signal(cm,"update",cm);if(cm.display.viewFrom!=cm.display.reportedViewFrom||cm.display.viewTo!=cm.display.reportedViewTo){update.signal(cm,"viewportChange",cm,cm.display.viewFrom,cm.display.viewTo);cm.display.reportedViewFrom=cm.display.viewFrom;cm.display.reportedViewTo=cm.display.viewTo}}
function updateDisplaySimple(cm,viewport){var update=new DisplayUpdate(cm,viewport);if(updateDisplayIfNeeded(cm,update)){updateHeightsInViewport(cm);postUpdateDisplay(cm,update);var barMeasure=measureForScrollbars(cm);updateSelection(cm);updateScrollbars(cm,barMeasure);setDocumentHeight(cm,barMeasure);update.finish()}}
function patchDisplay(cm,updateNumbersFrom,dims){var display=cm.display,lineNumbers=cm.options.lineNumbers;var container=display.lineDiv,cur=container.firstChild;function rm(node){var next=node.nextSibling;if(webkit&&mac&&cm.display.currentWheelTarget==node){node.style.display="none"}else{node.parentNode.removeChild(node)}
return next}
var view=display.view,lineN=display.viewFrom;for(var i=0;i<view.length;i++){var lineView=view[i];if(lineView.hidden);else if(!lineView.node||lineView.node.parentNode!=container){var node=buildLineElement(cm,lineView,lineN,dims);container.insertBefore(node,cur)}else{while(cur!=lineView.node){cur=rm(cur)}
var updateNumber=lineNumbers&&updateNumbersFrom!=null&&updateNumbersFrom<=lineN&&lineView.lineNumber;if(lineView.changes){if(indexOf(lineView.changes,"gutter")>-1){updateNumber=!1}
updateLineForChanges(cm,lineView,lineN,dims)}
if(updateNumber){removeChildren(lineView.lineNumber);lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options,lineN)))}
cur=lineView.node.nextSibling}
lineN+=lineView.size}
while(cur){cur=rm(cur)}}
function updateGutterSpace(display){var width=display.gutters.offsetWidth;display.sizer.style.marginLeft=width+"px";signalLater(display,"gutterChanged",display)}
function setDocumentHeight(cm,measure){cm.display.sizer.style.minHeight=measure.docHeight+"px";cm.display.heightForcer.style.top=measure.docHeight+"px";cm.display.gutters.style.height=(measure.docHeight+cm.display.barHeight+scrollGap(cm))+"px"}
function alignHorizontally(cm){var display=cm.display,view=display.view;if(!display.alignWidgets&&(!display.gutters.firstChild||!cm.options.fixedGutter)){return}
var comp=compensateForHScroll(display)-display.scroller.scrollLeft+cm.doc.scrollLeft;var gutterW=display.gutters.offsetWidth,left=comp+"px";for(var i=0;i<view.length;i++){if(!view[i].hidden){if(cm.options.fixedGutter){if(view[i].gutter){view[i].gutter.style.left=left}
if(view[i].gutterBackground){view[i].gutterBackground.style.left=left}}
var align=view[i].alignable;if(align){for(var j=0;j<align.length;j++){align[j].style.left=left}}}}
if(cm.options.fixedGutter){display.gutters.style.left=(comp+gutterW)+"px"}}
function maybeUpdateLineNumberWidth(cm){if(!cm.options.lineNumbers){return!1}
var doc=cm.doc,last=lineNumberFor(cm.options,doc.first+doc.size-1),display=cm.display;if(last.length!=display.lineNumChars){var test=display.measure.appendChild(elt("div",[elt("div",last)],"CodeMirror-linenumber CodeMirror-gutter-elt"));var innerW=test.firstChild.offsetWidth,padding=test.offsetWidth-innerW;display.lineGutter.style.width="";display.lineNumInnerWidth=Math.max(innerW,display.lineGutter.offsetWidth-padding)+1;display.lineNumWidth=display.lineNumInnerWidth+padding;display.lineNumChars=display.lineNumInnerWidth?last.length:-1;display.lineGutter.style.width=display.lineNumWidth+"px";updateGutterSpace(cm.display);return!0}
return!1}
function getGutters(gutters,lineNumbers){var result=[],sawLineNumbers=!1;for(var i=0;i<gutters.length;i++){var name=gutters[i],style=null;if(typeof name!="string"){style=name.style;name=name.className}
if(name=="CodeMirror-linenumbers"){if(!lineNumbers){continue}else{sawLineNumbers=!0}}
result.push({className:name,style:style})}
if(lineNumbers&&!sawLineNumbers){result.push({className:"CodeMirror-linenumbers",style:null})}
return result}
function renderGutters(display){var gutters=display.gutters,specs=display.gutterSpecs;removeChildren(gutters);display.lineGutter=null;for(var i=0;i<specs.length;++i){var ref=specs[i];var className=ref.className;var style=ref.style;var gElt=gutters.appendChild(elt("div",null,"CodeMirror-gutter "+className));if(style){gElt.style.cssText=style}
if(className=="CodeMirror-linenumbers"){display.lineGutter=gElt;gElt.style.width=(display.lineNumWidth||1)+"px"}}
gutters.style.display=specs.length?"":"none";updateGutterSpace(display)}
function updateGutters(cm){renderGutters(cm.display);regChange(cm);alignHorizontally(cm)}
function Display(place,doc,input,options){var d=this;this.input=input;d.scrollbarFiller=elt("div",null,"CodeMirror-scrollbar-filler");d.scrollbarFiller.setAttribute("cm-not-content","true");d.gutterFiller=elt("div",null,"CodeMirror-gutter-filler");d.gutterFiller.setAttribute("cm-not-content","true");d.lineDiv=eltP("div",null,"CodeMirror-code");d.selectionDiv=elt("div",null,null,"position: relative; z-index: 1");d.cursorDiv=elt("div",null,"CodeMirror-cursors");d.measure=elt("div",null,"CodeMirror-measure");d.lineMeasure=elt("div",null,"CodeMirror-measure");d.lineSpace=eltP("div",[d.measure,d.lineMeasure,d.selectionDiv,d.cursorDiv,d.lineDiv],null,"position: relative; outline: none");var lines=eltP("div",[d.lineSpace],"CodeMirror-lines");d.mover=elt("div",[lines],null,"position: relative");d.sizer=elt("div",[d.mover],"CodeMirror-sizer");d.sizerWidth=null;d.heightForcer=elt("div",null,null,"position: absolute; height: "+scrollerGap+"px; width: 1px;");d.gutters=elt("div",null,"CodeMirror-gutters");d.lineGutter=null;d.scroller=elt("div",[d.sizer,d.heightForcer,d.gutters],"CodeMirror-scroll");d.scroller.setAttribute("tabIndex","-1");d.wrapper=elt("div",[d.scrollbarFiller,d.gutterFiller,d.scroller],"CodeMirror");if(chrome&&chrome_version>=105){d.wrapper.style.clipPath="inset(0px)"}
d.wrapper.setAttribute('translate','no');if(ie&&ie_version<8){d.gutters.style.zIndex=-1;d.scroller.style.paddingRight=0}
if(!webkit&&!(gecko&&mobile)){d.scroller.draggable=!0}
if(place){if(place.appendChild){place.appendChild(d.wrapper)}else{place(d.wrapper)}}
d.viewFrom=d.viewTo=doc.first;d.reportedViewFrom=d.reportedViewTo=doc.first;d.view=[];d.renderedView=null;d.externalMeasured=null;d.viewOffset=0;d.lastWrapHeight=d.lastWrapWidth=0;d.updateLineNumbers=null;d.nativeBarWidth=d.barHeight=d.barWidth=0;d.scrollbarsClipped=!1;d.lineNumWidth=d.lineNumInnerWidth=d.lineNumChars=null;d.alignWidgets=!1;d.cachedCharWidth=d.cachedTextHeight=d.cachedPaddingH=null;d.maxLine=null;d.maxLineLength=0;d.maxLineChanged=!1;d.wheelDX=d.wheelDY=d.wheelStartX=d.wheelStartY=null;d.shift=!1;d.selForContextMenu=null;d.activeTouch=null;d.gutterSpecs=getGutters(options.gutters,options.lineNumbers);renderGutters(d);input.init(d)}
var wheelSamples=0,wheelPixelsPerUnit=null;if(ie){wheelPixelsPerUnit=-.53}else if(gecko){wheelPixelsPerUnit=15}else if(chrome){wheelPixelsPerUnit=-.7}else if(safari){wheelPixelsPerUnit=-1/3}
function wheelEventDelta(e){var dx=e.wheelDeltaX,dy=e.wheelDeltaY;if(dx==null&&e.detail&&e.axis==e.HORIZONTAL_AXIS){dx=e.detail}
if(dy==null&&e.detail&&e.axis==e.VERTICAL_AXIS){dy=e.detail}else if(dy==null){dy=e.wheelDelta}
return{x:dx,y:dy}}
function wheelEventPixels(e){var delta=wheelEventDelta(e);delta.x*=wheelPixelsPerUnit;delta.y*=wheelPixelsPerUnit;return delta}
function onScrollWheel(cm,e){if(chrome&&chrome_version==102){if(cm.display.chromeScrollHack==null){cm.display.sizer.style.pointerEvents="none"}else{clearTimeout(cm.display.chromeScrollHack)}
cm.display.chromeScrollHack=setTimeout(function(){cm.display.chromeScrollHack=null;cm.display.sizer.style.pointerEvents=""},100)}
var delta=wheelEventDelta(e),dx=delta.x,dy=delta.y;var pixelsPerUnit=wheelPixelsPerUnit;if(e.deltaMode===0){dx=e.deltaX;dy=e.deltaY;pixelsPerUnit=1}
var display=cm.display,scroll=display.scroller;var canScrollX=scroll.scrollWidth>scroll.clientWidth;var canScrollY=scroll.scrollHeight>scroll.clientHeight;if(!(dx&&canScrollX||dy&&canScrollY)){return}
if(dy&&mac&&webkit){outer:for(var cur=e.target,view=display.view;cur!=scroll;cur=cur.parentNode){for(var i=0;i<view.length;i++){if(view[i].node==cur){cm.display.currentWheelTarget=cur;break outer}}}}
if(dx&&!gecko&&!presto&&pixelsPerUnit!=null){if(dy&&canScrollY){updateScrollTop(cm,Math.max(0,scroll.scrollTop+dy*pixelsPerUnit))}
setScrollLeft(cm,Math.max(0,scroll.scrollLeft+dx*pixelsPerUnit));if(!dy||(dy&&canScrollY)){e_preventDefault(e)}
display.wheelStartX=null;return}
if(dy&&pixelsPerUnit!=null){var pixels=dy*pixelsPerUnit;var top=cm.doc.scrollTop,bot=top+display.wrapper.clientHeight;if(pixels<0){top=Math.max(0,top+pixels-50)}else{bot=Math.min(cm.doc.height,bot+pixels+50)}
updateDisplaySimple(cm,{top:top,bottom:bot})}
if(wheelSamples<20&&e.deltaMode!==0){if(display.wheelStartX==null){display.wheelStartX=scroll.scrollLeft;display.wheelStartY=scroll.scrollTop;display.wheelDX=dx;display.wheelDY=dy;setTimeout(function(){if(display.wheelStartX==null){return}
var movedX=scroll.scrollLeft-display.wheelStartX;var movedY=scroll.scrollTop-display.wheelStartY;var sample=(movedY&&display.wheelDY&&movedY/display.wheelDY)||(movedX&&display.wheelDX&&movedX/display.wheelDX);display.wheelStartX=display.wheelStartY=null;if(!sample){return}
wheelPixelsPerUnit=(wheelPixelsPerUnit*wheelSamples+sample)/(wheelSamples+1);++wheelSamples},200)}else{display.wheelDX+=dx;display.wheelDY+=dy}}}
var Selection=function(ranges,primIndex){this.ranges=ranges;this.primIndex=primIndex};Selection.prototype.primary=function(){return this.ranges[this.primIndex]};Selection.prototype.equals=function(other){if(other==this){return!0}
if(other.primIndex!=this.primIndex||other.ranges.length!=this.ranges.length){return!1}
for(var i=0;i<this.ranges.length;i++){var here=this.ranges[i],there=other.ranges[i];if(!equalCursorPos(here.anchor,there.anchor)||!equalCursorPos(here.head,there.head)){return!1}}
return!0};Selection.prototype.deepCopy=function(){var out=[];for(var i=0;i<this.ranges.length;i++){out[i]=new Range(copyPos(this.ranges[i].anchor),copyPos(this.ranges[i].head))}
return new Selection(out,this.primIndex)};Selection.prototype.somethingSelected=function(){for(var i=0;i<this.ranges.length;i++){if(!this.ranges[i].empty()){return!0}}
return!1};Selection.prototype.contains=function(pos,end){if(!end){end=pos}
for(var i=0;i<this.ranges.length;i++){var range=this.ranges[i];if(cmp(end,range.from())>=0&&cmp(pos,range.to())<=0){return i}}
return-1};var Range=function(anchor,head){this.anchor=anchor;this.head=head};Range.prototype.from=function(){return minPos(this.anchor,this.head)};Range.prototype.to=function(){return maxPos(this.anchor,this.head)};Range.prototype.empty=function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch};function normalizeSelection(cm,ranges,primIndex){var mayTouch=cm&&cm.options.selectionsMayTouch;var prim=ranges[primIndex];ranges.sort(function(a,b){return cmp(a.from(),b.from())});primIndex=indexOf(ranges,prim);for(var i=1;i<ranges.length;i++){var cur=ranges[i],prev=ranges[i-1];var diff=cmp(prev.to(),cur.from());if(mayTouch&&!cur.empty()?diff>0:diff>=0){var from=minPos(prev.from(),cur.from()),to=maxPos(prev.to(),cur.to());var inv=prev.empty()?cur.from()==cur.head:prev.from()==prev.head;if(i<=primIndex){--primIndex}
ranges.splice(--i,2,new Range(inv?to:from,inv?from:to))}}
return new Selection(ranges,primIndex)}
function simpleSelection(anchor,head){return new Selection([new Range(anchor,head||anchor)],0)}
function changeEnd(change){if(!change.text){return change.to}
return Pos(change.from.line+change.text.length-1,lst(change.text).length+(change.text.length==1?change.from.ch:0))}
function adjustForChange(pos,change){if(cmp(pos,change.from)<0){return pos}
if(cmp(pos,change.to)<=0){return changeEnd(change)}
var line=pos.line+change.text.length-(change.to.line-change.from.line)-1,ch=pos.ch;if(pos.line==change.to.line){ch+=changeEnd(change).ch-change.to.ch}
return Pos(line,ch)}
function computeSelAfterChange(doc,change){var out=[];for(var i=0;i<doc.sel.ranges.length;i++){var range=doc.sel.ranges[i];out.push(new Range(adjustForChange(range.anchor,change),adjustForChange(range.head,change)))}
return normalizeSelection(doc.cm,out,doc.sel.primIndex)}
function offsetPos(pos,old,nw){if(pos.line==old.line){return Pos(nw.line,pos.ch-old.ch+nw.ch)}else{return Pos(nw.line+(pos.line-old.line),pos.ch)}}
function computeReplacedSel(doc,changes,hint){var out=[];var oldPrev=Pos(doc.first,0),newPrev=oldPrev;for(var i=0;i<changes.length;i++){var change=changes[i];var from=offsetPos(change.from,oldPrev,newPrev);var to=offsetPos(changeEnd(change),oldPrev,newPrev);oldPrev=change.to;newPrev=to;if(hint=="around"){var range=doc.sel.ranges[i],inv=cmp(range.head,range.anchor)<0;out[i]=new Range(inv?to:from,inv?from:to)}else{out[i]=new Range(from,from)}}
return new Selection(out,doc.sel.primIndex)}
function loadMode(cm){cm.doc.mode=getMode(cm.options,cm.doc.modeOption);resetModeState(cm)}
function resetModeState(cm){cm.doc.iter(function(line){if(line.stateAfter){line.stateAfter=null}
if(line.styles){line.styles=null}});cm.doc.modeFrontier=cm.doc.highlightFrontier=cm.doc.first;startWorker(cm,100);cm.state.modeGen++;if(cm.curOp){regChange(cm)}}
function isWholeLineUpdate(doc,change){return change.from.ch==0&&change.to.ch==0&&lst(change.text)==""&&(!doc.cm||doc.cm.options.wholeLineUpdateBefore)}
function updateDoc(doc,change,markedSpans,estimateHeight){function spansFor(n){return markedSpans?markedSpans[n]:null}
function update(line,text,spans){updateLine(line,text,spans,estimateHeight);signalLater(line,"change",line,change)}
function linesFor(start,end){var result=[];for(var i=start;i<end;++i){result.push(new Line(text[i],spansFor(i),estimateHeight))}
return result}
var from=change.from,to=change.to,text=change.text;var firstLine=getLine(doc,from.line),lastLine=getLine(doc,to.line);var lastText=lst(text),lastSpans=spansFor(text.length-1),nlines=to.line-from.line;if(change.full){doc.insert(0,linesFor(0,text.length));doc.remove(text.length,doc.size-text.length)}else if(isWholeLineUpdate(doc,change)){var added=linesFor(0,text.length-1);update(lastLine,lastLine.text,lastSpans);if(nlines){doc.remove(from.line,nlines)}
if(added.length){doc.insert(from.line,added)}}else if(firstLine==lastLine){if(text.length==1){update(firstLine,firstLine.text.slice(0,from.ch)+lastText+firstLine.text.slice(to.ch),lastSpans)}else{var added$1=linesFor(1,text.length-1);added$1.push(new Line(lastText+firstLine.text.slice(to.ch),lastSpans,estimateHeight));update(firstLine,firstLine.text.slice(0,from.ch)+text[0],spansFor(0));doc.insert(from.line+1,added$1)}}else if(text.length==1){update(firstLine,firstLine.text.slice(0,from.ch)+text[0]+lastLine.text.slice(to.ch),spansFor(0));doc.remove(from.line+1,nlines)}else{update(firstLine,firstLine.text.slice(0,from.ch)+text[0],spansFor(0));update(lastLine,lastText+lastLine.text.slice(to.ch),lastSpans);var added$2=linesFor(1,text.length-1);if(nlines>1){doc.remove(from.line+1,nlines-1)}
doc.insert(from.line+1,added$2)}
signalLater(doc,"change",doc,change)}
function linkedDocs(doc,f,sharedHistOnly){function propagate(doc,skip,sharedHist){if(doc.linked){for(var i=0;i<doc.linked.length;++i){var rel=doc.linked[i];if(rel.doc==skip){continue}
var shared=sharedHist&&rel.sharedHist;if(sharedHistOnly&&!shared){continue}
f(rel.doc,shared);propagate(rel.doc,doc,shared)}}}
propagate(doc,null,!0)}
function attachDoc(cm,doc){if(doc.cm){throw new Error("This document is already in use.")}
cm.doc=doc;doc.cm=cm;estimateLineHeights(cm);loadMode(cm);setDirectionClass(cm);cm.options.direction=doc.direction;if(!cm.options.lineWrapping){findMaxLine(cm)}
cm.options.mode=doc.modeOption;regChange(cm)}
function setDirectionClass(cm){(cm.doc.direction=="rtl"?addClass:rmClass)(cm.display.lineDiv,"CodeMirror-rtl")}
function directionChanged(cm){runInOp(cm,function(){setDirectionClass(cm);regChange(cm)})}
function History(prev){this.done=[];this.undone=[];this.undoDepth=prev?prev.undoDepth:Infinity;this.lastModTime=this.lastSelTime=0;this.lastOp=this.lastSelOp=null;this.lastOrigin=this.lastSelOrigin=null;this.generation=this.maxGeneration=prev?prev.maxGeneration:1}
function historyChangeFromChange(doc,change){var histChange={from:copyPos(change.from),to:changeEnd(change),text:getBetween(doc,change.from,change.to)};attachLocalSpans(doc,histChange,change.from.line,change.to.line+1);linkedDocs(doc,function(doc){return attachLocalSpans(doc,histChange,change.from.line,change.to.line+1)},!0);return histChange}
function clearSelectionEvents(array){while(array.length){var last=lst(array);if(last.ranges){array.pop()}else{break}}}
function lastChangeEvent(hist,force){if(force){clearSelectionEvents(hist.done);return lst(hist.done)}else if(hist.done.length&&!lst(hist.done).ranges){return lst(hist.done)}else if(hist.done.length>1&&!hist.done[hist.done.length-2].ranges){hist.done.pop();return lst(hist.done)}}
function addChangeToHistory(doc,change,selAfter,opId){var hist=doc.history;hist.undone.length=0;var time=+new Date,cur;var last;if((hist.lastOp==opId||hist.lastOrigin==change.origin&&change.origin&&((change.origin.charAt(0)=="+"&&hist.lastModTime>time-(doc.cm?doc.cm.options.historyEventDelay:500))||change.origin.charAt(0)=="*"))&&(cur=lastChangeEvent(hist,hist.lastOp==opId))){last=lst(cur.changes);if(cmp(change.from,change.to)==0&&cmp(change.from,last.to)==0){last.to=changeEnd(change)}else{cur.changes.push(historyChangeFromChange(doc,change))}}else{var before=lst(hist.done);if(!before||!before.ranges){pushSelectionToHistory(doc.sel,hist.done)}
cur={changes:[historyChangeFromChange(doc,change)],generation:hist.generation};hist.done.push(cur);while(hist.done.length>hist.undoDepth){hist.done.shift();if(!hist.done[0].ranges){hist.done.shift()}}}
hist.done.push(selAfter);hist.generation=++hist.maxGeneration;hist.lastModTime=hist.lastSelTime=time;hist.lastOp=hist.lastSelOp=opId;hist.lastOrigin=hist.lastSelOrigin=change.origin;if(!last){signal(doc,"historyAdded")}}
function selectionEventCanBeMerged(doc,origin,prev,sel){var ch=origin.charAt(0);return ch=="*"||ch=="+"&&prev.ranges.length==sel.ranges.length&&prev.somethingSelected()==sel.somethingSelected()&&new Date-doc.history.lastSelTime<=(doc.cm?doc.cm.options.historyEventDelay:500)}
function addSelectionToHistory(doc,sel,opId,options){var hist=doc.history,origin=options&&options.origin;if(opId==hist.lastSelOp||(origin&&hist.lastSelOrigin==origin&&(hist.lastModTime==hist.lastSelTime&&hist.lastOrigin==origin||selectionEventCanBeMerged(doc,origin,lst(hist.done),sel)))){hist.done[hist.done.length-1]=sel}else{pushSelectionToHistory(sel,hist.done)}
hist.lastSelTime=+new Date;hist.lastSelOrigin=origin;hist.lastSelOp=opId;if(options&&options.clearRedo!==!1){clearSelectionEvents(hist.undone)}}
function pushSelectionToHistory(sel,dest){var top=lst(dest);if(!(top&&top.ranges&&top.equals(sel))){dest.push(sel)}}
function attachLocalSpans(doc,change,from,to){var existing=change["spans_"+doc.id],n=0;doc.iter(Math.max(doc.first,from),Math.min(doc.first+doc.size,to),function(line){if(line.markedSpans){(existing||(existing=change["spans_"+doc.id]={}))[n]=line.markedSpans}
++n})}
function removeClearedSpans(spans){if(!spans){return null}
var out;for(var i=0;i<spans.length;++i){if(spans[i].marker.explicitlyCleared){if(!out){out=spans.slice(0,i)}}else if(out){out.push(spans[i])}}
return!out?spans:out.length?out:null}
function getOldSpans(doc,change){var found=change["spans_"+doc.id];if(!found){return null}
var nw=[];for(var i=0;i<change.text.length;++i){nw.push(removeClearedSpans(found[i]))}
return nw}
function mergeOldSpans(doc,change){var old=getOldSpans(doc,change);var stretched=stretchSpansOverChange(doc,change);if(!old){return stretched}
if(!stretched){return old}
for(var i=0;i<old.length;++i){var oldCur=old[i],stretchCur=stretched[i];if(oldCur&&stretchCur){spans:for(var j=0;j<stretchCur.length;++j){var span=stretchCur[j];for(var k=0;k<oldCur.length;++k){if(oldCur[k].marker==span.marker){continue spans}}
oldCur.push(span)}}else if(stretchCur){old[i]=stretchCur}}
return old}
function copyHistoryArray(events,newGroup,instantiateSel){var copy=[];for(var i=0;i<events.length;++i){var event=events[i];if(event.ranges){copy.push(instantiateSel?Selection.prototype.deepCopy.call(event):event);continue}
var changes=event.changes,newChanges=[];copy.push({changes:newChanges});for(var j=0;j<changes.length;++j){var change=changes[j],m=(void 0);newChanges.push({from:change.from,to:change.to,text:change.text});if(newGroup){for(var prop in change){if(m=prop.match(/^spans_(\d+)$/)){if(indexOf(newGroup,Number(m[1]))>-1){lst(newChanges)[prop]=change[prop];delete change[prop]}}}}}}
return copy}
function extendRange(range,head,other,extend){if(extend){var anchor=range.anchor;if(other){var posBefore=cmp(head,anchor)<0;if(posBefore!=(cmp(other,anchor)<0)){anchor=head;head=other}else if(posBefore!=(cmp(head,other)<0)){head=other}}
return new Range(anchor,head)}else{return new Range(other||head,head)}}
function extendSelection(doc,head,other,options,extend){if(extend==null){extend=doc.cm&&(doc.cm.display.shift||doc.extend)}
setSelection(doc,new Selection([extendRange(doc.sel.primary(),head,other,extend)],0),options)}
function extendSelections(doc,heads,options){var out=[];var extend=doc.cm&&(doc.cm.display.shift||doc.extend);for(var i=0;i<doc.sel.ranges.length;i++){out[i]=extendRange(doc.sel.ranges[i],heads[i],null,extend)}
var newSel=normalizeSelection(doc.cm,out,doc.sel.primIndex);setSelection(doc,newSel,options)}
function replaceOneSelection(doc,i,range,options){var ranges=doc.sel.ranges.slice(0);ranges[i]=range;setSelection(doc,normalizeSelection(doc.cm,ranges,doc.sel.primIndex),options)}
function setSimpleSelection(doc,anchor,head,options){setSelection(doc,simpleSelection(anchor,head),options)}
function filterSelectionChange(doc,sel,options){var obj={ranges:sel.ranges,update:function(ranges){this.ranges=[];for(var i=0;i<ranges.length;i++){this.ranges[i]=new Range(clipPos(doc,ranges[i].anchor),clipPos(doc,ranges[i].head))}},origin:options&&options.origin};signal(doc,"beforeSelectionChange",doc,obj);if(doc.cm){signal(doc.cm,"beforeSelectionChange",doc.cm,obj)}
if(obj.ranges!=sel.ranges){return normalizeSelection(doc.cm,obj.ranges,obj.ranges.length-1)}else{return sel}}
function setSelectionReplaceHistory(doc,sel,options){var done=doc.history.done,last=lst(done);if(last&&last.ranges){done[done.length-1]=sel;setSelectionNoUndo(doc,sel,options)}else{setSelection(doc,sel,options)}}
function setSelection(doc,sel,options){setSelectionNoUndo(doc,sel,options);addSelectionToHistory(doc,doc.sel,doc.cm?doc.cm.curOp.id:NaN,options)}
function setSelectionNoUndo(doc,sel,options){if(hasHandler(doc,"beforeSelectionChange")||doc.cm&&hasHandler(doc.cm,"beforeSelectionChange")){sel=filterSelectionChange(doc,sel,options)}
var bias=options&&options.bias||(cmp(sel.primary().head,doc.sel.primary().head)<0?-1:1);setSelectionInner(doc,skipAtomicInSelection(doc,sel,bias,!0));if(!(options&&options.scroll===!1)&&doc.cm&&doc.cm.getOption("readOnly")!="nocursor"){ensureCursorVisible(doc.cm)}}
function setSelectionInner(doc,sel){if(sel.equals(doc.sel)){return}
doc.sel=sel;if(doc.cm){doc.cm.curOp.updateInput=1;doc.cm.curOp.selectionChanged=!0;signalCursorActivity(doc.cm)}
signalLater(doc,"cursorActivity",doc)}
function reCheckSelection(doc){setSelectionInner(doc,skipAtomicInSelection(doc,doc.sel,null,!1))}
function skipAtomicInSelection(doc,sel,bias,mayClear){var out;for(var i=0;i<sel.ranges.length;i++){var range=sel.ranges[i];var old=sel.ranges.length==doc.sel.ranges.length&&doc.sel.ranges[i];var newAnchor=skipAtomic(doc,range.anchor,old&&old.anchor,bias,mayClear);var newHead=range.head==range.anchor?newAnchor:skipAtomic(doc,range.head,old&&old.head,bias,mayClear);if(out||newAnchor!=range.anchor||newHead!=range.head){if(!out){out=sel.ranges.slice(0,i)}
out[i]=new Range(newAnchor,newHead)}}
return out?normalizeSelection(doc.cm,out,sel.primIndex):sel}
function skipAtomicInner(doc,pos,oldPos,dir,mayClear){var line=getLine(doc,pos.line);if(line.markedSpans){for(var i=0;i<line.markedSpans.length;++i){var sp=line.markedSpans[i],m=sp.marker;var preventCursorLeft=("selectLeft" in m)?!m.selectLeft:m.inclusiveLeft;var preventCursorRight=("selectRight" in m)?!m.selectRight:m.inclusiveRight;if((sp.from==null||(preventCursorLeft?sp.from<=pos.ch:sp.from<pos.ch))&&(sp.to==null||(preventCursorRight?sp.to>=pos.ch:sp.to>pos.ch))){if(mayClear){signal(m,"beforeCursorEnter");if(m.explicitlyCleared){if(!line.markedSpans){break}else{--i;continue}}}
if(!m.atomic){continue}
if(oldPos){var near=m.find(dir<0?1:-1),diff=(void 0);if(dir<0?preventCursorRight:preventCursorLeft){near=movePos(doc,near,-dir,near&&near.line==pos.line?line:null)}
if(near&&near.line==pos.line&&(diff=cmp(near,oldPos))&&(dir<0?diff<0:diff>0)){return skipAtomicInner(doc,near,pos,dir,mayClear)}}
var far=m.find(dir<0?-1:1);if(dir<0?preventCursorLeft:preventCursorRight){far=movePos(doc,far,dir,far.line==pos.line?line:null)}
return far?skipAtomicInner(doc,far,pos,dir,mayClear):null}}}
return pos}
function skipAtomic(doc,pos,oldPos,bias,mayClear){var dir=bias||1;var found=skipAtomicInner(doc,pos,oldPos,dir,mayClear)||(!mayClear&&skipAtomicInner(doc,pos,oldPos,dir,!0))||skipAtomicInner(doc,pos,oldPos,-dir,mayClear)||(!mayClear&&skipAtomicInner(doc,pos,oldPos,-dir,!0));if(!found){doc.cantEdit=!0;return Pos(doc.first,0)}
return found}
function movePos(doc,pos,dir,line){if(dir<0&&pos.ch==0){if(pos.line>doc.first){return clipPos(doc,Pos(pos.line-1))}else{return null}}else if(dir>0&&pos.ch==(line||getLine(doc,pos.line)).text.length){if(pos.line<doc.first+doc.size-1){return Pos(pos.line+1,0)}else{return null}}else{return new Pos(pos.line,pos.ch+dir)}}
function selectAll(cm){cm.setSelection(Pos(cm.firstLine(),0),Pos(cm.lastLine()),sel_dontScroll)}
function filterChange(doc,change,update){var obj={canceled:!1,from:change.from,to:change.to,text:change.text,origin:change.origin,cancel:function(){return obj.canceled=!0}};if(update){obj.update=function(from,to,text,origin){if(from){obj.from=clipPos(doc,from)}
if(to){obj.to=clipPos(doc,to)}
if(text){obj.text=text}
if(origin!==undefined){obj.origin=origin}}}
signal(doc,"beforeChange",doc,obj);if(doc.cm){signal(doc.cm,"beforeChange",doc.cm,obj)}
if(obj.canceled){if(doc.cm){doc.cm.curOp.updateInput=2}
return null}
return{from:obj.from,to:obj.to,text:obj.text,origin:obj.origin}}
function makeChange(doc,change,ignoreReadOnly){if(doc.cm){if(!doc.cm.curOp){return operation(doc.cm,makeChange)(doc,change,ignoreReadOnly)}
if(doc.cm.state.suppressEdits){return}}
if(hasHandler(doc,"beforeChange")||doc.cm&&hasHandler(doc.cm,"beforeChange")){change=filterChange(doc,change,!0);if(!change){return}}
var split=sawReadOnlySpans&&!ignoreReadOnly&&removeReadOnlyRanges(doc,change.from,change.to);if(split){for(var i=split.length-1;i>=0;--i){makeChangeInner(doc,{from:split[i].from,to:split[i].to,text:i?[""]:change.text,origin:change.origin})}}else{makeChangeInner(doc,change)}}
function makeChangeInner(doc,change){if(change.text.length==1&&change.text[0]==""&&cmp(change.from,change.to)==0){return}
var selAfter=computeSelAfterChange(doc,change);addChangeToHistory(doc,change,selAfter,doc.cm?doc.cm.curOp.id:NaN);makeChangeSingleDoc(doc,change,selAfter,stretchSpansOverChange(doc,change));var rebased=[];linkedDocs(doc,function(doc,sharedHist){if(!sharedHist&&indexOf(rebased,doc.history)==-1){rebaseHist(doc.history,change);rebased.push(doc.history)}
makeChangeSingleDoc(doc,change,null,stretchSpansOverChange(doc,change))})}
function makeChangeFromHistory(doc,type,allowSelectionOnly){var suppress=doc.cm&&doc.cm.state.suppressEdits;if(suppress&&!allowSelectionOnly){return}
var hist=doc.history,event,selAfter=doc.sel;var source=type=="undo"?hist.done:hist.undone,dest=type=="undo"?hist.undone:hist.done;var i=0;for(;i<source.length;i++){event=source[i];if(allowSelectionOnly?event.ranges&&!event.equals(doc.sel):!event.ranges){break}}
if(i==source.length){return}
hist.lastOrigin=hist.lastSelOrigin=null;for(;;){event=source.pop();if(event.ranges){pushSelectionToHistory(event,dest);if(allowSelectionOnly&&!event.equals(doc.sel)){setSelection(doc,event,{clearRedo:!1});return}
selAfter=event}else if(suppress){source.push(event);return}else{break}}
var antiChanges=[];pushSelectionToHistory(selAfter,dest);dest.push({changes:antiChanges,generation:hist.generation});hist.generation=event.generation||++hist.maxGeneration;var filter=hasHandler(doc,"beforeChange")||doc.cm&&hasHandler(doc.cm,"beforeChange");var loop=function(i){var change=event.changes[i];change.origin=type;if(filter&&!filterChange(doc,change,!1)){source.length=0;return{}}
antiChanges.push(historyChangeFromChange(doc,change));var after=i?computeSelAfterChange(doc,change):lst(source);makeChangeSingleDoc(doc,change,after,mergeOldSpans(doc,change));if(!i&&doc.cm){doc.cm.scrollIntoView({from:change.from,to:changeEnd(change)})}
var rebased=[];linkedDocs(doc,function(doc,sharedHist){if(!sharedHist&&indexOf(rebased,doc.history)==-1){rebaseHist(doc.history,change);rebased.push(doc.history)}
makeChangeSingleDoc(doc,change,null,mergeOldSpans(doc,change))})};for(var i$1=event.changes.length-1;i$1>=0;--i$1){var returned=loop(i$1);if(returned)return returned.v}}
function shiftDoc(doc,distance){if(distance==0){return}
doc.first+=distance;doc.sel=new Selection(map(doc.sel.ranges,function(range){return new Range(Pos(range.anchor.line+distance,range.anchor.ch),Pos(range.head.line+distance,range.head.ch))}),doc.sel.primIndex);if(doc.cm){regChange(doc.cm,doc.first,doc.first-distance,distance);for(var d=doc.cm.display,l=d.viewFrom;l<d.viewTo;l++){regLineChange(doc.cm,l,"gutter")}}}
function makeChangeSingleDoc(doc,change,selAfter,spans){if(doc.cm&&!doc.cm.curOp){return operation(doc.cm,makeChangeSingleDoc)(doc,change,selAfter,spans)}
if(change.to.line<doc.first){shiftDoc(doc,change.text.length-1-(change.to.line-change.from.line));return}
if(change.from.line>doc.lastLine()){return}
if(change.from.line<doc.first){var shift=change.text.length-1-(doc.first-change.from.line);shiftDoc(doc,shift);change={from:Pos(doc.first,0),to:Pos(change.to.line+shift,change.to.ch),text:[lst(change.text)],origin:change.origin}}
var last=doc.lastLine();if(change.to.line>last){change={from:change.from,to:Pos(last,getLine(doc,last).text.length),text:[change.text[0]],origin:change.origin}}
change.removed=getBetween(doc,change.from,change.to);if(!selAfter){selAfter=computeSelAfterChange(doc,change)}
if(doc.cm){makeChangeSingleDocInEditor(doc.cm,change,spans)}else{updateDoc(doc,change,spans)}
setSelectionNoUndo(doc,selAfter,sel_dontScroll);if(doc.cantEdit&&skipAtomic(doc,Pos(doc.firstLine(),0))){doc.cantEdit=!1}}
function makeChangeSingleDocInEditor(cm,change,spans){var doc=cm.doc,display=cm.display,from=change.from,to=change.to;var recomputeMaxLength=!1,checkWidthStart=from.line;if(!cm.options.lineWrapping){checkWidthStart=lineNo(visualLine(getLine(doc,from.line)));doc.iter(checkWidthStart,to.line+1,function(line){if(line==display.maxLine){recomputeMaxLength=!0;return!0}})}
if(doc.sel.contains(change.from,change.to)>-1){signalCursorActivity(cm)}
updateDoc(doc,change,spans,estimateHeight(cm));if(!cm.options.lineWrapping){doc.iter(checkWidthStart,from.line+change.text.length,function(line){var len=lineLength(line);if(len>display.maxLineLength){display.maxLine=line;display.maxLineLength=len;display.maxLineChanged=!0;recomputeMaxLength=!1}});if(recomputeMaxLength){cm.curOp.updateMaxLine=!0}}
retreatFrontier(doc,from.line);startWorker(cm,400);var lendiff=change.text.length-(to.line-from.line)-1;if(change.full){regChange(cm)}else if(from.line==to.line&&change.text.length==1&&!isWholeLineUpdate(cm.doc,change)){regLineChange(cm,from.line,"text")}else{regChange(cm,from.line,to.line+1,lendiff)}
var changesHandler=hasHandler(cm,"changes"),changeHandler=hasHandler(cm,"change");if(changeHandler||changesHandler){var obj={from:from,to:to,text:change.text,removed:change.removed,origin:change.origin};if(changeHandler){signalLater(cm,"change",cm,obj)}
if(changesHandler){(cm.curOp.changeObjs||(cm.curOp.changeObjs=[])).push(obj)}}
cm.display.selForContextMenu=null}
function replaceRange(doc,code,from,to,origin){var assign;if(!to){to=from}
if(cmp(to,from)<0){(assign=[to,from],from=assign[0],to=assign[1])}
if(typeof code=="string"){code=doc.splitLines(code)}
makeChange(doc,{from:from,to:to,text:code,origin:origin})}
function rebaseHistSelSingle(pos,from,to,diff){if(to<pos.line){pos.line+=diff}else if(from<pos.line){pos.line=from;pos.ch=0}}
function rebaseHistArray(array,from,to,diff){for(var i=0;i<array.length;++i){var sub=array[i],ok=!0;if(sub.ranges){if(!sub.copied){sub=array[i]=sub.deepCopy();sub.copied=!0}
for(var j=0;j<sub.ranges.length;j++){rebaseHistSelSingle(sub.ranges[j].anchor,from,to,diff);rebaseHistSelSingle(sub.ranges[j].head,from,to,diff)}
continue}
for(var j$1=0;j$1<sub.changes.length;++j$1){var cur=sub.changes[j$1];if(to<cur.from.line){cur.from=Pos(cur.from.line+diff,cur.from.ch);cur.to=Pos(cur.to.line+diff,cur.to.ch)}else if(from<=cur.to.line){ok=!1;break}}
if(!ok){array.splice(0,i+1);i=0}}}
function rebaseHist(hist,change){var from=change.from.line,to=change.to.line,diff=change.text.length-(to-from)-1;rebaseHistArray(hist.done,from,to,diff);rebaseHistArray(hist.undone,from,to,diff)}
function changeLine(doc,handle,changeType,op){var no=handle,line=handle;if(typeof handle=="number"){line=getLine(doc,clipLine(doc,handle))}else{no=lineNo(handle)}
if(no==null){return null}
if(op(line,no)&&doc.cm){regLineChange(doc.cm,no,changeType)}
return line}
function LeafChunk(lines){this.lines=lines;this.parent=null;var height=0;for(var i=0;i<lines.length;++i){lines[i].parent=this;height+=lines[i].height}
this.height=height}
LeafChunk.prototype={chunkSize:function(){return this.lines.length},removeInner:function(at,n){for(var i=at,e=at+n;i<e;++i){var line=this.lines[i];this.height-=line.height;cleanUpLine(line);signalLater(line,"delete")}
this.lines.splice(at,n)},collapse:function(lines){lines.push.apply(lines,this.lines)},insertInner:function(at,lines,height){this.height+=height;this.lines=this.lines.slice(0,at).concat(lines).concat(this.lines.slice(at));for(var i=0;i<lines.length;++i){lines[i].parent=this}},iterN:function(at,n,op){for(var e=at+n;at<e;++at){if(op(this.lines[at])){return!0}}}};function BranchChunk(children){this.children=children;var size=0,height=0;for(var i=0;i<children.length;++i){var ch=children[i];size+=ch.chunkSize();height+=ch.height;ch.parent=this}
this.size=size;this.height=height;this.parent=null}
BranchChunk.prototype={chunkSize:function(){return this.size},removeInner:function(at,n){this.size-=n;for(var i=0;i<this.children.length;++i){var child=this.children[i],sz=child.chunkSize();if(at<sz){var rm=Math.min(n,sz-at),oldHeight=child.height;child.removeInner(at,rm);this.height-=oldHeight-child.height;if(sz==rm){this.children.splice(i--,1);child.parent=null}
if((n-=rm)==0){break}
at=0}else{at-=sz}}
if(this.size-n<25&&(this.children.length>1||!(this.children[0]instanceof LeafChunk))){var lines=[];this.collapse(lines);this.children=[new LeafChunk(lines)];this.children[0].parent=this}},collapse:function(lines){for(var i=0;i<this.children.length;++i){this.children[i].collapse(lines)}},insertInner:function(at,lines,height){this.size+=lines.length;this.height+=height;for(var i=0;i<this.children.length;++i){var child=this.children[i],sz=child.chunkSize();if(at<=sz){child.insertInner(at,lines,height);if(child.lines&&child.lines.length>50){var remaining=child.lines.length%25+25;for(var pos=remaining;pos<child.lines.length;){var leaf=new LeafChunk(child.lines.slice(pos,pos+=25));child.height-=leaf.height;this.children.splice(++i,0,leaf);leaf.parent=this}
child.lines=child.lines.slice(0,remaining);this.maybeSpill()}
break}
at-=sz}},maybeSpill:function(){if(this.children.length<=10){return}
var me=this;do{var spilled=me.children.splice(me.children.length-5,5);var sibling=new BranchChunk(spilled);if(!me.parent){var copy=new BranchChunk(me.children);copy.parent=me;me.children=[copy,sibling];me=copy}else{me.size-=sibling.size;me.height-=sibling.height;var myIndex=indexOf(me.parent.children,me);me.parent.children.splice(myIndex+1,0,sibling)}
sibling.parent=me.parent}while(me.children.length>10)
me.parent.maybeSpill();},iterN:function(at,n,op){for(var i=0;i<this.children.length;++i){var child=this.children[i],sz=child.chunkSize();if(at<sz){var used=Math.min(n,sz-at);if(child.iterN(at,used,op)){return!0}
if((n-=used)==0){break}
at=0}else{at-=sz}}}};var LineWidget=function(doc,node,options){if(options){for(var opt in options){if(options.hasOwnProperty(opt)){this[opt]=options[opt]}}}
this.doc=doc;this.node=node};LineWidget.prototype.clear=function(){var cm=this.doc.cm,ws=this.line.widgets,line=this.line,no=lineNo(line);if(no==null||!ws){return}
for(var i=0;i<ws.length;++i){if(ws[i]==this){ws.splice(i--,1)}}
if(!ws.length){line.widgets=null}
var height=widgetHeight(this);updateLineHeight(line,Math.max(0,line.height-height));if(cm){runInOp(cm,function(){adjustScrollWhenAboveVisible(cm,line,-height);regLineChange(cm,no,"widget")});signalLater(cm,"lineWidgetCleared",cm,this,no)}};LineWidget.prototype.changed=function(){var this$1=this;var oldH=this.height,cm=this.doc.cm,line=this.line;this.height=null;var diff=widgetHeight(this)-oldH;if(!diff){return}
if(!lineIsHidden(this.doc,line)){updateLineHeight(line,line.height+diff)}
if(cm){runInOp(cm,function(){cm.curOp.forceUpdate=!0;adjustScrollWhenAboveVisible(cm,line,diff);signalLater(cm,"lineWidgetChanged",cm,this$1,lineNo(line))})}};eventMixin(LineWidget);function adjustScrollWhenAboveVisible(cm,line,diff){if(heightAtLine(line)<((cm.curOp&&cm.curOp.scrollTop)||cm.doc.scrollTop)){addToScrollTop(cm,diff)}}
function addLineWidget(doc,handle,node,options){var widget=new LineWidget(doc,node,options);var cm=doc.cm;if(cm&&widget.noHScroll){cm.display.alignWidgets=!0}
changeLine(doc,handle,"widget",function(line){var widgets=line.widgets||(line.widgets=[]);if(widget.insertAt==null){widgets.push(widget)}else{widgets.splice(Math.min(widgets.length,Math.max(0,widget.insertAt)),0,widget)}
widget.line=line;if(cm&&!lineIsHidden(doc,line)){var aboveVisible=heightAtLine(line)<doc.scrollTop;updateLineHeight(line,line.height+widgetHeight(widget));if(aboveVisible){addToScrollTop(cm,widget.height)}
cm.curOp.forceUpdate=!0}
return!0});if(cm){signalLater(cm,"lineWidgetAdded",cm,widget,typeof handle=="number"?handle:lineNo(handle))}
return widget}
var nextMarkerId=0;var TextMarker=function(doc,type){this.lines=[];this.type=type;this.doc=doc;this.id=++nextMarkerId};TextMarker.prototype.clear=function(){if(this.explicitlyCleared){return}
var cm=this.doc.cm,withOp=cm&&!cm.curOp;if(withOp){startOperation(cm)}
if(hasHandler(this,"clear")){var found=this.find();if(found){signalLater(this,"clear",found.from,found.to)}}
var min=null,max=null;for(var i=0;i<this.lines.length;++i){var line=this.lines[i];var span=getMarkedSpanFor(line.markedSpans,this);if(cm&&!this.collapsed){regLineChange(cm,lineNo(line),"text")}else if(cm){if(span.to!=null){max=lineNo(line)}
if(span.from!=null){min=lineNo(line)}}
line.markedSpans=removeMarkedSpan(line.markedSpans,span);if(span.from==null&&this.collapsed&&!lineIsHidden(this.doc,line)&&cm){updateLineHeight(line,textHeight(cm.display))}}
if(cm&&this.collapsed&&!cm.options.lineWrapping){for(var i$1=0;i$1<this.lines.length;++i$1){var visual=visualLine(this.lines[i$1]),len=lineLength(visual);if(len>cm.display.maxLineLength){cm.display.maxLine=visual;cm.display.maxLineLength=len;cm.display.maxLineChanged=!0}}}
if(min!=null&&cm&&this.collapsed){regChange(cm,min,max+1)}
this.lines.length=0;this.explicitlyCleared=!0;if(this.atomic&&this.doc.cantEdit){this.doc.cantEdit=!1;if(cm){reCheckSelection(cm.doc)}}
if(cm){signalLater(cm,"markerCleared",cm,this,min,max)}
if(withOp){endOperation(cm)}
if(this.parent){this.parent.clear()}};TextMarker.prototype.find=function(side,lineObj){if(side==null&&this.type=="bookmark"){side=1}
var from,to;for(var i=0;i<this.lines.length;++i){var line=this.lines[i];var span=getMarkedSpanFor(line.markedSpans,this);if(span.from!=null){from=Pos(lineObj?line:lineNo(line),span.from);if(side==-1){return from}}
if(span.to!=null){to=Pos(lineObj?line:lineNo(line),span.to);if(side==1){return to}}}
return from&&{from:from,to:to}};TextMarker.prototype.changed=function(){var this$1=this;var pos=this.find(-1,!0),widget=this,cm=this.doc.cm;if(!pos||!cm){return}
runInOp(cm,function(){var line=pos.line,lineN=lineNo(pos.line);var view=findViewForLine(cm,lineN);if(view){clearLineMeasurementCacheFor(view);cm.curOp.selectionChanged=cm.curOp.forceUpdate=!0}
cm.curOp.updateMaxLine=!0;if(!lineIsHidden(widget.doc,line)&&widget.height!=null){var oldHeight=widget.height;widget.height=null;var dHeight=widgetHeight(widget)-oldHeight;if(dHeight){updateLineHeight(line,line.height+dHeight)}}
signalLater(cm,"markerChanged",cm,this$1)})};TextMarker.prototype.attachLine=function(line){if(!this.lines.length&&this.doc.cm){var op=this.doc.cm.curOp;if(!op.maybeHiddenMarkers||indexOf(op.maybeHiddenMarkers,this)==-1){(op.maybeUnhiddenMarkers||(op.maybeUnhiddenMarkers=[])).push(this)}}
this.lines.push(line)};TextMarker.prototype.detachLine=function(line){this.lines.splice(indexOf(this.lines,line),1);if(!this.lines.length&&this.doc.cm){var op=this.doc.cm.curOp;(op.maybeHiddenMarkers||(op.maybeHiddenMarkers=[])).push(this)}};eventMixin(TextMarker);function markText(doc,from,to,options,type){if(options&&options.shared){return markTextShared(doc,from,to,options,type)}
if(doc.cm&&!doc.cm.curOp){return operation(doc.cm,markText)(doc,from,to,options,type)}
var marker=new TextMarker(doc,type),diff=cmp(from,to);if(options){copyObj(options,marker,!1)}
if(diff>0||diff==0&&marker.clearWhenEmpty!==!1){return marker}
if(marker.replacedWith){marker.collapsed=!0;marker.widgetNode=eltP("span",[marker.replacedWith],"CodeMirror-widget");if(!options.handleMouseEvents){marker.widgetNode.setAttribute("cm-ignore-events","true")}
if(options.insertLeft){marker.widgetNode.insertLeft=!0}}
if(marker.collapsed){if(conflictingCollapsedRange(doc,from.line,from,to,marker)||from.line!=to.line&&conflictingCollapsedRange(doc,to.line,from,to,marker)){throw new Error("Inserting collapsed marker partially overlapping an existing one")}
seeCollapsedSpans()}
if(marker.addToHistory){addChangeToHistory(doc,{from:from,to:to,origin:"markText"},doc.sel,NaN)}
var curLine=from.line,cm=doc.cm,updateMaxLine;doc.iter(curLine,to.line+1,function(line){if(cm&&marker.collapsed&&!cm.options.lineWrapping&&visualLine(line)==cm.display.maxLine){updateMaxLine=!0}
if(marker.collapsed&&curLine!=from.line){updateLineHeight(line,0)}
addMarkedSpan(line,new MarkedSpan(marker,curLine==from.line?from.ch:null,curLine==to.line?to.ch:null),doc.cm&&doc.cm.curOp);++curLine});if(marker.collapsed){doc.iter(from.line,to.line+1,function(line){if(lineIsHidden(doc,line)){updateLineHeight(line,0)}})}
if(marker.clearOnEnter){on(marker,"beforeCursorEnter",function(){return marker.clear()})}
if(marker.readOnly){seeReadOnlySpans();if(doc.history.done.length||doc.history.undone.length){doc.clearHistory()}}
if(marker.collapsed){marker.id=++nextMarkerId;marker.atomic=!0}
if(cm){if(updateMaxLine){cm.curOp.updateMaxLine=!0}
if(marker.collapsed){regChange(cm,from.line,to.line+1)}else if(marker.className||marker.startStyle||marker.endStyle||marker.css||marker.attributes||marker.title){for(var i=from.line;i<=to.line;i++){regLineChange(cm,i,"text")}}
if(marker.atomic){reCheckSelection(cm.doc)}
signalLater(cm,"markerAdded",cm,marker)}
return marker}
var SharedTextMarker=function(markers,primary){this.markers=markers;this.primary=primary;for(var i=0;i<markers.length;++i){markers[i].parent=this}};SharedTextMarker.prototype.clear=function(){if(this.explicitlyCleared){return}
this.explicitlyCleared=!0;for(var i=0;i<this.markers.length;++i){this.markers[i].clear()}
signalLater(this,"clear")};SharedTextMarker.prototype.find=function(side,lineObj){return this.primary.find(side,lineObj)};eventMixin(SharedTextMarker);function markTextShared(doc,from,to,options,type){options=copyObj(options);options.shared=!1;var markers=[markText(doc,from,to,options,type)],primary=markers[0];var widget=options.widgetNode;linkedDocs(doc,function(doc){if(widget){options.widgetNode=widget.cloneNode(!0)}
markers.push(markText(doc,clipPos(doc,from),clipPos(doc,to),options,type));for(var i=0;i<doc.linked.length;++i){if(doc.linked[i].isParent){return}}
primary=lst(markers)});return new SharedTextMarker(markers,primary)}
function findSharedMarkers(doc){return doc.findMarks(Pos(doc.first,0),doc.clipPos(Pos(doc.lastLine())),function(m){return m.parent})}
function copySharedMarkers(doc,markers){for(var i=0;i<markers.length;i++){var marker=markers[i],pos=marker.find();var mFrom=doc.clipPos(pos.from),mTo=doc.clipPos(pos.to);if(cmp(mFrom,mTo)){var subMark=markText(doc,mFrom,mTo,marker.primary,marker.primary.type);marker.markers.push(subMark);subMark.parent=marker}}}
function detachSharedMarkers(markers){var loop=function(i){var marker=markers[i],linked=[marker.primary.doc];linkedDocs(marker.primary.doc,function(d){return linked.push(d)});for(var j=0;j<marker.markers.length;j++){var subMarker=marker.markers[j];if(indexOf(linked,subMarker.doc)==-1){subMarker.parent=null;marker.markers.splice(j--,1)}}};for(var i=0;i<markers.length;i++)loop(i);}
var nextDocId=0;var Doc=function(text,mode,firstLine,lineSep,direction){if(!(this instanceof Doc)){return new Doc(text,mode,firstLine,lineSep,direction)}
if(firstLine==null){firstLine=0}
BranchChunk.call(this,[new LeafChunk([new Line("",null)])]);this.first=firstLine;this.scrollTop=this.scrollLeft=0;this.cantEdit=!1;this.cleanGeneration=1;this.modeFrontier=this.highlightFrontier=firstLine;var start=Pos(firstLine,0);this.sel=simpleSelection(start);this.history=new History(null);this.id=++nextDocId;this.modeOption=mode;this.lineSep=lineSep;this.direction=(direction=="rtl")?"rtl":"ltr";this.extend=!1;if(typeof text=="string"){text=this.splitLines(text)}
updateDoc(this,{from:start,to:start,text:text});setSelection(this,simpleSelection(start),sel_dontScroll)};Doc.prototype=createObj(BranchChunk.prototype,{constructor:Doc,iter:function(from,to,op){if(op){this.iterN(from-this.first,to-from,op)}else{this.iterN(this.first,this.first+this.size,from)}},insert:function(at,lines){var height=0;for(var i=0;i<lines.length;++i){height+=lines[i].height}
this.insertInner(at-this.first,lines,height)},remove:function(at,n){this.removeInner(at-this.first,n)},getValue:function(lineSep){var lines=getLines(this,this.first,this.first+this.size);if(lineSep===!1){return lines}
return lines.join(lineSep||this.lineSeparator())},setValue:docMethodOp(function(code){var top=Pos(this.first,0),last=this.first+this.size-1;makeChange(this,{from:top,to:Pos(last,getLine(this,last).text.length),text:this.splitLines(code),origin:"setValue",full:!0},!0);if(this.cm){scrollToCoords(this.cm,0,0)}
setSelection(this,simpleSelection(top),sel_dontScroll)}),replaceRange:function(code,from,to,origin){from=clipPos(this,from);to=to?clipPos(this,to):from;replaceRange(this,code,from,to,origin)},getRange:function(from,to,lineSep){var lines=getBetween(this,clipPos(this,from),clipPos(this,to));if(lineSep===!1){return lines}
if(lineSep===''){return lines.join('')}
return lines.join(lineSep||this.lineSeparator())},getLine:function(line){var l=this.getLineHandle(line);return l&&l.text},getLineHandle:function(line){if(isLine(this,line)){return getLine(this,line)}},getLineNumber:function(line){return lineNo(line)},getLineHandleVisualStart:function(line){if(typeof line=="number"){line=getLine(this,line)}
return visualLine(line)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(pos){return clipPos(this,pos)},getCursor:function(start){var range=this.sel.primary(),pos;if(start==null||start=="head"){pos=range.head}else if(start=="anchor"){pos=range.anchor}else if(start=="end"||start=="to"||start===!1){pos=range.to()}else{pos=range.from()}
return pos},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:docMethodOp(function(line,ch,options){setSimpleSelection(this,clipPos(this,typeof line=="number"?Pos(line,ch||0):line),null,options)}),setSelection:docMethodOp(function(anchor,head,options){setSimpleSelection(this,clipPos(this,anchor),clipPos(this,head||anchor),options)}),extendSelection:docMethodOp(function(head,other,options){extendSelection(this,clipPos(this,head),other&&clipPos(this,other),options)}),extendSelections:docMethodOp(function(heads,options){extendSelections(this,clipPosArray(this,heads),options)}),extendSelectionsBy:docMethodOp(function(f,options){var heads=map(this.sel.ranges,f);extendSelections(this,clipPosArray(this,heads),options)}),setSelections:docMethodOp(function(ranges,primary,options){if(!ranges.length){return}
var out=[];for(var i=0;i<ranges.length;i++){out[i]=new Range(clipPos(this,ranges[i].anchor),clipPos(this,ranges[i].head||ranges[i].anchor))}
if(primary==null){primary=Math.min(ranges.length-1,this.sel.primIndex)}
setSelection(this,normalizeSelection(this.cm,out,primary),options)}),addSelection:docMethodOp(function(anchor,head,options){var ranges=this.sel.ranges.slice(0);ranges.push(new Range(clipPos(this,anchor),clipPos(this,head||anchor)));setSelection(this,normalizeSelection(this.cm,ranges,ranges.length-1),options)}),getSelection:function(lineSep){var ranges=this.sel.ranges,lines;for(var i=0;i<ranges.length;i++){var sel=getBetween(this,ranges[i].from(),ranges[i].to());lines=lines?lines.concat(sel):sel}
if(lineSep===!1){return lines}else{return lines.join(lineSep||this.lineSeparator())}},getSelections:function(lineSep){var parts=[],ranges=this.sel.ranges;for(var i=0;i<ranges.length;i++){var sel=getBetween(this,ranges[i].from(),ranges[i].to());if(lineSep!==!1){sel=sel.join(lineSep||this.lineSeparator())}
parts[i]=sel}
return parts},replaceSelection:function(code,collapse,origin){var dup=[];for(var i=0;i<this.sel.ranges.length;i++){dup[i]=code}
this.replaceSelections(dup,collapse,origin||"+input")},replaceSelections:docMethodOp(function(code,collapse,origin){var changes=[],sel=this.sel;for(var i=0;i<sel.ranges.length;i++){var range=sel.ranges[i];changes[i]={from:range.from(),to:range.to(),text:this.splitLines(code[i]),origin:origin}}
var newSel=collapse&&collapse!="end"&&computeReplacedSel(this,changes,collapse);for(var i$1=changes.length-1;i$1>=0;i$1--){makeChange(this,changes[i$1])}
if(newSel){setSelectionReplaceHistory(this,newSel)}else if(this.cm){ensureCursorVisible(this.cm)}}),undo:docMethodOp(function(){makeChangeFromHistory(this,"undo")}),redo:docMethodOp(function(){makeChangeFromHistory(this,"redo")}),undoSelection:docMethodOp(function(){makeChangeFromHistory(this,"undo",!0)}),redoSelection:docMethodOp(function(){makeChangeFromHistory(this,"redo",!0)}),setExtending:function(val){this.extend=val},getExtending:function(){return this.extend},historySize:function(){var hist=this.history,done=0,undone=0;for(var i=0;i<hist.done.length;i++){if(!hist.done[i].ranges){++done}}
for(var i$1=0;i$1<hist.undone.length;i$1++){if(!hist.undone[i$1].ranges){++undone}}
return{undo:done,redo:undone}},clearHistory:function(){var this$1=this;this.history=new History(this.history);linkedDocs(this,function(doc){return doc.history=this$1.history},!0)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},changeGeneration:function(forceSplit){if(forceSplit){this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null}
return this.history.generation},isClean:function(gen){return this.history.generation==(gen||this.cleanGeneration)},getHistory:function(){return{done:copyHistoryArray(this.history.done),undone:copyHistoryArray(this.history.undone)}},setHistory:function(histData){var hist=this.history=new History(this.history);hist.done=copyHistoryArray(histData.done.slice(0),null,!0);hist.undone=copyHistoryArray(histData.undone.slice(0),null,!0)},setGutterMarker:docMethodOp(function(line,gutterID,value){return changeLine(this,line,"gutter",function(line){var markers=line.gutterMarkers||(line.gutterMarkers={});markers[gutterID]=value;if(!value&&isEmpty(markers)){line.gutterMarkers=null}
return!0})}),clearGutter:docMethodOp(function(gutterID){var this$1=this;this.iter(function(line){if(line.gutterMarkers&&line.gutterMarkers[gutterID]){changeLine(this$1,line,"gutter",function(){line.gutterMarkers[gutterID]=null;if(isEmpty(line.gutterMarkers)){line.gutterMarkers=null}
return!0})}})}),lineInfo:function(line){var n;if(typeof line=="number"){if(!isLine(this,line)){return null}
n=line;line=getLine(this,line);if(!line){return null}}else{n=lineNo(line);if(n==null){return null}}
return{line:n,handle:line,text:line.text,gutterMarkers:line.gutterMarkers,textClass:line.textClass,bgClass:line.bgClass,wrapClass:line.wrapClass,widgets:line.widgets}},addLineClass:docMethodOp(function(handle,where,cls){return changeLine(this,handle,where=="gutter"?"gutter":"class",function(line){var prop=where=="text"?"textClass":where=="background"?"bgClass":where=="gutter"?"gutterClass":"wrapClass";if(!line[prop]){line[prop]=cls}else if(classTest(cls).test(line[prop])){return!1}else{line[prop]+=" "+cls}
return!0})}),removeLineClass:docMethodOp(function(handle,where,cls){return changeLine(this,handle,where=="gutter"?"gutter":"class",function(line){var prop=where=="text"?"textClass":where=="background"?"bgClass":where=="gutter"?"gutterClass":"wrapClass";var cur=line[prop];if(!cur){return!1}else if(cls==null){line[prop]=null}else{var found=cur.match(classTest(cls));if(!found){return!1}
var end=found.index+found[0].length;line[prop]=cur.slice(0,found.index)+(!found.index||end==cur.length?"":" ")+cur.slice(end)||null}
return!0})}),addLineWidget:docMethodOp(function(handle,node,options){return addLineWidget(this,handle,node,options)}),removeLineWidget:function(widget){widget.clear()},markText:function(from,to,options){return markText(this,clipPos(this,from),clipPos(this,to),options,options&&options.type||"range")},setBookmark:function(pos,options){var realOpts={replacedWith:options&&(options.nodeType==null?options.widget:options),insertLeft:options&&options.insertLeft,clearWhenEmpty:!1,shared:options&&options.shared,handleMouseEvents:options&&options.handleMouseEvents};pos=clipPos(this,pos);return markText(this,pos,pos,realOpts,"bookmark")},findMarksAt:function(pos){pos=clipPos(this,pos);var markers=[],spans=getLine(this,pos.line).markedSpans;if(spans){for(var i=0;i<spans.length;++i){var span=spans[i];if((span.from==null||span.from<=pos.ch)&&(span.to==null||span.to>=pos.ch)){markers.push(span.marker.parent||span.marker)}}}
return markers},findMarks:function(from,to,filter){from=clipPos(this,from);to=clipPos(this,to);var found=[],lineNo=from.line;this.iter(from.line,to.line+1,function(line){var spans=line.markedSpans;if(spans){for(var i=0;i<spans.length;i++){var span=spans[i];if(!(span.to!=null&&lineNo==from.line&&from.ch>=span.to||span.from==null&&lineNo!=from.line||span.from!=null&&lineNo==to.line&&span.from>=to.ch)&&(!filter||filter(span.marker))){found.push(span.marker.parent||span.marker)}}}
++lineNo});return found},getAllMarks:function(){var markers=[];this.iter(function(line){var sps=line.markedSpans;if(sps){for(var i=0;i<sps.length;++i){if(sps[i].from!=null){markers.push(sps[i].marker)}}}});return markers},posFromIndex:function(off){var ch,lineNo=this.first,sepSize=this.lineSeparator().length;this.iter(function(line){var sz=line.text.length+sepSize;if(sz>off){ch=off;return!0}
off-=sz;++lineNo});return clipPos(this,Pos(lineNo,ch))},indexFromPos:function(coords){coords=clipPos(this,coords);var index=coords.ch;if(coords.line<this.first||coords.ch<0){return 0}
var sepSize=this.lineSeparator().length;this.iter(this.first,coords.line,function(line){index+=line.text.length+sepSize});return index},copy:function(copyHistory){var doc=new Doc(getLines(this,this.first,this.first+this.size),this.modeOption,this.first,this.lineSep,this.direction);doc.scrollTop=this.scrollTop;doc.scrollLeft=this.scrollLeft;doc.sel=this.sel;doc.extend=!1;if(copyHistory){doc.history.undoDepth=this.history.undoDepth;doc.setHistory(this.getHistory())}
return doc},linkedDoc:function(options){if(!options){options={}}
var from=this.first,to=this.first+this.size;if(options.from!=null&&options.from>from){from=options.from}
if(options.to!=null&&options.to<to){to=options.to}
var copy=new Doc(getLines(this,from,to),options.mode||this.modeOption,from,this.lineSep,this.direction);if(options.sharedHist){copy.history=this.history}(this.linked||(this.linked=[])).push({doc:copy,sharedHist:options.sharedHist});copy.linked=[{doc:this,isParent:!0,sharedHist:options.sharedHist}];copySharedMarkers(copy,findSharedMarkers(this));return copy},unlinkDoc:function(other){if(other instanceof CodeMirror){other=other.doc}
if(this.linked){for(var i=0;i<this.linked.length;++i){var link=this.linked[i];if(link.doc!=other){continue}
this.linked.splice(i,1);other.unlinkDoc(this);detachSharedMarkers(findSharedMarkers(this));break}}
if(other.history==this.history){var splitIds=[other.id];linkedDocs(other,function(doc){return splitIds.push(doc.id)},!0);other.history=new History(null);other.history.done=copyHistoryArray(this.history.done,splitIds);other.history.undone=copyHistoryArray(this.history.undone,splitIds)}},iterLinkedDocs:function(f){linkedDocs(this,f)},getMode:function(){return this.mode},getEditor:function(){return this.cm},splitLines:function(str){if(this.lineSep){return str.split(this.lineSep)}
return splitLinesAuto(str)},lineSeparator:function(){return this.lineSep||"\n"},setDirection:docMethodOp(function(dir){if(dir!="rtl"){dir="ltr"}
if(dir==this.direction){return}
this.direction=dir;this.iter(function(line){return line.order=null});if(this.cm){directionChanged(this.cm)}})});Doc.prototype.eachLine=Doc.prototype.iter;var lastDrop=0;function onDrop(e){var cm=this;clearDragCursor(cm);if(signalDOMEvent(cm,e)||eventInWidget(cm.display,e)){return}
e_preventDefault(e);if(ie){lastDrop=+new Date}
var pos=posFromMouse(cm,e,!0),files=e.dataTransfer.files;if(!pos||cm.isReadOnly()){return}
if(files&&files.length&&window.FileReader&&window.File){var n=files.length,text=Array(n),read=0;var markAsReadAndPasteIfAllFilesAreRead=function(){if(++read==n){operation(cm,function(){pos=clipPos(cm.doc,pos);var change={from:pos,to:pos,text:cm.doc.splitLines(text.filter(function(t){return t!=null}).join(cm.doc.lineSeparator())),origin:"paste"};makeChange(cm.doc,change);setSelectionReplaceHistory(cm.doc,simpleSelection(clipPos(cm.doc,pos),clipPos(cm.doc,changeEnd(change))))})()}};var readTextFromFile=function(file,i){if(cm.options.allowDropFileTypes&&indexOf(cm.options.allowDropFileTypes,file.type)==-1){markAsReadAndPasteIfAllFilesAreRead();return}
var reader=new FileReader;reader.onerror=function(){return markAsReadAndPasteIfAllFilesAreRead()};reader.onload=function(){var content=reader.result;if(/[\x00-\x08\x0e-\x1f]{2}/.test(content)){markAsReadAndPasteIfAllFilesAreRead();return}
text[i]=content;markAsReadAndPasteIfAllFilesAreRead()};reader.readAsText(file)};for(var i=0;i<files.length;i++){readTextFromFile(files[i],i)}}else{if(cm.state.draggingText&&cm.doc.sel.contains(pos)>-1){cm.state.draggingText(e);setTimeout(function(){return cm.display.input.focus()},20);return}
try{var text$1=e.dataTransfer.getData("Text");if(text$1){var selected;if(cm.state.draggingText&&!cm.state.draggingText.copy){selected=cm.listSelections()}
setSelectionNoUndo(cm.doc,simpleSelection(pos,pos));if(selected){for(var i$1=0;i$1<selected.length;++i$1){replaceRange(cm.doc,"",selected[i$1].anchor,selected[i$1].head,"drag")}}
cm.replaceSelection(text$1,"around","paste");cm.display.input.focus()}}catch(e$1){}}}
function onDragStart(cm,e){if(ie&&(!cm.state.draggingText||+new Date-lastDrop<100)){e_stop(e);return}
if(signalDOMEvent(cm,e)||eventInWidget(cm.display,e)){return}
e.dataTransfer.setData("Text",cm.getSelection());e.dataTransfer.effectAllowed="copyMove";if(e.dataTransfer.setDragImage&&!safari){var img=elt("img",null,null,"position: fixed; left: 0; top: 0;");img.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";if(presto){img.width=img.height=1;cm.display.wrapper.appendChild(img);img._top=img.offsetTop}
e.dataTransfer.setDragImage(img,0,0);if(presto){img.parentNode.removeChild(img)}}}
function onDragOver(cm,e){var pos=posFromMouse(cm,e);if(!pos){return}
var frag=document.createDocumentFragment();drawSelectionCursor(cm,pos,frag);if(!cm.display.dragCursor){cm.display.dragCursor=elt("div",null,"CodeMirror-cursors CodeMirror-dragcursors");cm.display.lineSpace.insertBefore(cm.display.dragCursor,cm.display.cursorDiv)}
removeChildrenAndAdd(cm.display.dragCursor,frag)}
function clearDragCursor(cm){if(cm.display.dragCursor){cm.display.lineSpace.removeChild(cm.display.dragCursor);cm.display.dragCursor=null}}
function forEachCodeMirror(f){if(!document.getElementsByClassName){return}
var byClass=document.getElementsByClassName("CodeMirror"),editors=[];for(var i=0;i<byClass.length;i++){var cm=byClass[i].CodeMirror;if(cm){editors.push(cm)}}
if(editors.length){editors[0].operation(function(){for(var i=0;i<editors.length;i++){f(editors[i])}})}}
var globalsRegistered=!1;function ensureGlobalHandlers(){if(globalsRegistered){return}
registerGlobalHandlers();globalsRegistered=!0}
function registerGlobalHandlers(){var resizeTimer;on(window,"resize",function(){if(resizeTimer==null){resizeTimer=setTimeout(function(){resizeTimer=null;forEachCodeMirror(onResize)},100)}});on(window,"blur",function(){return forEachCodeMirror(onBlur)})}
function onResize(cm){var d=cm.display;d.cachedCharWidth=d.cachedTextHeight=d.cachedPaddingH=null;d.scrollbarsClipped=!1;cm.setSize()}
var keyNames={3:"Pause",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"=",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"=",109:"-",110:".",111:"/",145:"ScrollLock",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",224:"Mod",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"};for(var i=0;i<10;i++){keyNames[i+48]=keyNames[i+96]=String(i)}
for(var i$1=65;i$1<=90;i$1++){keyNames[i$1]=String.fromCharCode(i$1)}
for(var i$2=1;i$2<=12;i$2++){keyNames[i$2+111]=keyNames[i$2+63235]="F"+i$2}
var keyMap={};keyMap.basic={"Left":"goCharLeft","Right":"goCharRight","Up":"goLineUp","Down":"goLineDown","End":"goLineEnd","Home":"goLineStartSmart","PageUp":"goPageUp","PageDown":"goPageDown","Delete":"delCharAfter","Backspace":"delCharBefore","Shift-Backspace":"delCharBefore","Tab":"defaultTab","Shift-Tab":"indentAuto","Enter":"newlineAndIndent","Insert":"toggleOverwrite","Esc":"singleSelection"};keyMap.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection","fallthrough":"basic"};keyMap.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars","Ctrl-O":"openLine"};keyMap.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd","fallthrough":["basic","emacsy"]};keyMap["default"]=mac?keyMap.macDefault:keyMap.pcDefault;function normalizeKeyName(name){var parts=name.split(/-(?!$)/);name=parts[parts.length-1];var alt,ctrl,shift,cmd;for(var i=0;i<parts.length-1;i++){var mod=parts[i];if(/^(cmd|meta|m)$/i.test(mod)){cmd=!0}else if(/^a(lt)?$/i.test(mod)){alt=!0}else if(/^(c|ctrl|control)$/i.test(mod)){ctrl=!0}else if(/^s(hift)?$/i.test(mod)){shift=!0}else{throw new Error("Unrecognized modifier name: "+mod)}}
if(alt){name="Alt-"+name}
if(ctrl){name="Ctrl-"+name}
if(cmd){name="Cmd-"+name}
if(shift){name="Shift-"+name}
return name}
function normalizeKeyMap(keymap){var copy={};for(var keyname in keymap){if(keymap.hasOwnProperty(keyname)){var value=keymap[keyname];if(/^(name|fallthrough|(de|at)tach)$/.test(keyname)){continue}
if(value=="..."){delete keymap[keyname];continue}
var keys=map(keyname.split(" "),normalizeKeyName);for(var i=0;i<keys.length;i++){var val=(void 0),name=(void 0);if(i==keys.length-1){name=keys.join(" ");val=value}else{name=keys.slice(0,i+1).join(" ");val="..."}
var prev=copy[name];if(!prev){copy[name]=val}else if(prev!=val){throw new Error("Inconsistent bindings for "+name)}}
delete keymap[keyname]}}
for(var prop in copy){keymap[prop]=copy[prop]}
return keymap}
function lookupKey(key,map,handle,context){map=getKeyMap(map);var found=map.call?map.call(key,context):map[key];if(found===!1){return"nothing"}
if(found==="..."){return"multi"}
if(found!=null&&handle(found)){return"handled"}
if(map.fallthrough){if(Object.prototype.toString.call(map.fallthrough)!="[object Array]"){return lookupKey(key,map.fallthrough,handle,context)}
for(var i=0;i<map.fallthrough.length;i++){var result=lookupKey(key,map.fallthrough[i],handle,context);if(result){return result}}}}
function isModifierKey(value){var name=typeof value=="string"?value:keyNames[value.keyCode];return name=="Ctrl"||name=="Alt"||name=="Shift"||name=="Mod"}
function addModifierNames(name,event,noShift){var base=name;if(event.altKey&&base!="Alt"){name="Alt-"+name}
if((flipCtrlCmd?event.metaKey:event.ctrlKey)&&base!="Ctrl"){name="Ctrl-"+name}
if((flipCtrlCmd?event.ctrlKey:event.metaKey)&&base!="Mod"){name="Cmd-"+name}
if(!noShift&&event.shiftKey&&base!="Shift"){name="Shift-"+name}
return name}
function keyName(event,noShift){if(presto&&event.keyCode==34&&event["char"]){return!1}
var name=keyNames[event.keyCode];if(name==null||event.altGraphKey){return!1}
if(event.keyCode==3&&event.code){name=event.code}
return addModifierNames(name,event,noShift)}
function getKeyMap(val){return typeof val=="string"?keyMap[val]:val}
function deleteNearSelection(cm,compute){var ranges=cm.doc.sel.ranges,kill=[];for(var i=0;i<ranges.length;i++){var toKill=compute(ranges[i]);while(kill.length&&cmp(toKill.from,lst(kill).to)<=0){var replaced=kill.pop();if(cmp(replaced.from,toKill.from)<0){toKill.from=replaced.from;break}}
kill.push(toKill)}
runInOp(cm,function(){for(var i=kill.length-1;i>=0;i--){replaceRange(cm.doc,"",kill[i].from,kill[i].to,"+delete")}
ensureCursorVisible(cm)})}
function moveCharLogically(line,ch,dir){var target=skipExtendingChars(line.text,ch+dir,dir);return target<0||target>line.text.length?null:target}
function moveLogically(line,start,dir){var ch=moveCharLogically(line,start.ch,dir);return ch==null?null:new Pos(start.line,ch,dir<0?"after":"before")}
function endOfLine(visually,cm,lineObj,lineNo,dir){if(visually){if(cm.doc.direction=="rtl"){dir=-dir}
var order=getOrder(lineObj,cm.doc.direction);if(order){var part=dir<0?lst(order):order[0];var moveInStorageOrder=(dir<0)==(part.level==1);var sticky=moveInStorageOrder?"after":"before";var ch;if(part.level>0||cm.doc.direction=="rtl"){var prep=prepareMeasureForLine(cm,lineObj);ch=dir<0?lineObj.text.length-1:0;var targetTop=measureCharPrepared(cm,prep,ch).top;ch=findFirst(function(ch){return measureCharPrepared(cm,prep,ch).top==targetTop},(dir<0)==(part.level==1)?part.from:part.to-1,ch);if(sticky=="before"){ch=moveCharLogically(lineObj,ch,1)}}else{ch=dir<0?part.to:part.from}
return new Pos(lineNo,ch,sticky)}}
return new Pos(lineNo,dir<0?lineObj.text.length:0,dir<0?"before":"after")}
function moveVisually(cm,line,start,dir){var bidi=getOrder(line,cm.doc.direction);if(!bidi){return moveLogically(line,start,dir)}
if(start.ch>=line.text.length){start.ch=line.text.length;start.sticky="before"}else if(start.ch<=0){start.ch=0;start.sticky="after"}
var partPos=getBidiPartAt(bidi,start.ch,start.sticky),part=bidi[partPos];if(cm.doc.direction=="ltr"&&part.level%2==0&&(dir>0?part.to>start.ch:part.from<start.ch)){return moveLogically(line,start,dir)}
var mv=function(pos,dir){return moveCharLogically(line,pos instanceof Pos?pos.ch:pos,dir)};var prep;var getWrappedLineExtent=function(ch){if(!cm.options.lineWrapping){return{begin:0,end:line.text.length}}
prep=prep||prepareMeasureForLine(cm,line);return wrappedLineExtentChar(cm,line,prep,ch)};var wrappedLineExtent=getWrappedLineExtent(start.sticky=="before"?mv(start,-1):start.ch);if(cm.doc.direction=="rtl"||part.level==1){var moveInStorageOrder=(part.level==1)==(dir<0);var ch=mv(start,moveInStorageOrder?1:-1);if(ch!=null&&(!moveInStorageOrder?ch>=part.from&&ch>=wrappedLineExtent.begin:ch<=part.to&&ch<=wrappedLineExtent.end)){var sticky=moveInStorageOrder?"before":"after";return new Pos(start.line,ch,sticky)}}
var searchInVisualLine=function(partPos,dir,wrappedLineExtent){var getRes=function(ch,moveInStorageOrder){return moveInStorageOrder?new Pos(start.line,mv(ch,1),"before"):new Pos(start.line,ch,"after")};for(;partPos>=0&&partPos<bidi.length;partPos+=dir){var part=bidi[partPos];var moveInStorageOrder=(dir>0)==(part.level!=1);var ch=moveInStorageOrder?wrappedLineExtent.begin:mv(wrappedLineExtent.end,-1);if(part.from<=ch&&ch<part.to){return getRes(ch,moveInStorageOrder)}
ch=moveInStorageOrder?part.from:mv(part.to,-1);if(wrappedLineExtent.begin<=ch&&ch<wrappedLineExtent.end){return getRes(ch,moveInStorageOrder)}}};var res=searchInVisualLine(partPos+dir,dir,wrappedLineExtent);if(res){return res}
var nextCh=dir>0?wrappedLineExtent.end:mv(wrappedLineExtent.begin,-1);if(nextCh!=null&&!(dir>0&&nextCh==line.text.length)){res=searchInVisualLine(dir>0?0:bidi.length-1,dir,getWrappedLineExtent(nextCh));if(res){return res}}
return null}
var commands={selectAll:selectAll,singleSelection:function(cm){return cm.setSelection(cm.getCursor("anchor"),cm.getCursor("head"),sel_dontScroll)},killLine:function(cm){return deleteNearSelection(cm,function(range){if(range.empty()){var len=getLine(cm.doc,range.head.line).text.length;if(range.head.ch==len&&range.head.line<cm.lastLine()){return{from:range.head,to:Pos(range.head.line+1,0)}}else{return{from:range.head,to:Pos(range.head.line,len)}}}else{return{from:range.from(),to:range.to()}}})},deleteLine:function(cm){return deleteNearSelection(cm,function(range){return({from:Pos(range.from().line,0),to:clipPos(cm.doc,Pos(range.to().line+1,0))})})},delLineLeft:function(cm){return deleteNearSelection(cm,function(range){return({from:Pos(range.from().line,0),to:range.from()})})},delWrappedLineLeft:function(cm){return deleteNearSelection(cm,function(range){var top=cm.charCoords(range.head,"div").top+5;var leftPos=cm.coordsChar({left:0,top:top},"div");return{from:leftPos,to:range.from()}})},delWrappedLineRight:function(cm){return deleteNearSelection(cm,function(range){var top=cm.charCoords(range.head,"div").top+5;var rightPos=cm.coordsChar({left:cm.display.lineDiv.offsetWidth+100,top:top},"div");return{from:range.from(),to:rightPos}})},undo:function(cm){return cm.undo()},redo:function(cm){return cm.redo()},undoSelection:function(cm){return cm.undoSelection()},redoSelection:function(cm){return cm.redoSelection()},goDocStart:function(cm){return cm.extendSelection(Pos(cm.firstLine(),0))},goDocEnd:function(cm){return cm.extendSelection(Pos(cm.lastLine()))},goLineStart:function(cm){return cm.extendSelectionsBy(function(range){return lineStart(cm,range.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(cm){return cm.extendSelectionsBy(function(range){return lineStartSmart(cm,range.head)},{origin:"+move",bias:1})},goLineEnd:function(cm){return cm.extendSelectionsBy(function(range){return lineEnd(cm,range.head.line)},{origin:"+move",bias:-1})},goLineRight:function(cm){return cm.extendSelectionsBy(function(range){var top=cm.cursorCoords(range.head,"div").top+5;return cm.coordsChar({left:cm.display.lineDiv.offsetWidth+100,top:top},"div")},sel_move)},goLineLeft:function(cm){return cm.extendSelectionsBy(function(range){var top=cm.cursorCoords(range.head,"div").top+5;return cm.coordsChar({left:0,top:top},"div")},sel_move)},goLineLeftSmart:function(cm){return cm.extendSelectionsBy(function(range){var top=cm.cursorCoords(range.head,"div").top+5;var pos=cm.coordsChar({left:0,top:top},"div");if(pos.ch<cm.getLine(pos.line).search(/\S/)){return lineStartSmart(cm,range.head)}
return pos},sel_move)},goLineUp:function(cm){return cm.moveV(-1,"line")},goLineDown:function(cm){return cm.moveV(1,"line")},goPageUp:function(cm){return cm.moveV(-1,"page")},goPageDown:function(cm){return cm.moveV(1,"page")},goCharLeft:function(cm){return cm.moveH(-1,"char")},goCharRight:function(cm){return cm.moveH(1,"char")},goColumnLeft:function(cm){return cm.moveH(-1,"column")},goColumnRight:function(cm){return cm.moveH(1,"column")},goWordLeft:function(cm){return cm.moveH(-1,"word")},goGroupRight:function(cm){return cm.moveH(1,"group")},goGroupLeft:function(cm){return cm.moveH(-1,"group")},goWordRight:function(cm){return cm.moveH(1,"word")},delCharBefore:function(cm){return cm.deleteH(-1,"codepoint")},delCharAfter:function(cm){return cm.deleteH(1,"char")},delWordBefore:function(cm){return cm.deleteH(-1,"word")},delWordAfter:function(cm){return cm.deleteH(1,"word")},delGroupBefore:function(cm){return cm.deleteH(-1,"group")},delGroupAfter:function(cm){return cm.deleteH(1,"group")},indentAuto:function(cm){return cm.indentSelection("smart")},indentMore:function(cm){return cm.indentSelection("add")},indentLess:function(cm){return cm.indentSelection("subtract")},insertTab:function(cm){return cm.replaceSelection("\t")},insertSoftTab:function(cm){var spaces=[],ranges=cm.listSelections(),tabSize=cm.options.tabSize;for(var i=0;i<ranges.length;i++){var pos=ranges[i].from();var col=countColumn(cm.getLine(pos.line),pos.ch,tabSize);spaces.push(spaceStr(tabSize-col%tabSize))}
cm.replaceSelections(spaces)},defaultTab:function(cm){if(cm.somethingSelected()){cm.indentSelection("add")}else{cm.execCommand("insertTab")}},transposeChars:function(cm){return runInOp(cm,function(){var ranges=cm.listSelections(),newSel=[];for(var i=0;i<ranges.length;i++){if(!ranges[i].empty()){continue}
var cur=ranges[i].head,line=getLine(cm.doc,cur.line).text;if(line){if(cur.ch==line.length){cur=new Pos(cur.line,cur.ch-1)}
if(cur.ch>0){cur=new Pos(cur.line,cur.ch+1);cm.replaceRange(line.charAt(cur.ch-1)+line.charAt(cur.ch-2),Pos(cur.line,cur.ch-2),cur,"+transpose")}else if(cur.line>cm.doc.first){var prev=getLine(cm.doc,cur.line-1).text;if(prev){cur=new Pos(cur.line,1);cm.replaceRange(line.charAt(0)+cm.doc.lineSeparator()+prev.charAt(prev.length-1),Pos(cur.line-1,prev.length-1),cur,"+transpose")}}}
newSel.push(new Range(cur,cur))}
cm.setSelections(newSel)})},newlineAndIndent:function(cm){return runInOp(cm,function(){var sels=cm.listSelections();for(var i=sels.length-1;i>=0;i--){cm.replaceRange(cm.doc.lineSeparator(),sels[i].anchor,sels[i].head,"+input")}
sels=cm.listSelections();for(var i$1=0;i$1<sels.length;i$1++){cm.indentLine(sels[i$1].from().line,null,!0)}
ensureCursorVisible(cm)})},openLine:function(cm){return cm.replaceSelection("\n","start")},toggleOverwrite:function(cm){return cm.toggleOverwrite()}};function lineStart(cm,lineN){var line=getLine(cm.doc,lineN);var visual=visualLine(line);if(visual!=line){lineN=lineNo(visual)}
return endOfLine(!0,cm,visual,lineN,1)}
function lineEnd(cm,lineN){var line=getLine(cm.doc,lineN);var visual=visualLineEnd(line);if(visual!=line){lineN=lineNo(visual)}
return endOfLine(!0,cm,line,lineN,-1)}
function lineStartSmart(cm,pos){var start=lineStart(cm,pos.line);var line=getLine(cm.doc,start.line);var order=getOrder(line,cm.doc.direction);if(!order||order[0].level==0){var firstNonWS=Math.max(start.ch,line.text.search(/\S/));var inWS=pos.line==start.line&&pos.ch<=firstNonWS&&pos.ch;return Pos(start.line,inWS?0:firstNonWS,start.sticky)}
return start}
function doHandleBinding(cm,bound,dropShift){if(typeof bound=="string"){bound=commands[bound];if(!bound){return!1}}
cm.display.input.ensurePolled();var prevShift=cm.display.shift,done=!1;try{if(cm.isReadOnly()){cm.state.suppressEdits=!0}
if(dropShift){cm.display.shift=!1}
done=bound(cm)!=Pass}finally{cm.display.shift=prevShift;cm.state.suppressEdits=!1}
return done}
function lookupKeyForEditor(cm,name,handle){for(var i=0;i<cm.state.keyMaps.length;i++){var result=lookupKey(name,cm.state.keyMaps[i],handle,cm);if(result){return result}}
return(cm.options.extraKeys&&lookupKey(name,cm.options.extraKeys,handle,cm))||lookupKey(name,cm.options.keyMap,handle,cm)}
var stopSeq=new Delayed;function dispatchKey(cm,name,e,handle){var seq=cm.state.keySeq;if(seq){if(isModifierKey(name)){return"handled"}
if(/\'$/.test(name)){cm.state.keySeq=null}else{stopSeq.set(50,function(){if(cm.state.keySeq==seq){cm.state.keySeq=null;cm.display.input.reset()}})}
if(dispatchKeyInner(cm,seq+" "+name,e,handle)){return!0}}
return dispatchKeyInner(cm,name,e,handle)}
function dispatchKeyInner(cm,name,e,handle){var result=lookupKeyForEditor(cm,name,handle);if(result=="multi"){cm.state.keySeq=name}
if(result=="handled"){signalLater(cm,"keyHandled",cm,name,e)}
if(result=="handled"||result=="multi"){e_preventDefault(e);restartBlink(cm)}
return!!result}
function handleKeyBinding(cm,e){var name=keyName(e,!0);if(!name){return!1}
if(e.shiftKey&&!cm.state.keySeq){return dispatchKey(cm,"Shift-"+name,e,function(b){return doHandleBinding(cm,b,!0)})||dispatchKey(cm,name,e,function(b){if(typeof b=="string"?/^go[A-Z]/.test(b):b.motion){return doHandleBinding(cm,b)}})}else{return dispatchKey(cm,name,e,function(b){return doHandleBinding(cm,b)})}}
function handleCharBinding(cm,e,ch){return dispatchKey(cm,"'"+ch+"'",e,function(b){return doHandleBinding(cm,b,!0)})}
var lastStoppedKey=null;function onKeyDown(e){var cm=this;if(e.target&&e.target!=cm.display.input.getField()){return}
cm.curOp.focus=activeElt(doc(cm));if(signalDOMEvent(cm,e)){return}
if(ie&&ie_version<11&&e.keyCode==27){e.returnValue=!1}
var code=e.keyCode;cm.display.shift=code==16||e.shiftKey;var handled=handleKeyBinding(cm,e);if(presto){lastStoppedKey=handled?code:null;if(!handled&&code==88&&!hasCopyEvent&&(mac?e.metaKey:e.ctrlKey)){cm.replaceSelection("",null,"cut")}}
if(gecko&&!mac&&!handled&&code==46&&e.shiftKey&&!e.ctrlKey&&document.execCommand){document.execCommand("cut")}
if(code==18&&!/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className)){showCrossHair(cm)}}
function showCrossHair(cm){var lineDiv=cm.display.lineDiv;addClass(lineDiv,"CodeMirror-crosshair");function up(e){if(e.keyCode==18||!e.altKey){rmClass(lineDiv,"CodeMirror-crosshair");off(document,"keyup",up);off(document,"mouseover",up)}}
on(document,"keyup",up);on(document,"mouseover",up)}
function onKeyUp(e){if(e.keyCode==16){this.doc.sel.shift=!1}
signalDOMEvent(this,e)}
function onKeyPress(e){var cm=this;if(e.target&&e.target!=cm.display.input.getField()){return}
if(eventInWidget(cm.display,e)||signalDOMEvent(cm,e)||e.ctrlKey&&!e.altKey||mac&&e.metaKey){return}
var keyCode=e.keyCode,charCode=e.charCode;if(presto&&keyCode==lastStoppedKey){lastStoppedKey=null;e_preventDefault(e);return}
if((presto&&(!e.which||e.which<10))&&handleKeyBinding(cm,e)){return}
var ch=String.fromCharCode(charCode==null?keyCode:charCode);if(ch=="\x08"){return}
if(handleCharBinding(cm,e,ch)){return}
cm.display.input.onKeyPress(e)}
var DOUBLECLICK_DELAY=400;var PastClick=function(time,pos,button){this.time=time;this.pos=pos;this.button=button};PastClick.prototype.compare=function(time,pos,button){return this.time+DOUBLECLICK_DELAY>time&&cmp(pos,this.pos)==0&&button==this.button};var lastClick,lastDoubleClick;function clickRepeat(pos,button){var now=+new Date;if(lastDoubleClick&&lastDoubleClick.compare(now,pos,button)){lastClick=lastDoubleClick=null;return"triple"}else if(lastClick&&lastClick.compare(now,pos,button)){lastDoubleClick=new PastClick(now,pos,button);lastClick=null;return"double"}else{lastClick=new PastClick(now,pos,button);lastDoubleClick=null;return"single"}}
function onMouseDown(e){var cm=this,display=cm.display;if(signalDOMEvent(cm,e)||display.activeTouch&&display.input.supportsTouch()){return}
display.input.ensurePolled();display.shift=e.shiftKey;if(eventInWidget(display,e)){if(!webkit){display.scroller.draggable=!1;setTimeout(function(){return display.scroller.draggable=!0},100)}
return}
if(clickInGutter(cm,e)){return}
var pos=posFromMouse(cm,e),button=e_button(e),repeat=pos?clickRepeat(pos,button):"single";win(cm).focus();if(button==1&&cm.state.selectingText){cm.state.selectingText(e)}
if(pos&&handleMappedButton(cm,button,pos,repeat,e)){return}
if(button==1){if(pos){leftButtonDown(cm,pos,repeat,e)}else if(e_target(e)==display.scroller){e_preventDefault(e)}}else if(button==2){if(pos){extendSelection(cm.doc,pos)}
setTimeout(function(){return display.input.focus()},20)}else if(button==3){if(captureRightClick){cm.display.input.onContextMenu(e)}else{delayBlurEvent(cm)}}}
function handleMappedButton(cm,button,pos,repeat,event){var name="Click";if(repeat=="double"){name="Double"+name}else if(repeat=="triple"){name="Triple"+name}
name=(button==1?"Left":button==2?"Middle":"Right")+name;return dispatchKey(cm,addModifierNames(name,event),event,function(bound){if(typeof bound=="string"){bound=commands[bound]}
if(!bound){return!1}
var done=!1;try{if(cm.isReadOnly()){cm.state.suppressEdits=!0}
done=bound(cm,pos)!=Pass}finally{cm.state.suppressEdits=!1}
return done})}
function configureMouse(cm,repeat,event){var option=cm.getOption("configureMouse");var value=option?option(cm,repeat,event):{};if(value.unit==null){var rect=chromeOS?event.shiftKey&&event.metaKey:event.altKey;value.unit=rect?"rectangle":repeat=="single"?"char":repeat=="double"?"word":"line"}
if(value.extend==null||cm.doc.extend){value.extend=cm.doc.extend||event.shiftKey}
if(value.addNew==null){value.addNew=mac?event.metaKey:event.ctrlKey}
if(value.moveOnDrag==null){value.moveOnDrag=!(mac?event.altKey:event.ctrlKey)}
return value}
function leftButtonDown(cm,pos,repeat,event){if(ie){setTimeout(bind(ensureFocus,cm),0)}else{cm.curOp.focus=activeElt(doc(cm))}
var behavior=configureMouse(cm,repeat,event);var sel=cm.doc.sel,contained;if(cm.options.dragDrop&&dragAndDrop&&!cm.isReadOnly()&&repeat=="single"&&(contained=sel.contains(pos))>-1&&(cmp((contained=sel.ranges[contained]).from(),pos)<0||pos.xRel>0)&&(cmp(contained.to(),pos)>0||pos.xRel<0)){leftButtonStartDrag(cm,event,pos,behavior)}else{leftButtonSelect(cm,event,pos,behavior)}}
function leftButtonStartDrag(cm,event,pos,behavior){var display=cm.display,moved=!1;var dragEnd=operation(cm,function(e){if(webkit){display.scroller.draggable=!1}
cm.state.draggingText=!1;if(cm.state.delayingBlurEvent){if(cm.hasFocus()){cm.state.delayingBlurEvent=!1}else{delayBlurEvent(cm)}}
off(display.wrapper.ownerDocument,"mouseup",dragEnd);off(display.wrapper.ownerDocument,"mousemove",mouseMove);off(display.scroller,"dragstart",dragStart);off(display.scroller,"drop",dragEnd);if(!moved){e_preventDefault(e);if(!behavior.addNew){extendSelection(cm.doc,pos,null,null,behavior.extend)}
if((webkit&&!safari)||ie&&ie_version==9){setTimeout(function(){display.wrapper.ownerDocument.body.focus({preventScroll:!0});display.input.focus()},20)}else{display.input.focus()}}});var mouseMove=function(e2){moved=moved||Math.abs(event.clientX-e2.clientX)+Math.abs(event.clientY-e2.clientY)>=10};var dragStart=function(){return moved=!0};if(webkit){display.scroller.draggable=!0}
cm.state.draggingText=dragEnd;dragEnd.copy=!behavior.moveOnDrag;on(display.wrapper.ownerDocument,"mouseup",dragEnd);on(display.wrapper.ownerDocument,"mousemove",mouseMove);on(display.scroller,"dragstart",dragStart);on(display.scroller,"drop",dragEnd);cm.state.delayingBlurEvent=!0;setTimeout(function(){return display.input.focus()},20);if(display.scroller.dragDrop){display.scroller.dragDrop()}}
function rangeForUnit(cm,pos,unit){if(unit=="char"){return new Range(pos,pos)}
if(unit=="word"){return cm.findWordAt(pos)}
if(unit=="line"){return new Range(Pos(pos.line,0),clipPos(cm.doc,Pos(pos.line+1,0)))}
var result=unit(cm,pos);return new Range(result.from,result.to)}
function leftButtonSelect(cm,event,start,behavior){if(ie){delayBlurEvent(cm)}
var display=cm.display,doc$1=cm.doc;e_preventDefault(event);var ourRange,ourIndex,startSel=doc$1.sel,ranges=startSel.ranges;if(behavior.addNew&&!behavior.extend){ourIndex=doc$1.sel.contains(start);if(ourIndex>-1){ourRange=ranges[ourIndex]}else{ourRange=new Range(start,start)}}else{ourRange=doc$1.sel.primary();ourIndex=doc$1.sel.primIndex}
if(behavior.unit=="rectangle"){if(!behavior.addNew){ourRange=new Range(start,start)}
start=posFromMouse(cm,event,!0,!0);ourIndex=-1}else{var range=rangeForUnit(cm,start,behavior.unit);if(behavior.extend){ourRange=extendRange(ourRange,range.anchor,range.head,behavior.extend)}else{ourRange=range}}
if(!behavior.addNew){ourIndex=0;setSelection(doc$1,new Selection([ourRange],0),sel_mouse);startSel=doc$1.sel}else if(ourIndex==-1){ourIndex=ranges.length;setSelection(doc$1,normalizeSelection(cm,ranges.concat([ourRange]),ourIndex),{scroll:!1,origin:"*mouse"})}else if(ranges.length>1&&ranges[ourIndex].empty()&&behavior.unit=="char"&&!behavior.extend){setSelection(doc$1,normalizeSelection(cm,ranges.slice(0,ourIndex).concat(ranges.slice(ourIndex+1)),0),{scroll:!1,origin:"*mouse"});startSel=doc$1.sel}else{replaceOneSelection(doc$1,ourIndex,ourRange,sel_mouse)}
var lastPos=start;function extendTo(pos){if(cmp(lastPos,pos)==0){return}
lastPos=pos;if(behavior.unit=="rectangle"){var ranges=[],tabSize=cm.options.tabSize;var startCol=countColumn(getLine(doc$1,start.line).text,start.ch,tabSize);var posCol=countColumn(getLine(doc$1,pos.line).text,pos.ch,tabSize);var left=Math.min(startCol,posCol),right=Math.max(startCol,posCol);for(var line=Math.min(start.line,pos.line),end=Math.min(cm.lastLine(),Math.max(start.line,pos.line));line<=end;line++){var text=getLine(doc$1,line).text,leftPos=findColumn(text,left,tabSize);if(left==right){ranges.push(new Range(Pos(line,leftPos),Pos(line,leftPos)))}else if(text.length>leftPos){ranges.push(new Range(Pos(line,leftPos),Pos(line,findColumn(text,right,tabSize))))}}
if(!ranges.length){ranges.push(new Range(start,start))}
setSelection(doc$1,normalizeSelection(cm,startSel.ranges.slice(0,ourIndex).concat(ranges),ourIndex),{origin:"*mouse",scroll:!1});cm.scrollIntoView(pos)}else{var oldRange=ourRange;var range=rangeForUnit(cm,pos,behavior.unit);var anchor=oldRange.anchor,head;if(cmp(range.anchor,anchor)>0){head=range.head;anchor=minPos(oldRange.from(),range.anchor)}else{head=range.anchor;anchor=maxPos(oldRange.to(),range.head)}
var ranges$1=startSel.ranges.slice(0);ranges$1[ourIndex]=bidiSimplify(cm,new Range(clipPos(doc$1,anchor),head));setSelection(doc$1,normalizeSelection(cm,ranges$1,ourIndex),sel_mouse)}}
var editorSize=display.wrapper.getBoundingClientRect();var counter=0;function extend(e){var curCount=++counter;var cur=posFromMouse(cm,e,!0,behavior.unit=="rectangle");if(!cur){return}
if(cmp(cur,lastPos)!=0){cm.curOp.focus=activeElt(doc(cm));extendTo(cur);var visible=visibleLines(display,doc$1);if(cur.line>=visible.to||cur.line<visible.from){setTimeout(operation(cm,function(){if(counter==curCount){extend(e)}}),150)}}else{var outside=e.clientY<editorSize.top?-20:e.clientY>editorSize.bottom?20:0;if(outside){setTimeout(operation(cm,function(){if(counter!=curCount){return}
display.scroller.scrollTop+=outside;extend(e)}),50)}}}
function done(e){cm.state.selectingText=!1;counter=Infinity;if(e){e_preventDefault(e);display.input.focus()}
off(display.wrapper.ownerDocument,"mousemove",move);off(display.wrapper.ownerDocument,"mouseup",up);doc$1.history.lastSelOrigin=null}
var move=operation(cm,function(e){if(e.buttons===0||!e_button(e)){done(e)}else{extend(e)}});var up=operation(cm,done);cm.state.selectingText=up;on(display.wrapper.ownerDocument,"mousemove",move);on(display.wrapper.ownerDocument,"mouseup",up)}
function bidiSimplify(cm,range){var anchor=range.anchor;var head=range.head;var anchorLine=getLine(cm.doc,anchor.line);if(cmp(anchor,head)==0&&anchor.sticky==head.sticky){return range}
var order=getOrder(anchorLine);if(!order){return range}
var index=getBidiPartAt(order,anchor.ch,anchor.sticky),part=order[index];if(part.from!=anchor.ch&&part.to!=anchor.ch){return range}
var boundary=index+((part.from==anchor.ch)==(part.level!=1)?0:1);if(boundary==0||boundary==order.length){return range}
var leftSide;if(head.line!=anchor.line){leftSide=(head.line-anchor.line)*(cm.doc.direction=="ltr"?1:-1)>0}else{var headIndex=getBidiPartAt(order,head.ch,head.sticky);var dir=headIndex-index||(head.ch-anchor.ch)*(part.level==1?-1:1);if(headIndex==boundary-1||headIndex==boundary){leftSide=dir<0}else{leftSide=dir>0}}
var usePart=order[boundary+(leftSide?-1:0)];var from=leftSide==(usePart.level==1);var ch=from?usePart.from:usePart.to,sticky=from?"after":"before";return anchor.ch==ch&&anchor.sticky==sticky?range:new Range(new Pos(anchor.line,ch,sticky),head)}
function gutterEvent(cm,e,type,prevent){var mX,mY;if(e.touches){mX=e.touches[0].clientX;mY=e.touches[0].clientY}else{try{mX=e.clientX;mY=e.clientY}catch(e$1){return!1}}
if(mX>=Math.floor(cm.display.gutters.getBoundingClientRect().right)){return!1}
if(prevent){e_preventDefault(e)}
var display=cm.display;var lineBox=display.lineDiv.getBoundingClientRect();if(mY>lineBox.bottom||!hasHandler(cm,type)){return e_defaultPrevented(e)}
mY-=lineBox.top-display.viewOffset;for(var i=0;i<cm.display.gutterSpecs.length;++i){var g=display.gutters.childNodes[i];if(g&&g.getBoundingClientRect().right>=mX){var line=lineAtHeight(cm.doc,mY);var gutter=cm.display.gutterSpecs[i];signal(cm,type,cm,line,gutter.className,e);return e_defaultPrevented(e)}}}
function clickInGutter(cm,e){return gutterEvent(cm,e,"gutterClick",!0)}
function onContextMenu(cm,e){if(eventInWidget(cm.display,e)||contextMenuInGutter(cm,e)){return}
if(signalDOMEvent(cm,e,"contextmenu")){return}
if(!captureRightClick){cm.display.input.onContextMenu(e)}}
function contextMenuInGutter(cm,e){if(!hasHandler(cm,"gutterContextMenu")){return!1}
return gutterEvent(cm,e,"gutterContextMenu",!1)}
function themeChanged(cm){cm.display.wrapper.className=cm.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+cm.options.theme.replace(/(^|\s)\s*/g," cm-s-");clearCaches(cm)}
var Init={toString:function(){return"CodeMirror.Init"}};var defaults={};var optionHandlers={};function defineOptions(CodeMirror){var optionHandlers=CodeMirror.optionHandlers;function option(name,deflt,handle,notOnInit){CodeMirror.defaults[name]=deflt;if(handle){optionHandlers[name]=notOnInit?function(cm,val,old){if(old!=Init){handle(cm,val,old)}}:handle}}
CodeMirror.defineOption=option;CodeMirror.Init=Init;option("value","",function(cm,val){return cm.setValue(val)},!0);option("mode",null,function(cm,val){cm.doc.modeOption=val;loadMode(cm)},!0);option("indentUnit",2,loadMode,!0);option("indentWithTabs",!1);option("smartIndent",!0);option("tabSize",4,function(cm){resetModeState(cm);clearCaches(cm);regChange(cm)},!0);option("lineSeparator",null,function(cm,val){cm.doc.lineSep=val;if(!val){return}
var newBreaks=[],lineNo=cm.doc.first;cm.doc.iter(function(line){for(var pos=0;;){var found=line.text.indexOf(val,pos);if(found==-1){break}
pos=found+val.length;newBreaks.push(Pos(lineNo,found))}
lineNo++});for(var i=newBreaks.length-1;i>=0;i--){replaceRange(cm.doc,val,newBreaks[i],Pos(newBreaks[i].line,newBreaks[i].ch+val.length))}});option("specialChars",/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc]/g,function(cm,val,old){cm.state.specialChars=new RegExp(val.source+(val.test("\t")?"":"|\t"),"g");if(old!=Init){cm.refresh()}});option("specialCharPlaceholder",defaultSpecialCharPlaceholder,function(cm){return cm.refresh()},!0);option("electricChars",!0);option("inputStyle",mobile?"contenteditable":"textarea",function(){throw new Error("inputStyle can not (yet) be changed in a running editor")},!0);option("spellcheck",!1,function(cm,val){return cm.getInputField().spellcheck=val},!0);option("autocorrect",!1,function(cm,val){return cm.getInputField().autocorrect=val},!0);option("autocapitalize",!1,function(cm,val){return cm.getInputField().autocapitalize=val},!0);option("rtlMoveVisually",!windows);option("wholeLineUpdateBefore",!0);option("theme","default",function(cm){themeChanged(cm);updateGutters(cm)},!0);option("keyMap","default",function(cm,val,old){var next=getKeyMap(val);var prev=old!=Init&&getKeyMap(old);if(prev&&prev.detach){prev.detach(cm,next)}
if(next.attach){next.attach(cm,prev||null)}});option("extraKeys",null);option("configureMouse",null);option("lineWrapping",!1,wrappingChanged,!0);option("gutters",[],function(cm,val){cm.display.gutterSpecs=getGutters(val,cm.options.lineNumbers);updateGutters(cm)},!0);option("fixedGutter",!0,function(cm,val){cm.display.gutters.style.left=val?compensateForHScroll(cm.display)+"px":"0";cm.refresh()},!0);option("coverGutterNextToScrollbar",!1,function(cm){return updateScrollbars(cm)},!0);option("scrollbarStyle","native",function(cm){initScrollbars(cm);updateScrollbars(cm);cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft)},!0);option("lineNumbers",!1,function(cm,val){cm.display.gutterSpecs=getGutters(cm.options.gutters,val);updateGutters(cm)},!0);option("firstLineNumber",1,updateGutters,!0);option("lineNumberFormatter",function(integer){return integer},updateGutters,!0);option("showCursorWhenSelecting",!1,updateSelection,!0);option("resetSelectionOnContextMenu",!0);option("lineWiseCopyCut",!0);option("pasteLinesPerSelection",!0);option("selectionsMayTouch",!1);option("readOnly",!1,function(cm,val){if(val=="nocursor"){onBlur(cm);cm.display.input.blur()}
cm.display.input.readOnlyChanged(val)});option("screenReaderLabel",null,function(cm,val){val=(val==='')?null:val;cm.display.input.screenReaderLabelChanged(val)});option("disableInput",!1,function(cm,val){if(!val){cm.display.input.reset()}},!0);option("dragDrop",!0,dragDropChanged);option("allowDropFileTypes",null);option("cursorBlinkRate",530);option("cursorScrollMargin",0);option("cursorHeight",1,updateSelection,!0);option("singleCursorHeightPerLine",!0,updateSelection,!0);option("workTime",100);option("workDelay",100);option("flattenSpans",!0,resetModeState,!0);option("addModeClass",!1,resetModeState,!0);option("pollInterval",100);option("undoDepth",200,function(cm,val){return cm.doc.history.undoDepth=val});option("historyEventDelay",1250);option("viewportMargin",10,function(cm){return cm.refresh()},!0);option("maxHighlightLength",10000,resetModeState,!0);option("moveInputWithCursor",!0,function(cm,val){if(!val){cm.display.input.resetPosition()}});option("tabindex",null,function(cm,val){return cm.display.input.getField().tabIndex=val||""});option("autofocus",null);option("direction","ltr",function(cm,val){return cm.doc.setDirection(val)},!0);option("phrases",null)}
function dragDropChanged(cm,value,old){var wasOn=old&&old!=Init;if(!value!=!wasOn){var funcs=cm.display.dragFunctions;var toggle=value?on:off;toggle(cm.display.scroller,"dragstart",funcs.start);toggle(cm.display.scroller,"dragenter",funcs.enter);toggle(cm.display.scroller,"dragover",funcs.over);toggle(cm.display.scroller,"dragleave",funcs.leave);toggle(cm.display.scroller,"drop",funcs.drop)}}
function wrappingChanged(cm){if(cm.options.lineWrapping){addClass(cm.display.wrapper,"CodeMirror-wrap");cm.display.sizer.style.minWidth="";cm.display.sizerWidth=null}else{rmClass(cm.display.wrapper,"CodeMirror-wrap");findMaxLine(cm)}
estimateLineHeights(cm);regChange(cm);clearCaches(cm);setTimeout(function(){return updateScrollbars(cm)},100)}
function CodeMirror(place,options){var this$1=this;if(!(this instanceof CodeMirror)){return new CodeMirror(place,options)}
this.options=options=options?copyObj(options):{};copyObj(defaults,options,!1);var doc=options.value;if(typeof doc=="string"){doc=new Doc(doc,options.mode,null,options.lineSeparator,options.direction)}else if(options.mode){doc.modeOption=options.mode}
this.doc=doc;var input=new CodeMirror.inputStyles[options.inputStyle](this);var display=this.display=new Display(place,doc,input,options);display.wrapper.CodeMirror=this;themeChanged(this);if(options.lineWrapping){this.display.wrapper.className+=" CodeMirror-wrap"}
initScrollbars(this);this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:-1,cutIncoming:-1,selectingText:!1,draggingText:!1,highlight:new Delayed(),keySeq:null,specialChars:null};if(options.autofocus&&!mobile){display.input.focus()}
if(ie&&ie_version<11){setTimeout(function(){return this$1.display.input.reset(!0)},20)}
registerEventHandlers(this);ensureGlobalHandlers();startOperation(this);this.curOp.forceUpdate=!0;attachDoc(this,doc);if((options.autofocus&&!mobile)||this.hasFocus()){setTimeout(function(){if(this$1.hasFocus()&&!this$1.state.focused){onFocus(this$1)}},20)}else{onBlur(this)}
for(var opt in optionHandlers){if(optionHandlers.hasOwnProperty(opt)){optionHandlers[opt](this,options[opt],Init)}}
maybeUpdateLineNumberWidth(this);if(options.finishInit){options.finishInit(this)}
for(var i=0;i<initHooks.length;++i){initHooks[i](this)}
endOperation(this);if(webkit&&options.lineWrapping&&getComputedStyle(display.lineDiv).textRendering=="optimizelegibility"){display.lineDiv.style.textRendering="auto"}}
CodeMirror.defaults=defaults;CodeMirror.optionHandlers=optionHandlers;function registerEventHandlers(cm){var d=cm.display;on(d.scroller,"mousedown",operation(cm,onMouseDown));if(ie&&ie_version<11){on(d.scroller,"dblclick",operation(cm,function(e){if(signalDOMEvent(cm,e)){return}
var pos=posFromMouse(cm,e);if(!pos||clickInGutter(cm,e)||eventInWidget(cm.display,e)){return}
e_preventDefault(e);var word=cm.findWordAt(pos);extendSelection(cm.doc,word.anchor,word.head)}))}else{on(d.scroller,"dblclick",function(e){return signalDOMEvent(cm,e)||e_preventDefault(e)})}
on(d.scroller,"contextmenu",function(e){return onContextMenu(cm,e)});on(d.input.getField(),"contextmenu",function(e){if(!d.scroller.contains(e.target)){onContextMenu(cm,e)}});var touchFinished,prevTouch={end:0};function finishTouch(){if(d.activeTouch){touchFinished=setTimeout(function(){return d.activeTouch=null},1000);prevTouch=d.activeTouch;prevTouch.end=+new Date}}
function isMouseLikeTouchEvent(e){if(e.touches.length!=1){return!1}
var touch=e.touches[0];return touch.radiusX<=1&&touch.radiusY<=1}
function farAway(touch,other){if(other.left==null){return!0}
var dx=other.left-touch.left,dy=other.top-touch.top;return dx*dx+dy*dy>20*20}
on(d.scroller,"touchstart",function(e){if(!signalDOMEvent(cm,e)&&!isMouseLikeTouchEvent(e)&&!clickInGutter(cm,e)){d.input.ensurePolled();clearTimeout(touchFinished);var now=+new Date;d.activeTouch={start:now,moved:!1,prev:now-prevTouch.end<=300?prevTouch:null};if(e.touches.length==1){d.activeTouch.left=e.touches[0].pageX;d.activeTouch.top=e.touches[0].pageY}}});on(d.scroller,"touchmove",function(){if(d.activeTouch){d.activeTouch.moved=!0}});on(d.scroller,"touchend",function(e){var touch=d.activeTouch;if(touch&&!eventInWidget(d,e)&&touch.left!=null&&!touch.moved&&new Date-touch.start<300){var pos=cm.coordsChar(d.activeTouch,"page"),range;if(!touch.prev||farAway(touch,touch.prev)){range=new Range(pos,pos)}else if(!touch.prev.prev||farAway(touch,touch.prev.prev)){range=cm.findWordAt(pos)}else{range=new Range(Pos(pos.line,0),clipPos(cm.doc,Pos(pos.line+1,0)))}
cm.setSelection(range.anchor,range.head);cm.focus();e_preventDefault(e)}
finishTouch()});on(d.scroller,"touchcancel",finishTouch);on(d.scroller,"scroll",function(){if(d.scroller.clientHeight){updateScrollTop(cm,d.scroller.scrollTop);setScrollLeft(cm,d.scroller.scrollLeft,!0);signal(cm,"scroll",cm)}});on(d.scroller,"mousewheel",function(e){return onScrollWheel(cm,e)});on(d.scroller,"DOMMouseScroll",function(e){return onScrollWheel(cm,e)});on(d.wrapper,"scroll",function(){return d.wrapper.scrollTop=d.wrapper.scrollLeft=0});d.dragFunctions={enter:function(e){if(!signalDOMEvent(cm,e)){e_stop(e)}},over:function(e){if(!signalDOMEvent(cm,e)){onDragOver(cm,e);e_stop(e)}},start:function(e){return onDragStart(cm,e)},drop:operation(cm,onDrop),leave:function(e){if(!signalDOMEvent(cm,e)){clearDragCursor(cm)}}};var inp=d.input.getField();on(inp,"keyup",function(e){return onKeyUp.call(cm,e)});on(inp,"keydown",operation(cm,onKeyDown));on(inp,"keypress",operation(cm,onKeyPress));on(inp,"focus",function(e){return onFocus(cm,e)});on(inp,"blur",function(e){return onBlur(cm,e)})}
var initHooks=[];CodeMirror.defineInitHook=function(f){return initHooks.push(f)};function indentLine(cm,n,how,aggressive){var doc=cm.doc,state;if(how==null){how="add"}
if(how=="smart"){if(!doc.mode.indent){how="prev"}else{state=getContextBefore(cm,n).state}}
var tabSize=cm.options.tabSize;var line=getLine(doc,n),curSpace=countColumn(line.text,null,tabSize);if(line.stateAfter){line.stateAfter=null}
var curSpaceString=line.text.match(/^\s*/)[0],indentation;if(!aggressive&&!/\S/.test(line.text)){indentation=0;how="not"}else if(how=="smart"){indentation=doc.mode.indent(state,line.text.slice(curSpaceString.length),line.text);if(indentation==Pass||indentation>150){if(!aggressive){return}
how="prev"}}
if(how=="prev"){if(n>doc.first){indentation=countColumn(getLine(doc,n-1).text,null,tabSize)}else{indentation=0}}else if(how=="add"){indentation=curSpace+cm.options.indentUnit}else if(how=="subtract"){indentation=curSpace-cm.options.indentUnit}else if(typeof how=="number"){indentation=curSpace+how}
indentation=Math.max(0,indentation);var indentString="",pos=0;if(cm.options.indentWithTabs){for(var i=Math.floor(indentation/tabSize);i;--i){pos+=tabSize;indentString+="\t"}}
if(pos<indentation){indentString+=spaceStr(indentation-pos)}
if(indentString!=curSpaceString){replaceRange(doc,indentString,Pos(n,0),Pos(n,curSpaceString.length),"+input");line.stateAfter=null;return!0}else{for(var i$1=0;i$1<doc.sel.ranges.length;i$1++){var range=doc.sel.ranges[i$1];if(range.head.line==n&&range.head.ch<curSpaceString.length){var pos$1=Pos(n,curSpaceString.length);replaceOneSelection(doc,i$1,new Range(pos$1,pos$1));break}}}}
var lastCopied=null;function setLastCopied(newLastCopied){lastCopied=newLastCopied}
function applyTextInput(cm,inserted,deleted,sel,origin){var doc=cm.doc;cm.display.shift=!1;if(!sel){sel=doc.sel}
var recent=+new Date-200;var paste=origin=="paste"||cm.state.pasteIncoming>recent;var textLines=splitLinesAuto(inserted),multiPaste=null;if(paste&&sel.ranges.length>1){if(lastCopied&&lastCopied.text.join("\n")==inserted){if(sel.ranges.length%lastCopied.text.length==0){multiPaste=[];for(var i=0;i<lastCopied.text.length;i++){multiPaste.push(doc.splitLines(lastCopied.text[i]))}}}else if(textLines.length==sel.ranges.length&&cm.options.pasteLinesPerSelection){multiPaste=map(textLines,function(l){return[l]})}}
var updateInput=cm.curOp.updateInput;for(var i$1=sel.ranges.length-1;i$1>=0;i$1--){var range=sel.ranges[i$1];var from=range.from(),to=range.to();if(range.empty()){if(deleted&&deleted>0){from=Pos(from.line,from.ch-deleted)}else if(cm.state.overwrite&&!paste){to=Pos(to.line,Math.min(getLine(doc,to.line).text.length,to.ch+lst(textLines).length))}else if(paste&&lastCopied&&lastCopied.lineWise&&lastCopied.text.join("\n")==textLines.join("\n")){from=to=Pos(from.line,0)}}
var changeEvent={from:from,to:to,text:multiPaste?multiPaste[i$1%multiPaste.length]:textLines,origin:origin||(paste?"paste":cm.state.cutIncoming>recent?"cut":"+input")};makeChange(cm.doc,changeEvent);signalLater(cm,"inputRead",cm,changeEvent)}
if(inserted&&!paste){triggerElectric(cm,inserted)}
ensureCursorVisible(cm);if(cm.curOp.updateInput<2){cm.curOp.updateInput=updateInput}
cm.curOp.typing=!0;cm.state.pasteIncoming=cm.state.cutIncoming=-1}
function handlePaste(e,cm){var pasted=e.clipboardData&&e.clipboardData.getData("Text");if(pasted){e.preventDefault();if(!cm.isReadOnly()&&!cm.options.disableInput&&cm.hasFocus()){runInOp(cm,function(){return applyTextInput(cm,pasted,0,null,"paste")})}
return!0}}
function triggerElectric(cm,inserted){if(!cm.options.electricChars||!cm.options.smartIndent){return}
var sel=cm.doc.sel;for(var i=sel.ranges.length-1;i>=0;i--){var range=sel.ranges[i];if(range.head.ch>100||(i&&sel.ranges[i-1].head.line==range.head.line)){continue}
var mode=cm.getModeAt(range.head);var indented=!1;if(mode.electricChars){for(var j=0;j<mode.electricChars.length;j++){if(inserted.indexOf(mode.electricChars.charAt(j))>-1){indented=indentLine(cm,range.head.line,"smart");break}}}else if(mode.electricInput){if(mode.electricInput.test(getLine(cm.doc,range.head.line).text.slice(0,range.head.ch))){indented=indentLine(cm,range.head.line,"smart")}}
if(indented){signalLater(cm,"electricInput",cm,range.head.line)}}}
function copyableRanges(cm){var text=[],ranges=[];for(var i=0;i<cm.doc.sel.ranges.length;i++){var line=cm.doc.sel.ranges[i].head.line;var lineRange={anchor:Pos(line,0),head:Pos(line+1,0)};ranges.push(lineRange);text.push(cm.getRange(lineRange.anchor,lineRange.head))}
return{text:text,ranges:ranges}}
function disableBrowserMagic(field,spellcheck,autocorrect,autocapitalize){field.setAttribute("autocorrect",autocorrect?"":"off");field.setAttribute("autocapitalize",autocapitalize?"":"off");field.setAttribute("spellcheck",!!spellcheck)}
function hiddenTextarea(){var te=elt("textarea",null,null,"position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");var div=elt("div",[te],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");if(webkit){te.style.width="1000px"}else{te.setAttribute("wrap","off")}
if(ios){te.style.border="1px solid black"}
disableBrowserMagic(te);return div}
function addEditorMethods(CodeMirror){var optionHandlers=CodeMirror.optionHandlers;var helpers=CodeMirror.helpers={};CodeMirror.prototype={constructor:CodeMirror,focus:function(){win(this).focus();this.display.input.focus()},setOption:function(option,value){var options=this.options,old=options[option];if(options[option]==value&&option!="mode"){return}
options[option]=value;if(optionHandlers.hasOwnProperty(option)){operation(this,optionHandlers[option])(this,value,old)}
signal(this,"optionChange",this,option)},getOption:function(option){return this.options[option]},getDoc:function(){return this.doc},addKeyMap:function(map,bottom){this.state.keyMaps[bottom?"push":"unshift"](getKeyMap(map))},removeKeyMap:function(map){var maps=this.state.keyMaps;for(var i=0;i<maps.length;++i){if(maps[i]==map||maps[i].name==map){maps.splice(i,1);return!0}}},addOverlay:methodOp(function(spec,options){var mode=spec.token?spec:CodeMirror.getMode(this.options,spec);if(mode.startState){throw new Error("Overlays may not be stateful.")}
insertSorted(this.state.overlays,{mode:mode,modeSpec:spec,opaque:options&&options.opaque,priority:(options&&options.priority)||0},function(overlay){return overlay.priority});this.state.modeGen++;regChange(this)}),removeOverlay:methodOp(function(spec){var overlays=this.state.overlays;for(var i=0;i<overlays.length;++i){var cur=overlays[i].modeSpec;if(cur==spec||typeof spec=="string"&&cur.name==spec){overlays.splice(i,1);this.state.modeGen++;regChange(this);return}}}),indentLine:methodOp(function(n,dir,aggressive){if(typeof dir!="string"&&typeof dir!="number"){if(dir==null){dir=this.options.smartIndent?"smart":"prev"}else{dir=dir?"add":"subtract"}}
if(isLine(this.doc,n)){indentLine(this,n,dir,aggressive)}}),indentSelection:methodOp(function(how){var ranges=this.doc.sel.ranges,end=-1;for(var i=0;i<ranges.length;i++){var range=ranges[i];if(!range.empty()){var from=range.from(),to=range.to();var start=Math.max(end,from.line);end=Math.min(this.lastLine(),to.line-(to.ch?0:1))+1;for(var j=start;j<end;++j){indentLine(this,j,how)}
var newRanges=this.doc.sel.ranges;if(from.ch==0&&ranges.length==newRanges.length&&newRanges[i].from().ch>0){replaceOneSelection(this.doc,i,new Range(from,newRanges[i].to()),sel_dontScroll)}}else if(range.head.line>end){indentLine(this,range.head.line,how,!0);end=range.head.line;if(i==this.doc.sel.primIndex){ensureCursorVisible(this)}}}}),getTokenAt:function(pos,precise){return takeToken(this,pos,precise)},getLineTokens:function(line,precise){return takeToken(this,Pos(line),precise,!0)},getTokenTypeAt:function(pos){pos=clipPos(this.doc,pos);var styles=getLineStyles(this,getLine(this.doc,pos.line));var before=0,after=(styles.length-1)/2,ch=pos.ch;var type;if(ch==0){type=styles[2]}else{for(;;){var mid=(before+after)>>1;if((mid?styles[mid*2-1]:0)>=ch){after=mid}else if(styles[mid*2+1]<ch){before=mid+1}else{type=styles[mid*2+2];break}}}
var cut=type?type.indexOf("overlay "):-1;return cut<0?type:cut==0?null:type.slice(0,cut-1)},getModeAt:function(pos){var mode=this.doc.mode;if(!mode.innerMode){return mode}
return CodeMirror.innerMode(mode,this.getTokenAt(pos).state).mode},getHelper:function(pos,type){return this.getHelpers(pos,type)[0]},getHelpers:function(pos,type){var found=[];if(!helpers.hasOwnProperty(type)){return found}
var help=helpers[type],mode=this.getModeAt(pos);if(typeof mode[type]=="string"){if(help[mode[type]]){found.push(help[mode[type]])}}else if(mode[type]){for(var i=0;i<mode[type].length;i++){var val=help[mode[type][i]];if(val){found.push(val)}}}else if(mode.helperType&&help[mode.helperType]){found.push(help[mode.helperType])}else if(help[mode.name]){found.push(help[mode.name])}
for(var i$1=0;i$1<help._global.length;i$1++){var cur=help._global[i$1];if(cur.pred(mode,this)&&indexOf(found,cur.val)==-1){found.push(cur.val)}}
return found},getStateAfter:function(line,precise){var doc=this.doc;line=clipLine(doc,line==null?doc.first+doc.size-1:line);return getContextBefore(this,line+1,precise).state},cursorCoords:function(start,mode){var pos,range=this.doc.sel.primary();if(start==null){pos=range.head}else if(typeof start=="object"){pos=clipPos(this.doc,start)}else{pos=start?range.from():range.to()}
return cursorCoords(this,pos,mode||"page")},charCoords:function(pos,mode){return charCoords(this,clipPos(this.doc,pos),mode||"page")},coordsChar:function(coords,mode){coords=fromCoordSystem(this,coords,mode||"page");return coordsChar(this,coords.left,coords.top)},lineAtHeight:function(height,mode){height=fromCoordSystem(this,{top:height,left:0},mode||"page").top;return lineAtHeight(this.doc,height+this.display.viewOffset)},heightAtLine:function(line,mode,includeWidgets){var end=!1,lineObj;if(typeof line=="number"){var last=this.doc.first+this.doc.size-1;if(line<this.doc.first){line=this.doc.first}else if(line>last){line=last;end=!0}
lineObj=getLine(this.doc,line)}else{lineObj=line}
return intoCoordSystem(this,lineObj,{top:0,left:0},mode||"page",includeWidgets||end).top+(end?this.doc.height-heightAtLine(lineObj):0)},defaultTextHeight:function(){return textHeight(this.display)},defaultCharWidth:function(){return charWidth(this.display)},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(pos,node,scroll,vert,horiz){var display=this.display;pos=cursorCoords(this,clipPos(this.doc,pos));var top=pos.bottom,left=pos.left;node.style.position="absolute";node.setAttribute("cm-ignore-events","true");this.display.input.setUneditable(node);display.sizer.appendChild(node);if(vert=="over"){top=pos.top}else if(vert=="above"||vert=="near"){var vspace=Math.max(display.wrapper.clientHeight,this.doc.height),hspace=Math.max(display.sizer.clientWidth,display.lineSpace.clientWidth);if((vert=='above'||pos.bottom+node.offsetHeight>vspace)&&pos.top>node.offsetHeight){top=pos.top-node.offsetHeight}else if(pos.bottom+node.offsetHeight<=vspace){top=pos.bottom}
if(left+node.offsetWidth>hspace){left=hspace-node.offsetWidth}}
node.style.top=top+"px";node.style.left=node.style.right="";if(horiz=="right"){left=display.sizer.clientWidth-node.offsetWidth;node.style.right="0px"}else{if(horiz=="left"){left=0}else if(horiz=="middle"){left=(display.sizer.clientWidth-node.offsetWidth)/2}
node.style.left=left+"px"}
if(scroll){scrollIntoView(this,{left:left,top:top,right:left+node.offsetWidth,bottom:top+node.offsetHeight})}},triggerOnKeyDown:methodOp(onKeyDown),triggerOnKeyPress:methodOp(onKeyPress),triggerOnKeyUp:onKeyUp,triggerOnMouseDown:methodOp(onMouseDown),execCommand:function(cmd){if(commands.hasOwnProperty(cmd)){return commands[cmd].call(null,this)}},triggerElectric:methodOp(function(text){triggerElectric(this,text)}),findPosH:function(from,amount,unit,visually){var dir=1;if(amount<0){dir=-1;amount=-amount}
var cur=clipPos(this.doc,from);for(var i=0;i<amount;++i){cur=findPosH(this.doc,cur,dir,unit,visually);if(cur.hitSide){break}}
return cur},moveH:methodOp(function(dir,unit){var this$1=this;this.extendSelectionsBy(function(range){if(this$1.display.shift||this$1.doc.extend||range.empty()){return findPosH(this$1.doc,range.head,dir,unit,this$1.options.rtlMoveVisually)}else{return dir<0?range.from():range.to()}},sel_move)}),deleteH:methodOp(function(dir,unit){var sel=this.doc.sel,doc=this.doc;if(sel.somethingSelected()){doc.replaceSelection("",null,"+delete")}else{deleteNearSelection(this,function(range){var other=findPosH(doc,range.head,dir,unit,!1);return dir<0?{from:other,to:range.head}:{from:range.head,to:other}})}}),findPosV:function(from,amount,unit,goalColumn){var dir=1,x=goalColumn;if(amount<0){dir=-1;amount=-amount}
var cur=clipPos(this.doc,from);for(var i=0;i<amount;++i){var coords=cursorCoords(this,cur,"div");if(x==null){x=coords.left}else{coords.left=x}
cur=findPosV(this,coords,dir,unit);if(cur.hitSide){break}}
return cur},moveV:methodOp(function(dir,unit){var this$1=this;var doc=this.doc,goals=[];var collapse=!this.display.shift&&!doc.extend&&doc.sel.somethingSelected();doc.extendSelectionsBy(function(range){if(collapse){return dir<0?range.from():range.to()}
var headPos=cursorCoords(this$1,range.head,"div");if(range.goalColumn!=null){headPos.left=range.goalColumn}
goals.push(headPos.left);var pos=findPosV(this$1,headPos,dir,unit);if(unit=="page"&&range==doc.sel.primary()){addToScrollTop(this$1,charCoords(this$1,pos,"div").top-headPos.top)}
return pos},sel_move);if(goals.length){for(var i=0;i<doc.sel.ranges.length;i++){doc.sel.ranges[i].goalColumn=goals[i]}}}),findWordAt:function(pos){var doc=this.doc,line=getLine(doc,pos.line).text;var start=pos.ch,end=pos.ch;if(line){var helper=this.getHelper(pos,"wordChars");if((pos.sticky=="before"||end==line.length)&&start){--start}else{++end}
var startChar=line.charAt(start);var check=isWordChar(startChar,helper)?function(ch){return isWordChar(ch,helper)}:/\s/.test(startChar)?function(ch){return/\s/.test(ch)}:function(ch){return(!/\s/.test(ch)&&!isWordChar(ch))};while(start>0&&check(line.charAt(start-1))){--start}
while(end<line.length&&check(line.charAt(end))){++end}}
return new Range(Pos(pos.line,start),Pos(pos.line,end))},toggleOverwrite:function(value){if(value!=null&&value==this.state.overwrite){return}
if(this.state.overwrite=!this.state.overwrite){addClass(this.display.cursorDiv,"CodeMirror-overwrite")}else{rmClass(this.display.cursorDiv,"CodeMirror-overwrite")}
signal(this,"overwriteToggle",this,this.state.overwrite)},hasFocus:function(){return this.display.input.getField()==activeElt(doc(this))},isReadOnly:function(){return!!(this.options.readOnly||this.doc.cantEdit)},scrollTo:methodOp(function(x,y){scrollToCoords(this,x,y)}),getScrollInfo:function(){var scroller=this.display.scroller;return{left:scroller.scrollLeft,top:scroller.scrollTop,height:scroller.scrollHeight-scrollGap(this)-this.display.barHeight,width:scroller.scrollWidth-scrollGap(this)-this.display.barWidth,clientHeight:displayHeight(this),clientWidth:displayWidth(this)}},scrollIntoView:methodOp(function(range,margin){if(range==null){range={from:this.doc.sel.primary().head,to:null};if(margin==null){margin=this.options.cursorScrollMargin}}else if(typeof range=="number"){range={from:Pos(range,0),to:null}}else if(range.from==null){range={from:range,to:null}}
if(!range.to){range.to=range.from}
range.margin=margin||0;if(range.from.line!=null){scrollToRange(this,range)}else{scrollToCoordsRange(this,range.from,range.to,range.margin)}}),setSize:methodOp(function(width,height){var this$1=this;var interpret=function(val){return typeof val=="number"||/^\d+$/.test(String(val))?val+"px":val};if(width!=null){this.display.wrapper.style.width=interpret(width)}
if(height!=null){this.display.wrapper.style.height=interpret(height)}
if(this.options.lineWrapping){clearLineMeasurementCache(this)}
var lineNo=this.display.viewFrom;this.doc.iter(lineNo,this.display.viewTo,function(line){if(line.widgets){for(var i=0;i<line.widgets.length;i++){if(line.widgets[i].noHScroll){regLineChange(this$1,lineNo,"widget");break}}}
++lineNo});this.curOp.forceUpdate=!0;signal(this,"refresh",this)}),operation:function(f){return runInOp(this,f)},startOperation:function(){return startOperation(this)},endOperation:function(){return endOperation(this)},refresh:methodOp(function(){var oldHeight=this.display.cachedTextHeight;regChange(this);this.curOp.forceUpdate=!0;clearCaches(this);scrollToCoords(this,this.doc.scrollLeft,this.doc.scrollTop);updateGutterSpace(this.display);if(oldHeight==null||Math.abs(oldHeight-textHeight(this.display))>.5||this.options.lineWrapping){estimateLineHeights(this)}
signal(this,"refresh",this)}),swapDoc:methodOp(function(doc){var old=this.doc;old.cm=null;if(this.state.selectingText){this.state.selectingText()}
attachDoc(this,doc);clearCaches(this);this.display.input.reset();scrollToCoords(this,doc.scrollLeft,doc.scrollTop);this.curOp.forceScroll=!0;signalLater(this,"swapDoc",this,old);return old}),phrase:function(phraseText){var phrases=this.options.phrases;return phrases&&Object.prototype.hasOwnProperty.call(phrases,phraseText)?phrases[phraseText]:phraseText},getInputField:function(){return this.display.input.getField()},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}};eventMixin(CodeMirror);CodeMirror.registerHelper=function(type,name,value){if(!helpers.hasOwnProperty(type)){helpers[type]=CodeMirror[type]={_global:[]}}
helpers[type][name]=value};CodeMirror.registerGlobalHelper=function(type,name,predicate,value){CodeMirror.registerHelper(type,name,value);helpers[type]._global.push({pred:predicate,val:value})}}
function findPosH(doc,pos,dir,unit,visually){var oldPos=pos;var origDir=dir;var lineObj=getLine(doc,pos.line);var lineDir=visually&&doc.direction=="rtl"?-dir:dir;function findNextLine(){var l=pos.line+lineDir;if(l<doc.first||l>=doc.first+doc.size){return!1}
pos=new Pos(l,pos.ch,pos.sticky);return lineObj=getLine(doc,l)}
function moveOnce(boundToLine){var next;if(unit=="codepoint"){var ch=lineObj.text.charCodeAt(pos.ch+(dir>0?0:-1));if(isNaN(ch)){next=null}else{var astral=dir>0?ch>=0xD800&&ch<0xDC00:ch>=0xDC00&&ch<0xDFFF;next=new Pos(pos.line,Math.max(0,Math.min(lineObj.text.length,pos.ch+dir*(astral?2:1))),-dir)}}else if(visually){next=moveVisually(doc.cm,lineObj,pos,dir)}else{next=moveLogically(lineObj,pos,dir)}
if(next==null){if(!boundToLine&&findNextLine()){pos=endOfLine(visually,doc.cm,lineObj,pos.line,lineDir)}else{return!1}}else{pos=next}
return!0}
if(unit=="char"||unit=="codepoint"){moveOnce()}else if(unit=="column"){moveOnce(!0)}else if(unit=="word"||unit=="group"){var sawType=null,group=unit=="group";var helper=doc.cm&&doc.cm.getHelper(pos,"wordChars");for(var first=!0;;first=!1){if(dir<0&&!moveOnce(!first)){break}
var cur=lineObj.text.charAt(pos.ch)||"\n";var type=isWordChar(cur,helper)?"w":group&&cur=="\n"?"n":!group||/\s/.test(cur)?null:"p";if(group&&!first&&!type){type="s"}
if(sawType&&sawType!=type){if(dir<0){dir=1;moveOnce();pos.sticky="after"}
break}
if(type){sawType=type}
if(dir>0&&!moveOnce(!first)){break}}}
var result=skipAtomic(doc,pos,oldPos,origDir,!0);if(equalCursorPos(oldPos,result)){result.hitSide=!0}
return result}
function findPosV(cm,pos,dir,unit){var doc=cm.doc,x=pos.left,y;if(unit=="page"){var pageSize=Math.min(cm.display.wrapper.clientHeight,win(cm).innerHeight||doc(cm).documentElement.clientHeight);var moveAmount=Math.max(pageSize-.5*textHeight(cm.display),3);y=(dir>0?pos.bottom:pos.top)+dir*moveAmount}else if(unit=="line"){y=dir>0?pos.bottom+3:pos.top-3}
var target;for(;;){target=coordsChar(cm,x,y);if(!target.outside){break}
if(dir<0?y<=0:y>=doc.height){target.hitSide=!0;break}
y+=dir*5}
return target}
var ContentEditableInput=function(cm){this.cm=cm;this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null;this.polling=new Delayed();this.composing=null;this.gracePeriod=!1;this.readDOMTimeout=null};ContentEditableInput.prototype.init=function(display){var this$1=this;var input=this,cm=input.cm;var div=input.div=display.lineDiv;div.contentEditable=!0;disableBrowserMagic(div,cm.options.spellcheck,cm.options.autocorrect,cm.options.autocapitalize);function belongsToInput(e){for(var t=e.target;t;t=t.parentNode){if(t==div){return!0}
if(/\bCodeMirror-(?:line)?widget\b/.test(t.className)){break}}
return!1}
on(div,"paste",function(e){if(!belongsToInput(e)||signalDOMEvent(cm,e)||handlePaste(e,cm)){return}
if(ie_version<=11){setTimeout(operation(cm,function(){return this$1.updateFromDOM()}),20)}});on(div,"compositionstart",function(e){this$1.composing={data:e.data,done:!1}});on(div,"compositionupdate",function(e){if(!this$1.composing){this$1.composing={data:e.data,done:!1}}});on(div,"compositionend",function(e){if(this$1.composing){if(e.data!=this$1.composing.data){this$1.readFromDOMSoon()}
this$1.composing.done=!0}});on(div,"touchstart",function(){return input.forceCompositionEnd()});on(div,"input",function(){if(!this$1.composing){this$1.readFromDOMSoon()}});function onCopyCut(e){if(!belongsToInput(e)||signalDOMEvent(cm,e)){return}
if(cm.somethingSelected()){setLastCopied({lineWise:!1,text:cm.getSelections()});if(e.type=="cut"){cm.replaceSelection("",null,"cut")}}else if(!cm.options.lineWiseCopyCut){return}else{var ranges=copyableRanges(cm);setLastCopied({lineWise:!0,text:ranges.text});if(e.type=="cut"){cm.operation(function(){cm.setSelections(ranges.ranges,0,sel_dontScroll);cm.replaceSelection("",null,"cut")})}}
if(e.clipboardData){e.clipboardData.clearData();var content=lastCopied.text.join("\n");e.clipboardData.setData("Text",content);if(e.clipboardData.getData("Text")==content){e.preventDefault();return}}
var kludge=hiddenTextarea(),te=kludge.firstChild;cm.display.lineSpace.insertBefore(kludge,cm.display.lineSpace.firstChild);te.value=lastCopied.text.join("\n");var hadFocus=activeElt(div.ownerDocument);selectInput(te);setTimeout(function(){cm.display.lineSpace.removeChild(kludge);hadFocus.focus();if(hadFocus==div){input.showPrimarySelection()}},50)}
on(div,"copy",onCopyCut);on(div,"cut",onCopyCut)};ContentEditableInput.prototype.screenReaderLabelChanged=function(label){if(label){this.div.setAttribute('aria-label',label)}else{this.div.removeAttribute('aria-label')}};ContentEditableInput.prototype.prepareSelection=function(){var result=prepareSelection(this.cm,!1);result.focus=activeElt(this.div.ownerDocument)==this.div;return result};ContentEditableInput.prototype.showSelection=function(info,takeFocus){if(!info||!this.cm.display.view.length){return}
if(info.focus||takeFocus){this.showPrimarySelection()}
this.showMultipleSelections(info)};ContentEditableInput.prototype.getSelection=function(){return this.cm.display.wrapper.ownerDocument.getSelection()};ContentEditableInput.prototype.showPrimarySelection=function(){var sel=this.getSelection(),cm=this.cm,prim=cm.doc.sel.primary();var from=prim.from(),to=prim.to();if(cm.display.viewTo==cm.display.viewFrom||from.line>=cm.display.viewTo||to.line<cm.display.viewFrom){sel.removeAllRanges();return}
var curAnchor=domToPos(cm,sel.anchorNode,sel.anchorOffset);var curFocus=domToPos(cm,sel.focusNode,sel.focusOffset);if(curAnchor&&!curAnchor.bad&&curFocus&&!curFocus.bad&&cmp(minPos(curAnchor,curFocus),from)==0&&cmp(maxPos(curAnchor,curFocus),to)==0){return}
var view=cm.display.view;var start=(from.line>=cm.display.viewFrom&&posToDOM(cm,from))||{node:view[0].measure.map[2],offset:0};var end=to.line<cm.display.viewTo&&posToDOM(cm,to);if(!end){var measure=view[view.length-1].measure;var map=measure.maps?measure.maps[measure.maps.length-1]:measure.map;end={node:map[map.length-1],offset:map[map.length-2]-map[map.length-3]}}
if(!start||!end){sel.removeAllRanges();return}
var old=sel.rangeCount&&sel.getRangeAt(0),rng;try{rng=range(start.node,start.offset,end.offset,end.node)}catch(e){}
if(rng){if(!gecko&&cm.state.focused){sel.collapse(start.node,start.offset);if(!rng.collapsed){sel.removeAllRanges();sel.addRange(rng)}}else{sel.removeAllRanges();sel.addRange(rng)}
if(old&&sel.anchorNode==null){sel.addRange(old)}else if(gecko){this.startGracePeriod()}}
this.rememberSelection()};ContentEditableInput.prototype.startGracePeriod=function(){var this$1=this;clearTimeout(this.gracePeriod);this.gracePeriod=setTimeout(function(){this$1.gracePeriod=!1;if(this$1.selectionChanged()){this$1.cm.operation(function(){return this$1.cm.curOp.selectionChanged=!0})}},20)};ContentEditableInput.prototype.showMultipleSelections=function(info){removeChildrenAndAdd(this.cm.display.cursorDiv,info.cursors);removeChildrenAndAdd(this.cm.display.selectionDiv,info.selection)};ContentEditableInput.prototype.rememberSelection=function(){var sel=this.getSelection();this.lastAnchorNode=sel.anchorNode;this.lastAnchorOffset=sel.anchorOffset;this.lastFocusNode=sel.focusNode;this.lastFocusOffset=sel.focusOffset};ContentEditableInput.prototype.selectionInEditor=function(){var sel=this.getSelection();if(!sel.rangeCount){return!1}
var node=sel.getRangeAt(0).commonAncestorContainer;return contains(this.div,node)};ContentEditableInput.prototype.focus=function(){if(this.cm.options.readOnly!="nocursor"){if(!this.selectionInEditor()||activeElt(this.div.ownerDocument)!=this.div){this.showSelection(this.prepareSelection(),!0)}
this.div.focus()}};ContentEditableInput.prototype.blur=function(){this.div.blur()};ContentEditableInput.prototype.getField=function(){return this.div};ContentEditableInput.prototype.supportsTouch=function(){return!0};ContentEditableInput.prototype.receivedFocus=function(){var this$1=this;var input=this;if(this.selectionInEditor()){setTimeout(function(){return this$1.pollSelection()},20)}else{runInOp(this.cm,function(){return input.cm.curOp.selectionChanged=!0})}
function poll(){if(input.cm.state.focused){input.pollSelection();input.polling.set(input.cm.options.pollInterval,poll)}}
this.polling.set(this.cm.options.pollInterval,poll)};ContentEditableInput.prototype.selectionChanged=function(){var sel=this.getSelection();return sel.anchorNode!=this.lastAnchorNode||sel.anchorOffset!=this.lastAnchorOffset||sel.focusNode!=this.lastFocusNode||sel.focusOffset!=this.lastFocusOffset};ContentEditableInput.prototype.pollSelection=function(){if(this.readDOMTimeout!=null||this.gracePeriod||!this.selectionChanged()){return}
var sel=this.getSelection(),cm=this.cm;if(android&&chrome&&this.cm.display.gutterSpecs.length&&isInGutter(sel.anchorNode)){this.cm.triggerOnKeyDown({type:"keydown",keyCode:8,preventDefault:Math.abs});this.blur();this.focus();return}
if(this.composing){return}
this.rememberSelection();var anchor=domToPos(cm,sel.anchorNode,sel.anchorOffset);var head=domToPos(cm,sel.focusNode,sel.focusOffset);if(anchor&&head){runInOp(cm,function(){setSelection(cm.doc,simpleSelection(anchor,head),sel_dontScroll);if(anchor.bad||head.bad){cm.curOp.selectionChanged=!0}})}};ContentEditableInput.prototype.pollContent=function(){if(this.readDOMTimeout!=null){clearTimeout(this.readDOMTimeout);this.readDOMTimeout=null}
var cm=this.cm,display=cm.display,sel=cm.doc.sel.primary();var from=sel.from(),to=sel.to();if(from.ch==0&&from.line>cm.firstLine()){from=Pos(from.line-1,getLine(cm.doc,from.line-1).length)}
if(to.ch==getLine(cm.doc,to.line).text.length&&to.line<cm.lastLine()){to=Pos(to.line+1,0)}
if(from.line<display.viewFrom||to.line>display.viewTo-1){return!1}
var fromIndex,fromLine,fromNode;if(from.line==display.viewFrom||(fromIndex=findViewIndex(cm,from.line))==0){fromLine=lineNo(display.view[0].line);fromNode=display.view[0].node}else{fromLine=lineNo(display.view[fromIndex].line);fromNode=display.view[fromIndex-1].node.nextSibling}
var toIndex=findViewIndex(cm,to.line);var toLine,toNode;if(toIndex==display.view.length-1){toLine=display.viewTo-1;toNode=display.lineDiv.lastChild}else{toLine=lineNo(display.view[toIndex+1].line)-1;toNode=display.view[toIndex+1].node.previousSibling}
if(!fromNode){return!1}
var newText=cm.doc.splitLines(domTextBetween(cm,fromNode,toNode,fromLine,toLine));var oldText=getBetween(cm.doc,Pos(fromLine,0),Pos(toLine,getLine(cm.doc,toLine).text.length));while(newText.length>1&&oldText.length>1){if(lst(newText)==lst(oldText)){newText.pop();oldText.pop();toLine--}else if(newText[0]==oldText[0]){newText.shift();oldText.shift();fromLine++}else{break}}
var cutFront=0,cutEnd=0;var newTop=newText[0],oldTop=oldText[0],maxCutFront=Math.min(newTop.length,oldTop.length);while(cutFront<maxCutFront&&newTop.charCodeAt(cutFront)==oldTop.charCodeAt(cutFront)){++cutFront}
var newBot=lst(newText),oldBot=lst(oldText);var maxCutEnd=Math.min(newBot.length-(newText.length==1?cutFront:0),oldBot.length-(oldText.length==1?cutFront:0));while(cutEnd<maxCutEnd&&newBot.charCodeAt(newBot.length-cutEnd-1)==oldBot.charCodeAt(oldBot.length-cutEnd-1)){++cutEnd}
if(newText.length==1&&oldText.length==1&&fromLine==from.line){while(cutFront&&cutFront>from.ch&&newBot.charCodeAt(newBot.length-cutEnd-1)==oldBot.charCodeAt(oldBot.length-cutEnd-1)){cutFront--;cutEnd++}}
newText[newText.length-1]=newBot.slice(0,newBot.length-cutEnd).replace(/^\u200b+/,"");newText[0]=newText[0].slice(cutFront).replace(/\u200b+$/,"");var chFrom=Pos(fromLine,cutFront);var chTo=Pos(toLine,oldText.length?lst(oldText).length-cutEnd:0);if(newText.length>1||newText[0]||cmp(chFrom,chTo)){replaceRange(cm.doc,newText,chFrom,chTo,"+input");return!0}};ContentEditableInput.prototype.ensurePolled=function(){this.forceCompositionEnd()};ContentEditableInput.prototype.reset=function(){this.forceCompositionEnd()};ContentEditableInput.prototype.forceCompositionEnd=function(){if(!this.composing){return}
clearTimeout(this.readDOMTimeout);this.composing=null;this.updateFromDOM();this.div.blur();this.div.focus()};ContentEditableInput.prototype.readFromDOMSoon=function(){var this$1=this;if(this.readDOMTimeout!=null){return}
this.readDOMTimeout=setTimeout(function(){this$1.readDOMTimeout=null;if(this$1.composing){if(this$1.composing.done){this$1.composing=null}else{return}}
this$1.updateFromDOM()},80)};ContentEditableInput.prototype.updateFromDOM=function(){var this$1=this;if(this.cm.isReadOnly()||!this.pollContent()){runInOp(this.cm,function(){return regChange(this$1.cm)})}};ContentEditableInput.prototype.setUneditable=function(node){node.contentEditable="false"};ContentEditableInput.prototype.onKeyPress=function(e){if(e.charCode==0||this.composing){return}
e.preventDefault();if(!this.cm.isReadOnly()){operation(this.cm,applyTextInput)(this.cm,String.fromCharCode(e.charCode==null?e.keyCode:e.charCode),0)}};ContentEditableInput.prototype.readOnlyChanged=function(val){this.div.contentEditable=String(val!="nocursor")};ContentEditableInput.prototype.onContextMenu=function(){};ContentEditableInput.prototype.resetPosition=function(){};ContentEditableInput.prototype.needsContentAttribute=!0;function posToDOM(cm,pos){var view=findViewForLine(cm,pos.line);if(!view||view.hidden){return null}
var line=getLine(cm.doc,pos.line);var info=mapFromLineView(view,line,pos.line);var order=getOrder(line,cm.doc.direction),side="left";if(order){var partPos=getBidiPartAt(order,pos.ch);side=partPos%2?"right":"left"}
var result=nodeAndOffsetInLineMap(info.map,pos.ch,side);result.offset=result.collapse=="right"?result.end:result.start;return result}
function isInGutter(node){for(var scan=node;scan;scan=scan.parentNode){if(/CodeMirror-gutter-wrapper/.test(scan.className)){return!0}}
return!1}
function badPos(pos,bad){if(bad){pos.bad=!0}return pos}
function domTextBetween(cm,from,to,fromLine,toLine){var text="",closing=!1,lineSep=cm.doc.lineSeparator(),extraLinebreak=!1;function recognizeMarker(id){return function(marker){return marker.id==id}}
function close(){if(closing){text+=lineSep;if(extraLinebreak){text+=lineSep}
closing=extraLinebreak=!1}}
function addText(str){if(str){close();text+=str}}
function walk(node){if(node.nodeType==1){var cmText=node.getAttribute("cm-text");if(cmText){addText(cmText);return}
var markerID=node.getAttribute("cm-marker"),range;if(markerID){var found=cm.findMarks(Pos(fromLine,0),Pos(toLine+1,0),recognizeMarker(+markerID));if(found.length&&(range=found[0].find(0))){addText(getBetween(cm.doc,range.from,range.to).join(lineSep))}
return}
if(node.getAttribute("contenteditable")=="false"){return}
var isBlock=/^(pre|div|p|li|table|br)$/i.test(node.nodeName);if(!/^br$/i.test(node.nodeName)&&node.textContent.length==0){return}
if(isBlock){close()}
for(var i=0;i<node.childNodes.length;i++){walk(node.childNodes[i])}
if(/^(pre|p)$/i.test(node.nodeName)){extraLinebreak=!0}
if(isBlock){closing=!0}}else if(node.nodeType==3){addText(node.nodeValue.replace(/\u200b/g,"").replace(/\u00a0/g," "))}}
for(;;){walk(from);if(from==to){break}
from=from.nextSibling;extraLinebreak=!1}
return text}
function domToPos(cm,node,offset){var lineNode;if(node==cm.display.lineDiv){lineNode=cm.display.lineDiv.childNodes[offset];if(!lineNode){return badPos(cm.clipPos(Pos(cm.display.viewTo-1)),!0)}
node=null;offset=0}else{for(lineNode=node;;lineNode=lineNode.parentNode){if(!lineNode||lineNode==cm.display.lineDiv){return null}
if(lineNode.parentNode&&lineNode.parentNode==cm.display.lineDiv){break}}}
for(var i=0;i<cm.display.view.length;i++){var lineView=cm.display.view[i];if(lineView.node==lineNode){return locateNodeInLineView(lineView,node,offset)}}}
function locateNodeInLineView(lineView,node,offset){var wrapper=lineView.text.firstChild,bad=!1;if(!node||!contains(wrapper,node)){return badPos(Pos(lineNo(lineView.line),0),!0)}
if(node==wrapper){bad=!0;node=wrapper.childNodes[offset];offset=0;if(!node){var line=lineView.rest?lst(lineView.rest):lineView.line;return badPos(Pos(lineNo(line),line.text.length),bad)}}
var textNode=node.nodeType==3?node:null,topNode=node;if(!textNode&&node.childNodes.length==1&&node.firstChild.nodeType==3){textNode=node.firstChild;if(offset){offset=textNode.nodeValue.length}}
while(topNode.parentNode!=wrapper){topNode=topNode.parentNode}
var measure=lineView.measure,maps=measure.maps;function find(textNode,topNode,offset){for(var i=-1;i<(maps?maps.length:0);i++){var map=i<0?measure.map:maps[i];for(var j=0;j<map.length;j+=3){var curNode=map[j+2];if(curNode==textNode||curNode==topNode){var line=lineNo(i<0?lineView.line:lineView.rest[i]);var ch=map[j]+offset;if(offset<0||curNode!=textNode){ch=map[j+(offset?1:0)]}
return Pos(line,ch)}}}}
var found=find(textNode,topNode,offset);if(found){return badPos(found,bad)}
for(var after=topNode.nextSibling,dist=textNode?textNode.nodeValue.length-offset:0;after;after=after.nextSibling){found=find(after,after.firstChild,0);if(found){return badPos(Pos(found.line,found.ch-dist),bad)}else{dist+=after.textContent.length}}
for(var before=topNode.previousSibling,dist$1=offset;before;before=before.previousSibling){found=find(before,before.firstChild,-1);if(found){return badPos(Pos(found.line,found.ch+dist$1),bad)}else{dist$1+=before.textContent.length}}}
var TextareaInput=function(cm){this.cm=cm;this.prevInput="";this.pollingFast=!1;this.polling=new Delayed();this.hasSelection=!1;this.composing=null;this.resetting=!1};TextareaInput.prototype.init=function(display){var this$1=this;var input=this,cm=this.cm;this.createField(display);var te=this.textarea;display.wrapper.insertBefore(this.wrapper,display.wrapper.firstChild);if(ios){te.style.width="0px"}
on(te,"input",function(){if(ie&&ie_version>=9&&this$1.hasSelection){this$1.hasSelection=null}
input.poll()});on(te,"paste",function(e){if(signalDOMEvent(cm,e)||handlePaste(e,cm)){return}
cm.state.pasteIncoming=+new Date;input.fastPoll()});function prepareCopyCut(e){if(signalDOMEvent(cm,e)){return}
if(cm.somethingSelected()){setLastCopied({lineWise:!1,text:cm.getSelections()})}else if(!cm.options.lineWiseCopyCut){return}else{var ranges=copyableRanges(cm);setLastCopied({lineWise:!0,text:ranges.text});if(e.type=="cut"){cm.setSelections(ranges.ranges,null,sel_dontScroll)}else{input.prevInput="";te.value=ranges.text.join("\n");selectInput(te)}}
if(e.type=="cut"){cm.state.cutIncoming=+new Date}}
on(te,"cut",prepareCopyCut);on(te,"copy",prepareCopyCut);on(display.scroller,"paste",function(e){if(eventInWidget(display,e)||signalDOMEvent(cm,e)){return}
if(!te.dispatchEvent){cm.state.pasteIncoming=+new Date;input.focus();return}
var event=new Event("paste");event.clipboardData=e.clipboardData;te.dispatchEvent(event)});on(display.lineSpace,"selectstart",function(e){if(!eventInWidget(display,e)){e_preventDefault(e)}});on(te,"compositionstart",function(){var start=cm.getCursor("from");if(input.composing){input.composing.range.clear()}
input.composing={start:start,range:cm.markText(start,cm.getCursor("to"),{className:"CodeMirror-composing"})}});on(te,"compositionend",function(){if(input.composing){input.poll();input.composing.range.clear();input.composing=null}})};TextareaInput.prototype.createField=function(_display){this.wrapper=hiddenTextarea();this.textarea=this.wrapper.firstChild};TextareaInput.prototype.screenReaderLabelChanged=function(label){if(label){this.textarea.setAttribute('aria-label',label)}else{this.textarea.removeAttribute('aria-label')}};TextareaInput.prototype.prepareSelection=function(){var cm=this.cm,display=cm.display,doc=cm.doc;var result=prepareSelection(cm);if(cm.options.moveInputWithCursor){var headPos=cursorCoords(cm,doc.sel.primary().head,"div");var wrapOff=display.wrapper.getBoundingClientRect(),lineOff=display.lineDiv.getBoundingClientRect();result.teTop=Math.max(0,Math.min(display.wrapper.clientHeight-10,headPos.top+lineOff.top-wrapOff.top));result.teLeft=Math.max(0,Math.min(display.wrapper.clientWidth-10,headPos.left+lineOff.left-wrapOff.left))}
return result};TextareaInput.prototype.showSelection=function(drawn){var cm=this.cm,display=cm.display;removeChildrenAndAdd(display.cursorDiv,drawn.cursors);removeChildrenAndAdd(display.selectionDiv,drawn.selection);if(drawn.teTop!=null){this.wrapper.style.top=drawn.teTop+"px";this.wrapper.style.left=drawn.teLeft+"px"}};TextareaInput.prototype.reset=function(typing){if(this.contextMenuPending||this.composing&&typing){return}
var cm=this.cm;this.resetting=!0;if(cm.somethingSelected()){this.prevInput="";var content=cm.getSelection();this.textarea.value=content;if(cm.state.focused){selectInput(this.textarea)}
if(ie&&ie_version>=9){this.hasSelection=content}}else if(!typing){this.prevInput=this.textarea.value="";if(ie&&ie_version>=9){this.hasSelection=null}}
this.resetting=!1};TextareaInput.prototype.getField=function(){return this.textarea};TextareaInput.prototype.supportsTouch=function(){return!1};TextareaInput.prototype.focus=function(){if(this.cm.options.readOnly!="nocursor"&&(!mobile||activeElt(this.textarea.ownerDocument)!=this.textarea)){try{this.textarea.focus()}catch(e){}}};TextareaInput.prototype.blur=function(){this.textarea.blur()};TextareaInput.prototype.resetPosition=function(){this.wrapper.style.top=this.wrapper.style.left=0};TextareaInput.prototype.receivedFocus=function(){this.slowPoll()};TextareaInput.prototype.slowPoll=function(){var this$1=this;if(this.pollingFast){return}
this.polling.set(this.cm.options.pollInterval,function(){this$1.poll();if(this$1.cm.state.focused){this$1.slowPoll()}})};TextareaInput.prototype.fastPoll=function(){var missed=!1,input=this;input.pollingFast=!0;function p(){var changed=input.poll();if(!changed&&!missed){missed=!0;input.polling.set(60,p)}else{input.pollingFast=!1;input.slowPoll()}}
input.polling.set(20,p)};TextareaInput.prototype.poll=function(){var this$1=this;var cm=this.cm,input=this.textarea,prevInput=this.prevInput;if(this.contextMenuPending||this.resetting||!cm.state.focused||(hasSelection(input)&&!prevInput&&!this.composing)||cm.isReadOnly()||cm.options.disableInput||cm.state.keySeq){return!1}
var text=input.value;if(text==prevInput&&!cm.somethingSelected()){return!1}
if(ie&&ie_version>=9&&this.hasSelection===text||mac&&/[\uf700-\uf7ff]/.test(text)){cm.display.input.reset();return!1}
if(cm.doc.sel==cm.display.selForContextMenu){var first=text.charCodeAt(0);if(first==0x200b&&!prevInput){prevInput="\u200b"}
if(first==0x21da){this.reset();return this.cm.execCommand("undo")}}
var same=0,l=Math.min(prevInput.length,text.length);while(same<l&&prevInput.charCodeAt(same)==text.charCodeAt(same)){++same}
runInOp(cm,function(){applyTextInput(cm,text.slice(same),prevInput.length-same,null,this$1.composing?"*compose":null);if(text.length>1000||text.indexOf("\n")>-1){input.value=this$1.prevInput=""}else{this$1.prevInput=text}
if(this$1.composing){this$1.composing.range.clear();this$1.composing.range=cm.markText(this$1.composing.start,cm.getCursor("to"),{className:"CodeMirror-composing"})}});return!0};TextareaInput.prototype.ensurePolled=function(){if(this.pollingFast&&this.poll()){this.pollingFast=!1}};TextareaInput.prototype.onKeyPress=function(){if(ie&&ie_version>=9){this.hasSelection=null}
this.fastPoll()};TextareaInput.prototype.onContextMenu=function(e){var input=this,cm=input.cm,display=cm.display,te=input.textarea;if(input.contextMenuPending){input.contextMenuPending()}
var pos=posFromMouse(cm,e),scrollPos=display.scroller.scrollTop;if(!pos||presto){return}
var reset=cm.options.resetSelectionOnContextMenu;if(reset&&cm.doc.sel.contains(pos)==-1){operation(cm,setSelection)(cm.doc,simpleSelection(pos),sel_dontScroll)}
var oldCSS=te.style.cssText,oldWrapperCSS=input.wrapper.style.cssText;var wrapperBox=input.wrapper.offsetParent.getBoundingClientRect();input.wrapper.style.cssText="position: static";te.style.cssText="position: absolute; width: 30px; height: 30px;\n      top: "+(e.clientY-wrapperBox.top-5)+"px; left: "+(e.clientX-wrapperBox.left-5)+"px;\n      z-index: 1000; background: "+(ie?"rgba(255, 255, 255, .05)":"transparent")+";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";var oldScrollY;if(webkit){oldScrollY=te.ownerDocument.defaultView.scrollY}
display.input.focus();if(webkit){te.ownerDocument.defaultView.scrollTo(null,oldScrollY)}
display.input.reset();if(!cm.somethingSelected()){te.value=input.prevInput=" "}
input.contextMenuPending=rehide;display.selForContextMenu=cm.doc.sel;clearTimeout(display.detectingSelectAll);function prepareSelectAllHack(){if(te.selectionStart!=null){var selected=cm.somethingSelected();var extval="\u200b"+(selected?te.value:"");te.value="\u21da";te.value=extval;input.prevInput=selected?"":"\u200b";te.selectionStart=1;te.selectionEnd=extval.length;display.selForContextMenu=cm.doc.sel}}
function rehide(){if(input.contextMenuPending!=rehide){return}
input.contextMenuPending=!1;input.wrapper.style.cssText=oldWrapperCSS;te.style.cssText=oldCSS;if(ie&&ie_version<9){display.scrollbars.setScrollTop(display.scroller.scrollTop=scrollPos)}
if(te.selectionStart!=null){if(!ie||(ie&&ie_version<9)){prepareSelectAllHack()}
var i=0,poll=function(){if(display.selForContextMenu==cm.doc.sel&&te.selectionStart==0&&te.selectionEnd>0&&input.prevInput=="\u200b"){operation(cm,selectAll)(cm)}else if(i++<10){display.detectingSelectAll=setTimeout(poll,500)}else{display.selForContextMenu=null;display.input.reset()}};display.detectingSelectAll=setTimeout(poll,200)}}
if(ie&&ie_version>=9){prepareSelectAllHack()}
if(captureRightClick){e_stop(e);var mouseup=function(){off(window,"mouseup",mouseup);setTimeout(rehide,20)};on(window,"mouseup",mouseup)}else{setTimeout(rehide,50)}};TextareaInput.prototype.readOnlyChanged=function(val){if(!val){this.reset()}
this.textarea.disabled=val=="nocursor";this.textarea.readOnly=!!val};TextareaInput.prototype.setUneditable=function(){};TextareaInput.prototype.needsContentAttribute=!1;function fromTextArea(textarea,options){options=options?copyObj(options):{};options.value=textarea.value;if(!options.tabindex&&textarea.tabIndex){options.tabindex=textarea.tabIndex}
if(!options.placeholder&&textarea.placeholder){options.placeholder=textarea.placeholder}
if(options.autofocus==null){var hasFocus=activeElt(textarea.ownerDocument);options.autofocus=hasFocus==textarea||textarea.getAttribute("autofocus")!=null&&hasFocus==document.body}
function save(){textarea.value=cm.getValue()}
var realSubmit;if(textarea.form){on(textarea.form,"submit",save);if(!options.leaveSubmitMethodAlone){var form=textarea.form;realSubmit=form.submit;try{var wrappedSubmit=form.submit=function(){save();form.submit=realSubmit;form.submit();form.submit=wrappedSubmit}}catch(e){}}}
options.finishInit=function(cm){cm.save=save;cm.getTextArea=function(){return textarea};cm.toTextArea=function(){cm.toTextArea=isNaN;save();textarea.parentNode.removeChild(cm.getWrapperElement());textarea.style.display="";if(textarea.form){off(textarea.form,"submit",save);if(!options.leaveSubmitMethodAlone&&typeof textarea.form.submit=="function"){textarea.form.submit=realSubmit}}}};textarea.style.display="none";var cm=CodeMirror(function(node){return textarea.parentNode.insertBefore(node,textarea.nextSibling)},options);return cm}
function addLegacyProps(CodeMirror){CodeMirror.off=off;CodeMirror.on=on;CodeMirror.wheelEventPixels=wheelEventPixels;CodeMirror.Doc=Doc;CodeMirror.splitLines=splitLinesAuto;CodeMirror.countColumn=countColumn;CodeMirror.findColumn=findColumn;CodeMirror.isWordChar=isWordCharBasic;CodeMirror.Pass=Pass;CodeMirror.signal=signal;CodeMirror.Line=Line;CodeMirror.changeEnd=changeEnd;CodeMirror.scrollbarModel=scrollbarModel;CodeMirror.Pos=Pos;CodeMirror.cmpPos=cmp;CodeMirror.modes=modes;CodeMirror.mimeModes=mimeModes;CodeMirror.resolveMode=resolveMode;CodeMirror.getMode=getMode;CodeMirror.modeExtensions=modeExtensions;CodeMirror.extendMode=extendMode;CodeMirror.copyState=copyState;CodeMirror.startState=startState;CodeMirror.innerMode=innerMode;CodeMirror.commands=commands;CodeMirror.keyMap=keyMap;CodeMirror.keyName=keyName;CodeMirror.isModifierKey=isModifierKey;CodeMirror.lookupKey=lookupKey;CodeMirror.normalizeKeyMap=normalizeKeyMap;CodeMirror.StringStream=StringStream;CodeMirror.SharedTextMarker=SharedTextMarker;CodeMirror.TextMarker=TextMarker;CodeMirror.LineWidget=LineWidget;CodeMirror.e_preventDefault=e_preventDefault;CodeMirror.e_stopPropagation=e_stopPropagation;CodeMirror.e_stop=e_stop;CodeMirror.addClass=addClass;CodeMirror.contains=contains;CodeMirror.rmClass=rmClass;CodeMirror.keyNames=keyNames}
defineOptions(CodeMirror);addEditorMethods(CodeMirror);var dontDelegate="iter insert remove copy getEditor constructor".split(" ");for(var prop in Doc.prototype){if(Doc.prototype.hasOwnProperty(prop)&&indexOf(dontDelegate,prop)<0){CodeMirror.prototype[prop]=(function(method){return function(){return method.apply(this.doc,arguments)}})(Doc.prototype[prop])}}
eventMixin(Doc);CodeMirror.inputStyles={"textarea":TextareaInput,"contenteditable":ContentEditableInput};CodeMirror.defineMode=function(name){if(!CodeMirror.defaults.mode&&name!="null"){CodeMirror.defaults.mode=name}
defineMode.apply(this,arguments)};CodeMirror.defineMIME=defineMIME;CodeMirror.defineMode("null",function(){return({token:function(stream){return stream.skipToEnd()}})});CodeMirror.defineMIME("text/plain","null");CodeMirror.defineExtension=function(name,func){CodeMirror.prototype[name]=func};CodeMirror.defineDocExtension=function(name,func){Doc.prototype[name]=func};CodeMirror.fromTextArea=fromTextArea;addLegacyProps(CodeMirror);CodeMirror.version="5.65.9";return CodeMirror})));(function(mod){if(typeof exports=="object"&&typeof module=="object")
mod(require("../../lib/codemirror"));else if(typeof define=="function"&&define.amd)
define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";var htmlConfig={autoSelfClosers:{'area':!0,'base':!0,'br':!0,'col':!0,'command':!0,'embed':!0,'frame':!0,'hr':!0,'img':!0,'input':!0,'keygen':!0,'link':!0,'meta':!0,'param':!0,'source':!0,'track':!0,'wbr':!0,'menuitem':!0},implicitlyClosed:{'dd':!0,'li':!0,'optgroup':!0,'option':!0,'p':!0,'rp':!0,'rt':!0,'tbody':!0,'td':!0,'tfoot':!0,'th':!0,'tr':!0},contextGrabbers:{'dd':{'dd':!0,'dt':!0},'dt':{'dd':!0,'dt':!0},'li':{'li':!0},'option':{'option':!0,'optgroup':!0},'optgroup':{'optgroup':!0},'p':{'address':!0,'article':!0,'aside':!0,'blockquote':!0,'dir':!0,'div':!0,'dl':!0,'fieldset':!0,'footer':!0,'form':!0,'h1':!0,'h2':!0,'h3':!0,'h4':!0,'h5':!0,'h6':!0,'header':!0,'hgroup':!0,'hr':!0,'menu':!0,'nav':!0,'ol':!0,'p':!0,'pre':!0,'section':!0,'table':!0,'ul':!0},'rp':{'rp':!0,'rt':!0},'rt':{'rp':!0,'rt':!0},'tbody':{'tbody':!0,'tfoot':!0},'td':{'td':!0,'th':!0},'tfoot':{'tbody':!0},'th':{'td':!0,'th':!0},'thead':{'tbody':!0,'tfoot':!0},'tr':{'tr':!0}},doNotIndent:{"pre":!0},allowUnquoted:!0,allowMissing:!0,caseFold:!0}
var xmlConfig={autoSelfClosers:{},implicitlyClosed:{},contextGrabbers:{},doNotIndent:{},allowUnquoted:!1,allowMissing:!1,allowMissingTagName:!1,caseFold:!1}
CodeMirror.defineMode("xml",function(editorConf,config_){var indentUnit=editorConf.indentUnit
var config={}
var defaults=config_.htmlMode?htmlConfig:xmlConfig
for(var prop in defaults)config[prop]=defaults[prop]
for(var prop in config_)config[prop]=config_[prop]
var type,setStyle;function inText(stream,state){function chain(parser){state.tokenize=parser;return parser(stream,state)}
var ch=stream.next();if(ch=="<"){if(stream.eat("!")){if(stream.eat("[")){if(stream.match("CDATA["))return chain(inBlock("atom","]]>"));else return null}else if(stream.match("--")){return chain(inBlock("comment","-->"))}else if(stream.match("DOCTYPE",!0,!0)){stream.eatWhile(/[\w\._\-]/);return chain(doctype(1))}else{return null}}else if(stream.eat("?")){stream.eatWhile(/[\w\._\-]/);state.tokenize=inBlock("meta","?>");return"meta"}else{type=stream.eat("/")?"closeTag":"openTag";state.tokenize=inTag;return"tag bracket"}}else if(ch=="&"){var ok;if(stream.eat("#")){if(stream.eat("x")){ok=stream.eatWhile(/[a-fA-F\d]/)&&stream.eat(";")}else{ok=stream.eatWhile(/[\d]/)&&stream.eat(";")}}else{ok=stream.eatWhile(/[\w\.\-:]/)&&stream.eat(";")}
return ok?"atom":"error"}else{stream.eatWhile(/[^&<]/);return null}}
inText.isInText=!0;function inTag(stream,state){var ch=stream.next();if(ch==">"||(ch=="/"&&stream.eat(">"))){state.tokenize=inText;type=ch==">"?"endTag":"selfcloseTag";return"tag bracket"}else if(ch=="="){type="equals";return null}else if(ch=="<"){state.tokenize=inText;state.state=baseState;state.tagName=state.tagStart=null;var next=state.tokenize(stream,state);return next?next+" tag error":"tag error"}else if(/[\'\"]/.test(ch)){state.tokenize=inAttribute(ch);state.stringStartCol=stream.column();return state.tokenize(stream,state)}else{stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);return"word"}}
function inAttribute(quote){var closure=function(stream,state){while(!stream.eol()){if(stream.next()==quote){state.tokenize=inTag;break}}
return"string"};closure.isInAttribute=!0;return closure}
function inBlock(style,terminator){return function(stream,state){while(!stream.eol()){if(stream.match(terminator)){state.tokenize=inText;break}
stream.next()}
return style}}
function doctype(depth){return function(stream,state){var ch;while((ch=stream.next())!=null){if(ch=="<"){state.tokenize=doctype(depth+1);return state.tokenize(stream,state)}else if(ch==">"){if(depth==1){state.tokenize=inText;break}else{state.tokenize=doctype(depth-1);return state.tokenize(stream,state)}}}
return"meta"}}
function lower(tagName){return tagName&&tagName.toLowerCase()}
function Context(state,tagName,startOfLine){this.prev=state.context;this.tagName=tagName||"";this.indent=state.indented;this.startOfLine=startOfLine;if(config.doNotIndent.hasOwnProperty(tagName)||(state.context&&state.context.noIndent))
this.noIndent=!0}
function popContext(state){if(state.context)state.context=state.context.prev}
function maybePopContext(state,nextTagName){var parentTagName;while(!0){if(!state.context){return}
parentTagName=state.context.tagName;if(!config.contextGrabbers.hasOwnProperty(lower(parentTagName))||!config.contextGrabbers[lower(parentTagName)].hasOwnProperty(lower(nextTagName))){return}
popContext(state)}}
function baseState(type,stream,state){if(type=="openTag"){state.tagStart=stream.column();return tagNameState}else if(type=="closeTag"){return closeTagNameState}else{return baseState}}
function tagNameState(type,stream,state){if(type=="word"){state.tagName=stream.current();setStyle="tag";return attrState}else if(config.allowMissingTagName&&type=="endTag"){setStyle="tag bracket";return attrState(type,stream,state)}else{setStyle="error";return tagNameState}}
function closeTagNameState(type,stream,state){if(type=="word"){var tagName=stream.current();if(state.context&&state.context.tagName!=tagName&&config.implicitlyClosed.hasOwnProperty(lower(state.context.tagName)))
popContext(state);if((state.context&&state.context.tagName==tagName)||config.matchClosing===!1){setStyle="tag";return closeState}else{setStyle="tag error";return closeStateErr}}else if(config.allowMissingTagName&&type=="endTag"){setStyle="tag bracket";return closeState(type,stream,state)}else{setStyle="error";return closeStateErr}}
function closeState(type,_stream,state){if(type!="endTag"){setStyle="error";return closeState}
popContext(state);return baseState}
function closeStateErr(type,stream,state){setStyle="error";return closeState(type,stream,state)}
function attrState(type,_stream,state){if(type=="word"){setStyle="attribute";return attrEqState}else if(type=="endTag"||type=="selfcloseTag"){var tagName=state.tagName,tagStart=state.tagStart;state.tagName=state.tagStart=null;if(type=="selfcloseTag"||config.autoSelfClosers.hasOwnProperty(lower(tagName))){maybePopContext(state,tagName)}else{maybePopContext(state,tagName);state.context=new Context(state,tagName,tagStart==state.indented)}
return baseState}
setStyle="error";return attrState}
function attrEqState(type,stream,state){if(type=="equals")return attrValueState;if(!config.allowMissing)setStyle="error";return attrState(type,stream,state)}
function attrValueState(type,stream,state){if(type=="string")return attrContinuedState;if(type=="word"&&config.allowUnquoted){setStyle="string";return attrState}
setStyle="error";return attrState(type,stream,state)}
function attrContinuedState(type,stream,state){if(type=="string")return attrContinuedState;return attrState(type,stream,state)}
return{startState:function(baseIndent){var state={tokenize:inText,state:baseState,indented:baseIndent||0,tagName:null,tagStart:null,context:null}
if(baseIndent!=null)state.baseIndent=baseIndent
return state},token:function(stream,state){if(!state.tagName&&stream.sol())
state.indented=stream.indentation();if(stream.eatSpace())return null;type=null;var style=state.tokenize(stream,state);if((style||type)&&style!="comment"){setStyle=null;state.state=state.state(type||style,stream,state);if(setStyle)
style=setStyle=="error"?style+" error":setStyle}
return style},indent:function(state,textAfter,fullLine){var context=state.context;if(state.tokenize.isInAttribute){if(state.tagStart==state.indented)
return state.stringStartCol+1;else return state.indented+indentUnit}
if(context&&context.noIndent)return CodeMirror.Pass;if(state.tokenize!=inTag&&state.tokenize!=inText)
return fullLine?fullLine.match(/^(\s*)/)[0].length:0;if(state.tagName){if(config.multilineTagIndentPastTag!==!1)
return state.tagStart+state.tagName.length+2;else return state.tagStart+indentUnit*(config.multilineTagIndentFactor||1)}
if(config.alignCDATA&&/<!\[CDATA\[/.test(textAfter))return 0;var tagAfter=textAfter&&/^<(\/)?([\w_:\.-]*)/.exec(textAfter);if(tagAfter&&tagAfter[1]){while(context){if(context.tagName==tagAfter[2]){context=context.prev;break}else if(config.implicitlyClosed.hasOwnProperty(lower(context.tagName))){context=context.prev}else{break}}}else if(tagAfter){while(context){var grabbers=config.contextGrabbers[lower(context.tagName)];if(grabbers&&grabbers.hasOwnProperty(lower(tagAfter[2])))
context=context.prev;else break}}
while(context&&context.prev&&!context.startOfLine)
context=context.prev;if(context)return context.indent+indentUnit;else return state.baseIndent||0},electricInput:/<\/[\s\w:]+>$/,blockCommentStart:"<!--",blockCommentEnd:"-->",configuration:config.htmlMode?"html":"xml",helperType:config.htmlMode?"html":"xml",skipAttribute:function(state){if(state.state==attrValueState)
state.state=attrState},xmlCurrentTag:function(state){return state.tagName?{name:state.tagName,close:state.type=="closeTag"}:null},xmlCurrentContext:function(state){var context=[]
for(var cx=state.context;cx;cx=cx.prev)
context.push(cx.tagName)
return context.reverse()}}});CodeMirror.defineMIME("text/xml","xml");CodeMirror.defineMIME("application/xml","xml");if(!CodeMirror.mimeModes.hasOwnProperty("text/html"))
CodeMirror.defineMIME("text/html",{name:"xml",htmlMode:!0})});(function(mod){if(typeof exports=="object"&&typeof module=="object")
mod(require("../../lib/codemirror"));else if(typeof define=="function"&&define.amd)
define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";CodeMirror.defineMode("javascript",function(config,parserConfig){var indentUnit=config.indentUnit;var statementIndent=parserConfig.statementIndent;var jsonldMode=parserConfig.jsonld;var jsonMode=parserConfig.json||jsonldMode;var trackScope=parserConfig.trackScope!==!1
var isTS=parserConfig.typescript;var wordRE=parserConfig.wordCharacters||/[\w$\xa1-\uffff]/;var keywords=function(){function kw(type){return{type:type,style:"keyword"}}
var A=kw("keyword a"),B=kw("keyword b"),C=kw("keyword c"),D=kw("keyword d");var operator=kw("operator"),atom={type:"atom",style:"atom"};return{"if":kw("if"),"while":A,"with":A,"else":B,"do":B,"try":B,"finally":B,"return":D,"break":D,"continue":D,"new":kw("new"),"delete":C,"void":C,"throw":C,"debugger":kw("debugger"),"var":kw("var"),"const":kw("var"),"let":kw("var"),"function":kw("function"),"catch":kw("catch"),"for":kw("for"),"switch":kw("switch"),"case":kw("case"),"default":kw("default"),"in":operator,"typeof":operator,"instanceof":operator,"true":atom,"false":atom,"null":atom,"undefined":atom,"NaN":atom,"Infinity":atom,"this":kw("this"),"class":kw("class"),"super":kw("atom"),"yield":C,"export":kw("export"),"import":kw("import"),"extends":C,"await":C}}();var isOperatorChar=/[+\-*&%=<>!?|~^@]/;var isJsonldKeyword=/^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;function readRegexp(stream){var escaped=!1,next,inSet=!1;while((next=stream.next())!=null){if(!escaped){if(next=="/"&&!inSet)return;if(next=="[")inSet=!0;else if(inSet&&next=="]")inSet=!1}
escaped=!escaped&&next=="\\"}}
var type,content;function ret(tp,style,cont){type=tp;content=cont;return style}
function tokenBase(stream,state){var ch=stream.next();if(ch=='"'||ch=="'"){state.tokenize=tokenString(ch);return state.tokenize(stream,state)}else if(ch=="."&&stream.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)){return ret("number","number")}else if(ch=="."&&stream.match("..")){return ret("spread","meta")}else if(/[\[\]{}\(\),;\:\.]/.test(ch)){return ret(ch)}else if(ch=="="&&stream.eat(">")){return ret("=>","operator")}else if(ch=="0"&&stream.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)){return ret("number","number")}else if(/\d/.test(ch)){stream.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/);return ret("number","number")}else if(ch=="/"){if(stream.eat("*")){state.tokenize=tokenComment;return tokenComment(stream,state)}else if(stream.eat("/")){stream.skipToEnd();return ret("comment","comment")}else if(expressionAllowed(stream,state,1)){readRegexp(stream);stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);return ret("regexp","string-2")}else{stream.eat("=");return ret("operator","operator",stream.current())}}else if(ch=="`"){state.tokenize=tokenQuasi;return tokenQuasi(stream,state)}else if(ch=="#"&&stream.peek()=="!"){stream.skipToEnd();return ret("meta","meta")}else if(ch=="#"&&stream.eatWhile(wordRE)){return ret("variable","property")}else if(ch=="<"&&stream.match("!--")||(ch=="-"&&stream.match("->")&&!/\S/.test(stream.string.slice(0,stream.start)))){stream.skipToEnd()
return ret("comment","comment")}else if(isOperatorChar.test(ch)){if(ch!=">"||!state.lexical||state.lexical.type!=">"){if(stream.eat("=")){if(ch=="!"||ch=="=")stream.eat("=")}else if(/[<>*+\-|&?]/.test(ch)){stream.eat(ch)
if(ch==">")stream.eat(ch)}}
if(ch=="?"&&stream.eat("."))return ret(".")
return ret("operator","operator",stream.current())}else if(wordRE.test(ch)){stream.eatWhile(wordRE);var word=stream.current()
if(state.lastType!="."){if(keywords.propertyIsEnumerable(word)){var kw=keywords[word]
return ret(kw.type,kw.style,word)}
if(word=="async"&&stream.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/,!1))
return ret("async","keyword",word)}
return ret("variable","variable",word)}}
function tokenString(quote){return function(stream,state){var escaped=!1,next;if(jsonldMode&&stream.peek()=="@"&&stream.match(isJsonldKeyword)){state.tokenize=tokenBase;return ret("jsonld-keyword","meta")}
while((next=stream.next())!=null){if(next==quote&&!escaped)break;escaped=!escaped&&next=="\\"}
if(!escaped)state.tokenize=tokenBase;return ret("string","string")}}
function tokenComment(stream,state){var maybeEnd=!1,ch;while(ch=stream.next()){if(ch=="/"&&maybeEnd){state.tokenize=tokenBase;break}
maybeEnd=(ch=="*")}
return ret("comment","comment")}
function tokenQuasi(stream,state){var escaped=!1,next;while((next=stream.next())!=null){if(!escaped&&(next=="`"||next=="$"&&stream.eat("{"))){state.tokenize=tokenBase;break}
escaped=!escaped&&next=="\\"}
return ret("quasi","string-2",stream.current())}
var brackets="([{}])";function findFatArrow(stream,state){if(state.fatArrowAt)state.fatArrowAt=null;var arrow=stream.string.indexOf("=>",stream.start);if(arrow<0)return;if(isTS){var m=/:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start,arrow))
if(m)arrow=m.index}
var depth=0,sawSomething=!1;for(var pos=arrow-1;pos>=0;--pos){var ch=stream.string.charAt(pos);var bracket=brackets.indexOf(ch);if(bracket>=0&&bracket<3){if(!depth){++pos;break}
if(--depth==0){if(ch=="(")sawSomething=!0;break}}else if(bracket>=3&&bracket<6){++depth}else if(wordRE.test(ch)){sawSomething=!0}else if(/["'\/`]/.test(ch)){for(;;--pos){if(pos==0)return
var next=stream.string.charAt(pos-1)
if(next==ch&&stream.string.charAt(pos-2)!="\\"){pos--;break}}}else if(sawSomething&&!depth){++pos;break}}
if(sawSomething&&!depth)state.fatArrowAt=pos}
var atomicTypes={"atom":!0,"number":!0,"variable":!0,"string":!0,"regexp":!0,"this":!0,"import":!0,"jsonld-keyword":!0};function JSLexical(indented,column,type,align,prev,info){this.indented=indented;this.column=column;this.type=type;this.prev=prev;this.info=info;if(align!=null)this.align=align}
function inScope(state,varname){if(!trackScope)return!1
for(var v=state.localVars;v;v=v.next)
if(v.name==varname)return!0;for(var cx=state.context;cx;cx=cx.prev){for(var v=cx.vars;v;v=v.next)
if(v.name==varname)return!0}}
function parseJS(state,style,type,content,stream){var cc=state.cc;cx.state=state;cx.stream=stream;cx.marked=null,cx.cc=cc;cx.style=style;if(!state.lexical.hasOwnProperty("align"))
state.lexical.align=!0;while(!0){var combinator=cc.length?cc.pop():jsonMode?expression:statement;if(combinator(type,content)){while(cc.length&&cc[cc.length-1].lex)
cc.pop()();if(cx.marked)return cx.marked;if(type=="variable"&&inScope(state,content))return"variable-2";return style}}}
var cx={state:null,column:null,marked:null,cc:null};function pass(){for(var i=arguments.length-1;i>=0;i--)cx.cc.push(arguments[i]);}
function cont(){pass.apply(null,arguments);return!0}
function inList(name,list){for(var v=list;v;v=v.next)if(v.name==name)return!0
return!1}
function register(varname){var state=cx.state;cx.marked="def";if(!trackScope)return
if(state.context){if(state.lexical.info=="var"&&state.context&&state.context.block){var newContext=registerVarScoped(varname,state.context)
if(newContext!=null){state.context=newContext
return}}else if(!inList(varname,state.localVars)){state.localVars=new Var(varname,state.localVars)
return}}
if(parserConfig.globalVars&&!inList(varname,state.globalVars))
state.globalVars=new Var(varname,state.globalVars)}
function registerVarScoped(varname,context){if(!context){return null}else if(context.block){var inner=registerVarScoped(varname,context.prev)
if(!inner)return null
if(inner==context.prev)return context
return new Context(inner,context.vars,!0)}else if(inList(varname,context.vars)){return context}else{return new Context(context.prev,new Var(varname,context.vars),!1)}}
function isModifier(name){return name=="public"||name=="private"||name=="protected"||name=="abstract"||name=="readonly"}
function Context(prev,vars,block){this.prev=prev;this.vars=vars;this.block=block}
function Var(name,next){this.name=name;this.next=next}
var defaultVars=new Var("this",new Var("arguments",null))
function pushcontext(){cx.state.context=new Context(cx.state.context,cx.state.localVars,!1)
cx.state.localVars=defaultVars}
function pushblockcontext(){cx.state.context=new Context(cx.state.context,cx.state.localVars,!0)
cx.state.localVars=null}
pushcontext.lex=pushblockcontext.lex=!0
function popcontext(){cx.state.localVars=cx.state.context.vars
cx.state.context=cx.state.context.prev}
popcontext.lex=!0
function pushlex(type,info){var result=function(){var state=cx.state,indent=state.indented;if(state.lexical.type=="stat")indent=state.lexical.indented;else for(var outer=state.lexical;outer&&outer.type==")"&&outer.align;outer=outer.prev)
indent=outer.indented;state.lexical=new JSLexical(indent,cx.stream.column(),type,null,state.lexical,info)};result.lex=!0;return result}
function poplex(){var state=cx.state;if(state.lexical.prev){if(state.lexical.type==")")
state.indented=state.lexical.indented;state.lexical=state.lexical.prev}}
poplex.lex=!0;function expect(wanted){function exp(type){if(type==wanted)return cont();else if(wanted==";"||type=="}"||type==")"||type=="]")return pass();else return cont(exp)};return exp}
function statement(type,value){if(type=="var")return cont(pushlex("vardef",value),vardef,expect(";"),poplex);if(type=="keyword a")return cont(pushlex("form"),parenExpr,statement,poplex);if(type=="keyword b")return cont(pushlex("form"),statement,poplex);if(type=="keyword d")return cx.stream.match(/^\s*$/,!1)?cont():cont(pushlex("stat"),maybeexpression,expect(";"),poplex);if(type=="debugger")return cont(expect(";"));if(type=="{")return cont(pushlex("}"),pushblockcontext,block,poplex,popcontext);if(type==";")return cont();if(type=="if"){if(cx.state.lexical.info=="else"&&cx.state.cc[cx.state.cc.length-1]==poplex)
cx.state.cc.pop()();return cont(pushlex("form"),parenExpr,statement,poplex,maybeelse)}
if(type=="function")return cont(functiondef);if(type=="for")return cont(pushlex("form"),pushblockcontext,forspec,statement,popcontext,poplex);if(type=="class"||(isTS&&value=="interface")){cx.marked="keyword"
return cont(pushlex("form",type=="class"?type:value),className,poplex)}
if(type=="variable"){if(isTS&&value=="declare"){cx.marked="keyword"
return cont(statement)}else if(isTS&&(value=="module"||value=="enum"||value=="type")&&cx.stream.match(/^\s*\w/,!1)){cx.marked="keyword"
if(value=="enum")return cont(enumdef);else if(value=="type")return cont(typename,expect("operator"),typeexpr,expect(";"));else return cont(pushlex("form"),pattern,expect("{"),pushlex("}"),block,poplex,poplex)}else if(isTS&&value=="namespace"){cx.marked="keyword"
return cont(pushlex("form"),expression,statement,poplex)}else if(isTS&&value=="abstract"){cx.marked="keyword"
return cont(statement)}else{return cont(pushlex("stat"),maybelabel)}}
if(type=="switch")return cont(pushlex("form"),parenExpr,expect("{"),pushlex("}","switch"),pushblockcontext,block,poplex,poplex,popcontext);if(type=="case")return cont(expression,expect(":"));if(type=="default")return cont(expect(":"));if(type=="catch")return cont(pushlex("form"),pushcontext,maybeCatchBinding,statement,poplex,popcontext);if(type=="export")return cont(pushlex("stat"),afterExport,poplex);if(type=="import")return cont(pushlex("stat"),afterImport,poplex);if(type=="async")return cont(statement)
if(value=="@")return cont(expression,statement)
return pass(pushlex("stat"),expression,expect(";"),poplex)}
function maybeCatchBinding(type){if(type=="(")return cont(funarg,expect(")"))}
function expression(type,value){return expressionInner(type,value,!1)}
function expressionNoComma(type,value){return expressionInner(type,value,!0)}
function parenExpr(type){if(type!="(")return pass()
return cont(pushlex(")"),maybeexpression,expect(")"),poplex)}
function expressionInner(type,value,noComma){if(cx.state.fatArrowAt==cx.stream.start){var body=noComma?arrowBodyNoComma:arrowBody;if(type=="(")return cont(pushcontext,pushlex(")"),commasep(funarg,")"),poplex,expect("=>"),body,popcontext);else if(type=="variable")return pass(pushcontext,pattern,expect("=>"),body,popcontext)}
var maybeop=noComma?maybeoperatorNoComma:maybeoperatorComma;if(atomicTypes.hasOwnProperty(type))return cont(maybeop);if(type=="function")return cont(functiondef,maybeop);if(type=="class"||(isTS&&value=="interface")){cx.marked="keyword";return cont(pushlex("form"),classExpression,poplex)}
if(type=="keyword c"||type=="async")return cont(noComma?expressionNoComma:expression);if(type=="(")return cont(pushlex(")"),maybeexpression,expect(")"),poplex,maybeop);if(type=="operator"||type=="spread")return cont(noComma?expressionNoComma:expression);if(type=="[")return cont(pushlex("]"),arrayLiteral,poplex,maybeop);if(type=="{")return contCommasep(objprop,"}",null,maybeop);if(type=="quasi")return pass(quasi,maybeop);if(type=="new")return cont(maybeTarget(noComma));return cont()}
function maybeexpression(type){if(type.match(/[;\}\)\],]/))return pass();return pass(expression)}
function maybeoperatorComma(type,value){if(type==",")return cont(maybeexpression);return maybeoperatorNoComma(type,value,!1)}
function maybeoperatorNoComma(type,value,noComma){var me=noComma==!1?maybeoperatorComma:maybeoperatorNoComma;var expr=noComma==!1?expression:expressionNoComma;if(type=="=>")return cont(pushcontext,noComma?arrowBodyNoComma:arrowBody,popcontext);if(type=="operator"){if(/\+\+|--/.test(value)||isTS&&value=="!")return cont(me);if(isTS&&value=="<"&&cx.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/,!1))
return cont(pushlex(">"),commasep(typeexpr,">"),poplex,me);if(value=="?")return cont(expression,expect(":"),expr);return cont(expr)}
if(type=="quasi"){return pass(quasi,me)}
if(type==";")return;if(type=="(")return contCommasep(expressionNoComma,")","call",me);if(type==".")return cont(property,me);if(type=="[")return cont(pushlex("]"),maybeexpression,expect("]"),poplex,me);if(isTS&&value=="as"){cx.marked="keyword";return cont(typeexpr,me)}
if(type=="regexp"){cx.state.lastType=cx.marked="operator"
cx.stream.backUp(cx.stream.pos-cx.stream.start-1)
return cont(expr)}}
function quasi(type,value){if(type!="quasi")return pass();if(value.slice(value.length-2)!="${")return cont(quasi);return cont(maybeexpression,continueQuasi)}
function continueQuasi(type){if(type=="}"){cx.marked="string-2";cx.state.tokenize=tokenQuasi;return cont(quasi)}}
function arrowBody(type){findFatArrow(cx.stream,cx.state);return pass(type=="{"?statement:expression)}
function arrowBodyNoComma(type){findFatArrow(cx.stream,cx.state);return pass(type=="{"?statement:expressionNoComma)}
function maybeTarget(noComma){return function(type){if(type==".")return cont(noComma?targetNoComma:target);else if(type=="variable"&&isTS)return cont(maybeTypeArgs,noComma?maybeoperatorNoComma:maybeoperatorComma)
else return pass(noComma?expressionNoComma:expression)}}
function target(_,value){if(value=="target"){cx.marked="keyword";return cont(maybeoperatorComma)}}
function targetNoComma(_,value){if(value=="target"){cx.marked="keyword";return cont(maybeoperatorNoComma)}}
function maybelabel(type){if(type==":")return cont(poplex,statement);return pass(maybeoperatorComma,expect(";"),poplex)}
function property(type){if(type=="variable"){cx.marked="property";return cont()}}
function objprop(type,value){if(type=="async"){cx.marked="property";return cont(objprop)}else if(type=="variable"||cx.style=="keyword"){cx.marked="property";if(value=="get"||value=="set")return cont(getterSetter);var m
if(isTS&&cx.state.fatArrowAt==cx.stream.start&&(m=cx.stream.match(/^\s*:\s*/,!1)))
cx.state.fatArrowAt=cx.stream.pos+m[0].length
return cont(afterprop)}else if(type=="number"||type=="string"){cx.marked=jsonldMode?"property":(cx.style+" property");return cont(afterprop)}else if(type=="jsonld-keyword"){return cont(afterprop)}else if(isTS&&isModifier(value)){cx.marked="keyword"
return cont(objprop)}else if(type=="["){return cont(expression,maybetype,expect("]"),afterprop)}else if(type=="spread"){return cont(expressionNoComma,afterprop)}else if(value=="*"){cx.marked="keyword";return cont(objprop)}else if(type==":"){return pass(afterprop)}}
function getterSetter(type){if(type!="variable")return pass(afterprop);cx.marked="property";return cont(functiondef)}
function afterprop(type){if(type==":")return cont(expressionNoComma);if(type=="(")return pass(functiondef)}
function commasep(what,end,sep){function proceed(type,value){if(sep?sep.indexOf(type)>-1:type==","){var lex=cx.state.lexical;if(lex.info=="call")lex.pos=(lex.pos||0)+1;return cont(function(type,value){if(type==end||value==end)return pass()
return pass(what)},proceed)}
if(type==end||value==end)return cont();if(sep&&sep.indexOf(";")>-1)return pass(what)
return cont(expect(end))}
return function(type,value){if(type==end||value==end)return cont();return pass(what,proceed)}}
function contCommasep(what,end,info){for(var i=3;i<arguments.length;i++)
cx.cc.push(arguments[i]);return cont(pushlex(end,info),commasep(what,end),poplex)}
function block(type){if(type=="}")return cont();return pass(statement,block)}
function maybetype(type,value){if(isTS){if(type==":")return cont(typeexpr);if(value=="?")return cont(maybetype)}}
function maybetypeOrIn(type,value){if(isTS&&(type==":"||value=="in"))return cont(typeexpr)}
function mayberettype(type){if(isTS&&type==":"){if(cx.stream.match(/^\s*\w+\s+is\b/,!1))return cont(expression,isKW,typeexpr)
else return cont(typeexpr)}}
function isKW(_,value){if(value=="is"){cx.marked="keyword"
return cont()}}
function typeexpr(type,value){if(value=="keyof"||value=="typeof"||value=="infer"||value=="readonly"){cx.marked="keyword"
return cont(value=="typeof"?expressionNoComma:typeexpr)}
if(type=="variable"||value=="void"){cx.marked="type"
return cont(afterType)}
if(value=="|"||value=="&")return cont(typeexpr)
if(type=="string"||type=="number"||type=="atom")return cont(afterType);if(type=="[")return cont(pushlex("]"),commasep(typeexpr,"]",","),poplex,afterType)
if(type=="{")return cont(pushlex("}"),typeprops,poplex,afterType)
if(type=="(")return cont(commasep(typearg,")"),maybeReturnType,afterType)
if(type=="<")return cont(commasep(typeexpr,">"),typeexpr)
if(type=="quasi"){return pass(quasiType,afterType)}}
function maybeReturnType(type){if(type=="=>")return cont(typeexpr)}
function typeprops(type){if(type.match(/[\}\)\]]/))return cont()
if(type==","||type==";")return cont(typeprops)
return pass(typeprop,typeprops)}
function typeprop(type,value){if(type=="variable"||cx.style=="keyword"){cx.marked="property"
return cont(typeprop)}else if(value=="?"||type=="number"||type=="string"){return cont(typeprop)}else if(type==":"){return cont(typeexpr)}else if(type=="["){return cont(expect("variable"),maybetypeOrIn,expect("]"),typeprop)}else if(type=="("){return pass(functiondecl,typeprop)}else if(!type.match(/[;\}\)\],]/)){return cont()}}
function quasiType(type,value){if(type!="quasi")return pass();if(value.slice(value.length-2)!="${")return cont(quasiType);return cont(typeexpr,continueQuasiType)}
function continueQuasiType(type){if(type=="}"){cx.marked="string-2";cx.state.tokenize=tokenQuasi;return cont(quasiType)}}
function typearg(type,value){if(type=="variable"&&cx.stream.match(/^\s*[?:]/,!1)||value=="?")return cont(typearg)
if(type==":")return cont(typeexpr)
if(type=="spread")return cont(typearg)
return pass(typeexpr)}
function afterType(type,value){if(value=="<")return cont(pushlex(">"),commasep(typeexpr,">"),poplex,afterType)
if(value=="|"||type=="."||value=="&")return cont(typeexpr)
if(type=="[")return cont(typeexpr,expect("]"),afterType)
if(value=="extends"||value=="implements"){cx.marked="keyword";return cont(typeexpr)}
if(value=="?")return cont(typeexpr,expect(":"),typeexpr)}
function maybeTypeArgs(_,value){if(value=="<")return cont(pushlex(">"),commasep(typeexpr,">"),poplex,afterType)}
function typeparam(){return pass(typeexpr,maybeTypeDefault)}
function maybeTypeDefault(_,value){if(value=="=")return cont(typeexpr)}
function vardef(_,value){if(value=="enum"){cx.marked="keyword";return cont(enumdef)}
return pass(pattern,maybetype,maybeAssign,vardefCont)}
function pattern(type,value){if(isTS&&isModifier(value)){cx.marked="keyword";return cont(pattern)}
if(type=="variable"){register(value);return cont()}
if(type=="spread")return cont(pattern);if(type=="[")return contCommasep(eltpattern,"]");if(type=="{")return contCommasep(proppattern,"}")}
function proppattern(type,value){if(type=="variable"&&!cx.stream.match(/^\s*:/,!1)){register(value);return cont(maybeAssign)}
if(type=="variable")cx.marked="property";if(type=="spread")return cont(pattern);if(type=="}")return pass();if(type=="[")return cont(expression,expect(']'),expect(':'),proppattern);return cont(expect(":"),pattern,maybeAssign)}
function eltpattern(){return pass(pattern,maybeAssign)}
function maybeAssign(_type,value){if(value=="=")return cont(expressionNoComma)}
function vardefCont(type){if(type==",")return cont(vardef)}
function maybeelse(type,value){if(type=="keyword b"&&value=="else")return cont(pushlex("form","else"),statement,poplex)}
function forspec(type,value){if(value=="await")return cont(forspec);if(type=="(")return cont(pushlex(")"),forspec1,poplex)}
function forspec1(type){if(type=="var")return cont(vardef,forspec2);if(type=="variable")return cont(forspec2);return pass(forspec2)}
function forspec2(type,value){if(type==")")return cont()
if(type==";")return cont(forspec2)
if(value=="in"||value=="of"){cx.marked="keyword";return cont(expression,forspec2)}
return pass(expression,forspec2)}
function functiondef(type,value){if(value=="*"){cx.marked="keyword";return cont(functiondef)}
if(type=="variable"){register(value);return cont(functiondef)}
if(type=="(")return cont(pushcontext,pushlex(")"),commasep(funarg,")"),poplex,mayberettype,statement,popcontext);if(isTS&&value=="<")return cont(pushlex(">"),commasep(typeparam,">"),poplex,functiondef)}
function functiondecl(type,value){if(value=="*"){cx.marked="keyword";return cont(functiondecl)}
if(type=="variable"){register(value);return cont(functiondecl)}
if(type=="(")return cont(pushcontext,pushlex(")"),commasep(funarg,")"),poplex,mayberettype,popcontext);if(isTS&&value=="<")return cont(pushlex(">"),commasep(typeparam,">"),poplex,functiondecl)}
function typename(type,value){if(type=="keyword"||type=="variable"){cx.marked="type"
return cont(typename)}else if(value=="<"){return cont(pushlex(">"),commasep(typeparam,">"),poplex)}}
function funarg(type,value){if(value=="@")cont(expression,funarg)
if(type=="spread")return cont(funarg);if(isTS&&isModifier(value)){cx.marked="keyword";return cont(funarg)}
if(isTS&&type=="this")return cont(maybetype,maybeAssign)
return pass(pattern,maybetype,maybeAssign)}
function classExpression(type,value){if(type=="variable")return className(type,value);return classNameAfter(type,value)}
function className(type,value){if(type=="variable"){register(value);return cont(classNameAfter)}}
function classNameAfter(type,value){if(value=="<")return cont(pushlex(">"),commasep(typeparam,">"),poplex,classNameAfter)
if(value=="extends"||value=="implements"||(isTS&&type==",")){if(value=="implements")cx.marked="keyword";return cont(isTS?typeexpr:expression,classNameAfter)}
if(type=="{")return cont(pushlex("}"),classBody,poplex)}
function classBody(type,value){if(type=="async"||(type=="variable"&&(value=="static"||value=="get"||value=="set"||(isTS&&isModifier(value)))&&cx.stream.match(/^\s+[\w$\xa1-\uffff]/,!1))){cx.marked="keyword";return cont(classBody)}
if(type=="variable"||cx.style=="keyword"){cx.marked="property";return cont(classfield,classBody)}
if(type=="number"||type=="string")return cont(classfield,classBody);if(type=="[")
return cont(expression,maybetype,expect("]"),classfield,classBody)
if(value=="*"){cx.marked="keyword";return cont(classBody)}
if(isTS&&type=="(")return pass(functiondecl,classBody)
if(type==";"||type==",")return cont(classBody);if(type=="}")return cont();if(value=="@")return cont(expression,classBody)}
function classfield(type,value){if(value=="!")return cont(classfield)
if(value=="?")return cont(classfield)
if(type==":")return cont(typeexpr,maybeAssign)
if(value=="=")return cont(expressionNoComma)
var context=cx.state.lexical.prev,isInterface=context&&context.info=="interface"
return pass(isInterface?functiondecl:functiondef)}
function afterExport(type,value){if(value=="*"){cx.marked="keyword";return cont(maybeFrom,expect(";"))}
if(value=="default"){cx.marked="keyword";return cont(expression,expect(";"))}
if(type=="{")return cont(commasep(exportField,"}"),maybeFrom,expect(";"));return pass(statement)}
function exportField(type,value){if(value=="as"){cx.marked="keyword";return cont(expect("variable"))}
if(type=="variable")return pass(expressionNoComma,exportField)}
function afterImport(type){if(type=="string")return cont();if(type=="(")return pass(expression);if(type==".")return pass(maybeoperatorComma);return pass(importSpec,maybeMoreImports,maybeFrom)}
function importSpec(type,value){if(type=="{")return contCommasep(importSpec,"}");if(type=="variable")register(value);if(value=="*")cx.marked="keyword";return cont(maybeAs)}
function maybeMoreImports(type){if(type==",")return cont(importSpec,maybeMoreImports)}
function maybeAs(_type,value){if(value=="as"){cx.marked="keyword";return cont(importSpec)}}
function maybeFrom(_type,value){if(value=="from"){cx.marked="keyword";return cont(expression)}}
function arrayLiteral(type){if(type=="]")return cont();return pass(commasep(expressionNoComma,"]"))}
function enumdef(){return pass(pushlex("form"),pattern,expect("{"),pushlex("}"),commasep(enummember,"}"),poplex,poplex)}
function enummember(){return pass(pattern,maybeAssign)}
function isContinuedStatement(state,textAfter){return state.lastType=="operator"||state.lastType==","||isOperatorChar.test(textAfter.charAt(0))||/[,.]/.test(textAfter.charAt(0))}
function expressionAllowed(stream,state,backUp){return state.tokenize==tokenBase&&/^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType)||(state.lastType=="quasi"&&/\{\s*$/.test(stream.string.slice(0,stream.pos-(backUp||0))))}
return{startState:function(basecolumn){var state={tokenize:tokenBase,lastType:"sof",cc:[],lexical:new JSLexical((basecolumn||0)-indentUnit,0,"block",!1),localVars:parserConfig.localVars,context:parserConfig.localVars&&new Context(null,null,!1),indented:basecolumn||0};if(parserConfig.globalVars&&typeof parserConfig.globalVars=="object")
state.globalVars=parserConfig.globalVars;return state},token:function(stream,state){if(stream.sol()){if(!state.lexical.hasOwnProperty("align"))
state.lexical.align=!1;state.indented=stream.indentation();findFatArrow(stream,state)}
if(state.tokenize!=tokenComment&&stream.eatSpace())return null;var style=state.tokenize(stream,state);if(type=="comment")return style;state.lastType=type=="operator"&&(content=="++"||content=="--")?"incdec":type;return parseJS(state,style,type,content,stream)},indent:function(state,textAfter){if(state.tokenize==tokenComment||state.tokenize==tokenQuasi)return CodeMirror.Pass;if(state.tokenize!=tokenBase)return 0;var firstChar=textAfter&&textAfter.charAt(0),lexical=state.lexical,top
if(!/^\s*else\b/.test(textAfter))for(var i=state.cc.length-1;i>=0;--i){var c=state.cc[i];if(c==poplex)lexical=lexical.prev;else if(c!=maybeelse&&c!=popcontext)break}
while((lexical.type=="stat"||lexical.type=="form")&&(firstChar=="}"||((top=state.cc[state.cc.length-1])&&(top==maybeoperatorComma||top==maybeoperatorNoComma)&&!/^[,\.=+\-*:?[\(]/.test(textAfter))))
lexical=lexical.prev;if(statementIndent&&lexical.type==")"&&lexical.prev.type=="stat")
lexical=lexical.prev;var type=lexical.type,closing=firstChar==type;if(type=="vardef")return lexical.indented+(state.lastType=="operator"||state.lastType==","?lexical.info.length+1:0);else if(type=="form"&&firstChar=="{")return lexical.indented;else if(type=="form")return lexical.indented+indentUnit;else if(type=="stat")
return lexical.indented+(isContinuedStatement(state,textAfter)?statementIndent||indentUnit:0);else if(lexical.info=="switch"&&!closing&&parserConfig.doubleIndentSwitch!=!1)
return lexical.indented+(/^(?:case|default)\b/.test(textAfter)?indentUnit:2*indentUnit);else if(lexical.align)return lexical.column+(closing?0:1);else return lexical.indented+(closing?0:indentUnit)},electricInput:/^\s*(?:case .*?:|default:|\{|\})$/,blockCommentStart:jsonMode?null:"/*",blockCommentEnd:jsonMode?null:"*/",blockCommentContinue:jsonMode?null:" * ",lineComment:jsonMode?null:"//",fold:"brace",closeBrackets:"()[]{}''\"\"``",helperType:jsonMode?"json":"javascript",jsonldMode:jsonldMode,jsonMode:jsonMode,expressionAllowed:expressionAllowed,skipExpression:function(state){parseJS(state,"atom","atom","true",new CodeMirror.StringStream("",2,null))}}});CodeMirror.registerHelper("wordChars","javascript",/[\w$]/);CodeMirror.defineMIME("text/javascript","javascript");CodeMirror.defineMIME("text/ecmascript","javascript");CodeMirror.defineMIME("application/javascript","javascript");CodeMirror.defineMIME("application/x-javascript","javascript");CodeMirror.defineMIME("application/ecmascript","javascript");CodeMirror.defineMIME("application/json",{name:"javascript",json:!0});CodeMirror.defineMIME("application/x-json",{name:"javascript",json:!0});CodeMirror.defineMIME("application/manifest+json",{name:"javascript",json:!0})
CodeMirror.defineMIME("application/ld+json",{name:"javascript",jsonld:!0});CodeMirror.defineMIME("text/typescript",{name:"javascript",typescript:!0});CodeMirror.defineMIME("application/typescript",{name:"javascript",typescript:!0})});(function(mod){if(typeof exports=="object"&&typeof module=="object")
mod(require("../../lib/codemirror"));else if(typeof define=="function"&&define.amd)
define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";CodeMirror.defineMode("css",function(config,parserConfig){var inline=parserConfig.inline
if(!parserConfig.propertyKeywords)parserConfig=CodeMirror.resolveMode("text/css");var indentUnit=config.indentUnit,tokenHooks=parserConfig.tokenHooks,documentTypes=parserConfig.documentTypes||{},mediaTypes=parserConfig.mediaTypes||{},mediaFeatures=parserConfig.mediaFeatures||{},mediaValueKeywords=parserConfig.mediaValueKeywords||{},propertyKeywords=parserConfig.propertyKeywords||{},nonStandardPropertyKeywords=parserConfig.nonStandardPropertyKeywords||{},fontProperties=parserConfig.fontProperties||{},counterDescriptors=parserConfig.counterDescriptors||{},colorKeywords=parserConfig.colorKeywords||{},valueKeywords=parserConfig.valueKeywords||{},allowNested=parserConfig.allowNested,lineComment=parserConfig.lineComment,supportsAtComponent=parserConfig.supportsAtComponent===!0,highlightNonStandardPropertyKeywords=config.highlightNonStandardPropertyKeywords!==!1;var type,override;function ret(style,tp){type=tp;return style}
function tokenBase(stream,state){var ch=stream.next();if(tokenHooks[ch]){var result=tokenHooks[ch](stream,state);if(result!==!1)return result}
if(ch=="@"){stream.eatWhile(/[\w\\\-]/);return ret("def",stream.current())}else if(ch=="="||(ch=="~"||ch=="|")&&stream.eat("=")){return ret(null,"compare")}else if(ch=="\""||ch=="'"){state.tokenize=tokenString(ch);return state.tokenize(stream,state)}else if(ch=="#"){stream.eatWhile(/[\w\\\-]/);return ret("atom","hash")}else if(ch=="!"){stream.match(/^\s*\w*/);return ret("keyword","important")}else if(/\d/.test(ch)||ch=="."&&stream.eat(/\d/)){stream.eatWhile(/[\w.%]/);return ret("number","unit")}else if(ch==="-"){if(/[\d.]/.test(stream.peek())){stream.eatWhile(/[\w.%]/);return ret("number","unit")}else if(stream.match(/^-[\w\\\-]*/)){stream.eatWhile(/[\w\\\-]/);if(stream.match(/^\s*:/,!1))
return ret("variable-2","variable-definition");return ret("variable-2","variable")}else if(stream.match(/^\w+-/)){return ret("meta","meta")}}else if(/[,+>*\/]/.test(ch)){return ret(null,"select-op")}else if(ch=="."&&stream.match(/^-?[_a-z][_a-z0-9-]*/i)){return ret("qualifier","qualifier")}else if(/[:;{}\[\]\(\)]/.test(ch)){return ret(null,ch)}else if(stream.match(/^[\w-.]+(?=\()/)){if(/^(url(-prefix)?|domain|regexp)$/i.test(stream.current())){state.tokenize=tokenParenthesized}
return ret("variable callee","variable")}else if(/[\w\\\-]/.test(ch)){stream.eatWhile(/[\w\\\-]/);return ret("property","word")}else{return ret(null,null)}}
function tokenString(quote){return function(stream,state){var escaped=!1,ch;while((ch=stream.next())!=null){if(ch==quote&&!escaped){if(quote==")")stream.backUp(1);break}
escaped=!escaped&&ch=="\\"}
if(ch==quote||!escaped&&quote!=")")state.tokenize=null;return ret("string","string")}}
function tokenParenthesized(stream,state){stream.next();if(!stream.match(/^\s*[\"\')]/,!1))
state.tokenize=tokenString(")");else state.tokenize=null;return ret(null,"(")}
function Context(type,indent,prev){this.type=type;this.indent=indent;this.prev=prev}
function pushContext(state,stream,type,indent){state.context=new Context(type,stream.indentation()+(indent===!1?0:indentUnit),state.context);return type}
function popContext(state){if(state.context.prev)
state.context=state.context.prev;return state.context.type}
function pass(type,stream,state){return states[state.context.type](type,stream,state)}
function popAndPass(type,stream,state,n){for(var i=n||1;i>0;i--)
state.context=state.context.prev;return pass(type,stream,state)}
function wordAsValue(stream){var word=stream.current().toLowerCase();if(valueKeywords.hasOwnProperty(word))
override="atom";else if(colorKeywords.hasOwnProperty(word))
override="keyword";else override="variable"}
var states={};states.top=function(type,stream,state){if(type=="{"){return pushContext(state,stream,"block")}else if(type=="}"&&state.context.prev){return popContext(state)}else if(supportsAtComponent&&/@component/i.test(type)){return pushContext(state,stream,"atComponentBlock")}else if(/^@(-moz-)?document$/i.test(type)){return pushContext(state,stream,"documentTypes")}else if(/^@(media|supports|(-moz-)?document|import)$/i.test(type)){return pushContext(state,stream,"atBlock")}else if(/^@(font-face|counter-style)/i.test(type)){state.stateArg=type;return"restricted_atBlock_before"}else if(/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)){return"keyframes"}else if(type&&type.charAt(0)=="@"){return pushContext(state,stream,"at")}else if(type=="hash"){override="builtin"}else if(type=="word"){override="tag"}else if(type=="variable-definition"){return"maybeprop"}else if(type=="interpolation"){return pushContext(state,stream,"interpolation")}else if(type==":"){return"pseudo"}else if(allowNested&&type=="("){return pushContext(state,stream,"parens")}
return state.context.type};states.block=function(type,stream,state){if(type=="word"){var word=stream.current().toLowerCase();if(propertyKeywords.hasOwnProperty(word)){override="property";return"maybeprop"}else if(nonStandardPropertyKeywords.hasOwnProperty(word)){override=highlightNonStandardPropertyKeywords?"string-2":"property";return"maybeprop"}else if(allowNested){override=stream.match(/^\s*:(?:\s|$)/,!1)?"property":"tag";return"block"}else{override+=" error";return"maybeprop"}}else if(type=="meta"){return"block"}else if(!allowNested&&(type=="hash"||type=="qualifier")){override="error";return"block"}else{return states.top(type,stream,state)}};states.maybeprop=function(type,stream,state){if(type==":")return pushContext(state,stream,"prop");return pass(type,stream,state)};states.prop=function(type,stream,state){if(type==";")return popContext(state);if(type=="{"&&allowNested)return pushContext(state,stream,"propBlock");if(type=="}"||type=="{")return popAndPass(type,stream,state);if(type=="(")return pushContext(state,stream,"parens");if(type=="hash"&&!/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(stream.current())){override+=" error"}else if(type=="word"){wordAsValue(stream)}else if(type=="interpolation"){return pushContext(state,stream,"interpolation")}
return"prop"};states.propBlock=function(type,_stream,state){if(type=="}")return popContext(state);if(type=="word"){override="property";return"maybeprop"}
return state.context.type};states.parens=function(type,stream,state){if(type=="{"||type=="}")return popAndPass(type,stream,state);if(type==")")return popContext(state);if(type=="(")return pushContext(state,stream,"parens");if(type=="interpolation")return pushContext(state,stream,"interpolation");if(type=="word")wordAsValue(stream);return"parens"};states.pseudo=function(type,stream,state){if(type=="meta")return"pseudo";if(type=="word"){override="variable-3";return state.context.type}
return pass(type,stream,state)};states.documentTypes=function(type,stream,state){if(type=="word"&&documentTypes.hasOwnProperty(stream.current())){override="tag";return state.context.type}else{return states.atBlock(type,stream,state)}};states.atBlock=function(type,stream,state){if(type=="(")return pushContext(state,stream,"atBlock_parens");if(type=="}"||type==";")return popAndPass(type,stream,state);if(type=="{")return popContext(state)&&pushContext(state,stream,allowNested?"block":"top");if(type=="interpolation")return pushContext(state,stream,"interpolation");if(type=="word"){var word=stream.current().toLowerCase();if(word=="only"||word=="not"||word=="and"||word=="or")
override="keyword";else if(mediaTypes.hasOwnProperty(word))
override="attribute";else if(mediaFeatures.hasOwnProperty(word))
override="property";else if(mediaValueKeywords.hasOwnProperty(word))
override="keyword";else if(propertyKeywords.hasOwnProperty(word))
override="property";else if(nonStandardPropertyKeywords.hasOwnProperty(word))
override=highlightNonStandardPropertyKeywords?"string-2":"property";else if(valueKeywords.hasOwnProperty(word))
override="atom";else if(colorKeywords.hasOwnProperty(word))
override="keyword";else override="error"}
return state.context.type};states.atComponentBlock=function(type,stream,state){if(type=="}")
return popAndPass(type,stream,state);if(type=="{")
return popContext(state)&&pushContext(state,stream,allowNested?"block":"top",!1);if(type=="word")
override="error";return state.context.type};states.atBlock_parens=function(type,stream,state){if(type==")")return popContext(state);if(type=="{"||type=="}")return popAndPass(type,stream,state,2);return states.atBlock(type,stream,state)};states.restricted_atBlock_before=function(type,stream,state){if(type=="{")
return pushContext(state,stream,"restricted_atBlock");if(type=="word"&&state.stateArg=="@counter-style"){override="variable";return"restricted_atBlock_before"}
return pass(type,stream,state)};states.restricted_atBlock=function(type,stream,state){if(type=="}"){state.stateArg=null;return popContext(state)}
if(type=="word"){if((state.stateArg=="@font-face"&&!fontProperties.hasOwnProperty(stream.current().toLowerCase()))||(state.stateArg=="@counter-style"&&!counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
override="error";else override="property";return"maybeprop"}
return"restricted_atBlock"};states.keyframes=function(type,stream,state){if(type=="word"){override="variable";return"keyframes"}
if(type=="{")return pushContext(state,stream,"top");return pass(type,stream,state)};states.at=function(type,stream,state){if(type==";")return popContext(state);if(type=="{"||type=="}")return popAndPass(type,stream,state);if(type=="word")override="tag";else if(type=="hash")override="builtin";return"at"};states.interpolation=function(type,stream,state){if(type=="}")return popContext(state);if(type=="{"||type==";")return popAndPass(type,stream,state);if(type=="word")override="variable";else if(type!="variable"&&type!="("&&type!=")")override="error";return"interpolation"};return{startState:function(base){return{tokenize:null,state:inline?"block":"top",stateArg:null,context:new Context(inline?"block":"top",base||0,null)}},token:function(stream,state){if(!state.tokenize&&stream.eatSpace())return null;var style=(state.tokenize||tokenBase)(stream,state);if(style&&typeof style=="object"){type=style[1];style=style[0]}
override=style;if(type!="comment")
state.state=states[state.state](type,stream,state);return override},indent:function(state,textAfter){var cx=state.context,ch=textAfter&&textAfter.charAt(0);var indent=cx.indent;if(cx.type=="prop"&&(ch=="}"||ch==")"))cx=cx.prev;if(cx.prev){if(ch=="}"&&(cx.type=="block"||cx.type=="top"||cx.type=="interpolation"||cx.type=="restricted_atBlock")){cx=cx.prev;indent=cx.indent}else if(ch==")"&&(cx.type=="parens"||cx.type=="atBlock_parens")||ch=="{"&&(cx.type=="at"||cx.type=="atBlock")){indent=Math.max(0,cx.indent-indentUnit)}}
return indent},electricChars:"}",blockCommentStart:"/*",blockCommentEnd:"*/",blockCommentContinue:" * ",lineComment:lineComment,fold:"brace"}});function keySet(array){var keys={};for(var i=0;i<array.length;++i){keys[array[i].toLowerCase()]=!0}
return keys}
var documentTypes_=["domain","regexp","url","url-prefix"],documentTypes=keySet(documentTypes_);var mediaTypes_=["all","aural","braille","handheld","print","projection","screen","tty","tv","embossed"],mediaTypes=keySet(mediaTypes_);var mediaFeatures_=["width","min-width","max-width","height","min-height","max-height","device-width","min-device-width","max-device-width","device-height","min-device-height","max-device-height","aspect-ratio","min-aspect-ratio","max-aspect-ratio","device-aspect-ratio","min-device-aspect-ratio","max-device-aspect-ratio","color","min-color","max-color","color-index","min-color-index","max-color-index","monochrome","min-monochrome","max-monochrome","resolution","min-resolution","max-resolution","scan","grid","orientation","device-pixel-ratio","min-device-pixel-ratio","max-device-pixel-ratio","pointer","any-pointer","hover","any-hover","prefers-color-scheme","dynamic-range","video-dynamic-range"],mediaFeatures=keySet(mediaFeatures_);var mediaValueKeywords_=["landscape","portrait","none","coarse","fine","on-demand","hover","interlace","progressive","dark","light","standard","high"],mediaValueKeywords=keySet(mediaValueKeywords_);var propertyKeywords_=["align-content","align-items","align-self","alignment-adjust","alignment-baseline","all","anchor-point","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","appearance","azimuth","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","binding","bleed","block-size","bookmark-label","bookmark-level","bookmark-state","bookmark-target","border","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","color","color-profile","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","content","counter-increment","counter-reset","crop","cue","cue-after","cue-before","cursor","direction","display","dominant-baseline","drop-initial-after-adjust","drop-initial-after-align","drop-initial-before-adjust","drop-initial-before-align","drop-initial-size","drop-initial-value","elevation","empty-cells","fit","fit-content","fit-position","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","float-offset","flow-from","flow-into","font","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-size","font-size-adjust","font-stretch","font-style","font-synthesis","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","gap","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-gap","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-gap","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphens","icon","image-orientation","image-rendering","image-resolution","inline-box-align","inset","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","left","letter-spacing","line-break","line-height","line-height-step","line-stacking","line-stacking-ruby","line-stacking-shift","line-stacking-strategy","list-style","list-style-image","list-style-position","list-style-type","margin","margin-bottom","margin-left","margin-right","margin-top","marks","marquee-direction","marquee-loop","marquee-play-count","marquee-speed","marquee-style","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","move-to","nav-down","nav-index","nav-left","nav-right","nav-up","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-style","overflow-wrap","overflow-x","overflow-y","padding","padding-bottom","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","page-policy","pause","pause-after","pause-before","perspective","perspective-origin","pitch","pitch-range","place-content","place-items","place-self","play-during","position","presentation-level","punctuation-trim","quotes","region-break-after","region-break-before","region-break-inside","region-fragment","rendering-intent","resize","rest","rest-after","rest-before","richness","right","rotate","rotation","rotation-point","row-gap","ruby-align","ruby-overhang","ruby-position","ruby-span","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-type","shape-image-threshold","shape-inside","shape-margin","shape-outside","size","speak","speak-as","speak-header","speak-numeral","speak-punctuation","speech-rate","stress","string-set","tab-size","table-layout","target","target-name","target-new","target-position","text-align","text-align-last","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-height","text-indent","text-justify","text-orientation","text-outline","text-overflow","text-rendering","text-shadow","text-size-adjust","text-space-collapse","text-transform","text-underline-position","text-wrap","top","touch-action","transform","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","user-select","vertical-align","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","volume","white-space","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","z-index","clip-path","clip-rule","mask","enable-background","filter","flood-color","flood-opacity","lighting-color","stop-color","stop-opacity","pointer-events","color-interpolation","color-interpolation-filters","color-rendering","fill","fill-opacity","fill-rule","image-rendering","marker","marker-end","marker-mid","marker-start","paint-order","shape-rendering","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","text-rendering","baseline-shift","dominant-baseline","glyph-orientation-horizontal","glyph-orientation-vertical","text-anchor","writing-mode",],propertyKeywords=keySet(propertyKeywords_);var nonStandardPropertyKeywords_=["accent-color","aspect-ratio","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","content-visibility","margin-block","margin-block-end","margin-block-start","margin-inline","margin-inline-end","margin-inline-start","overflow-anchor","overscroll-behavior","padding-block","padding-block-end","padding-block-start","padding-inline","padding-inline-end","padding-inline-start","scroll-snap-stop","scrollbar-3d-light-color","scrollbar-arrow-color","scrollbar-base-color","scrollbar-dark-shadow-color","scrollbar-face-color","scrollbar-highlight-color","scrollbar-shadow-color","scrollbar-track-color","searchfield-cancel-button","searchfield-decoration","searchfield-results-button","searchfield-results-decoration","shape-inside","zoom"],nonStandardPropertyKeywords=keySet(nonStandardPropertyKeywords_);var fontProperties_=["font-display","font-family","src","unicode-range","font-variant","font-feature-settings","font-stretch","font-weight","font-style"],fontProperties=keySet(fontProperties_);var counterDescriptors_=["additive-symbols","fallback","negative","pad","prefix","range","speak-as","suffix","symbols","system"],counterDescriptors=keySet(counterDescriptors_);var colorKeywords_=["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","grey","green","greenyellow","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","rebeccapurple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"],colorKeywords=keySet(colorKeywords_);var valueKeywords_=["above","absolute","activeborder","additive","activecaption","afar","after-white-space","ahead","alias","all","all-scroll","alphabetic","alternate","always","amharic","amharic-abegede","antialiased","appworkspace","arabic-indic","armenian","asterisks","attr","auto","auto-flow","avoid","avoid-column","avoid-page","avoid-region","axis-pan","background","backwards","baseline","below","bidi-override","binary","bengali","blink","block","block-axis","blur","bold","bolder","border","border-box","both","bottom","break","break-all","break-word","brightness","bullets","button","buttonface","buttonhighlight","buttonshadow","buttontext","calc","cambodian","capitalize","caps-lock-indicator","caption","captiontext","caret","cell","center","checkbox","circle","cjk-decimal","cjk-earthly-branch","cjk-heavenly-stem","cjk-ideographic","clear","clip","close-quote","col-resize","collapse","color","color-burn","color-dodge","column","column-reverse","compact","condensed","conic-gradient","contain","content","contents","content-box","context-menu","continuous","contrast","copy","counter","counters","cover","crop","cross","crosshair","cubic-bezier","currentcolor","cursive","cyclic","darken","dashed","decimal","decimal-leading-zero","default","default-button","dense","destination-atop","destination-in","destination-out","destination-over","devanagari","difference","disc","discard","disclosure-closed","disclosure-open","document","dot-dash","dot-dot-dash","dotted","double","down","drop-shadow","e-resize","ease","ease-in","ease-in-out","ease-out","element","ellipse","ellipsis","embed","end","ethiopic","ethiopic-abegede","ethiopic-abegede-am-et","ethiopic-abegede-gez","ethiopic-abegede-ti-er","ethiopic-abegede-ti-et","ethiopic-halehame-aa-er","ethiopic-halehame-aa-et","ethiopic-halehame-am-et","ethiopic-halehame-gez","ethiopic-halehame-om-et","ethiopic-halehame-sid-et","ethiopic-halehame-so-et","ethiopic-halehame-ti-er","ethiopic-halehame-ti-et","ethiopic-halehame-tig","ethiopic-numeric","ew-resize","exclusion","expanded","extends","extra-condensed","extra-expanded","fantasy","fast","fill","fill-box","fixed","flat","flex","flex-end","flex-start","footnotes","forwards","from","geometricPrecision","georgian","grayscale","graytext","grid","groove","gujarati","gurmukhi","hand","hangul","hangul-consonant","hard-light","hebrew","help","hidden","hide","higher","highlight","highlighttext","hiragana","hiragana-iroha","horizontal","hsl","hsla","hue","hue-rotate","icon","ignore","inactiveborder","inactivecaption","inactivecaptiontext","infinite","infobackground","infotext","inherit","initial","inline","inline-axis","inline-block","inline-flex","inline-grid","inline-table","inset","inside","intrinsic","invert","italic","japanese-formal","japanese-informal","justify","kannada","katakana","katakana-iroha","keep-all","khmer","korean-hangul-formal","korean-hanja-formal","korean-hanja-informal","landscape","lao","large","larger","left","level","lighter","lighten","line-through","linear","linear-gradient","lines","list-item","listbox","listitem","local","logical","loud","lower","lower-alpha","lower-armenian","lower-greek","lower-hexadecimal","lower-latin","lower-norwegian","lower-roman","lowercase","ltr","luminosity","malayalam","manipulation","match","matrix","matrix3d","media-play-button","media-slider","media-sliderthumb","media-volume-slider","media-volume-sliderthumb","medium","menu","menulist","menulist-button","menutext","message-box","middle","min-intrinsic","mix","mongolian","monospace","move","multiple","multiple_mask_images","multiply","myanmar","n-resize","narrower","ne-resize","nesw-resize","no-close-quote","no-drop","no-open-quote","no-repeat","none","normal","not-allowed","nowrap","ns-resize","numbers","numeric","nw-resize","nwse-resize","oblique","octal","opacity","open-quote","optimizeLegibility","optimizeSpeed","oriya","oromo","outset","outside","outside-shape","overlay","overline","padding","padding-box","painted","page","paused","persian","perspective","pinch-zoom","plus-darker","plus-lighter","pointer","polygon","portrait","pre","pre-line","pre-wrap","preserve-3d","progress","push-button","radial-gradient","radio","read-only","read-write","read-write-plaintext-only","rectangle","region","relative","repeat","repeating-linear-gradient","repeating-radial-gradient","repeating-conic-gradient","repeat-x","repeat-y","reset","reverse","rgb","rgba","ridge","right","rotate","rotate3d","rotateX","rotateY","rotateZ","round","row","row-resize","row-reverse","rtl","run-in","running","s-resize","sans-serif","saturate","saturation","scale","scale3d","scaleX","scaleY","scaleZ","screen","scroll","scrollbar","scroll-position","se-resize","searchfield","searchfield-cancel-button","searchfield-decoration","searchfield-results-button","searchfield-results-decoration","self-start","self-end","semi-condensed","semi-expanded","separate","sepia","serif","show","sidama","simp-chinese-formal","simp-chinese-informal","single","skew","skewX","skewY","skip-white-space","slide","slider-horizontal","slider-vertical","sliderthumb-horizontal","sliderthumb-vertical","slow","small","small-caps","small-caption","smaller","soft-light","solid","somali","source-atop","source-in","source-out","source-over","space","space-around","space-between","space-evenly","spell-out","square","square-button","start","static","status-bar","stretch","stroke","stroke-box","sub","subpixel-antialiased","svg_masks","super","sw-resize","symbolic","symbols","system-ui","table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row","table-row-group","tamil","telugu","text","text-bottom","text-top","textarea","textfield","thai","thick","thin","threeddarkshadow","threedface","threedhighlight","threedlightshadow","threedshadow","tibetan","tigre","tigrinya-er","tigrinya-er-abegede","tigrinya-et","tigrinya-et-abegede","to","top","trad-chinese-formal","trad-chinese-informal","transform","translate","translate3d","translateX","translateY","translateZ","transparent","ultra-condensed","ultra-expanded","underline","unidirectional-pan","unset","up","upper-alpha","upper-armenian","upper-greek","upper-hexadecimal","upper-latin","upper-norwegian","upper-roman","uppercase","urdu","url","var","vertical","vertical-text","view-box","visible","visibleFill","visiblePainted","visibleStroke","visual","w-resize","wait","wave","wider","window","windowframe","windowtext","words","wrap","wrap-reverse","x-large","x-small","xor","xx-large","xx-small"],valueKeywords=keySet(valueKeywords_);var allWords=documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_).concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_).concat(valueKeywords_);CodeMirror.registerHelper("hintWords","css",allWords);function tokenCComment(stream,state){var maybeEnd=!1,ch;while((ch=stream.next())!=null){if(maybeEnd&&ch=="/"){state.tokenize=null;break}
maybeEnd=(ch=="*")}
return["comment","comment"]}
CodeMirror.defineMIME("text/css",{documentTypes:documentTypes,mediaTypes:mediaTypes,mediaFeatures:mediaFeatures,mediaValueKeywords:mediaValueKeywords,propertyKeywords:propertyKeywords,nonStandardPropertyKeywords:nonStandardPropertyKeywords,fontProperties:fontProperties,counterDescriptors:counterDescriptors,colorKeywords:colorKeywords,valueKeywords:valueKeywords,tokenHooks:{"/":function(stream,state){if(!stream.eat("*"))return!1;state.tokenize=tokenCComment;return tokenCComment(stream,state)}},name:"css"});CodeMirror.defineMIME("text/x-scss",{mediaTypes:mediaTypes,mediaFeatures:mediaFeatures,mediaValueKeywords:mediaValueKeywords,propertyKeywords:propertyKeywords,nonStandardPropertyKeywords:nonStandardPropertyKeywords,colorKeywords:colorKeywords,valueKeywords:valueKeywords,fontProperties:fontProperties,allowNested:!0,lineComment:"//",tokenHooks:{"/":function(stream,state){if(stream.eat("/")){stream.skipToEnd();return["comment","comment"]}else if(stream.eat("*")){state.tokenize=tokenCComment;return tokenCComment(stream,state)}else{return["operator","operator"]}},":":function(stream){if(stream.match(/^\s*\{/,!1))
return[null,null]
return!1},"$":function(stream){stream.match(/^[\w-]+/);if(stream.match(/^\s*:/,!1))
return["variable-2","variable-definition"];return["variable-2","variable"]},"#":function(stream){if(!stream.eat("{"))return!1;return[null,"interpolation"]}},name:"css",helperType:"scss"});CodeMirror.defineMIME("text/x-less",{mediaTypes:mediaTypes,mediaFeatures:mediaFeatures,mediaValueKeywords:mediaValueKeywords,propertyKeywords:propertyKeywords,nonStandardPropertyKeywords:nonStandardPropertyKeywords,colorKeywords:colorKeywords,valueKeywords:valueKeywords,fontProperties:fontProperties,allowNested:!0,lineComment:"//",tokenHooks:{"/":function(stream,state){if(stream.eat("/")){stream.skipToEnd();return["comment","comment"]}else if(stream.eat("*")){state.tokenize=tokenCComment;return tokenCComment(stream,state)}else{return["operator","operator"]}},"@":function(stream){if(stream.eat("{"))return[null,"interpolation"];if(stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i,!1))return!1;stream.eatWhile(/[\w\\\-]/);if(stream.match(/^\s*:/,!1))
return["variable-2","variable-definition"];return["variable-2","variable"]},"&":function(){return["atom","atom"]}},name:"css",helperType:"less"});CodeMirror.defineMIME("text/x-gss",{documentTypes:documentTypes,mediaTypes:mediaTypes,mediaFeatures:mediaFeatures,propertyKeywords:propertyKeywords,nonStandardPropertyKeywords:nonStandardPropertyKeywords,fontProperties:fontProperties,counterDescriptors:counterDescriptors,colorKeywords:colorKeywords,valueKeywords:valueKeywords,supportsAtComponent:!0,tokenHooks:{"/":function(stream,state){if(!stream.eat("*"))return!1;state.tokenize=tokenCComment;return tokenCComment(stream,state)}},name:"css",helperType:"gss"})});(function(mod){if(typeof exports=="object"&&typeof module=="object")
mod(require("../../lib/codemirror"));else if(typeof define=="function"&&define.amd)
define(["../../lib/codemirror"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";function Context(indented,column,type,info,align,prev){this.indented=indented;this.column=column;this.type=type;this.info=info;this.align=align;this.prev=prev}
function pushContext(state,col,type,info){var indent=state.indented;if(state.context&&state.context.type=="statement"&&type!="statement")
indent=state.context.indented;return state.context=new Context(indent,col,type,info,null,state.context)}
function popContext(state){var t=state.context.type;if(t==")"||t=="]"||t=="}")
state.indented=state.context.indented;return state.context=state.context.prev}
function typeBefore(stream,state,pos){if(state.prevToken=="variable"||state.prevToken=="type")return!0;if(/\S(?:[^- ]>|[*\]])\s*$|\*$/.test(stream.string.slice(0,pos)))return!0;if(state.typeAtEndOfLine&&stream.column()==stream.indentation())return!0}
function isTopScope(context){for(;;){if(!context||context.type=="top")return!0;if(context.type=="}"&&context.prev.info!="namespace")return!1;context=context.prev}}
CodeMirror.defineMode("clike",function(config,parserConfig){var indentUnit=config.indentUnit,statementIndentUnit=parserConfig.statementIndentUnit||indentUnit,dontAlignCalls=parserConfig.dontAlignCalls,keywords=parserConfig.keywords||{},types=parserConfig.types||{},builtin=parserConfig.builtin||{},blockKeywords=parserConfig.blockKeywords||{},defKeywords=parserConfig.defKeywords||{},atoms=parserConfig.atoms||{},hooks=parserConfig.hooks||{},multiLineStrings=parserConfig.multiLineStrings,indentStatements=parserConfig.indentStatements!==!1,indentSwitch=parserConfig.indentSwitch!==!1,namespaceSeparator=parserConfig.namespaceSeparator,isPunctuationChar=parserConfig.isPunctuationChar||/[\[\]{}\(\),;\:\.]/,numberStart=parserConfig.numberStart||/[\d\.]/,number=parserConfig.number||/^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i,isOperatorChar=parserConfig.isOperatorChar||/[+\-*&%=<>!?|\/]/,isIdentifierChar=parserConfig.isIdentifierChar||/[\w\$_\xa1-\uffff]/,isReservedIdentifier=parserConfig.isReservedIdentifier||!1;var curPunc,isDefKeyword;function tokenBase(stream,state){var ch=stream.next();if(hooks[ch]){var result=hooks[ch](stream,state);if(result!==!1)return result}
if(ch=='"'||ch=="'"){state.tokenize=tokenString(ch);return state.tokenize(stream,state)}
if(numberStart.test(ch)){stream.backUp(1)
if(stream.match(number))return"number"
stream.next()}
if(isPunctuationChar.test(ch)){curPunc=ch;return null}
if(ch=="/"){if(stream.eat("*")){state.tokenize=tokenComment;return tokenComment(stream,state)}
if(stream.eat("/")){stream.skipToEnd();return"comment"}}
if(isOperatorChar.test(ch)){while(!stream.match(/^\/[\/*]/,!1)&&stream.eat(isOperatorChar)){}
return"operator"}
stream.eatWhile(isIdentifierChar);if(namespaceSeparator)while(stream.match(namespaceSeparator))
stream.eatWhile(isIdentifierChar);var cur=stream.current();if(contains(keywords,cur)){if(contains(blockKeywords,cur))curPunc="newstatement";if(contains(defKeywords,cur))isDefKeyword=!0;return"keyword"}
if(contains(types,cur))return"type";if(contains(builtin,cur)||(isReservedIdentifier&&isReservedIdentifier(cur))){if(contains(blockKeywords,cur))curPunc="newstatement";return"builtin"}
if(contains(atoms,cur))return"atom";return"variable"}
function tokenString(quote){return function(stream,state){var escaped=!1,next,end=!1;while((next=stream.next())!=null){if(next==quote&&!escaped){end=!0;break}
escaped=!escaped&&next=="\\"}
if(end||!(escaped||multiLineStrings))
state.tokenize=null;return"string"}}
function tokenComment(stream,state){var maybeEnd=!1,ch;while(ch=stream.next()){if(ch=="/"&&maybeEnd){state.tokenize=null;break}
maybeEnd=(ch=="*")}
return"comment"}
function maybeEOL(stream,state){if(parserConfig.typeFirstDefinitions&&stream.eol()&&isTopScope(state.context))
state.typeAtEndOfLine=typeBefore(stream,state,stream.pos)}
return{startState:function(basecolumn){return{tokenize:null,context:new Context((basecolumn||0)-indentUnit,0,"top",null,!1),indented:0,startOfLine:!0,prevToken:null}},token:function(stream,state){var ctx=state.context;if(stream.sol()){if(ctx.align==null)ctx.align=!1;state.indented=stream.indentation();state.startOfLine=!0}
if(stream.eatSpace()){maybeEOL(stream,state);return null}
curPunc=isDefKeyword=null;var style=(state.tokenize||tokenBase)(stream,state);if(style=="comment"||style=="meta")return style;if(ctx.align==null)ctx.align=!0;if(curPunc==";"||curPunc==":"||(curPunc==","&&stream.match(/^\s*(?:\/\/.*)?$/,!1)))
while(state.context.type=="statement")popContext(state);else if(curPunc=="{")pushContext(state,stream.column(),"}");else if(curPunc=="[")pushContext(state,stream.column(),"]");else if(curPunc=="(")pushContext(state,stream.column(),")");else if(curPunc=="}"){while(ctx.type=="statement")ctx=popContext(state);if(ctx.type=="}")ctx=popContext(state);while(ctx.type=="statement")ctx=popContext(state);}else if(curPunc==ctx.type)popContext(state);else if(indentStatements&&(((ctx.type=="}"||ctx.type=="top")&&curPunc!=";")||(ctx.type=="statement"&&curPunc=="newstatement"))){pushContext(state,stream.column(),"statement",stream.current())}
if(style=="variable"&&((state.prevToken=="def"||(parserConfig.typeFirstDefinitions&&typeBefore(stream,state,stream.start)&&isTopScope(state.context)&&stream.match(/^\s*\(/,!1)))))
style="def";if(hooks.token){var result=hooks.token(stream,state,style);if(result!==undefined)style=result}
if(style=="def"&&parserConfig.styleDefs===!1)style="variable";state.startOfLine=!1;state.prevToken=isDefKeyword?"def":style||curPunc;maybeEOL(stream,state);return style},indent:function(state,textAfter){if(state.tokenize!=tokenBase&&state.tokenize!=null||state.typeAtEndOfLine)return CodeMirror.Pass;var ctx=state.context,firstChar=textAfter&&textAfter.charAt(0);var closing=firstChar==ctx.type;if(ctx.type=="statement"&&firstChar=="}")ctx=ctx.prev;if(parserConfig.dontIndentStatements)
while(ctx.type=="statement"&&parserConfig.dontIndentStatements.test(ctx.info))
ctx=ctx.prev
if(hooks.indent){var hook=hooks.indent(state,ctx,textAfter,indentUnit);if(typeof hook=="number")return hook}
var switchBlock=ctx.prev&&ctx.prev.info=="switch";if(parserConfig.allmanIndentation&&/[{(]/.test(firstChar)){while(ctx.type!="top"&&ctx.type!="}")ctx=ctx.prev
return ctx.indented}
if(ctx.type=="statement")
return ctx.indented+(firstChar=="{"?0:statementIndentUnit);if(ctx.align&&(!dontAlignCalls||ctx.type!=")"))
return ctx.column+(closing?0:1);if(ctx.type==")"&&!closing)
return ctx.indented+statementIndentUnit;return ctx.indented+(closing?0:indentUnit)+(!closing&&switchBlock&&!/^(?:case|default)\b/.test(textAfter)?indentUnit:0)},electricInput:indentSwitch?/^\s*(?:case.*?:|default:|\{\}?|\})$/:/^\s*[{}]$/,blockCommentStart:"/*",blockCommentEnd:"*/",blockCommentContinue:" * ",lineComment:"//",fold:"brace"}});function words(str){var obj={},words=str.split(" ");for(var i=0;i<words.length;++i)obj[words[i]]=!0;return obj}
function contains(words,word){if(typeof words==="function"){return words(word)}else{return words.propertyIsEnumerable(word)}}
var cKeywords="auto if break case register continue return default do sizeof "+"static else struct switch extern typedef union for goto while enum const "+"volatile inline restrict asm fortran";var cppKeywords="alignas alignof and and_eq audit axiom bitand bitor catch "+"class compl concept constexpr const_cast decltype delete dynamic_cast "+"explicit export final friend import module mutable namespace new noexcept "+"not not_eq operator or or_eq override private protected public "+"reinterpret_cast requires static_assert static_cast template this "+"thread_local throw try typeid typename using virtual xor xor_eq";var objCKeywords="bycopy byref in inout oneway out self super atomic nonatomic retain copy "+"readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd "+"@interface @implementation @end @protocol @encode @property @synthesize @dynamic @class "+"@public @package @private @protected @required @optional @try @catch @finally @import "+"@selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available";var objCBuiltins="FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION "+" NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER "+"NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION "+"NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT"
var basicCTypes=words("int long char short double float unsigned signed "+"void bool");var basicObjCTypes=words("SEL instancetype id Class Protocol BOOL");function cTypes(identifier){return contains(basicCTypes,identifier)||/.+_t$/.test(identifier)}
function objCTypes(identifier){return cTypes(identifier)||contains(basicObjCTypes,identifier)}
var cBlockKeywords="case do else for if switch while struct enum union";var cDefKeywords="struct enum union";function cppHook(stream,state){if(!state.startOfLine)return!1
for(var ch,next=null;ch=stream.peek();){if(ch=="\\"&&stream.match(/^.$/)){next=cppHook
break}else if(ch=="/"&&stream.match(/^\/[\/\*]/,!1)){break}
stream.next()}
state.tokenize=next
return"meta"}
function pointerHook(_stream,state){if(state.prevToken=="type")return"type";return!1}
function cIsReservedIdentifier(token){if(!token||token.length<2)return!1;if(token[0]!='_')return!1;return(token[1]=='_')||(token[1]!==token[1].toLowerCase())}
function cpp14Literal(stream){stream.eatWhile(/[\w\.']/);return"number"}
function cpp11StringHook(stream,state){stream.backUp(1);if(stream.match(/^(?:R|u8R|uR|UR|LR)/)){var match=stream.match(/^"([^\s\\()]{0,16})\(/);if(!match){return!1}
state.cpp11RawStringDelim=match[1];state.tokenize=tokenRawString;return tokenRawString(stream,state)}
if(stream.match(/^(?:u8|u|U|L)/)){if(stream.match(/^["']/,!1)){return"string"}
return!1}
stream.next();return!1}
function cppLooksLikeConstructor(word){var lastTwo=/(\w+)::~?(\w+)$/.exec(word);return lastTwo&&lastTwo[1]==lastTwo[2]}
function tokenAtString(stream,state){var next;while((next=stream.next())!=null){if(next=='"'&&!stream.eat('"')){state.tokenize=null;break}}
return"string"}
function tokenRawString(stream,state){var delim=state.cpp11RawStringDelim.replace(/[^\w\s]/g,'\\$&');var match=stream.match(new RegExp(".*?\\)"+delim+'"'));if(match)
state.tokenize=null;else stream.skipToEnd();return"string"}
function def(mimes,mode){if(typeof mimes=="string")mimes=[mimes];var words=[];function add(obj){if(obj)for(var prop in obj)if(obj.hasOwnProperty(prop))
words.push(prop);}
add(mode.keywords);add(mode.types);add(mode.builtin);add(mode.atoms);if(words.length){mode.helperType=mimes[0];CodeMirror.registerHelper("hintWords",mimes[0],words)}
for(var i=0;i<mimes.length;++i)
CodeMirror.defineMIME(mimes[i],mode);}
def(["text/x-csrc","text/x-c","text/x-chdr"],{name:"clike",keywords:words(cKeywords),types:cTypes,blockKeywords:words(cBlockKeywords),defKeywords:words(cDefKeywords),typeFirstDefinitions:!0,atoms:words("NULL true false"),isReservedIdentifier:cIsReservedIdentifier,hooks:{"#":cppHook,"*":pointerHook,},modeProps:{fold:["brace","include"]}});def(["text/x-c++src","text/x-c++hdr"],{name:"clike",keywords:words(cKeywords+" "+cppKeywords),types:cTypes,blockKeywords:words(cBlockKeywords+" class try catch"),defKeywords:words(cDefKeywords+" class namespace"),typeFirstDefinitions:!0,atoms:words("true false NULL nullptr"),dontIndentStatements:/^template$/,isIdentifierChar:/[\w\$_~\xa1-\uffff]/,isReservedIdentifier:cIsReservedIdentifier,hooks:{"#":cppHook,"*":pointerHook,"u":cpp11StringHook,"U":cpp11StringHook,"L":cpp11StringHook,"R":cpp11StringHook,"0":cpp14Literal,"1":cpp14Literal,"2":cpp14Literal,"3":cpp14Literal,"4":cpp14Literal,"5":cpp14Literal,"6":cpp14Literal,"7":cpp14Literal,"8":cpp14Literal,"9":cpp14Literal,token:function(stream,state,style){if(style=="variable"&&stream.peek()=="("&&(state.prevToken==";"||state.prevToken==null||state.prevToken=="}")&&cppLooksLikeConstructor(stream.current()))
return"def"}},namespaceSeparator:"::",modeProps:{fold:["brace","include"]}});def("text/x-java",{name:"clike",keywords:words("abstract assert break case catch class const continue default "+"do else enum extends final finally for goto if implements import "+"instanceof interface native new package private protected public "+"return static strictfp super switch synchronized this throw throws transient "+"try volatile while @interface"),types:words("var byte short int long float double boolean char void Boolean Byte Character Double Float "+"Integer Long Number Object Short String StringBuffer StringBuilder Void"),blockKeywords:words("catch class do else finally for if switch try while"),defKeywords:words("class interface enum @interface"),typeFirstDefinitions:!0,atoms:words("true false null"),number:/^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+\.?\d*|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,hooks:{"@":function(stream){if(stream.match('interface',!1))return!1;stream.eatWhile(/[\w\$_]/);return"meta"},'"':function(stream,state){if(!stream.match(/""$/))return!1;state.tokenize=tokenTripleString;return state.tokenize(stream,state)}},modeProps:{fold:["brace","import"]}});def("text/x-csharp",{name:"clike",keywords:words("abstract as async await base break case catch checked class const continue"+" default delegate do else enum event explicit extern finally fixed for"+" foreach goto if implicit in interface internal is lock namespace new"+" operator out override params private protected public readonly ref return sealed"+" sizeof stackalloc static struct switch this throw try typeof unchecked"+" unsafe using virtual void volatile while add alias ascending descending dynamic from get"+" global group into join let orderby partial remove select set value var yield"),types:words("Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func"+" Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32"+" UInt64 bool byte char decimal double short int long object"+" sbyte float string ushort uint ulong"),blockKeywords:words("catch class do else finally for foreach if struct switch try while"),defKeywords:words("class interface namespace struct var"),typeFirstDefinitions:!0,atoms:words("true false null"),hooks:{"@":function(stream,state){if(stream.eat('"')){state.tokenize=tokenAtString;return tokenAtString(stream,state)}
stream.eatWhile(/[\w\$_]/);return"meta"}}});function tokenTripleString(stream,state){var escaped=!1;while(!stream.eol()){if(!escaped&&stream.match('"""')){state.tokenize=null;break}
escaped=stream.next()=="\\"&&!escaped}
return"string"}
function tokenNestedComment(depth){return function(stream,state){var ch
while(ch=stream.next()){if(ch=="*"&&stream.eat("/")){if(depth==1){state.tokenize=null
break}else{state.tokenize=tokenNestedComment(depth-1)
return state.tokenize(stream,state)}}else if(ch=="/"&&stream.eat("*")){state.tokenize=tokenNestedComment(depth+1)
return state.tokenize(stream,state)}}
return"comment"}}
def("text/x-scala",{name:"clike",keywords:words("abstract case catch class def do else extends final finally for forSome if "+"implicit import lazy match new null object override package private protected return "+"sealed super this throw trait try type val var while with yield _ "+"assert assume require print println printf readLine readBoolean readByte readShort "+"readChar readInt readLong readFloat readDouble"),types:words("AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either "+"Enumeration Equiv Error Exception Fractional Function IndexedSeq Int Integral Iterable "+"Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering "+"Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder "+"StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector "+"Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable "+"Compiler Double Exception Float Integer Long Math Number Object Package Pair Process "+"Runtime Runnable SecurityManager Short StackTraceElement StrictMath String "+"StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"),multiLineStrings:!0,blockKeywords:words("catch class enum do else finally for forSome if match switch try while"),defKeywords:words("class enum def object package trait type val var"),atoms:words("true false null"),indentStatements:!1,indentSwitch:!1,isOperatorChar:/[+\-*&%=<>!?|\/#:@]/,hooks:{"@":function(stream){stream.eatWhile(/[\w\$_]/);return"meta"},'"':function(stream,state){if(!stream.match('""'))return!1;state.tokenize=tokenTripleString;return state.tokenize(stream,state)},"'":function(stream){stream.eatWhile(/[\w\$_\xa1-\uffff]/);return"atom"},"=":function(stream,state){var cx=state.context
if(cx.type=="}"&&cx.align&&stream.eat(">")){state.context=new Context(cx.indented,cx.column,cx.type,cx.info,null,cx.prev)
return"operator"}else{return!1}},"/":function(stream,state){if(!stream.eat("*"))return!1
state.tokenize=tokenNestedComment(1)
return state.tokenize(stream,state)}},modeProps:{closeBrackets:{pairs:'()[]{}""',triples:'"'}}});function tokenKotlinString(tripleString){return function(stream,state){var escaped=!1,next,end=!1;while(!stream.eol()){if(!tripleString&&!escaped&&stream.match('"')){end=!0;break}
if(tripleString&&stream.match('"""')){end=!0;break}
next=stream.next();if(!escaped&&next=="$"&&stream.match('{'))
stream.skipTo("}");escaped=!escaped&&next=="\\"&&!tripleString}
if(end||!tripleString)
state.tokenize=null;return"string"}}
def("text/x-kotlin",{name:"clike",keywords:words("package as typealias class interface this super val operator "+"var fun for is in This throw return annotation "+"break continue object if else while do try when !in !is as? "+"file import where by get set abstract enum open inner override private public internal "+"protected catch finally out final vararg reified dynamic companion constructor init "+"sealed field property receiver param sparam lateinit data inline noinline tailrec "+"external annotation crossinline const operator infix suspend actual expect setparam value"),types:words("Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable "+"Compiler Double Exception Float Integer Long Math Number Object Package Pair Process "+"Runtime Runnable SecurityManager Short StackTraceElement StrictMath String "+"StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void Annotation Any BooleanArray "+"ByteArray Char CharArray DeprecationLevel DoubleArray Enum FloatArray Function Int IntArray Lazy "+"LazyThreadSafetyMode LongArray Nothing ShortArray Unit"),intendSwitch:!1,indentStatements:!1,multiLineStrings:!0,number:/^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,blockKeywords:words("catch class do else finally for if where try while enum"),defKeywords:words("class val var object interface fun"),atoms:words("true false null this"),hooks:{"@":function(stream){stream.eatWhile(/[\w\$_]/);return"meta"},'*':function(_stream,state){return state.prevToken=='.'?'variable':'operator'},'"':function(stream,state){state.tokenize=tokenKotlinString(stream.match('""'));return state.tokenize(stream,state)},"/":function(stream,state){if(!stream.eat("*"))return!1;state.tokenize=tokenNestedComment(1);return state.tokenize(stream,state)},indent:function(state,ctx,textAfter,indentUnit){var firstChar=textAfter&&textAfter.charAt(0);if((state.prevToken=="}"||state.prevToken==")")&&textAfter=="")
return state.indented;if((state.prevToken=="operator"&&textAfter!="}"&&state.context.type!="}")||state.prevToken=="variable"&&firstChar=="."||(state.prevToken=="}"||state.prevToken==")")&&firstChar==".")
return indentUnit*2+ctx.indented;if(ctx.align&&ctx.type=="}")
return ctx.indented+(state.context.type==(textAfter||"").charAt(0)?0:indentUnit)}},modeProps:{closeBrackets:{triples:'"'}}});def(["x-shader/x-vertex","x-shader/x-fragment"],{name:"clike",keywords:words("sampler1D sampler2D sampler3D samplerCube "+"sampler1DShadow sampler2DShadow "+"const attribute uniform varying "+"break continue discard return "+"for while do if else struct "+"in out inout"),types:words("float int bool void "+"vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 "+"mat2 mat3 mat4"),blockKeywords:words("for while do if else struct"),builtin:words("radians degrees sin cos tan asin acos atan "+"pow exp log exp2 sqrt inversesqrt "+"abs sign floor ceil fract mod min max clamp mix step smoothstep "+"length distance dot cross normalize ftransform faceforward "+"reflect refract matrixCompMult "+"lessThan lessThanEqual greaterThan greaterThanEqual "+"equal notEqual any all not "+"texture1D texture1DProj texture1DLod texture1DProjLod "+"texture2D texture2DProj texture2DLod texture2DProjLod "+"texture3D texture3DProj texture3DLod texture3DProjLod "+"textureCube textureCubeLod "+"shadow1D shadow2D shadow1DProj shadow2DProj "+"shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod "+"dFdx dFdy fwidth "+"noise1 noise2 noise3 noise4"),atoms:words("true false "+"gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex "+"gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 "+"gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 "+"gl_FogCoord gl_PointCoord "+"gl_Position gl_PointSize gl_ClipVertex "+"gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor "+"gl_TexCoord gl_FogFragCoord "+"gl_FragCoord gl_FrontFacing "+"gl_FragData gl_FragDepth "+"gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix "+"gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse "+"gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse "+"gl_TextureMatrixTranspose gl_ModelViewMatrixInverseTranspose "+"gl_ProjectionMatrixInverseTranspose "+"gl_ModelViewProjectionMatrixInverseTranspose "+"gl_TextureMatrixInverseTranspose "+"gl_NormalScale gl_DepthRange gl_ClipPlane "+"gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel "+"gl_FrontLightModelProduct gl_BackLightModelProduct "+"gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ "+"gl_FogParameters "+"gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords "+"gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats "+"gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits "+"gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits "+"gl_MaxDrawBuffers"),indentSwitch:!1,hooks:{"#":cppHook},modeProps:{fold:["brace","include"]}});def("text/x-nesc",{name:"clike",keywords:words(cKeywords+" as atomic async call command component components configuration event generic "+"implementation includes interface module new norace nx_struct nx_union post provides "+"signal task uses abstract extends"),types:cTypes,blockKeywords:words(cBlockKeywords),atoms:words("null true false"),hooks:{"#":cppHook},modeProps:{fold:["brace","include"]}});def("text/x-objectivec",{name:"clike",keywords:words(cKeywords+" "+objCKeywords),types:objCTypes,builtin:words(objCBuiltins),blockKeywords:words(cBlockKeywords+" @synthesize @try @catch @finally @autoreleasepool @synchronized"),defKeywords:words(cDefKeywords+" @interface @implementation @protocol @class"),dontIndentStatements:/^@.*$/,typeFirstDefinitions:!0,atoms:words("YES NO NULL Nil nil true false nullptr"),isReservedIdentifier:cIsReservedIdentifier,hooks:{"#":cppHook,"*":pointerHook,},modeProps:{fold:["brace","include"]}});def("text/x-objectivec++",{name:"clike",keywords:words(cKeywords+" "+objCKeywords+" "+cppKeywords),types:objCTypes,builtin:words(objCBuiltins),blockKeywords:words(cBlockKeywords+" @synthesize @try @catch @finally @autoreleasepool @synchronized class try catch"),defKeywords:words(cDefKeywords+" @interface @implementation @protocol @class class namespace"),dontIndentStatements:/^@.*$|^template$/,typeFirstDefinitions:!0,atoms:words("YES NO NULL Nil nil true false nullptr"),isReservedIdentifier:cIsReservedIdentifier,hooks:{"#":cppHook,"*":pointerHook,"u":cpp11StringHook,"U":cpp11StringHook,"L":cpp11StringHook,"R":cpp11StringHook,"0":cpp14Literal,"1":cpp14Literal,"2":cpp14Literal,"3":cpp14Literal,"4":cpp14Literal,"5":cpp14Literal,"6":cpp14Literal,"7":cpp14Literal,"8":cpp14Literal,"9":cpp14Literal,token:function(stream,state,style){if(style=="variable"&&stream.peek()=="("&&(state.prevToken==";"||state.prevToken==null||state.prevToken=="}")&&cppLooksLikeConstructor(stream.current()))
return"def"}},namespaceSeparator:"::",modeProps:{fold:["brace","include"]}});def("text/x-squirrel",{name:"clike",keywords:words("base break clone continue const default delete enum extends function in class"+" foreach local resume return this throw typeof yield constructor instanceof static"),types:cTypes,blockKeywords:words("case catch class else for foreach if switch try while"),defKeywords:words("function local class"),typeFirstDefinitions:!0,atoms:words("true false null"),hooks:{"#":cppHook},modeProps:{fold:["brace","include"]}});var stringTokenizer=null;function tokenCeylonString(type){return function(stream,state){var escaped=!1,next,end=!1;while(!stream.eol()){if(!escaped&&stream.match('"')&&(type=="single"||stream.match('""'))){end=!0;break}
if(!escaped&&stream.match('``')){stringTokenizer=tokenCeylonString(type);end=!0;break}
next=stream.next();escaped=type=="single"&&!escaped&&next=="\\"}
if(end)
state.tokenize=null;return"string"}}
def("text/x-ceylon",{name:"clike",keywords:words("abstracts alias assembly assert assign break case catch class continue dynamic else"+" exists extends finally for function given if import in interface is let module new"+" nonempty object of out outer package return satisfies super switch then this throw"+" try value void while"),types:function(word){var first=word.charAt(0);return(first===first.toUpperCase()&&first!==first.toLowerCase())},blockKeywords:words("case catch class dynamic else finally for function if interface module new object switch try while"),defKeywords:words("class dynamic function interface module object package value"),builtin:words("abstract actual aliased annotation by default deprecated doc final formal late license"+" native optional sealed see serializable shared suppressWarnings tagged throws variable"),isPunctuationChar:/[\[\]{}\(\),;\:\.`]/,isOperatorChar:/[+\-*&%=<>!?|^~:\/]/,numberStart:/[\d#$]/,number:/^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,multiLineStrings:!0,typeFirstDefinitions:!0,atoms:words("true false null larger smaller equal empty finished"),indentSwitch:!1,styleDefs:!1,hooks:{"@":function(stream){stream.eatWhile(/[\w\$_]/);return"meta"},'"':function(stream,state){state.tokenize=tokenCeylonString(stream.match('""')?"triple":"single");return state.tokenize(stream,state)},'`':function(stream,state){if(!stringTokenizer||!stream.match('`'))return!1;state.tokenize=stringTokenizer;stringTokenizer=null;return state.tokenize(stream,state)},"'":function(stream){stream.eatWhile(/[\w\$_\xa1-\uffff]/);return"atom"},token:function(_stream,state,style){if((style=="variable"||style=="type")&&state.prevToken=="."){return"variable-2"}}},modeProps:{fold:["brace","import"],closeBrackets:{triples:'"'}}})});(function(mod){if(typeof exports=="object"&&typeof module=="object")
mod(require("../../lib/codemirror"),require("../htmlmixed/htmlmixed"),require("../clike/clike"));else if(typeof define=="function"&&define.amd)
define(["../../lib/codemirror","../htmlmixed/htmlmixed","../clike/clike"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";function keywords(str){var obj={},words=str.split(" ");for(var i=0;i<words.length;++i)obj[words[i]]=!0;return obj}
function matchSequence(list,end,escapes){if(list.length==0)return phpString(end);return function(stream,state){var patterns=list[0];for(var i=0;i<patterns.length;i++)if(stream.match(patterns[i][0])){state.tokenize=matchSequence(list.slice(1),end);return patterns[i][1]}
state.tokenize=phpString(end,escapes);return"string"}}
function phpString(closing,escapes){return function(stream,state){return phpString_(stream,state,closing,escapes)}}
function phpString_(stream,state,closing,escapes){if(escapes!==!1&&stream.match("${",!1)||stream.match("{$",!1)){state.tokenize=null;return"string"}
if(escapes!==!1&&stream.match(/^\$[a-zA-Z_][a-zA-Z0-9_]*/)){if(stream.match("[",!1)){state.tokenize=matchSequence([[["[",null]],[[/\d[\w\.]*/,"number"],[/\$[a-zA-Z_][a-zA-Z0-9_]*/,"variable-2"],[/[\w\$]+/,"variable"]],[["]",null]]],closing,escapes)}
if(stream.match(/^->\w/,!1)){state.tokenize=matchSequence([[["->",null]],[[/[\w]+/,"variable"]]],closing,escapes)}
return"variable-2"}
var escaped=!1;while(!stream.eol()&&(escaped||escapes===!1||(!stream.match("{$",!1)&&!stream.match(/^(\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{)/,!1)))){if(!escaped&&stream.match(closing)){state.tokenize=null;state.tokStack.pop();state.tokStack.pop();break}
escaped=stream.next()=="\\"&&!escaped}
return"string"}
var phpKeywords="abstract and array as break case catch class clone const continue declare default "+"do else elseif enddeclare endfor endforeach endif endswitch endwhile enum extends final "+"for foreach function global goto if implements interface instanceof namespace "+"new or private protected public static switch throw trait try use var while xor "+"die echo empty exit eval include include_once isset list require require_once return "+"print unset __halt_compiler self static parent yield insteadof finally readonly match";var phpAtoms="true false null TRUE FALSE NULL __CLASS__ __DIR__ __FILE__ __LINE__ __METHOD__ __FUNCTION__ __NAMESPACE__ __TRAIT__";var phpBuiltin="func_num_args func_get_arg func_get_args strlen strcmp strncmp strcasecmp strncasecmp each error_reporting define defined trigger_error user_error set_error_handler restore_error_handler get_declared_classes get_loaded_extensions extension_loaded get_extension_funcs debug_backtrace constant bin2hex hex2bin sleep usleep time mktime gmmktime strftime gmstrftime strtotime date gmdate getdate localtime checkdate flush wordwrap htmlspecialchars htmlentities html_entity_decode md5 md5_file crc32 getimagesize image_type_to_mime_type phpinfo phpversion phpcredits strnatcmp strnatcasecmp substr_count strspn strcspn strtok strtoupper strtolower strpos strrpos strrev hebrev hebrevc nl2br basename dirname pathinfo stripslashes stripcslashes strstr stristr strrchr str_shuffle str_word_count strcoll substr substr_replace quotemeta ucfirst ucwords strtr addslashes addcslashes rtrim str_replace str_repeat count_chars chunk_split trim ltrim strip_tags similar_text explode implode setlocale localeconv parse_str str_pad chop strchr sprintf printf vprintf vsprintf sscanf fscanf parse_url urlencode urldecode rawurlencode rawurldecode readlink linkinfo link unlink exec system escapeshellcmd escapeshellarg passthru shell_exec proc_open proc_close rand srand getrandmax mt_rand mt_srand mt_getrandmax base64_decode base64_encode abs ceil floor round is_finite is_nan is_infinite bindec hexdec octdec decbin decoct dechex base_convert number_format fmod ip2long long2ip getenv putenv getopt microtime gettimeofday getrusage uniqid quoted_printable_decode set_time_limit get_cfg_var magic_quotes_runtime set_magic_quotes_runtime get_magic_quotes_gpc get_magic_quotes_runtime import_request_variables error_log serialize unserialize memory_get_usage memory_get_peak_usage var_dump var_export debug_zval_dump print_r highlight_file show_source highlight_string ini_get ini_get_all ini_set ini_alter ini_restore get_include_path set_include_path restore_include_path setcookie header headers_sent connection_aborted connection_status ignore_user_abort parse_ini_file is_uploaded_file move_uploaded_file intval floatval doubleval strval gettype settype is_null is_resource is_bool is_long is_float is_int is_integer is_double is_real is_numeric is_string is_array is_object is_scalar ereg ereg_replace eregi eregi_replace split spliti join sql_regcase dl pclose popen readfile rewind rmdir umask fclose feof fgetc fgets fgetss fread fopen fpassthru ftruncate fstat fseek ftell fflush fwrite fputs mkdir rename copy tempnam tmpfile file file_get_contents file_put_contents stream_select stream_context_create stream_context_set_params stream_context_set_option stream_context_get_options stream_filter_prepend stream_filter_append fgetcsv flock get_meta_tags stream_set_write_buffer set_file_buffer set_socket_blocking stream_set_blocking socket_set_blocking stream_get_meta_data stream_register_wrapper stream_wrapper_register stream_set_timeout socket_set_timeout socket_get_status realpath fnmatch fsockopen pfsockopen pack unpack get_browser crypt opendir closedir chdir getcwd rewinddir readdir dir glob fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype file_exists is_writable is_writeable is_readable is_executable is_file is_dir is_link stat lstat chown touch clearstatcache mail ob_start ob_flush ob_clean ob_end_flush ob_end_clean ob_get_flush ob_get_clean ob_get_length ob_get_level ob_get_status ob_get_contents ob_implicit_flush ob_list_handlers ksort krsort natsort natcasesort asort arsort sort rsort usort uasort uksort shuffle array_walk count end prev next reset current key min max in_array array_search extract compact array_fill range array_multisort array_push array_pop array_shift array_unshift array_splice array_slice array_merge array_merge_recursive array_keys array_values array_count_values array_reverse array_reduce array_pad array_flip array_change_key_case array_rand array_unique array_intersect array_intersect_assoc array_diff array_diff_assoc array_sum array_filter array_map array_chunk array_key_exists array_intersect_key array_combine array_column pos sizeof key_exists assert assert_options version_compare ftok str_rot13 aggregate session_name session_module_name session_save_path session_id session_regenerate_id session_decode session_register session_unregister session_is_registered session_encode session_start session_destroy session_unset session_set_save_handler session_cache_limiter session_cache_expire session_set_cookie_params session_get_cookie_params session_write_close preg_match preg_match_all preg_replace preg_replace_callback preg_split preg_quote preg_grep overload ctype_alnum ctype_alpha ctype_cntrl ctype_digit ctype_lower ctype_graph ctype_print ctype_punct ctype_space ctype_upper ctype_xdigit virtual apache_request_headers apache_note apache_lookup_uri apache_child_terminate apache_setenv apache_response_headers apache_get_version getallheaders mysql_connect mysql_pconnect mysql_close mysql_select_db mysql_create_db mysql_drop_db mysql_query mysql_unbuffered_query mysql_db_query mysql_list_dbs mysql_list_tables mysql_list_fields mysql_list_processes mysql_error mysql_errno mysql_affected_rows mysql_insert_id mysql_result mysql_num_rows mysql_num_fields mysql_fetch_row mysql_fetch_array mysql_fetch_assoc mysql_fetch_object mysql_data_seek mysql_fetch_lengths mysql_fetch_field mysql_field_seek mysql_free_result mysql_field_name mysql_field_table mysql_field_len mysql_field_type mysql_field_flags mysql_escape_string mysql_real_escape_string mysql_stat mysql_thread_id mysql_client_encoding mysql_get_client_info mysql_get_host_info mysql_get_proto_info mysql_get_server_info mysql_info mysql mysql_fieldname mysql_fieldtable mysql_fieldlen mysql_fieldtype mysql_fieldflags mysql_selectdb mysql_createdb mysql_dropdb mysql_freeresult mysql_numfields mysql_numrows mysql_listdbs mysql_listtables mysql_listfields mysql_db_name mysql_dbname mysql_tablename mysql_table_name pg_connect pg_pconnect pg_close pg_connection_status pg_connection_busy pg_connection_reset pg_host pg_dbname pg_port pg_tty pg_options pg_ping pg_query pg_send_query pg_cancel_query pg_fetch_result pg_fetch_row pg_fetch_assoc pg_fetch_array pg_fetch_object pg_fetch_all pg_affected_rows pg_get_result pg_result_seek pg_result_status pg_free_result pg_last_oid pg_num_rows pg_num_fields pg_field_name pg_field_num pg_field_size pg_field_type pg_field_prtlen pg_field_is_null pg_get_notify pg_get_pid pg_result_error pg_last_error pg_last_notice pg_put_line pg_end_copy pg_copy_to pg_copy_from pg_trace pg_untrace pg_lo_create pg_lo_unlink pg_lo_open pg_lo_close pg_lo_read pg_lo_write pg_lo_read_all pg_lo_import pg_lo_export pg_lo_seek pg_lo_tell pg_escape_string pg_escape_bytea pg_unescape_bytea pg_client_encoding pg_set_client_encoding pg_meta_data pg_convert pg_insert pg_update pg_delete pg_select pg_exec pg_getlastoid pg_cmdtuples pg_errormessage pg_numrows pg_numfields pg_fieldname pg_fieldsize pg_fieldtype pg_fieldnum pg_fieldprtlen pg_fieldisnull pg_freeresult pg_result pg_loreadall pg_locreate pg_lounlink pg_loopen pg_loclose pg_loread pg_lowrite pg_loimport pg_loexport http_response_code get_declared_traits getimagesizefromstring socket_import_stream stream_set_chunk_size trait_exists header_register_callback class_uses session_status session_register_shutdown echo print global static exit array empty eval isset unset die include require include_once require_once json_decode json_encode json_last_error json_last_error_msg curl_close curl_copy_handle curl_errno curl_error curl_escape curl_exec curl_file_create curl_getinfo curl_init curl_multi_add_handle curl_multi_close curl_multi_exec curl_multi_getcontent curl_multi_info_read curl_multi_init curl_multi_remove_handle curl_multi_select curl_multi_setopt curl_multi_strerror curl_pause curl_reset curl_setopt_array curl_setopt curl_share_close curl_share_init curl_share_setopt curl_strerror curl_unescape curl_version mysqli_affected_rows mysqli_autocommit mysqli_change_user mysqli_character_set_name mysqli_close mysqli_commit mysqli_connect_errno mysqli_connect_error mysqli_connect mysqli_data_seek mysqli_debug mysqli_dump_debug_info mysqli_errno mysqli_error_list mysqli_error mysqli_fetch_all mysqli_fetch_array mysqli_fetch_assoc mysqli_fetch_field_direct mysqli_fetch_field mysqli_fetch_fields mysqli_fetch_lengths mysqli_fetch_object mysqli_fetch_row mysqli_field_count mysqli_field_seek mysqli_field_tell mysqli_free_result mysqli_get_charset mysqli_get_client_info mysqli_get_client_stats mysqli_get_client_version mysqli_get_connection_stats mysqli_get_host_info mysqli_get_proto_info mysqli_get_server_info mysqli_get_server_version mysqli_info mysqli_init mysqli_insert_id mysqli_kill mysqli_more_results mysqli_multi_query mysqli_next_result mysqli_num_fields mysqli_num_rows mysqli_options mysqli_ping mysqli_prepare mysqli_query mysqli_real_connect mysqli_real_escape_string mysqli_real_query mysqli_reap_async_query mysqli_refresh mysqli_rollback mysqli_select_db mysqli_set_charset mysqli_set_local_infile_default mysqli_set_local_infile_handler mysqli_sqlstate mysqli_ssl_set mysqli_stat mysqli_stmt_init mysqli_store_result mysqli_thread_id mysqli_thread_safe mysqli_use_result mysqli_warning_count";CodeMirror.registerHelper("hintWords","php",[phpKeywords,phpAtoms,phpBuiltin].join(" ").split(" "));CodeMirror.registerHelper("wordChars","php",/[\w$]/);var phpConfig={name:"clike",helperType:"php",keywords:keywords(phpKeywords),blockKeywords:keywords("catch do else elseif for foreach if switch try while finally"),defKeywords:keywords("class enum function interface namespace trait"),atoms:keywords(phpAtoms),builtin:keywords(phpBuiltin),multiLineStrings:!0,hooks:{"$":function(stream){stream.eatWhile(/[\w\$_]/);return"variable-2"},"<":function(stream,state){var before;if(before=stream.match(/^<<\s*/)){var quoted=stream.eat(/['"]/);stream.eatWhile(/[\w\.]/);var delim=stream.current().slice(before[0].length+(quoted?2:1));if(quoted)stream.eat(quoted);if(delim){(state.tokStack||(state.tokStack=[])).push(delim,0);state.tokenize=phpString(delim,quoted!="'");return"string"}}
return!1},"#":function(stream){while(!stream.eol()&&!stream.match("?>",!1))stream.next();return"comment"},"/":function(stream){if(stream.eat("/")){while(!stream.eol()&&!stream.match("?>",!1))stream.next();return"comment"}
return!1},'"':function(_stream,state){(state.tokStack||(state.tokStack=[])).push('"',0);state.tokenize=phpString('"');return"string"},"{":function(_stream,state){if(state.tokStack&&state.tokStack.length)
state.tokStack[state.tokStack.length-1]++;return!1},"}":function(_stream,state){if(state.tokStack&&state.tokStack.length>0&&!--state.tokStack[state.tokStack.length-1]){state.tokenize=phpString(state.tokStack[state.tokStack.length-2])}
return!1}}};CodeMirror.defineMode("php",function(config,parserConfig){var htmlMode=CodeMirror.getMode(config,(parserConfig&&parserConfig.htmlMode)||"text/html");var phpMode=CodeMirror.getMode(config,phpConfig);function dispatch(stream,state){var isPHP=state.curMode==phpMode;if(stream.sol()&&state.pending&&state.pending!='"'&&state.pending!="'")state.pending=null;if(!isPHP){if(stream.match(/^<\?\w*/)){state.curMode=phpMode;if(!state.php)state.php=CodeMirror.startState(phpMode,htmlMode.indent(state.html,"",""))
state.curState=state.php;return"meta"}
if(state.pending=='"'||state.pending=="'"){while(!stream.eol()&&stream.next()!=state.pending){}
var style="string"}else if(state.pending&&stream.pos<state.pending.end){stream.pos=state.pending.end;var style=state.pending.style}else{var style=htmlMode.token(stream,state.curState)}
if(state.pending)state.pending=null;var cur=stream.current(),openPHP=cur.search(/<\?/),m;if(openPHP!=-1){if(style=="string"&&(m=cur.match(/[\'\"]$/))&&!/\?>/.test(cur))state.pending=m[0];else state.pending={end:stream.pos,style:style};stream.backUp(cur.length-openPHP)}
return style}else if(isPHP&&state.php.tokenize==null&&stream.match("?>")){state.curMode=htmlMode;state.curState=state.html;if(!state.php.context.prev)state.php=null;return"meta"}else{return phpMode.token(stream,state.curState)}}
return{startState:function(){var html=CodeMirror.startState(htmlMode)
var php=parserConfig.startOpen?CodeMirror.startState(phpMode):null
return{html:html,php:php,curMode:parserConfig.startOpen?phpMode:htmlMode,curState:parserConfig.startOpen?php:html,pending:null}},copyState:function(state){var html=state.html,htmlNew=CodeMirror.copyState(htmlMode,html),php=state.php,phpNew=php&&CodeMirror.copyState(phpMode,php),cur;if(state.curMode==htmlMode)cur=htmlNew;else cur=phpNew;return{html:htmlNew,php:phpNew,curMode:state.curMode,curState:cur,pending:state.pending}},token:dispatch,indent:function(state,textAfter,line){if((state.curMode!=phpMode&&/^\s*<\//.test(textAfter))||(state.curMode==phpMode&&/^\?>/.test(textAfter)))
return htmlMode.indent(state.html,textAfter,line);return state.curMode.indent(state.curState,textAfter,line)},blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//",innerMode:function(state){return{state:state.curState,mode:state.curMode}}}},"htmlmixed","clike");CodeMirror.defineMIME("application/x-httpd-php","php");CodeMirror.defineMIME("application/x-httpd-php-open",{name:"php",startOpen:!0});CodeMirror.defineMIME("text/x-php",phpConfig)});(function(mod){if(typeof exports=="object"&&typeof module=="object")
mod(require("../../lib/codemirror"),require("../xml/xml"),require("../javascript/javascript"),require("../css/css"));else if(typeof define=="function"&&define.amd)
define(["../../lib/codemirror","../xml/xml","../javascript/javascript","../css/css"],mod);else mod(CodeMirror)})(function(CodeMirror){"use strict";var defaultTags={script:[["lang",/(javascript|babel)/i,"javascript"],["type",/^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i,"javascript"],["type",/./,"text/plain"],[null,null,"javascript"]],style:[["lang",/^css$/i,"css"],["type",/^(text\/)?(x-)?(stylesheet|css)$/i,"css"],["type",/./,"text/plain"],[null,null,"css"]]};function maybeBackup(stream,pat,style){var cur=stream.current(),close=cur.search(pat);if(close>-1){stream.backUp(cur.length-close)}else if(cur.match(/<\/?$/)){stream.backUp(cur.length);if(!stream.match(pat,!1))stream.match(cur)}
return style}
var attrRegexpCache={};function getAttrRegexp(attr){var regexp=attrRegexpCache[attr];if(regexp)return regexp;return attrRegexpCache[attr]=new RegExp("\\s+"+attr+"\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*")}
function getAttrValue(text,attr){var match=text.match(getAttrRegexp(attr))
return match?/^\s*(.*?)\s*$/.exec(match[2])[1]:""}
function getTagRegexp(tagName,anchored){return new RegExp((anchored?"^":"")+"<\/\\s*"+tagName+"\\s*>","i")}
function addTags(from,to){for(var tag in from){var dest=to[tag]||(to[tag]=[]);var source=from[tag];for(var i=source.length-1;i>=0;i--)
dest.unshift(source[i])}}
function findMatchingMode(tagInfo,tagText){for(var i=0;i<tagInfo.length;i++){var spec=tagInfo[i];if(!spec[0]||spec[1].test(getAttrValue(tagText,spec[0])))return spec[2]}}
CodeMirror.defineMode("htmlmixed",function(config,parserConfig){var htmlMode=CodeMirror.getMode(config,{name:"xml",htmlMode:!0,multilineTagIndentFactor:parserConfig.multilineTagIndentFactor,multilineTagIndentPastTag:parserConfig.multilineTagIndentPastTag,allowMissingTagName:parserConfig.allowMissingTagName,});var tags={};var configTags=parserConfig&&parserConfig.tags,configScript=parserConfig&&parserConfig.scriptTypes;addTags(defaultTags,tags);if(configTags)addTags(configTags,tags);if(configScript)for(var i=configScript.length-1;i>=0;i--)
tags.script.unshift(["type",configScript[i].matches,configScript[i].mode])
function html(stream,state){var style=htmlMode.token(stream,state.htmlState),tag=/\btag\b/.test(style),tagName
if(tag&&!/[<>\s\/]/.test(stream.current())&&(tagName=state.htmlState.tagName&&state.htmlState.tagName.toLowerCase())&&tags.hasOwnProperty(tagName)){state.inTag=tagName+" "}else if(state.inTag&&tag&&/>$/.test(stream.current())){var inTag=/^([\S]+) (.*)/.exec(state.inTag)
state.inTag=null
var modeSpec=stream.current()==">"&&findMatchingMode(tags[inTag[1]],inTag[2])
var mode=CodeMirror.getMode(config,modeSpec)
var endTagA=getTagRegexp(inTag[1],!0),endTag=getTagRegexp(inTag[1],!1);state.token=function(stream,state){if(stream.match(endTagA,!1)){state.token=html;state.localState=state.localMode=null;return null}
return maybeBackup(stream,endTag,state.localMode.token(stream,state.localState))};state.localMode=mode;state.localState=CodeMirror.startState(mode,htmlMode.indent(state.htmlState,"",""))}else if(state.inTag){state.inTag+=stream.current()
if(stream.eol())state.inTag+=" "}
return style};return{startState:function(){var state=CodeMirror.startState(htmlMode);return{token:html,inTag:null,localMode:null,localState:null,htmlState:state}},copyState:function(state){var local;if(state.localState){local=CodeMirror.copyState(state.localMode,state.localState)}
return{token:state.token,inTag:state.inTag,localMode:state.localMode,localState:local,htmlState:CodeMirror.copyState(htmlMode,state.htmlState)}},token:function(stream,state){return state.token(stream,state)},indent:function(state,textAfter,line){if(!state.localMode||/^\s*<\//.test(textAfter))
return htmlMode.indent(state.htmlState,textAfter,line);else if(state.localMode.indent)
return state.localMode.indent(state.localState,textAfter,line);else return CodeMirror.Pass},innerMode:function(state){return{state:state.localState||state.htmlState,mode:state.localMode||htmlMode}}}},"xml","javascript","css");CodeMirror.defineMIME("text/html","htmlmixed")})