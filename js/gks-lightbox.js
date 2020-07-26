"use strict";

/*

*/

const Defaults = {

    layout: 'single',
    template: '<!-- single image template --> <div class="overlay-container" > <div class="box-wrapper"> <div class="close-gks-box">&times;</div> <div class="gksbox-stage" > <div class="gksbox-slide" > <div class="gksbox-content"> <img class="single-img" src=""></div> </div> </div> <div class="img-numbering" ></div>  </div> </div>' ,
    albumLabel: 'Image %1 of %2',
    closeFromAnyWhere: true ,
    disableScrolling: true,

    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 600,
    fitImagesInViewport: true,
    imageFadeDuration: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    sanitizeTitle: false,

};

// Browser Compatibility
if (!Object.values) {
  Object.values = function(obj) {
    return Object.keys(obj).map(function(e) {
      return obj[e]
    });
  };
}

if (!''.repeat) {
  String.prototype.repeat = function (repeats){
    return Array(repeats + 1).join(this);
  }

}

if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

HTMLElement.prototype.addMultipleClassNames = function (names) {
  for (let i = 0; i < names.length; i++) {
    this.classList.add(names[i]);
  }
}

HTMLElement.prototype.removeMultipleClassNames = function (names) {
  for (let i = 0; i < names.length; i++) {
    this.classList.remove(names[i]);
  }
}

document.body.addMultipleClassNames = function (names) {
  for (let i = 0; i < names.length; i++) {
    this.classList.add(names[i]);
  }
}

document.body.removeMultipleClassNames = function (names) {
  for (let i = 0; i < names.length; i++) {
    this.classList.remove(names[i]);
  }
}

// curcial functions
function $el (selector){
   let myEl ;
   if (selector[0] === '#' && selector.indexOf('.') === -1) {
     return  document.getElementById(selector);
   }else if ( selector.indexOf('.') >= 0 ) {
     myEl  = document.querySelectorAll(selector);
     if (myEl.length === 1) {
       myEl = myEl.item(0);
     }
     //
     return myEl;
   }else if (selector[0] != '#' && selector[0] != '.') {
    myEl =  document.getElementsByTagName(selector);
    if (myEl.length === 1) {
      myEl = myEl.item(0);
    }
     return myEl;
   }
 }

function handelingDefaults(options , myself) {
    const t = 'template' in options;
    const l = 'layout' in options;
    // const layoutFetchced = options.layout;
    const templateFetched = options.template;
    if (l) {
        if (options.layout === 'single') {
            if (t) {
                myself.options.template = myself.overlay_single_templates[templateFetched];
            }else if (!t) {
                myself.options.template = myself.overlay_single_templates.one_image;
            }
        }else if (options.layout === 'gallery') {
            if (t) {
                myself.options.template = myself.overlay_gallery_templates[templateFetched];
            }else if (!t) {
                myself.options.template = myself.overlay_gallery_templates.gallery_imgs_right;
            }
        }
    }else if (!l) {
        console.error("You Must Define your layout type ( single or gallery)");
    }
}

function embedStyle(tagName , styleName , styling){
  let embedded_style = document.createElement('style');
  embedded_style.classList.add(styleName);
  document.getElementsByTagName(tagName)[0].appendChild(embedded_style);
  embedded_style.innerHTML += styling;
  console.log(styleName + ' Style Embedded');
}

function remStyle(styleClassName){

  let style = $el('.' + styleClassName);

  if (NodeList.prototype.isPrototypeOf(style)) {
    if (style.length > 0) {
      style.forEach( function (item, i) {
        item.parentNode.removeChild(item);
        console.log(styleClassName + ' Style Removed');
      });
    }

  }else  {

      style.parentNode.removeChild(style);
      console.log(styleClassName + ' Style Removed');
  }
}

function handelingScrolling(disableScrolling) {

    if (disableScrolling) {
        const scrollWidth = (window.innerWidth - document.documentElement.clientWidth)  + 'px';
        const styling = '.compensate-for-scrolbar{margin-right:'
                      + scrollWidth + '}';

        embedStyle('head' ,'gks-scroll-styling' ,  styling);

        document.body.addMultipleClassNames(['disableScrolling' , 'compensate-for-scrolbar']);
    }
}

function updateSlideWidth(myself , c , i) {
    window.addEventListener('resize', function () {
        myself.windowWidth = window.innerWidth;
        myself.gksBoxSlide[c].style.transform = 'translate(' + myself.windowWidth * (c-i) + 'px , -50%)';
    });
}

