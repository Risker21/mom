// 加载完成处理函数
function handlePageLoad() {
  gsap.to("#loader", 1, { y: "-100%" });
  gsap.to("#loader", 1, { opacity: 0 });
  gsap.to("#loader", 0, { display: "none", delay: 1 });
  gsap.to("#header", 0, { display: "block", delay: 1 });
  gsap.to("#navigation-content", 0, { display: "none" });
  gsap.to("#navigation-content", 0, { display: "flex", delay: 1 });
  
  // 清除超时定时器，防止重复执行
  if (window.loadTimeout) {
    clearTimeout(window.loadTimeout);
    window.loadTimeout = null;
  }
}

// 设置3秒超时机制 - 防止网络问题导致加载动画卡住
window.loadTimeout = setTimeout(function() {
  // 如果3秒后页面还没有加载完成，强制隐藏加载动画
  if (document.readyState !== 'complete') {
    console.log('页面加载超时，强制隐藏加载动画');
    handlePageLoad();
  }
}, 3000);

// 页面加载完成事件
$(window).on("load", handlePageLoad);

// 如果页面已经加载完成，立即执行
if (document.readyState === 'complete') {
  handlePageLoad();
}
$(function () {
  $(".color-panel").on("click", function (e) {
    e.preventDefault();
    $(".color-changer").toggleClass("color-changer-active");
  });
  $(".colors a").on("click", function (e) {
    e.preventDefault();
    var attr = $(this).attr("title");
    console.log(attr);
    $("head").append('<link rel="stylesheet" href="css/' + attr + '.css">');
  });
});
$(function () {
  $(".menubar").on("click", function () {
    gsap.to("#navigation-content", 0.6, { y: 0 });
  });
  $(".navigation-close").on("click", function () {
    gsap.to("#navigation-content", 0.6, { y: "-100%" });
  });
});

