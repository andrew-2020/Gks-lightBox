let counterElements = document.querySelectorAll('.counter');
let counterElementsData = new Array(counterElements.length);
let from , to , speed;
let limitBar = [];
let trigger_count_up = false;
 function count_up(element) {
     from = parseFloat(element.getAttribute('data-from'));
     to =  parseFloat(element.getAttribute('data-to'));
     speed =  parseFloat(element.getAttribute('data-speed'));
     let p;
     for (let i = 0; i < counterElements.length; i++) {
       if (element == counterElements[i]) {
          p = i;
       }
     }
     limitBar[p] = to - from;
     counterElementsData[p] = new Array(element , from , to , speed );
   setInterval(()=>{
       if (limitBar[p] - counterElementsData[p][3] <= 0) {
         element.innerHTML = counterElementsData[p][2];
         return;
       }
       element.innerHTML = counterElementsData[p][2] - ( limitBar[p] - counterElementsData[p][3] );
       limitBar[p] -= counterElementsData[p][3];
   }, 50)
 }
 let objListener = {
   _triggers : new Array(counterElements.length).fill(false),
   _trigger_listener : function(val){},
   get triggers(){
     return this._triggers;
   },
   set triggers(value){
     this._triggers = value;
     this._trigger_listener(value);
   },
   registerListener(listener){
     this._trigger_listener = listener;
   },
 }
let fire;
window.addEventListener('scroll' , ()=>{
  counterElements.forEach((item, i) => {
    if (isInViewport(item)) {
      mytriggers =   objListener._triggers;
        if (!mytriggers[i]) {
          mytriggers[i] = true;
          fire = item;
          objListener.triggers = mytriggers;
        }
    }
  });
});
objListener.registerListener(function(val) {
  if (val) {
    count_up(fire);
  }
});