function returnedOptions(options) {

  const defValues = Object.values(Defaults);
  const optValues = Object.values(options);
  const defKeys = Object.keys(Defaults);
  const optKeys = Object.keys(options);
  let NewOpt = {};
  for (let d = 0; d < defKeys.length; d++) {
    for (let o = 0; o < optKeys.length; o++) {
      if (defKeys[d] === optKeys[o]) {
        NewOpt[optKeys[o]] = optValues[o];
        break;
      }
      if (o === optKeys.length - 1) {
        NewOpt[defKeys[d]] = defValues[d];
      }
    }
  }
  return NewOpt;
}
//
// function imgPreloader (sourceImg , imgObj , imgSrc , callback){
//   let mySrc = imgObj.getAttribute('src');
//   console.log(mySrc);
//   if (mySrc === "" ) {
//     imgObj.parentNode.parentNode.classList.add('preloader-spinner');
//     imgObj.classList.add('hide-till-load');
//     imgObj.src = imgSrc;
//     console.log('preloader added');
//     imgObj.onload = function () {
//       callback(imgObj);
//       imgObj.onload = function (){}
//     }
//     return true;
//
//   }else {
//     console.log('image already loaded');
//     setFirstPos(sourceImg , imgObj , 'gks-first-look');
//     setSecPos(imgObj , 'gks-first-look' );
//     return false;
//
//   }
//
// }

function imgPreloader (sourceImg , imgObj , imgSrc , callback ){
  let mySrc = imgObj.getAttribute('src');
  console.log(mySrc);
  if (mySrc === "" || mySrc !==  imgSrc ) {
    imgObj.parentNode.parentNode.classList.add('preloader-spinner');
    imgObj.classList.add('hide-till-load');
    imgObj.src = imgSrc;
    console.log('preloader added');

    imgObj.onload = function () {
      callback();
      imgObj.onload = function (){}
    }
  }

}

function preloadingSpinner (imgObj){
  imgObj.parentNode.parentNode.classList.remove('preloader-spinner');
  imgObj.classList.remove('hide-till-load');
  console.log('preloader removed');
}

function setFirstPos(parentImg , childImg ,  childImgName){
  remStyle('scale-from-parent');
  let windowWidth = window.innerWidth;
  let windowHeight  = window.innerHeight;
  let originalWidth = childImg.naturalWidth;
  let originalHeight = childImg.naturalHeight;
  console.log(originalWidth);
  console.log(childImg);
  // let top ='top:' + (parentImg.getBoundingClientRect().top / windowHeight) * 100 + '%;';
  // let left = 'left:'+  (parentImg.getBoundingClientRect().left / windowWidth ) * 100 + '%;';
  let translatey = parentImg.getBoundingClientRect().top + 'px';
  let translatex =  parentImg.getBoundingClientRect().left + 'px';
  // let top = 'top:0px;';
  // let left = 'left:0px;';
  let height = 'height:' +  parentImg.getBoundingClientRect().height + 'px;';
  let width = 'width:' +  parentImg.getBoundingClientRect().width + 'px;';
  // let scaley = parentImg.getBoundingClientRect().height / originalHeight ;
  // let scalex =  parentImg.getBoundingClientRect().width / originalWidth  ;
  // scalex = 1;scaley = 1;
  let transform = 'transform: translate('+ translatex + ',' + translatey + ') ;'
  let transition = 'transition: 0s;';
  let styling = '.' + childImgName + '{' +  width + height +  transform + transition + '}';
  embedStyle('body' , 'on-parent' , styling);
}

function setSecPos (childImgObj , childImgName){

  console.log('making second Pos');
  console.log(childImgObj);
  window.setTimeout(function(){

    let windowWidth = window.innerWidth;
    let windowHeight  = window.innerHeight;
    let originalWidth = childImgObj.naturalWidth;
    let originalHeight = childImgObj.naturalHeight;
    let aspRatio = originalWidth / originalHeight;
    let width = 0;
    let height = 0;
    if (originalWidth > windowWidth) {
      if( 0.95 * windowHeight * aspRatio  > windowWidth) {
        width = windowWidth;
        height = windowWidth / aspRatio;
      }else {
        height = 0.95 * windowHeight;
        width = height * aspRatio;
      }
    }else {
      if( originalHeight > 0.95 * windowHeight ) {
        height = 0.95 * windowHeight;
        width = height * aspRatio;
      }else {
        width = originalWidth;
        height =  originalHeight;
      }
    }
    let translatex = (windowWidth - width) / 2  + 'px' ;
    let translatey = (windowHeight - height) / 2 + 'px'  ;
    let transform = 'transform: translate(' + translatex  + ' , '  + translatey + ');'
    height = 'height:' + height + 'px;';
    width = 'width:'+  width + 'px;';
    let transition = 'transition: 300ms linear;';
    let styling = '.' + childImgName + '{' + width + height   +  transform + transition + '}';
    embedStyle('body' , 'scale-from-parent' , styling);
    remStyle('on-parent');
    console.log('finishing second Pos');
  } , 10);
}


