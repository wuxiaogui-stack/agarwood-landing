document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       沉香树轮播
    ========================= */

    const treeTrack = document.querySelector(".tree-track");
    const treeSlides = document.querySelectorAll(".tree-slide");
    const treePrev = document.querySelector(".slider-prev");
    const treeNext = document.querySelector(".slider-next");
    const treeDots = document.querySelectorAll(".slider-dot");

    let currentTreeSlide = 0;

    function showTreeSlide(index) {

        if (!treeTrack || treeSlides.length === 0) {
            return;
        }

        if (index < 0) {
            currentTreeSlide = treeSlides.length - 1;
        } else if (index >= treeSlides.length) {
            currentTreeSlide = 0;
        } else {
            currentTreeSlide = index;
        }

        treeTrack.style.transform =
            `translateX(-${currentTreeSlide * 100}%)`;

        treeDots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentTreeSlide
            );

        });
    }


    if (treeNext) {

        treeNext.addEventListener("click", function () {

            showTreeSlide(currentTreeSlide + 1);

        });

    }


    if (treePrev) {

        treePrev.addEventListener("click", function () {

            showTreeSlide(currentTreeSlide - 1);

        });

    }


    treeDots.forEach((dot, index) => {

        dot.addEventListener("click", function () {

            showTreeSlide(index);

        });

    });



    /* =========================
       客户好评轮播
    ========================= */

    const reviewTrack = document.querySelector(".review-track");
    const reviewSlides = document.querySelectorAll(".review-slide");
    const reviewPrev = document.querySelector(".review-prev");
    const reviewNext = document.querySelector(".review-next");
    const reviewDots = document.querySelectorAll(".review-dot");

    let currentReview = 0;


    function showReview(index) {

        if (!reviewTrack || reviewSlides.length === 0) {
            return;
        }

        if (index < 0) {

            currentReview = reviewSlides.length - 1;

        } else if (index >= reviewSlides.length) {

            currentReview = 0;

        } else {

            currentReview = index;

        }


        reviewTrack.style.transform =
            `translateX(-${currentReview * 100}%)`;


        reviewDots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentReview
            );

        });

    }


    if (reviewNext) {

        reviewNext.addEventListener("click", function () {

            showReview(currentReview + 1);

        });

    }


    if (reviewPrev) {

        reviewPrev.addEventListener("click", function () {

            showReview(currentReview - 1);

        });

    }


    reviewDots.forEach((dot, index) => {

        dot.addEventListener("click", function () {

            showReview(index);

        });

    });



    /* =========================
       初始化
    ========================= */

    showTreeSlide(0);

    showReview(0);

});