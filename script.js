document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       手机端导航
    ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");


    function closeMenu() {

        if (!menuToggle || !mainNav) {
            return;
        }

        mainNav.classList.remove(
            "mobile-open"
        );

        menuToggle.classList.remove(
            "active"
        );

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    if (menuToggle && mainNav) {

        menuToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const open =
                    mainNav.classList.toggle(
                        "mobile-open"
                    );


                menuToggle.classList.toggle(
                    "active",
                    open
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    open
                        ? "true"
                        : "false"
                );

            }
        );


        mainNav
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        closeMenu();

                    }
                );

            });


        document.addEventListener(
            "click",
            function (event) {

                if (
                    !mainNav.contains(
                        event.target
                    ) &&
                    !menuToggle.contains(
                        event.target
                    )
                ) {

                    closeMenu();

                }

            }
        );

    }


    /* =====================================================
       通用轮播
       不使用克隆
       不使用无限循环
       更稳定
    ===================================================== */

    function createSlider(options) {

        const track =
            document.querySelector(
                options.track
            );


        if (!track) {
            return;
        }


        const slides =
            Array.from(
                track.querySelectorAll(
                    options.slide
                )
            );


        const prevButton =
            document.querySelector(
                options.prev
            );


        const nextButton =
            document.querySelector(
                options.next
            );


        const dots =
            Array.from(
                document.querySelectorAll(
                    options.dot
                )
            );


        if (slides.length === 0) {
            return;
        }


        let currentIndex = 0;


        let startX = 0;
        let startY = 0;

        let touching = false;


        function updateSlider(
            animate
        ) {

            track.style.transition =
                animate
                    ? "transform 0.45s ease"
                    : "none";


            track.style.transform =
                "translate3d(-" +
                (
                    currentIndex * 100
                ) +
                "%, 0, 0)";


            dots.forEach(
                function (dot, index) {

                    dot.classList.toggle(
                        "active",
                        index ===
                        currentIndex
                    );

                }
            );

        }


        function nextSlide() {

            if (slides.length <= 1) {
                return;
            }


            currentIndex++;


            if (
                currentIndex >=
                slides.length
            ) {

                currentIndex = 0;

            }


            updateSlider(true);

        }


        function previousSlide() {

            if (slides.length <= 1) {
                return;
            }


            currentIndex--;


            if (
                currentIndex < 0
            ) {

                currentIndex =
                    slides.length - 1;

            }


            updateSlider(true);

        }


        /* 下一张 */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    nextSlide();

                }
            );

        }


        /* 上一张 */

        if (prevButton) {

            prevButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    previousSlide();

                }
            );

        }


        /* 圆点 */

        dots.forEach(
            function (dot, index) {

                dot.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        if (
                            index >=
                            slides.length
                        ) {
                            return;
                        }


                        currentIndex =
                            index;


                        updateSlider(true);

                    }
                );

            }
        );


        /* 手机左右滑动 */

        track.addEventListener(
            "touchstart",
            function (event) {

                if (
                    !event.touches ||
                    event.touches.length !== 1
                ) {
                    return;
                }


                startX =
                    event.touches[0]
                        .clientX;

                startY =
                    event.touches[0]
                        .clientY;


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
                    event.changedTouches.length !== 1
                ) {
                    return;
                }


                const endX =
                    event.changedTouches[0]
                        .clientX;

                const endY =
                    event.changedTouches[0]
                        .clientY;


                const diffX =
                    endX - startX;

                const diffY =
                    endY - startY;


                if (
                    Math.abs(diffX) > 50 &&
                    Math.abs(diffX) >
                    Math.abs(diffY)
                ) {

                    if (diffX < 0) {

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


        updateSlider(false);

    }


    /* =====================================================
       沉香树 + 工厂
    ===================================================== */

    createSlider({

        track: ".tree-track",

        slide: ".tree-slide",

        prev: ".slider-prev",

        next: ".slider-next",

        dot: ".slider-dot"

    });


    /* =====================================================
       客户反馈
    ===================================================== */

    createSlider({

        track: ".review-track",

        slide: ".review-slide",

        prev: ".review-prev",

        next: ".review-next",

        dot: ".review-dot"

    });


    /* =====================================================
       图片放大
    ===================================================== */

    const lightbox =
        document.getElementById(
            "imageLightbox"
        );


    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    const lightboxClose =
        document.getElementById(
            "lightboxClose"
        );


    const lightboxPrev =
        document.getElementById(
            "lightboxPrev"
        );


    const lightboxNext =
        document.getElementById(
            "lightboxNext"
        );


    if (
        !lightbox ||
        !lightboxImage
    ) {
        return;
    }


    function getZoomImages() {

        return Array.from(
            document.querySelectorAll(
                ".tree-slide img, " +
                ".product-image img, " +
                ".shipping-promotion-image img, " +
                ".review-slide img"
            )
        );

    }


    let currentImageIndex = 0;


    function openLightbox(image) {

        const images =
            getZoomImages();


        const index =
            images.indexOf(image);


        if (
            index === -1 ||
            !images[index]
        ) {
            return;
        }


        currentImageIndex =
            index;


        lightboxImage.src =
            images[index].currentSrc ||
            images[index].src;


        lightboxImage.alt =
            images[index].alt || "";


        lightbox.classList.add(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    function showImage(direction) {

        const images =
            getZoomImages();


        if (images.length === 0) {
            return;
        }


        currentImageIndex +=
            direction;


        if (
            currentImageIndex < 0
        ) {

            currentImageIndex =
                images.length - 1;

        }


        if (
            currentImageIndex >=
            images.length
        ) {

            currentImageIndex = 0;

        }


        const image =
            images[currentImageIndex];


        lightboxImage.src =
            image.currentSrc ||
            image.src;


        lightboxImage.alt =
            image.alt || "";

    }


    /* =====================================================
       图片点击
       使用事件委托
       轮播后的图片也能放大
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const image =
                event.target.closest(
                    ".tree-slide img, " +
                    ".product-image img, " +
                    ".shipping-promotion-image img, " +
                    ".review-slide img"
                );


            if (!image) {
                return;
            }


            openLightbox(image);

        }
    );


    /* =====================================================
       关闭
    ===================================================== */

    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                closeLightbox();

            }
        );

    }


    /* =====================================================
       Lightbox 上一张
    ===================================================== */

    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                showImage(-1);

            }
        );

    }


    /* =====================================================
       Lightbox 下一张
    ===================================================== */

    if (lightboxNext) {

        lightboxNext.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                showImage(1);

            }
        );

    }


    /* =====================================================
       点击黑色背景关闭
    ===================================================== */

    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* =====================================================
       手机图片左右滑动
    ===================================================== */

    let lightboxStartX = 0;
    let lightboxStartY = 0;

    let lightboxTouching = false;


    lightbox.addEventListener(
        "touchstart",
        function (event) {

            if (
                !event.touches ||
                event.touches.length !== 1
            ) {
                return;
            }


            lightboxStartX =
                event.touches[0]
                    .clientX;

            lightboxStartY =
                event.touches[0]
                    .clientY;


            lightboxTouching = true;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        function (event) {

            if (!lightboxTouching) {
                return;
            }


            lightboxTouching = false;


            if (
                !event.changedTouches ||
                event.changedTouches.length !== 1
            ) {
                return;
            }


            const endX =
                event.changedTouches[0]
                    .clientX;

            const endY =
                event.changedTouches[0]
                    .clientY;


            const diffX =
                endX - lightboxStartX;

            const diffY =
                endY - lightboxStartY;


            if (
                Math.abs(diffX) > 50 &&
                Math.abs(diffX) >
                Math.abs(diffY)
            ) {

                if (diffX < 0) {

                    showImage(1);

                } else {

                    showImage(-1);

                }

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                showImage(-1);

            }


            if (
                event.key === "ArrowRight"
            ) {

                showImage(1);

            }

        }
    );

});