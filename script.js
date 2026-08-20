```javascript
/* =========================================================
   网站交互脚本
   优化目标：
   1. 防止手机端页面加载闪动
   2. 防止浏览器自动恢复滚动位置
   3. 优化沉香树轮播
   4. 优化客户反馈轮播
   5. 使用 translate3d 提升移动端流畅度
========================================================= */


(function () {

    "use strict";


    /* =========================================================
       页面初始化
    ========================================================= */

    document.addEventListener("DOMContentLoaded", function () {


        /* -----------------------------------------------------
           防止浏览器自动恢复上次滚动位置
        ----------------------------------------------------- */

        if ("scrollRestoration" in history) {

            history.scrollRestoration = "manual";

        }


        /* -----------------------------------------------------
           页面没有锚点时，从顶部开始
           
           注意：
           如果 URL 是 #products / #contact 等，
           不强制回到顶部。
        ----------------------------------------------------- */

        if (!window.location.hash) {

            window.scrollTo(0, 0);

        }



        /* =====================================================
           沉香树轮播
        ===================================================== */

        const treeTrack =
            document.querySelector(".tree-track");

        const treeSlides =
            document.querySelectorAll(".tree-slide");

        const treePrev =
            document.querySelector(".slider-prev");

        const treeNext =
            document.querySelector(".slider-next");

        const treeDots =
            document.querySelectorAll(".slider-dot");


        let currentTreeSlide = 0;



        /* -----------------------------------------------------
           显示沉香树图片
        ----------------------------------------------------- */

        function showTreeSlide(index, animate = true) {


            if (!treeTrack || treeSlides.length === 0) {

                return;

            }


            /* 循环切换 */

            if (index < 0) {

                currentTreeSlide =
                    treeSlides.length - 1;

            }

            else if (index >= treeSlides.length) {

                currentTreeSlide = 0;

            }

            else {

                currentTreeSlide = index;

            }


            /* -------------------------------------------------
               初始化时关闭动画

               防止页面第一次打开时
               从第一张图片滑动到第一张图片。
            ------------------------------------------------- */

            if (!animate) {

                treeTrack.style.transition = "none";

            }

            else {

                treeTrack.style.transition = "";

            }


            /* -------------------------------------------------
               使用 translate3d

               对手机 GPU 更友好。
            ------------------------------------------------- */

            treeTrack.style.transform =
                "translate3d(-" +
                (currentTreeSlide * 100) +
                "%, 0, 0)";


            /* 更新圆点 */

            treeDots.forEach(function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === currentTreeSlide
                );

            });


            /* -------------------------------------------------
               初始化结束后恢复动画
            ------------------------------------------------- */

            if (!animate) {

                requestAnimationFrame(function () {

                    requestAnimationFrame(function () {

                        if (treeTrack) {

                            treeTrack.style.transition = "";

                        }

                    });

                });

            }

        }



        /* -----------------------------------------------------
           下一张
        ----------------------------------------------------- */

        if (treeNext) {

            treeNext.addEventListener(
                "click",
                function () {

                    showTreeSlide(
                        currentTreeSlide + 1,
                        true
                    );

                }
            );

        }



        /* -----------------------------------------------------
           上一张
        ----------------------------------------------------- */

        if (treePrev) {

            treePrev.addEventListener(
                "click",
                function () {

                    showTreeSlide(
                        currentTreeSlide - 1,
                        true
                    );

                }
            );

        }



        /* -----------------------------------------------------
           圆点切换
        ----------------------------------------------------- */

        treeDots.forEach(function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    showTreeSlide(
                        index,
                        true
                    );

                }
            );

        });



        /* =====================================================
           客户反馈轮播
        ===================================================== */

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



        /* -----------------------------------------------------
           显示客户反馈
        ----------------------------------------------------- */

        function showReview(index, animate = true) {


            if (!reviewTrack || reviewSlides.length === 0) {

                return;

            }


            /* 循环切换 */

            if (index < 0) {

                currentReview =
                    reviewSlides.length - 1;

            }

            else if (index >= reviewSlides.length) {

                currentReview = 0;

            }

            else {

                currentReview = index;

            }


            /* 初始化关闭动画 */

            if (!animate) {

                reviewTrack.style.transition = "none";

            }

            else {

                reviewTrack.style.transition = "";

            }


            /* 使用 GPU 加速 */

            reviewTrack.style.transform =
                "translate3d(-" +
                (currentReview * 100) +
                "%, 0, 0)";


            /* 更新圆点 */

            reviewDots.forEach(function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === currentReview
                );

            });


            /* 初始化完成后恢复动画 */

            if (!animate) {

                requestAnimationFrame(function () {

                    requestAnimationFrame(function () {

                        if (reviewTrack) {

                            reviewTrack.style.transition = "";

                        }

                    });

                });

            }

        }



        /* -----------------------------------------------------
           下一条反馈
        ----------------------------------------------------- */

        if (reviewNext) {

            reviewNext.addEventListener(
                "click",
                function () {

                    showReview(
                        currentReview + 1,
                        true
                    );

                }
            );

        }



        /* -----------------------------------------------------
           上一条反馈
        ----------------------------------------------------- */

        if (reviewPrev) {

            reviewPrev.addEventListener(
                "click",
                function () {

                    showReview(
                        currentReview - 1,
                        true
                    );

                }
            );

        }



        /* -----------------------------------------------------
           客户反馈圆点
        ----------------------------------------------------- */

        reviewDots.forEach(function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    showReview(
                        index,
                        true
                    );

                }
            );

        });



        /* =====================================================
           初始化轮播
        ===================================================== */

        showTreeSlide(0, false);

        showReview(0, false);


    });


})();
```
