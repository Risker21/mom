// 加载动画处理 - 增强版超时和错误处理机制
var loaderHidden = false;
var loaderTimeout = null;
var resourcesLoaded = false;

function updateLoaderProgress(progress) {
  var progressBar = document.getElementById('loader-progress');
  var progressText = document.getElementById('loader-progress-text');
  
  if (progressBar && progressText) {
    progressBar.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '%';
  }
}

function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  
  // 清除超时计时器
  if (loaderTimeout) {
    clearTimeout(loaderTimeout);
  }
  
  // 平滑隐藏加载动画
  gsap.to("#loader", {
    duration: 0.8,
    opacity: 0,
    y: "-100%",
    ease: "power2.inOut",
    onComplete: function() {
      gsap.set("#loader", { display: "none" });
      gsap.set("#header", { display: "block" });
      gsap.set("#navigation-content", { display: "flex" });
    }
  });
}

function showLoaderError(message) {
  var loaderContent = document.querySelector('#loader .loader-content');
  if (loaderContent) {
    loaderContent.innerHTML = `
      <div style="text-align: center; color: #ff6b6b; margin-bottom: 20px;">
        <div style="font-size: 24px; margin-bottom: 10px;">😢 加载遇到问题</div>
        <div style="font-size: 16px; opacity: 0.8;">${message}</div>
      </div>
      <button id="retry-button" style="
        background: #c70039;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-family: poppins;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
      " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
        重试加载
      </button>
    `;
    
    document.getElementById('retry-button').addEventListener('click', function() {
      location.reload();
    });
  }
}

// 模拟资源加载进度
function simulateLoadingProgress() {
  var progress = 0;
  var interval = setInterval(function() {
    progress += Math.random() * 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    updateLoaderProgress(progress);
  }, 200);
}

// 检查关键资源是否加载完成
function checkCriticalResources() {
  return new Promise((resolve) => {
    var criticalResources = [
      'js/jquery.min.js',
      'js/particles.min.js',
      'css/index.css'
    ];
    
    var loaded = 0;
    var total = criticalResources.length;
    
    if (total === 0) {
      resolve(true);
      return;
    }
    
    criticalResources.forEach(function(resource) {
      var img = new Image();
      img.onload = img.onerror = function() {
        loaded++;
        updateLoaderProgress((loaded / total) * 80); // 资源加载占80%进度
        if (loaded === total) {
          resolve(true);
        }
      };
      img.src = resource + '?v=' + Date.now(); // 添加时间戳避免缓存
    });
  });
}

// 主要加载逻辑
async function initLoader() {
  // 开始模拟进度
  simulateLoadingProgress();
  
  try {
    // 检查关键资源
    await checkCriticalResources();
    
    // 等待window.load事件或超时
    var loadPromise = new Promise((resolve) => {
      $(window).on("load", resolve);
    });
    
    var timeoutPromise = new Promise((resolve) => {
      loaderTimeout = setTimeout(() => {
        resolve('timeout');
      }, 6000); // 6秒超时
    });
    
    var result = await Promise.race([loadPromise, timeoutPromise]);
    
    if (result === 'timeout') {
      // 超时但可能部分资源已加载完成
      console.log('页面加载超时，但继续显示内容');
    }
    
    resourcesLoaded = true;
    hideLoader();
    
  } catch (error) {
    console.error('加载错误:', error);
    showLoaderError('网络连接不稳定，部分内容可能无法正常显示');
    // 即使出错也尝试显示页面
    setTimeout(hideLoader, 2000);
  }
}

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden' && !resourcesLoaded) {
    // 页面被隐藏，暂停加载动画
    if (loaderTimeout) {
      clearTimeout(loaderTimeout);
    }
  } else if (document.visibilityState === 'visible' && !resourcesLoaded) {
    // 页面重新可见，重新开始加载
    initLoader();
  }
});

// 初始化加载器
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoader);
} else {
  initLoader();
}

// 备用方案：10秒绝对超时，确保即使前面所有机制都失败也能显示页面
setTimeout(function() {
  if (!loaderHidden) {
    console.log('绝对超时机制触发');
    hideLoader();
  }
}, 10000);
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
    "link/music/秋风.mp3",
    "link/music/水星记.mp3",
    "link/music/Anyone.mp3",
    "link/music/搁浅.mp3",
    "link/music/戒不掉.mp3",
    "link/music/柳叶笺.mp3",
    "link/music/明天，你好.mp3",
    "link/music/我记得.mp3",
    "link/music/这世界那么多人.mp3",
    "link/music/I Really Want To Stay At Your House.mp3",
    "link/music/WE PRAY.mp3",
    "link/music/终生老友.mp3",
    "link/music/是什么让我遇见这样的你.mp3",
    "link/music/everglow.mp3",
    "link/music/Trouble I’m in.mp3",
    "link/music/鱼仔.mp3",
    "link/music/无额.mp3",
    "link/music/哪里都是你.mp3",
    "link/music/every time we touch.mp3",
    "link/music/所念皆星河.mp3",
    "link/music/let her go.mp3",
    "link/music/程艾影.mp3",
    "link/music/sacred play secret place.mp3",
    "link/music/what was that.mp3",
    "link/music/blue dragon.mp3",
    "link/music/white ferrari.mp3",
    "link/music/looking forward.mp3",
    "link/music/reach.mp3",
    "link/music/III.mp3",
    "link/music/家后.mp3",
    "link/music/离开我的依赖.mp3",
    "link/music/路过人间.mp3"
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
