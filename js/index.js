$(window).on('load',function(){
  gsap.to('#loader',1,{y:"-100%"});
  gsap.to('#loader',1,{opacity:0});
  gsap.to('#loader',0,{display:"none",delay:1});
  gsap.to('#header',0,{display:"block",delay:1})
  gsap.to('#navigation-content',0,{display:"none"});
  gsap.to('#navigation-content',0,{display:"flex",delay:1});
})
$(function(){
  $('.color-panel').on("click",function(e) {
    e.preventDefault();
    $('.color-changer').toggleClass('color-changer-active');
});
$('.colors a').on("click",function(e) {
  e.preventDefault();
  var attr = $(this).attr("title");
  console.log(attr);
  $('head').append('<link rel="stylesheet" href="css/'+attr+'.css">');
});
});
$(function(){
     $('.menubar').on('click',function(){
         gsap.to('#navigation-content',.6,{y:0});
     })
     $('.navigation-close').on('click',function(){
        gsap.to('#navigation-content',.6,{y:"-100%"});
    });
   }); 

$(function(){
    var TxtRotate = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.currentColor = '#3dd60fff'; // Initialize with default color
        this.tick();
        this.isDeleting = false;
      };
      
      TxtRotate.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];
      
        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Generate new random color at start of each loop
        if (this.txt.length === 0) {
          this.currentColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
          console.log('New color generated:', this.currentColor);
        }
      
        this.el.innerHTML = '<span class="wrap" style="color:' + this.currentColor + '">'+this.txt+'</span>';
        console.log('Current color:', this.currentColor); // Debug output
      
        var that = this;
        var delta = 200 - Math.random() * 100;
      
        if (this.isDeleting) { delta /= 2; }
      
        if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          delta = 100;
        }
      
        setTimeout(function() {
          that.tick();
        }, delta);
      };
      
      window.onload = function() {
        var elements = document.getElementsByClassName('txt-rotate');
        for (var i=0; i<elements.length; i++) {
          var toRotate = elements[i].getAttribute('data-rotate');
          var period = elements[i].getAttribute('data-period');
          if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
          }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".txt-rotate > .wrap { border-right: 0em solid #666 ; }";
        document.body.appendChild(css);
      };
})
$(function(){

    $('#about-link').on('click',function(){
      gsap.to('#navigation-content',0,{display:"none",delay:.7});
      gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
  gsap.to('#header',0,{display:"none"});
gsap.to('#blog',0,{display:"none"});
gsap.to('#portfolio',0,{display:"none"});
   gsap.to('#breaker',0,{display:"block"});
   gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#contact',0,{display:"none"});
   gsap.to('#breaker',0,{display:"none",delay:2});
   gsap.to('#breaker-two',0,{display:"none",delay:2});
   gsap.to('#about',0,{display:"block",delay:.7});
   gsap.to('#navigation-content',0,{display:'flex',delay:2});
 })
 $('#contact-link').on('click',function(){
   gsap.to('#navigation-content',0,{display:"none",delay:.7});
   gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
gsap.to('#header',0,{display:"none"});
gsap.to('#about',0,{display:"none"});
gsap.to('#blog',0,{display:"none"});
gsap.to('#portfolio',0,{display:"none"});
gsap.to('#breaker',0,{display:"block"});
gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#breaker',0,{display:"none",delay:2});
gsap.to('#breaker-two',0,{display:"none",delay:2});
gsap.to('#contact',0,{display:"block",delay:.7});
gsap.to('#navigation-content',0,{display:'flex',delay:2});
})
$('#portfolio-link').on('click',function(){
  gsap.to('#navigation-content',0,{display:"none",delay:.7});
  gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
gsap.to('#header',0,{display:"none"});
gsap.to('#about',0,{display:"none"});
gsap.to('#contact',0,{display:"none"});
gsap.to('#blog',0,{display:"none"});
gsap.to('#breaker',0,{display:"block"});
gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#breaker',0,{display:"none",delay:2});
gsap.to('#breaker-two',0,{display:"none",delay:2});
gsap.to('#portfolio',0,{display:"block",delay:.7});
gsap.to('#navigation-content',0,{display:'flex',delay:2});
})
$('#blog-link').on('click',function(){
  gsap.to('#navigation-content',0,{display:"none",delay:.7});
  gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
gsap.to('#header',0,{display:"none"});
gsap.to('#about',0,{display:"none"});
gsap.to('#portfolio',0,{display:"none"});
gsap.to('#contact',0,{display:"none"});
gsap.to('#breaker',0,{display:"block"});
gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#breaker',0,{display:"none",delay:2});
gsap.to('#breaker-two',0,{display:"none",delay:2});
gsap.to('#blog',0,{display:"block",delay:.7});
gsap.to('#navigation-content',0,{display:'flex',delay:2});
})
$('#home-link').on('click',function(){
  gsap.to('#navigation-content',0,{display:"none",delay:.7});
  gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
gsap.to('#header',0,{display:"none"});
gsap.to('#about',0,{display:"none"});
gsap.to('#portfolio',0,{display:"none"});
gsap.to('#contact',0,{display:"none"});
gsap.to('#blog',0,{display:"none"});
gsap.to('#breaker',0,{display:"block"});
gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#breaker',0,{display:"none",delay:2});
gsap.to('#breaker-two',0,{display:"none",delay:2});
gsap.to('#header',0,{display:"block",delay:.7});
gsap.to('#navigation-content',0,{display:'flex',delay:2});
})

})
$(function(){
 var body =  document.querySelector('body');
 var $cursor = $('.cursor')
   function cursormover(e){
    
    gsap.to( $cursor, {
      x : e.clientX ,
      y : e.clientY,
      stagger:.002
     })
   }
   function cursorhover(e){
    gsap.to( $cursor,{
     scale:1.4,
     opacity:1
    })
    
  }
  function cursor(e){
    gsap.to( $cursor, {
     scale:1,
     opacity:.6
    }) 
  }
  $(window).on('mousemove',cursormover);
  $('.menubar').hover(cursorhover,cursor);
  $('a:not([target="_blank"])').hover(cursorhover,cursor);
  $('.navigation-close').hover(cursorhover,cursor);

})

