```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       通用触摸滑动参数
    ========================================================= */

    const SWIPE_DISTANCE = 50;


    /* =========================================================
       沉香树轮播
    ========================================================= */

    const treeTrack = document.querySelector(".tree-track");
    const treeSlides = document.querySelectorAll(".tree-slide");
    const treePrev = document.querySelector(".slider-prev");
    const treeNext = document.querySelector(".slider-next");
    const treeDots = document.querySelectorAll(".slider-dot");

    let currentTreeSlide = 0;
    let treeTouchStartX = 0;
    let treeTouchStartY = 0;
    let treeIsAnimating = false;


    function updateTreeDots() {

        treeDots.forEach((dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentTreeSlide
            );

        });

    }


    function showTreeSlide(index, direction = "next") {

        if (!treeTrack || treeSlides.length === 0) {
            return;
        }

        if (treeIsAnimating) {
            return;
        }

        treeIsAnimating = true;


        /* -----------------------------------------
           计算下一张
        ----------------------------------------- */

        if (index < 0) {

            currentTreeSlide = treeSlides.length - 1;

        } else if (index >= treeSlides.length) {

            currentTreeSlide = 0;

        } else {

            currentTreeSlide = index;

        }


        updateTreeDots();


        /* -----------------------------------------
           正常轮播
        ----------------------------------------- */

        treeTrack.style.transition =
            "transform 0.45s ease";

        treeTrack.style.transform =
            `translateX(-${currentTreeSlide * 100}%)`;


        setTimeout(function () {

            treeIsAnimating = false;

        }, 480);

    }


    /* -----------------------------------------
       左按钮
    ----------------------------------------- */

    if (treePrev) {

        treePrev.addEventListener("click", function () {

            showTreeSlide(
                currentTreeSlide - 1,
                "prev"
            );

        });

    }


    /* -----------------------------------------
       右按钮
    ----------------------------------------- */

    if (treeNext) {

        treeNext.addEventListener("click", function () {

            showTreeSlide(
                currentTreeSlide + 1,
                "next"
            );

        });

    }


    /* -----------------------------------------
       圆点
    ----------------------------------------- */

    treeDots.forEach(function (dot, index) {

        dot.addEventListener("click", function () {

            if (index > currentTreeSlide) {

                showTreeSlide(index, "next");

            } else {

                showTreeSlide(index, "prev");

            }

        });

    });


    /* -----------------------------------------
       手机触摸开始
    ----------------------------------------- */

    if (treeTrack) {

        treeTrack.addEventListener(
            "touchstart",
            function (event) {

                const touch = event.touches[0];

                treeTouchStartX = touch.clientX;

                treeTouchStartY = touch.clientY;

            },
            {
                passive: true
            }
        );


        /* -----------------------------------------
           手机触摸结束
        ----------------------------------------- */

        treeTrack.addEventListener(
            "touchend",
            function (event) {

                const touch = event.changedTouches[0];

                const endX = touch.clientX;
                const endY = touch.clientY;

                const distanceX =
                    endX - treeTouchStartX;

                const distanceY =
                    endY - treeTouchStartY;


                /* 防止上下滚动被误认为左右滑 */

                if (
                    Math.abs(distanceX) <
                    Math.abs(distanceY)
                ) {
                    return;
                }


                /* 左滑 */

                if (distanceX < -SWIPE_DISTANCE) {

                    showTreeSlide(
                        currentTreeSlide + 1,
                        "next"
                    );

                }


                /* 右滑 */

                else if (
                    distanceX > SWIPE_DISTANCE
                ) {

                    showTreeSlide(
                        currentTreeSlide - 1,
                        "prev"
                    );

                }

            },
            {
                passive: true
            }
        );

    }



    /* =========================================================
       客户反馈轮播
    ========================================================= */

    const reviewTrack =
        document.querySelector(".review-track");

    const reviewSlides =
        document.querySelectorAll(".review-slide");

    const reviewPrev =
        document.querySelector(".review-prev");

    const reviewNext =
        document.querySelector(".review-next");

    const reviewDots =
        document.querySelectorAll(".review-dot");

    let currentReview = 0;

    let reviewTouchStartX = 0;
    let reviewTouchStartY = 0;

    let reviewIsAnimating = false;


    function updateReviewDots() {

        reviewDots.forEach(function (dot, index) {

            dot.classList.toggle(
                "active",
                index === currentReview
            );

        });

    }


    function showReview(index, direction = "next") {

        if (
            !reviewTrack ||
            reviewSlides.length === 0
        ) {
            return;
        }

        if (reviewIsAnimating) {
            return;
        }

        reviewIsAnimating = true;


        /* -----------------------------------------
           计算下一张
        ----------------------------------------- */

        if (index < 0) {

            currentReview =
                reviewSlides.length - 1;

        } else if (
            index >= reviewSlides.length
        ) {

            currentReview = 0;

        } else {

            currentReview = index;

        }


        updateReviewDots();


        /* -----------------------------------------
           正常轮播动画
        ----------------------------------------- */

        reviewTrack.style.transition =
            "transform 0.45s ease";

        reviewTrack.style.transform =
            `translateX(-${currentReview * 100}%)`;


        setTimeout(function () {

            reviewIsAnimating = false;

        }, 480);

    }


    /* -----------------------------------------
       左按钮
    ----------------------------------------- */

    if (reviewPrev) {

        reviewPrev.addEventListener(
            "click",
            function () {

                showReview(
                    currentReview - 1,
                    "prev"
                );

            }
        );

    }


    /* -----------------------------------------
       右按钮
    ----------------------------------------- */

    if (reviewNext) {

        reviewNext.addEventListener(
            "click",
            function () {

                showReview(
                    currentReview + 1,
                    "next"
                );

            }
        );

    }


    /* -----------------------------------------
       客户反馈圆点
    ----------------------------------------- */

    reviewDots.forEach(function (dot, index) {

        dot.addEventListener(
            "click",
            function () {

                if (index > currentReview) {

                    showReview(
                        index,
                        "next"
                    );

                } else {

                    showReview(
                        index,
                        "prev"
                    );

                }

            }
        );

    });


    /* -----------------------------------------
       手机触摸开始
    ----------------------------------------- */

    if (reviewTrack) {

        reviewTrack.addEventListener(
            "touchstart",
            function (event) {

                const touch =
                    event.touches[0];

                reviewTouchStartX =
                    touch.clientX;

                reviewTouchStartY =
                    touch.clientY;

            },
            {
                passive: true
            }
        );


        /* -----------------------------------------
           手机触摸结束
        ----------------------------------------- */

        reviewTrack.addEventListener(
            "touchend",
            function (event) {

                const touch =
                    event.changedTouches[0];

                const endX =
                    touch.clientX;

                const endY =
                    touch.clientY;


                const distanceX =
                    endX - reviewTouchStartX;

                const distanceY =
                    endY - reviewTouchStartY;


                /* 防止上下滑动误触 */

                if (
                    Math.abs(distanceX) <
                    Math.abs(distanceY)
                ) {

                    return;

                }


                /* 左滑 */

                if (
                    distanceX <
                    -SWIPE_DISTANCE
                ) {

                    showReview(
                        currentReview + 1,
                        "next"
                    );

                }


                /* 右滑 */

                else if (
                    distanceX >
                    SWIPE_DISTANCE
                ) {

                    showReview(
                        currentReview - 1,
                        "prev"
                    );

                }

            },
            {
                passive: true
            }
        );

    }



    /* =========================================================
       初始化
    ========================================================= */

    showTreeSlide(0);

    showReview(0);

});
```
