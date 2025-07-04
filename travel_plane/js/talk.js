new TypeIt("#tqyxhj", {
        loop: true,
        cursorSpeed: 1000,
        speed: 100
    })
    .type("✈️ 航班即将起飞")
    .pause(2000)
    .delete(null, {
        delay: 500
    })
    .type("请系好安全带哦")
    .pause(7000)
    .delete(null, {
        delay: 500
    })
    .type("航班已起飞")
    .pause(2000)
    .delete(null, {
        delay: 500
    })
    .type("一起欣赏风景吧")
    .pause(3000)
    .go();

new TypeIt('#talkToXHJ', {
    lifeLike: true,
    cursorSpeed: 1000,
    waitUntilVisible: true,
    speed: 100
}).go();