/* parent image is the image showed in page it self */
/* child image is the image in lightbox */
/* childImgName is the class name of the child image */
function start_up (parentImg , childImg ,  childImgName){
  remStyle('introStyling');
  console.log('this is a callback function ');
  childImg.parentNode.parentNode.classList.remove('preloader-spinner');
  childImg.classList.remove('hide-till-load');
  console.log('preloader removed');
  let windowWidth = window.innerWidth;
  let windowHeight  = window.innerHeight;
  let originalWidth = childImg.naturalWidth;
  let originalHeight = childImg.naturalHeight;
  let translatey1 = Math.round(parentImg.getBoundingClientRect().top) + 'px';
  let translatex1 =  Math.round(parentImg.getBoundingClientRect().left) + 'px';
  let height1 = 'height:' +  parentImg.getBoundingClientRect().height + 'px;';
  let width1 = 'width:' +  parentImg.getBoundingClientRect().width + 'px;';
  let transition1 = 'transition: 0s;';
  console.log(parentImg.getBoundingClientRect().height);
  console.log(parentImg.getBoundingClientRect().width);

  let aspRatio = originalWidth / originalHeight;
  let width2 = 0;
  let height2 = 0;
  if (originalWidth > windowWidth) {
    if( 0.95 * windowHeight * aspRatio  > windowWidth) {
      width2 = Math.round(windowWidth);
      height2 = Math.round(windowWidth / aspRatio);
    }else {
      height2 =  Math.round(0.95 * windowHeight);
      width2 =  Math.round(height2 * aspRatio);
    }
  }else {
    if( originalHeight > 0.95 * windowHeight ) {
      height2 =  Math.round(0.95 * windowHeight);
      width2 =  Math.round(height2 * aspRatio);
    }else {
      width2 =  Math.round(originalWidth);
      height2 =   Math.round(originalHeight);
    }
  }
  let translatex2 = Math.round((windowWidth - width2) / 2 )  + 'px' ;
  let translatey2 = Math.round((windowHeight - height2) / 2 ) + 'px'  ;
  let scalex2 = width2 / parentImg.getBoundingClientRect().width;
  let scaley2 = height2 / parentImg.getBoundingClientRect().height;
  let transform1 = 'transform: translate('+ translatex1 + ',' + translatey1 + ') ;'
  let transform2 = 'transform: translate(' + translatex2  + ','  + translatey2 + '  );'
  height2 = 'height:' + height2 + 'px;';
  width2 = 'width:'+  width2 + 'px;';
  let transition2 = 'transition: 300ms linear;';

  let styling = '@keyframes imgIntro {0%{' + transform1 +  height1 + width1 + '}'
  + '5%{' + transform1 +  height1 + width1 + '}'
  +'100%{' + transform2 +  height2 + width2 + '}}';
  // styling += '@-webkit-keyframes imgIntro {0%{' + transform1 +  height1 + width1 + '}'
  // + '5%{' + transform1 +  height1 + width1 + '}'
  // +'100%{' + transform2 +  height2 + width2 + '}}';
  // styling += '@-moz-keyframes imgIntro {0%{' + transform1 +  height1 + width1 + '}'
  // + '5%{' + transform1 +  height1 + width1 + '}'
  // +'100%{' + transform2 +  height2 + width2 + '}}';
  styling += '.' + childImgName + '{';
  // styling += '-webkit-animation-duration: 0.5s;';
  // styling += '-webkit-animation-name: imgIntro;';
  // styling += '-webkit-animation-direction: normal;';
  // styling += '-webkit-animation-fill-mode: forwards;';
  // styling += '-moz-animation-name: imgIntro;';
  // styling += '-moz-animation-duration: 0.5s;';
  // styling += '-moz-animation-direction: normal;' ;
  // styling += '-moz-animation-fill-mode: forwards;';
  styling += '-webkit-' + transform2;
  styling += height2;
  styling += width2;
  styling += 'animation-name: imgIntro;';
  styling += 'animation-duration: 0.3s;';
  styling += 'animation-direction: normal;';
  styling += 'animation-fill-mode: forwards;' + '}'  ;

  embedStyle('body' , 'introStyling' , styling);

}