// 音频控制功能
$(function() {
  const audio = document.querySelector('audio');
  const toggleBtn = document.getElementById('audio-toggle');
  
  // 音乐列表
  const musicFiles = [
    'link/music/Anyone.mp3',
    'link/music/搁浅.mp3',
    'link/music/戒不掉.mp3',
    'link/music/柳叶笺.mp3',
    'link/music/明天，你好.mp3',
    'link/music/我记得.mp3',
    'link/music/这世界那么多人.mp3',
    'link/music/I Really Want To Stay At Your House.mp3', 
    'link/music/WE PRAY.mp3',
    'link/music/终生老友.mp3',
    'link/music/是什么让我遇见这样的你.mp3',
    'link/music/everglow.mp3',
    'link/music/Trouble I’m in.mp3',
    'link/music/鱼仔.mp3',
    'link/music/无额.mp3',
    'link/music/哪里都是你.mp3',
    'link/music/every time we touch.mp3',
        "link/music/所念皆星河.mp3",
"https://m801.music.126.net/20250725214223/b88356536a82bb87ad337a742ace386b/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/17718436245/f062/58cc/541e/0c7d69976f536e0552ebb7c8821566f7.mp3?vuutv=ur6g6mxT0xX8QIyAfFSa7diG6w9jBwXurAcMxz+OYrgJHGxOdQXy0dYNlMTLGKn8SBIETbzRvCR+nMIk+yTzkqyrhr3EPSEE/6Z7eLqw/R4gaPeyVxkJdOhVp2wAlFGSFYxmPAPSwl+ZJGh8D40cshBKot/GMDGcX43gNFRMGwHqa80srGuaIMlf+VS9PmN0vwKN7xpYGXmWYc69SKTXxynS0SLLFqNMYPYLz5mWGq6DWhcYRBLJknxSJ8U0tTty/7Umf/1gtWjgx8mX01NG10cD6vMHF029r6r6OlxGYiCTzCL2xiF/KLwzatoLCy5aelVbjJJTMAjEOZke8oE1jHCpMHY6AfGXbLDr4ICjABAaGBUPhvlnkISHkdMYeuac",
    "https://m801.music.126.net/20250725212656/706b344d1743460e5f57a8aa0de8af33/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/30301113155/7eda/02ed/91b6/822eb95eb53b52ae5c03f48ee9883ea1.mp3?vuutv=B05ynIr9eJju91SajYA9KJMDl2zUBm3qsK+Ad8/9seRlCNYyjnfqud540WI3awNDOMUDP03A5f+YQF7/y0v/nFBd/Z9AJtPoDn7e4IzgytcL0PKH8qJwtMZ31tIT23HZiMWmnse8Pa0X88gRSK4HW2N8NDy0oDsxwIPZgBY38jSFHkwwzv1N9byuAvx3UgSpY4NLE/6Q/ugo4KKDXqBZXmDq9DIH8CzTOCThnkUrBH4sPowAq6c6e72woCyXoOhO68kxrPsWi6i/AldmUWtxg6agBD5MRlpBwmC3+Uaa273w1lGYfBDoKKUbj1M1z9dUrcRjdBIVipRwENtcBAGseJv/sc+JuzYhFw09bH9L3Egwq6za5bBq1b9+vU4iCFji",
    "https://m801.music.126.net/20250725221351/b88d5d7cb7354fcb6a19e11dddd205a2/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28481702452/fe23/0a50/2da2/e401dcaa57baf7a2d4850ac9002fa400.mp3?vuutv=GW4A2h2PGc5IUMcnA8eJyVrBWqivpe9JtOQKjfdEKYp5zAGdMgzxez5b+MbvB1kNbqbgdULv5X+gTA/CiSBNN4TealUF/iICg/Pc9rSy+i6HNNVK64HmViMe2DJ/ijvWex7PFRqVhMD0ZmOKGPPsMspol8EaHKfbKtpRQwO5t9Oj1anrWuzGStm8+7og5Nj222FCBTXhObERWVgLubp0HuGOviKQVrqbg0I4Spa6sBu43xvq4Qm374XcEOHRAo4ZzWVcswnE40rSvIZb4XRdDQ264vosALMsbM/7uHouBhl9t4vxlgsPM3dTabyCwZ5XpYAZlK62P09PtwaDl/oXgx4jUcjVwlsPDi0Zyj2BFxySYnS1yHvyh9IELiPZlGXm",
    "https://ws.stream.qqmusic.qq.com/M500000qeQug4FZVG2.mp3?guid=493794572&vkey=93BDFA4DA667BB4EB033B32A4B052826DA8A009A580F03E5A748FD9A3E340269F0079F39FEC6A87DE8149F89DD57082052FB35436758DC6A__v21519280a&uin=&fromtag=120042&src=M500003GbBNd0eYOZR.mp3",
    "https://ws.stream.qqmusic.qq.com/M500002peQOX1Cq3a4.mp3?guid=720666577&vkey=A002C968BFA77A02EBD0811B3C133E1A0B2CF2409555320F09BE161C8E61784710C8F398428D0A1FC2421611973E549918F09313B5025219__v21ea05d38&uin=&fromtag=120042&src=M500002HUfmQ3XPS9w.mp3",
    "https://ws.stream.qqmusic.qq.com/M5000002Cv5T08PDre.mp3?guid=403155588&vkey=D02D82A7F7C63BDC19482F41F462F72E0FC4772A6AF6E63633716C135A48AA0BEE935FCC3D73FEE6F02866647D43A1DF2EE4D63677F5647A__v21ea05d38&uin=&fromtag=120042",
    "https://m10.music.126.net/20250725225413/6ce81f4a882aa5de0a430914ccde9836/ymusic/78f4/6b32/db59/a5f16119e7cb6bc5637261bef655d9f2.mp3?vuutv=EjCT1grIDJPZviH6Kl+Ssfr4XvdA8imTXMNdcbqipsNXILJnuSCT8zOTLq9xlrWmqxWBNT9mPinjfkWy9tWqXnEQSb4lIYqlt9ojFJvgB72z6AiSuEnJSl/3NzCvL8qv0iGqI9iGORQPML5/BDUAgk052XB1xmWoz/sjdxkd/evS3kN8kWAo77ipDVrEJEDLJoFy9ahyXPNUT0s8mpD0dk+AB+eAwtao01Wjh2iyaLGRT9qmGtjBhwbIcpvp472AEZwKkfLLNMWeslipwrQxUb7cSZh/OlHZx/z4qiFqpCk9crQNJNZ2mCsQ8IZSYZHvme3xQV9QkrbmccHcHXTzdygSPMGWWO4Mi7CrJhxaudsngZVb3SaQeRWOgiZ22v5X",
    "https://m801.music.126.net/20250725225815/f48d7fef8b1920c34147a191204a283f/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/59563994535/3995/b165/4e73/e3ec4648f61f3536de5f8c2b9ae940f9.mp3?vuutv=0WuIrTsAED98UP9yithOgfaE2AaXKG+votlP4IXMBRpq0e+Md9BXE+Wc9H16Oc2ypoFaiqrJvljX+QkHqfHiIn8J+g1Q9cRJ4JhfXwSqLBD4a1wtnoU6iFVT50qWPOB7RCCRiX3r/9V0GA1JToC32iv1e+v86+6Bwvxfmqdjni9VioCusK9Ql+J16iF0v9V25+1x0YLjHUOmzHktdX+2BErW0oY+aa4yJKH9/dF3hUUQ5a+uxeCdKqWX9OtDB4c38SfWtRRRNTBPd0ofO2ncCLPf0S/8/Z2niytg70yL3RLs61ve52KrT+c9ElagzKlIV/VqbLrZrkL7+tegqBoTfeB7Hxg50vYMBuIsNjl9jDXE11651QfxosjAs3v75isj",
    "https://m701.music.126.net/20250725230045/5df98ee15d93ee79694a4317669f00cf/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/55814189925/b391/2cf7/ad0b/0f34687e593a9fb36d149283d641402c.mp3?vuutv=232SKA1BzVS7AuYGfj9cq0LjjGTV7nuS6Z+EJcGVI/i4roX6fnuVOvMWEJMWk9A1i+q62HJq0OWgraJ9noOBULERmnLg8KXqusJ/7MnJH3748pVWleBG96tvdP0xx7l/bpPTvLt/JVWS8nITGHNZdP5iPhu7sXHqOEjLvHwjg5ltc8xS0GqSEvZqC9pE4+6kMBiwpR5txOwNTjq7frRsCT227ZlggSVBjG0FqzBdqjKRpgWEBK3czHB4fKvWYk8KVvrFcBYzJ1RLjbHJ2zc3F6tnfPMDGCHxn/qAn8T9OCR9xd1bVhBVPpEULgBgo6qcqB9WtIjaJE5vQ981c00w47FvCz7L9aoVn4iscppnab+y+dPdINzh/WBt4M+ktlzh",
  ];
  
  // 随机选择音乐
  function getRandomMusic() {
    const randomIndex = Math.floor(Math.random() * musicFiles.length);
    return musicFiles[randomIndex];
  }
  
  // 初始状态
  let isPlaying = false;
  audio.autoplay = false; // 禁用自动播放
  toggleBtn.src = "link/img/music_off.png"; // 初始显示暂停图标
  audio.src = getRandomMusic(); // 设置初始随机音乐
  
  // 音乐结束事件
  audio.addEventListener('ended', function() {
    audio.src = getRandomMusic();
    if (isPlaying) {
      audio.play();
    }
  });
  
  // 首次点击时开始播放
  document.body.addEventListener('click', function firstClick() {
    if (!isPlaying) {
      audio.play().catch(e => {
        console.log("Autoplay prevented:", e);
        toggleBtn.src = "link/img/music_off.png";
      });
      toggleBtn.src = "link/img/music_on.png";
      isPlaying = true;
    }
    document.body.removeEventListener('click', firstClick);
  });
  
  // 切换播放/暂停
  toggleBtn.addEventListener('click', function() {
    // 添加点击动画
    gsap.to(toggleBtn, {
      scale: 0.8,
      opacity: 0.7,
      duration: 0.1,
      onComplete: function() {
        gsap.to(toggleBtn, {
          scale: 1,
          opacity: 1,
          duration: 0.2
        });
      }
    });

    if (isPlaying) {
      audio.pause();
      toggleBtn.src = "link/img/music_off.png";
    } else {
      audio.play();
      toggleBtn.src = "link/img/music_on.png";
    }
    isPlaying = !isPlaying;
  });
  
  // 窗口焦点变化时暂停
  window.addEventListener('blur', function() {
    if (isPlaying) {
      audio.pause();
      toggleBtn.src = "link/img/music_off.png";
      isPlaying = false;
      localStorage.setItem('audioWasPlaying', 'true');
    }
  });
  
  // 窗口重新获得焦点时恢复播放
  window.addEventListener('focus', function() {
    if (!isPlaying && localStorage.getItem('audioWasPlaying') === 'true') {
      audio.play().then(() => {
        toggleBtn.src = "link/img/music_on.png";
        isPlaying = true;
        localStorage.removeItem('audioWasPlaying');
      }).catch(e => {
        console.log("Resume playback failed:", e);
      });
    }
  });
});