$(function () {
  var TxtRotate = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = "";
    this.currentColor = "#3dd60fff"; // Initialize with default color
    this.tick();
    this.isDeleting = false;
  };

  TxtRotate.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Generate new random color at start of each loop
    if (this.txt.length === 0) {
      this.currentColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      console.log("New color generated:", this.currentColor);
    }

    this.el.innerHTML =
      '<span class="wrap" style="color:' +
      this.currentColor +
      '">' +
      this.txt +
      "</span>";
    console.log("Current color:", this.currentColor); // Debug output

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
      delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === "") {
      this.isDeleting = false;
      this.loopNum++;
      delta = 100;
    }

    setTimeout(function () {
      that.tick();
    }, delta);
  };

  window.onload = function () {
    var elements = document.getElementsByClassName("txt-rotate");
    for (var i = 0; i < elements.length; i++) {
      var toRotate = elements[i].getAttribute("data-rotate");
      var period = elements[i].getAttribute("data-period");
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
});
$(function () {
  $("#about-link").on("click", function () {
    gsap.to("#navigation-content", 0, { display: "none", delay: 0.7 });
    gsap.to("#navigation-content", 0, { y: "-100%", delay: 0.7 });
    gsap.to("#header", 0, { display: "none" });
    gsap.to("#blog", 0, { display: "none" });
    gsap.to("#portfolio", 0, { display: "none" });
    gsap.to("#breaker", 0, { display: "block" });
    gsap.to("#breaker-two", 0, { display: "block", delay: 0.1 });
    gsap.to("#contact", 0, { display: "none" });
    gsap.to("#breaker", 0, { display: "none", delay: 2 });
    gsap.to("#breaker-two", 0, { display: "none", delay: 2 });
    gsap.to("#about", 0, { display: "block", delay: 0.7 });
    gsap.to("#navigation-content", 0, { display: "flex", delay: 2 });
  });
  $("#contact-link").on("click", function () {
    gsap.to("#navigation-content", 0, { display: "none", delay: 0.7 });
    gsap.to("#navigation-content", 0, { y: "-100%", delay: 0.7 });
    gsap.to("#header", 0, { display: "none" });
    gsap.to("#about", 0, { display: "none" });
    gsap.to("#blog", 0, { display: "none" });
    gsap.to("#portfolio", 0, { display: "none" });
    gsap.to("#breaker", 0, { display: "block" });
    gsap.to("#breaker-two", 0, { display: "block", delay: 0.1 });
    gsap.to("#breaker", 0, { display: "none", delay: 2 });
    gsap.to("#breaker-two", 0, { display: "none", delay: 2 });
    gsap.to("#contact", 0, { display: "block", delay: 0.7 });
    gsap.to("#navigation-content", 0, { display: "flex", delay: 2 });
  });
  $("#portfolio-link").on("click", function () {
    gsap.to("#navigation-content", 0, { display: "none", delay: 0.7 });
    gsap.to("#navigation-content", 0, { y: "-100%", delay: 0.7 });
    gsap.to("#header", 0, { display: "none" });
    gsap.to("#about", 0, { display: "none" });
    gsap.to("#contact", 0, { display: "none" });
    gsap.to("#blog", 0, { display: "none" });
    gsap.to("#breaker", 0, { display: "block" });
    gsap.to("#breaker-two", 0, { display: "block", delay: 0.1 });
    gsap.to("#breaker", 0, { display: "none", delay: 2 });
    gsap.to("#breaker-two", 0, { display: "none", delay: 2 });
    gsap.to("#portfolio", 0, { display: "block", delay: 0.7 });
    gsap.to("#navigation-content", 0, { display: "flex", delay: 2 });
  });
  $("#blog-link").on("click", function () {
    gsap.to("#navigation-content", 0, { display: "none", delay: 0.7 });
    gsap.to("#navigation-content", 0, { y: "-100%", delay: 0.7 });
    gsap.to("#header", 0, { display: "none" });
    gsap.to("#about", 0, { display: "none" });
    gsap.to("#portfolio", 0, { display: "none" });
    gsap.to("#contact", 0, { display: "none" });
    gsap.to("#breaker", 0, { display: "block" });
    gsap.to("#breaker-two", 0, { display: "block", delay: 0.1 });
    gsap.to("#breaker", 0, { display: "none", delay: 2 });
    gsap.to("#breaker-two", 0, { display: "none", delay: 2 });
    gsap.to("#blog", 0, { display: "block", delay: 0.7 });
    gsap.to("#navigation-content", 0, { display: "flex", delay: 2 });
  });
  $("#home-link").on("click", function () {
    gsap.to("#navigation-content", 0, { display: "none", delay: 0.7 });
    gsap.to("#navigation-content", 0, { y: "-100%", delay: 0.7 });
    gsap.to("#header", 0, { display: "none" });
    gsap.to("#about", 0, { display: "none" });
    gsap.to("#portfolio", 0, { display: "none" });
    gsap.to("#contact", 0, { display: "none" });
    gsap.to("#blog", 0, { display: "none" });
    gsap.to("#breaker", 0, { display: "block" });
    gsap.to("#breaker-two", 0, { display: "block", delay: 0.1 });
    gsap.to("#breaker", 0, { display: "none", delay: 2 });
    gsap.to("#breaker-two", 0, { display: "none", delay: 2 });
    gsap.to("#header", 0, { display: "block", delay: 0.7 });
    gsap.to("#navigation-content", 0, { display: "flex", delay: 2 });
  });
});
$(function () {
  var body = document.querySelector("body");
  var $cursor = $(".cursor");
  function cursormover(e) {
    gsap.to($cursor, {
      x: e.clientX,
      y: e.clientY,
      stagger: 0.002,
    });
  }
  function cursorhover(e) {
    gsap.to($cursor, {
      scale: 1.4,
      opacity: 1,
    });
  }
  function cursor(e) {
    gsap.to($cursor, {
      scale: 1,
      opacity: 0.6,
    });
  }
  $(window).on("mousemove", cursormover);
  $(".menubar").hover(cursorhover, cursor);
  $('a:not([target="_blank"])').hover(cursorhover, cursor);
  $(".navigation-close").hover(cursorhover, cursor);
});

