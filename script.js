document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       手机端导航
    ========================= */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    function closeMenu() {

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

            const open =
                mainNav.classList.toggle("mobile-open");

            menuToggle.classList.toggle(
                "active",
                open
            );

            menuToggle.setAttribute(
                "aria-expanded",
                open ? "true" : "false"
            );
        });


        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                closeMenu();

            });

        });


        document.addEventListener("click", function (event) {

            if (
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });
    }


    /* =========================
       无限循环轮播
    ========================= */

    function createInfiniteSlider(config) {

        const slider =
            document.querySelector(config.slider);

        const track =
            document.querySelector(config.track);

        const prev =
            document.querySelector(config.prev);

        const next =
            document.querySelector(config.next);

        const dots =
            Array.from(
                document.querySelectorAll(config.dot)
            );

        if (!slider || !track) {
            return;
        }


        const slides =
            Array.from(
                track.children
            );


        if (slides.length <= 1) {
            return;
        }


        const total =
            slides.length;


        /* 创建首尾克隆 */

        const firstClone =
            slides[0].cloneNode(true);

        const lastClone =
            slides[total - 1].cloneNode(true);


        firstClone.setAttribute(
            "aria-hidden",
            "true"
        );

        lastClone.setAttribute(
            "aria-hidden",
            "true"
        );


        track.insertBefore(
            lastClone,
            track.firstChild
        );

        track.appendChild(
            firstClone
        );


        let index = 1;

        let locked = false;


        function updateDots() {

            let realIndex = index - 1;

            if (realIndex < 0) {
                realIndex = total - 1;
            }

            if (realIndex >= total) {
                realIndex = 0;
            }


            dots.forEach(function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === realIndex
                );

            });
        }


        function setPosition(
            newIndex,
            animate
        ) {

            index = newIndex;

            if (animate) {

                track.style.transition =
                    "transform 0.45s ease";

            } else {

                track.style.transition =
                    "none";
            }


            track.style.transform =
                "translate3d(-" +
                (index * 100) +
                "%, 0, 0)";


            updateDots();
        }


        function nextSlide() {

            if (locked) {
                return;
            }

            locked = true;

            setPosition(
                index + 1,
                true
            );
        }


        function previousSlide() {

            if (locked) {
                return;
            }

            locked = true;

            setPosition(
                index - 1,
                true
            );
        }


        track.addEventListener(
            "transitionend",
            function (event) {

                if (
                    event.propertyName !== "transform"
                ) {
                    return;
                }


                if (index === total + 1) {

                    setPosition(
                        1,
                        false
                    );

                } else if (index === 0) {

                    setPosition(
                        total,
                        false
                    );
                }


                requestAnimationFrame(function () {

                    locked = false;

                });

            }
        );


        if (next) {

            next.addEventListener(
                "click",
                nextSlide
            );

        }


        if (prev) {

            prev.addEventListener(
                "click",
                previousSlide
            );

        }


        dots.forEach(
            function (dot, dotIndex) {

                dot.addEventListener(
                    "click",
                    function () {

                        if (locked) {
                            return;
                        }

                        setPosition(
                            dotIndex + 1,
                            true
                        );

                    }
                );

            }
        );


        /* =========================
           手机左右滑动
        ========================= */

        let startX = 0;
        let startY = 0;
        let touching = false;


        slider.addEventListener(
            "touchstart",
            function (event) {

                if (
                    !event.touches ||
                    event.touches.length !== 1
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


        slider.addEventListener(
            "touchend",
            function (event) {

                if (!touching) {
                    return;
                }

                touching = false;


                if (
                    !event.changedTouches ||
                    event.changedTouches.length !== 1
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

                        nextSlide();

                    } else {

                        previousSlide();

                    }
                }

            },
            {
                passive: true
            }
        );


        /* 初始位置 */

        setPosition(
            1,
            false
        );

    }


    /* =========================
       沉香树与工厂轮播
    ========================= */

    createInfiniteSlider({

        slider: ".tree-slider",

        track: ".tree-track",

        prev: ".slider-prev",

        next: ".slider-next",

        dot: ".slider-dot"

    });


    /* =========================
       客户反馈轮播
    ========================= */

    createInfiniteSlider({

        slider: ".review-slider",

        track: ".review-track",

        prev: ".review-prev",

        next: ".review-next",

        dot: ".review-dot"

    });


    /* =========================
       防止菜单打开后滚动异常
    ========================= */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 700
            ) {
                closeMenu();
            }

        },
        {
            passive: true
        }
    );

});