function goNext (){

}

function goPrev (){

}

// Initialising gks-lightbox object
function Gks_lightbox(targetClass , options , bgColor ){
    const self = this;
    this.targetClass = '.' + targetClass;
    this.id = targetClass + new Date().getTime();
    this.imgs = $el(this.targetClass);
    this.nuOfImgs = this.imgs.length;
    this.windowWidth = window.innerWidth;

    if (options ===  null || Object.keys(options).length === 0 || options.length === 0) {

      console.log('Empty options');
      } else {

    // // TODO: Validate options
        console.log('Filled options');

        self.options = returnedOptions(options);
        this.setting_templates();

        /* Handeling defaults */
        handelingDefaults(options , this);
    }

    this.set_ex_template = function  (template , name  ,  category) {

        if (this[category]) {
         this[category][name] = template;
            console.log('category found');
            console.log(this[category]);

        }else {
            console.log('category not found');
        }
    };

    this.bgColor =  bgColor;
    this.init_lightbox();
}

Gks_lightbox.prototype.setting_templates = function () {
  const self = this;
  let closeBox = '<div class="svg-box" ><svg aria-hidden="true" focusable="false" class="times close-gks-box close-svg toolsbar-svg" viewBox="0 0 352 512"><path class=" close-gks-box close-path" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></div>';
  let playBox =   '<div class="svg-box" ><svg focusable="true" class="gks-box-play toolsbar-svg"  viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></div>';
  let galleryBox =   '<div class="svg-box" ><svg focusable="true" class="gks-box-gallery toolsbar-svg"  viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></div>';
  let zoomBox =   '<div class="svg-box" ><svg focusable="true" class="gks-box-zoom toolsbar-svg"  viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></div>';
  let infoBar = '<div class="gksbox-infobar" >This is the Info Bar</div>';
  let toolBar = '<div class="gksbox-toolbar" >'+ zoomBox + playBox +galleryBox + closeBox + ' </div>';
  let gksStage = ' <div class="gksbox-stage" > <div class="gksbox-slide" > <div class="gksbox-content"> <img class="single-img" src=""></div> </div> </div>';
  let gksStageMulti = ' <div class="gksbox-stage" >'  + '<div class="gksbox-slide" > <div class="gksbox-content"> <img class="gallery-img" src=""></div> </div>'.repeat(self.nuOfImgs) + '</div>';
  let imgNumbering = '<div class="img-numbering" ></div>';
  let nxtArrow = '<svg class="svg-inline--fa fa-chevron-right fa-w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>';
  let prevArrow = '<svg class="svg-inline--fa fa-chevron-left fa-w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>';
  let nxtArrowBox = '<div class="nxtArrow navArrow">' + nxtArrow + '</div>';
  let prevArrowBox = '<div class="prevArrow navArrow">' + prevArrow + '</div>';


  if (this.options.layout === 'single') {
    self.overlay_single_templates = {
      one_image:  '<!-- single image template --> <div class="overlay-container" > <div class="box-wrapper">'  + infoBar  + toolBar +  gksStage + imgNumbering  +  nxtArrowBox + prevArrowBox +  '</div> </div>' ,
    };
  }else if (self.options.layout === 'gallery') {
    console.log('it is gallery');
    self.overlay_gallery_templates = {
      gallery_imgs_right: '<!-- gallery image template --> <div class="overlay-container" > <div class="box-wrapper">'  + infoBar  + toolBar +  gksStageMulti + imgNumbering  +  nxtArrowBox + prevArrowBox + '</div> </div>' ,
      gallery_imgs_bottom: '<!-- gallery image template --> <div class="overlay-container" > <div class="box-wrapper">'  + infoBar  + toolBar +  gksStageMulti + imgNumbering  + nxtArrowBox + prevArrowBox +  '</div> </div>' ,
      gallery_imgs_left: '<!-- gallery image template --> <div class="overlay-container" > <div class="box-wrapper">'  + infoBar  + toolBar +  gksStageMulti + imgNumbering  +  nxtArrowBox + prevArrowBox + '</div> </div>' ,
      gallery_imgs_top: '<!-- gallery image template --> <div class="overlay-container" > <div class="box-wrapper">'  + infoBar  + toolBar +  gksStageMulti + imgNumbering  + nxtArrowBox + prevArrowBox +  '</div> </div>' ,
    };
  }else if (self.options.layout === 'form') {

  }else if (self.options.layout === 'product') {

  }else if (self.options.layout === 'video') {

  }

};