// 音频控制功能
$(function () {
  const audio = document.querySelector("audio");
  const toggleBtn = document.getElementById("audio-toggle");

  // 音乐列表
  const musicFiles = [
    "link/music/此类生物.mp3",
    "link/music/想自由.mp3",
    "link/music/归途有风.mp3",
    "link/music/Born To Live.mp3",
    "link/music/搁浅.mp3",
    "link/music/离开我的依赖.mp3",
    "link/music/推开世界的门.mp3",
    "link/music/我记得.mp3",
    "link/music/这世界那么多人.mp3"
    

    
  ];
      // "link/music/秋风.mp3",
    // "link/music/水星记.mp3",
    // "link/music/Anyone.mp3",
    // "link/music/搁浅.mp3",
    // "link/music/戒不掉.mp3",
    // "link/music/柳叶笺.mp3",
    // "link/music/明天，你好.mp3",
    // "link/music/我记得.mp3",
    // "link/music/这世界那么多人.mp3",
    // "link/music/I Really Want To Stay At Your House.mp3",
    // "link/music/WE PRAY.mp3",
    // "link/music/终生老友.mp3",
    // "link/music/是什么让我遇见这样的你.mp3",
    // "link/music/everglow.mp3",
    // "link/music/Trouble I’m in.mp3",
    // "link/music/鱼仔.mp3",
    // "link/music/无额.mp3",
    // "link/music/哪里都是你.mp3",
    // "link/music/every time we touch.mp3",
    // "link/music/所念皆星河.mp3",
    // "link/music/let her go.mp3",
    // "link/music/程艾影.mp3",
    // "link/music/sacred play secret place.mp3",
    // "link/music/what was that.mp3",
    // "link/music/blue dragon.mp3",
    // "link/music/white ferrari.mp3",
    // "link/music/looking forward.mp3",
    // "link/music/reach.mp3",
    // "link/music/III.mp3",
    // "link/music/家后.mp3",
    // "link/music/离开我的依赖.mp3",
    // "link/music/路过人间.mp3",
    // "link/music/飞鸟和蝉.mp3",
    // "link/music/真爱的力量.mp3",
    // "link/music/Kamin.mp3",
    // "link/music/推开世界的门.mp3",
    // "link/music/房间.mp3",
    // "link/music/Lonely Day.mp3",
    // "link/music/演员.mp3",
    // "link/music/安和桥.mp3"

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
  audio.addEventListener("ended", function () {
    audio.src = getRandomMusic();
    if (isPlaying) {
      audio.play();
    }
  });

  // 首次点击时开始播放
  document.body.addEventListener("click", function firstClick() {
    if (!isPlaying) {
      audio.play().catch((e) => {
        console.log("Autoplay prevented:", e);
        toggleBtn.src = "link/img/music_off.png";
      });
      toggleBtn.src = "link/img/music_on.png";
      isPlaying = true;
    }
    document.body.removeEventListener("click", firstClick);
  });

  // 切换播放/暂停
  toggleBtn.addEventListener("click", function () {
    // 添加点击动画
    gsap.to(toggleBtn, {
      scale: 0.8,
      opacity: 0.7,
      duration: 0.1,
      onComplete: function () {
        gsap.to(toggleBtn, {
          scale: 1,
          opacity: 1,
          duration: 0.2,
        });
      },
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
  window.addEventListener("blur", function () {
    if (isPlaying) {
      audio.pause();
      toggleBtn.src = "link/img/music_off.png";
      isPlaying = false;
      localStorage.setItem("audioWasPlaying", "true");
    }
  });

  // 窗口重新获得焦点时恢复播放
  window.addEventListener("focus", function () {
    if (!isPlaying && localStorage.getItem("audioWasPlaying") === "true") {
      audio
        .play()
        .then(() => {
          toggleBtn.src = "link/img/music_on.png";
          isPlaying = true;
          localStorage.removeItem("audioWasPlaying");
        })
        .catch((e) => {
          console.log("Resume playback failed:", e);
        });
    }
  });
});
