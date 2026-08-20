document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       手机端导航
    ========================= */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    function closeMobileMenu() {

        if (!menuToggle || !mainNav) {
            return;
        }

        mainNav.classList.remove("mobile-open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function (event) {

            event.stopPropagation();

            const isOpen =
                mainNav.classList.toggle("mobile-open");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        });


        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                closeMobileMenu();
            });

        });


        document.addEventListener("click", function (event) {

            if (
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }

        });

    }


    /* =========================
       无限循环轮播
    ========================= */

    function createInfiniteSlider(options) {

        const track =
            document.querySelector(options.track);

        const slides =
            Array.from(
                document.querySelectorAll(options.slide)
            );

        const prevButton =
            document.querySelector(options.prev);

        const nextButton =
            document.querySelector(options.next);

        const dots =
            Array.from(
                document.querySelectorAll(options.dot)
            );


        if (
            !track ||
            slides.length === 0
        ) {
            return;
        }


        /* =========================
           单张图片
        ========================= */

        if (slides.length === 1) {

            if (prevButton) {
                prevButton.style.display = "none";
            }

            if (nextButton) {
                nextButton.style.display = "none";
            }

            dots.forEach(function (dot) {
                dot.style.display = "none";
            });

            return;
        }


        /* =========================
           创建首尾克隆
        ========================= */

        const firstClone =
            slides[0].cloneNode(true);

        const lastClone =
            slides[slides.length - 1].cloneNode(true);


        firstClone.classList.add("slider-clone");
        lastClone.classList.add("slider-clone");


        track.insertBefore(
            lastClone,
            track.firstChild
        );

        track.appendChild(firstClone);


        const total =
            slides.length;


        let currentIndex = 1;

        let isAnimating = false;


        /* =========================
           初始位置
        ========================= */

        track.style.transition = "none";

        track.style.transform =
            "translate3d(-100%, 0, 0)";


        /* =========================
           更新圆点
        ========================= */

        function updateDots() {

            let realIndex =
                currentIndex - 1;


            if (realIndex < 0) {
                realIndex = total - 1;
            }


            if (realIndex >= total) {
                realIndex = 0;
            }


            dots.forEach(function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === realIndex
                );

            });

        }


        /* =========================
           移动
        ========================= */

        function moveTo(
            index,
            animate
        ) {

            currentIndex = index;


            if (animate) {

                track.style.transition =
                    "transform 0.45s ease";

            } else {

                track.style.transition =
                    "none";

            }


            track.style.transform =
                "translate3d(-" +
                (currentIndex * 100) +
                "%, 0, 0)";


            updateDots();
        }


        /* =========================
           下一张
        ========================= */

        function next() {

            if (isAnimating) {
                return;
            }

            isAnimating = true;

            moveTo(
                currentIndex + 1,
                true
            );
        }


        /* =========================
           上一张
        ========================= */

        function previous() {

            if (isAnimating) {
                return;
            }

            isAnimating = true;

            moveTo(
                currentIndex - 1,
                true
            );
        }


        /* =========================
           动画结束
        ========================= */

        track.addEventListener(
            "transitionend",
            function (event) {

                if (
                    event.propertyName !==
                    "transform"
                ) {
                    return;
                }


                if (
                    currentIndex ===
                    total + 1
                ) {

                    moveTo(
                        1,
                        false
                    );

                }


                else if (
                    currentIndex === 0
                ) {

                    moveTo(
                        total,
                        false
                    );

                }


                isAnimating = false;

            }
        );


        /* =========================
           左右按钮
        ========================= */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                next
            );

        }


        if (prevButton) {

            prevButton.addEventListener(
                "click",
                previous
            );

        }


        /* =========================
           圆点
        ========================= */

        dots.forEach(function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    if (isAnimating) {
                        return;
                    }

                    moveTo(
                        index + 1,
                        true
                    );

                }
            );

        });


        /* =========================
           手机滑动
        ========================= */

        let startX = 0;
        let startY = 0;
        let touching = false;


        track.addEventListener(
            "touchstart",
            function (event) {

                if (
                    !event.touches ||
                    event.touches.length === 0
                ) {
                    return;
                }


                startX =
                    event.touches[0].clientX;

                startY =
                    event.touches[0].clientY;

                touching = true;

            },
            {
                passive: true
            }
        );


        track.addEventListener(
            "touchend",
            function (event) {

                if (!touching) {
                    return;
                }

                touching = false;


                if (
                    !event.changedTouches ||
                    event.changedTouches.length === 0
                ) {
                    return;
                }


                const endX =
                    event.changedTouches[0].clientX;

                const endY =
                    event.changedTouches[0].clientY;


                const deltaX =
                    endX - startX;

                const deltaY =
                    endY - startY;


                if (
                    Math.abs(deltaX) > 50 &&
                    Math.abs(deltaX) >
                    Math.abs(deltaY)
                ) {

                    if (deltaX < 0) {
                        next();
                    } else {
                        previous();
                    }

                }

            },
            {
                passive: true
            }
        );


        updateDots();

    }


    /* =========================
       沉香树轮播
    ========================= */

    createInfiniteSlider({

        track: ".tree-track",

        slide: ".tree-slide",

        prev: ".slider-prev",

        next: ".slider-next",

        dot: ".slider-dot"

    });


    /* =========================
       客户反馈轮播
    ========================= */

    createInfiniteSlider({

        track: ".review-track",

        slide: ".review-slide",

        prev: ".review-prev",

        next: ".review-next",

        dot: ".review-dot"

    });


    /* =========================
       产品图片格式兼容
    ========================= */

    const productImages =
        document.querySelectorAll(
            ".product-image img[data-image-base]"
        );


    productImages.forEach(function (image) {

        const base =
            image.getAttribute(
                "data-image-base"
            );


        if (!base) {
            return;
        }


        const extensions = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        ];


        let current = 0;


        image.addEventListener(
            "error",
            function () {

                current++;


                if (
                    current <
                    extensions.length
                ) {

                    image.src =
                        base +
                        extensions[current];

                }

            }
        );

    });


    /* =========================
       页面准备完成
    ========================= */

    document.documentElement.classList.add(
        "page-ready"
    );

});