Gks_lightbox.prototype.init_lightbox = function() {

  this.gks_overlay();
  this.register_components();
  this.collecting_img();

};

Gks_lightbox.prototype.gks_overlay = function() {
  let desktop_paper = document.createElement('div');
  desktop_paper.addMultipleClassNames(['lightbox-overlay' , 'gks-overlay-hdn']);
  desktop_paper.setAttribute('id' , this.id );
  desktop_paper.innerHTML = this.options.template;
  document.body.appendChild(desktop_paper);
  this.desktop_paper = desktop_paper;
};

Gks_lightbox.prototype.register_components = function () {


  this.overlayContainer = $el("#"  +  this.id + " .overlay-container");

  this.gksBoxStage = $el("#" + this.id + " > .overlay-container  .gksbox-stage");

  this.gksBoxSlide = $el("#" + this.id + " > .overlay-container  .gksbox-slide");

  this.close_btn = $el("#" + this.id + " > .overlay-container  .close-gks-box");

  this.img_num = $el("#" + this.id + " > .overlay-container  .img-numbering");

  if (this.options.layout === 'single') {

        const single_pointer =  "#" + this.id +  " .single-img";
        this.my_single_img = $el(single_pointer);

    }else if (this.options.layout === 'gallery') {
        const self = this;
        const gallery_pointer =  "#" + self.id +  " .gallery-img";
        self.my_stage_imgs = $el(gallery_pointer);
        self.sidebar_imgs = $el(gallery_pointer);
        self.sidebar_imgs.forEach( function (item , i) {
          // item.setAttribute("src" , self.imgs[i].getAttribute("href") ) ;
          item.setAttribute("src" , "" ) ;
        });
  }

};

// WARNING: this is test method
Gks_lightbox.prototype.collecting_img = function () {
  const self = this;
  self.imgs.forEach( function (sourceImg , i) {

    sourceImg.addEventListener('click' , function (e) {
      e.preventDefault();
      self.desktop_paper.classList.remove('gks-overlay-hdn');
      self.desktop_paper.classList.add(self.bgColor);
      if (self.my_single_img) {

         self.my_single_img.parentNode.classList.add('gks-first-look');
         // self.my_single_img.setAttribute('src' , e.currentTarget.getAttribute('href') );
         console.log(e.currentTarget.getAttribute('href'));
         imgPreloader( sourceImg
                    ,  self.my_single_img
                    ,  e.currentTarget.getAttribute('href')
                    , function(){
                      start_up (sourceImg ,  self.my_single_img , 'gks-first-look');
                    });


    } // else if (self.my_stage_imgs) {
    //
    //      self.my_stage_imgs.forEach( (function (item , c) {
    //
    //        self.gksBoxSlide[c].style.transform = 'translate('+ self.windowWidth * (c-i) +'px , 0)';
    //        // updateSlideWidth(self , c , i);
    //        if (i === c) {
    //          self.activeSlide = c;
    //          item.parentNode.classList.add('gks-first-look');
    //
    //          if ( imgPreloader( sourceImg , item , e.currentTarget.getAttribute('href') , preloadingSpinner)) {
    //            setFirstPos(sourceImg , item , 'gks-first-look');
    //          }
    //
    //
    //          item.addEventListener( 'load' , multiLoadHandler );
    //
    //          function multiLoadHandler () {
    //            setSecPos( item , 'gks-first-look');
    //            item.removeEventListener('load' , multiLoadHandler);
    //          }
    //
    //        }
    //
    //      }));
    //
    //    }
    //
      handelingScrolling(self.options.disableScrolling);

      self.end_lightbox(self);
    });
  });
};

