document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       工具函数
    ===================================================== */

    function setupInfiniteSlider(options) {

        const {
            track,
            slides,
            prevButton,
            nextButton,
            dots
        } = options;

        if (!track || !slides.length) {
            return;
        }


        /* ---------------------------------------------
           保存原始数量
        --------------------------------------------- */

        const originalSlides = Array.from(slides);

        const originalCount = originalSlides.length;


        if (originalCount <= 1) {
            return;
        }


        /* ---------------------------------------------
           克隆第一张和最后一张
           
           原始：
           1 2 3

           变成：
           3 1 2 3 1
        --------------------------------------------- */

        const firstClone =
            originalSlides[0].cloneNode(true);

        const lastClone =
            originalSlides[originalCount - 1].cloneNode(true);


        firstClone.classList.add("clone-slide");

        lastClone.classList.add("clone-slide");


        track.appendChild(firstClone);

        track.insertBefore(
            lastClone,
            track.firstChild
        );


        const allSlides =
            track.querySelectorAll(
                ".tree-slide, .review-slide"
            );


        /* ---------------------------------------------
           当前索引

           真实第一张 = 1

           因为 0 是最后一张克隆
        --------------------------------------------- */

        let currentIndex = 1;


        let isAnimating = false;


        let touchStartX = 0;

        let touchStartY = 0;

        let touchEndX = 0;

        let touchEndY = 0;


        /* ---------------------------------------------
           更新位置
        --------------------------------------------- */

        function updatePosition(animate = true) {

            if (animate) {

                track.classList.remove(
                    "no-transition"
                );

            } else {

                track.classList.add(
                    "no-transition"
                );

            }


            track.style.transform =
                `translate3d(-${currentIndex * 100}%, 0, 0)`;


            updateDots();
        }


        /* ---------------------------------------------
           更新圆点
        --------------------------------------------- */

        function updateDots() {

            let realIndex =
                currentIndex - 1;


            if (realIndex < 0) {

                realIndex =
                    originalCount - 1;

            }


            if (realIndex >= originalCount) {

                realIndex = 0;

            }


            dots.forEach(function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === realIndex
                );

            });

        }


        /* ---------------------------------------------
           下一张
        --------------------------------------------- */

        function next() {

            if (isAnimating) {
                return;
            }


            isAnimating = true;


            currentIndex++;


            updatePosition(true);
        }


        /* ---------------------------------------------
           上一张
        --------------------------------------------- */

        function previous() {

            if (isAnimating) {
                return;
            }


            isAnimating = true;


            currentIndex--;


            updatePosition(true);
        }


        /* ---------------------------------------------
           动画结束
           
           到达克隆图后瞬间跳回真实图片
           
           第3张 → 第1张
           
           用户看到的是连续动画
        --------------------------------------------- */

        track.addEventListener(
            "transitionend",
            function () {

                if (
                    currentIndex ===
                    originalCount + 1
                ) {

                    currentIndex = 1;

                    updatePosition(false);

                }


                else if (
                    currentIndex === 0
                ) {

                    currentIndex =
                        originalCount;

                    updatePosition(false);

                }


                isAnimating = false;

            }
        );


        /* ---------------------------------------------
           左右按钮
        --------------------------------------------- */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function () {

                    next();

                }
            );

        }


        if (prevButton) {

            prevButton.addEventListener(
                "click",
                function () {

                    previous();

                }
            );

        }


        /* ---------------------------------------------
           圆点点击
        --------------------------------------------- */

        dots.forEach(function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    if (isAnimating) {
                        return;
                    }


                    currentIndex =
                        index + 1;


                    updatePosition(true);

                }
            );

        });


        /* ---------------------------------------------
           手机触摸滑动
        --------------------------------------------- */

        track.addEventListener(
            "touchstart",
            function (event) {

                if (!event.touches.length) {
                    return;
                }


                touchStartX =
                    event.touches[0].clientX;


                touchStartY =
                    event.touches[0].clientY;

            },
            {
                passive: true
            }
        );


        track.addEventListener(
            "touchend",
            function (event) {

                if (!event.changedTouches.length) {
                    return;
                }


                touchEndX =
                    event.changedTouches[0].clientX;


                touchEndY =
                    event.changedTouches[0].clientY;


                const distanceX =
                    touchEndX - touchStartX;


                const distanceY =
                    touchEndY - touchStartY;


                /* -------------------------------------
                   防止上下滚动被误判为左右滑动
                ------------------------------------- */

                if (
                    Math.abs(distanceX) < 50 ||
                    Math.abs(distanceX) <
                    Math.abs(distanceY)
                ) {

                    return;

                }


                if (distanceX < 0) {

                    next();

                } else {

                    previous();

                }

            },
            {
                passive: true
            }
        );


        /* ---------------------------------------------
           防止图片拖拽
        --------------------------------------------- */

        track.addEventListener(
            "dragstart",
            function (event) {

                event.preventDefault();

            }
        );


        /* ---------------------------------------------
           初始位置
        --------------------------------------------- */

        track.classList.add(
            "no-transition"
        );


        currentIndex = 1;


        updatePosition(false);


        /* ---------------------------------------------
           下一帧恢复动画
        --------------------------------------------- */

        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                track.classList.remove(
                    "no-transition"
                );

            });

        });

    }



    /* =====================================================
       沉香树无限轮播
    ===================================================== */

    setupInfiniteSlider({

        track:
            document.querySelector(
                ".tree-track"
            ),

        slides:
            document.querySelectorAll(
                ".tree-slide"
            ),

        prevButton:
            document.querySelector(
                ".slider-prev"
            ),

        nextButton:
            document.querySelector(
                ".slider-next"
            ),

        dots:
            document.querySelectorAll(
                ".slider-dot"
            )

    });



    /* =====================================================
       客户反馈无限轮播
    ===================================================== */

    setupInfiniteSlider({

        track:
            document.querySelector(
                ".review-track"
            ),

        slides:
            document.querySelectorAll(
                ".review-slide"
            ),

        prevButton:
            document.querySelector(
                ".review-prev"
            ),

        nextButton:
            document.querySelector(
                ".review-next"
            ),

        dots:
            document.querySelectorAll(
                ".review-dot"
            )

    });



    /* =====================================================
       防止页面刷新后自动跳到锚点
       
       例如：
       agarwood-landing.pages.dev/#contact
       
       如果用户重新打开页面，
       自动回到顶部。
    ===================================================== */

    if (
        window.location.hash &&
        performance.getEntriesByType
    ) {

        window.scrollTo(
            0,
            0
        );

    }


});