// Gks_lightbox.prototype.collecting_img = function () {
//   const self = this;
//   self.imgs.forEach( function (sourceImg , i) {
//
//     sourceImg.addEventListener('click' , function (e) {
//       e.preventDefault();
//       self.desktop_paper.classList.remove('gks-overlay-hdn');
//       self.desktop_paper.classList.add(self.bgColor);
//       if (self.my_single_img) {
//
//          self.my_single_img.parentNode.classList.add('gks-first-look');
//          // self.my_single_img.setAttribute('src' , e.currentTarget.getAttribute('href') );
//
//          if(imgPreloader(sourceImg ,  self.my_single_img , e.currentTarget.getAttribute('href') , preloadingSpinner )){
//            setFirstPos(sourceImg ,  self.my_single_img , 'gks-first-look' );
//          }
//
//
//       self.my_single_img.addEventListener ( 'load' , singleLoadHandler );
//
//       function singleLoadHandler (){
//         setSecPos( this , 'gks-first-look');
//         self.my_single_img.removeEventListener('load' , singleLoadHandler);
//       }
//       }else if (self.my_stage_imgs) {
//
//         self.my_stage_imgs.forEach( (function (item , c) {
//
//           self.gksBoxSlide[c].style.transform = 'translate('+ self.windowWidth * (c-i) +'px , 0)';
//           // updateSlideWidth(self , c , i);
//           if (i === c) {
//             self.activeSlide = c;
//             item.parentNode.classList.add('gks-first-look');
//
//             if ( imgPreloader( sourceImg , item , e.currentTarget.getAttribute('href') , preloadingSpinner)) {
//               setFirstPos(sourceImg , item , 'gks-first-look');
//             }
//
//
//             item.addEventListener( 'load' , multiLoadHandler );
//
//             function multiLoadHandler () {
//               setSecPos( item , 'gks-first-look');
//               item.removeEventListener('load' , multiLoadHandler);
//             }
//
//           }else {
//
//             // item.setAttribute('src' , self.imgs[c].getAttribute('href') );
//           }
//
//         }));
//
//       }
//
//       handelingScrolling(self.options.disableScrolling);
//
//       self.end_lightbox(self);
//     });
//   });
// };

Gks_lightbox.prototype.end_lightbox = function (self) {
  // let style = null;
   if (!self.isListenedBefore) {
     let closeFrom = [  self.close_btn.item(0)
                      , self.close_btn.item(1) , self.desktop_paper , self.overlayContainer
                      , self.gksBoxStage];
     if (self.gksBoxSlide.length > 1) {
       let mySlides = Array.prototype.slice.call(self.gksBoxSlide);
       console.log(mySlides);
       closeFrom = closeFrom.concat(mySlides);
     }else {
       closeFrom.push(self.gksBoxSlide);
       console.log(closeFrom);
     }
     for (let i = 0; i < closeFrom.length; i++) {
       if (self.options.closeFromAnyWhere === false && i > 1) {
         break;
       }

        closeFrom[i].addEventListener('click' , closing);
        function closing (e) {
         if (e.target != e.currentTarget) {
           return;
         }

         self.desktop_paper.classList.add('gks-overlay-hdn' );
         document.body.removeMultipleClassNames(['disableScrolling' , 'compensate-for-scrolbar' ]);
         remStyle('gks-scroll-styling');
     }
     if (i === closeFrom.length - 1) {
       self.isListenedBefore = true;
     }
   }
}

};

Gks_lightbox.prototype.set_defaults = function() {

};



/*  https://www.youtube.com/watch?v=F8xANXY0kaU  */
 let s =  'https://www.youtube.com/watch?v=F8xANXY0kaU';
 let f =  'youtube.com/watch?v=';
  console.log(s.indexOf(f));

// window.onload = function (){
  console.log("page loaded");
  let tem =  '<!-- single image template --> <div class="overlay-container" > <div class="box-wrapper"> <div class="close-gks-box">&times;</div> <div class="gksbox-stage" > <div class="gksbox-slide" > <div class="gksbox-content"> <img class="single-img" src=""></div> </div> </div> <div class="img-numbering" ></div>  </div> </div>';
  new Gks_lightbox("gks_img1" , {layout: 'gallery' , closeFromAnyWhere: true } , "yellow");
  new Gks_lightbox("gks_img2" , {fitImagesInViewport: true , layout: 'single', closeFromAnyWhere: true } , "blue");
  new Gks_lightbox("gks_img3" , {layout: 'gallery' , closeFromAnyWhere: true } , "black");
  // new_lightbox.set_ex_template("dodo" , "dodoname" ,"overlay_gallery_templates");
// };
