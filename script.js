document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       1. 手机端导航
    ========================================================= */

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


    /* =========================================================
       2. 通用轮播
       
       不使用 clone 无限循环。
       使用真实图片进行循环切换。
       
       优点：
       - 不会产生重复图片
       - 不会干扰图片放大
       - 不会把树木图片和产品图片混在一起
       - 手机端更加稳定
    ========================================================= */

    function createSlider(options) {

        const slider =
            document.querySelector(options.slider);

        const track =
            document.querySelector(options.track);

        if (!slider || !track) {
            return;
        }


        const slides =
            Array.from(
                track.querySelectorAll(options.slide)
            );


        const prev =
            slider.querySelector(options.prev);

        const next =
            slider.querySelector(options.next);

        const dots =
            Array.from(
                slider.querySelectorAll(options.dot)
            );


        if (slides.length === 0) {
            return;
        }


        let currentIndex = 0;

        let isMoving = false;


        /* -----------------------------------------
           设置轮播位置
        ----------------------------------------- */

        function updateSlider(animate) {

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


        /* -----------------------------------------
           更新圆点
        ----------------------------------------- */

        function updateDots() {

            dots.forEach(function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            });
        }


        /* -----------------------------------------
           切换到指定图片
        ----------------------------------------- */

        function goTo(index) {

            if (isMoving || slides.length <= 1) {
                return;
            }


            if (index < 0) {

                index = slides.length - 1;

            }


            if (index >= slides.length) {

                index = 0;

            }


            currentIndex = index;

            isMoving = true;

            updateSlider(true);
        }


        /* -----------------------------------------
           上一张
        ----------------------------------------- */

        function previous() {

            goTo(currentIndex - 1);

        }


        /* -----------------------------------------
           下一张
        ----------------------------------------- */

        function nextSlide() {

            goTo(currentIndex + 1);

        }


        /* -----------------------------------------
           CSS transition 结束
        ----------------------------------------- */

        track.addEventListener(
            "transitionend",
            function () {

                isMoving = false;

            }
        );


        /* -----------------------------------------
           左右按钮
        ----------------------------------------- */

        if (prev) {

            prev.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    previous();

                }
            );
        }


        if (next) {

            next.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    nextSlide();

                }
            );
        }


        /* -----------------------------------------
           圆点
        ----------------------------------------- */

        dots.forEach(function (dot, index) {

            dot.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    goTo(index);

                }
            );

        });


        /* =================================================
           手机左右滑动
        ================================================= */

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


                const diffX =
                    endX - startX;

                const diffY =
                    endY - startY;


                /* 防止上下滚动被误认为左右滑动 */

                if (
                    Math.abs(diffX) < 50 ||
                    Math.abs(diffX) <= Math.abs(diffY)
                ) {
                    return;
                }


                if (diffX < 0) {

                    nextSlide();

                } else {

                    previous();

                }

            },
            {
                passive: true
            }
        );


        /* -----------------------------------------
           初始位置
        ----------------------------------------- */

        updateSlider(false);
    }


    /* =========================================================
       3. 沉香树 + 工厂轮播
    ========================================================= */

    createSlider({

        slider: ".tree-slider",

        track: ".tree-track",

        slide: ".tree-slide",

        prev: ".slider-prev",

        next: ".slider-next",

        dot: ".slider-dot"

    });


    /* =========================================================
       4. 客户反馈轮播
    ========================================================= */

    createSlider({

        slider: ".review-slider",

        track: ".review-track",

        slide: ".review-slide",

        prev: ".review-prev",

        next: ".review-next",

        dot: ".review-dot"

    });


    /* =========================================================
       5. 图片放大 Lightbox
       
       每个区域独立图库：

       tree    = 沉香树与工厂
       product = 沉香产品
       shipping = 配送活动
       review  = 客户反馈
    ========================================================= */

    const lightbox =
        document.getElementById("imageLightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const lightboxClose =
        document.getElementById("lightboxClose");

    const lightboxPrev =
        document.getElementById("lightboxPrev");

    const lightboxNext =
        document.getElementById("lightboxNext");


    if (
        !lightbox ||
        !lightboxImage
    ) {
        return;
    }


    let currentGallery = [];

    let currentImageIndex = 0;


    /* -----------------------------------------
       获取指定图库
    ----------------------------------------- */

    function getGallery(type) {

        let selector = "";


        if (type === "tree") {

            selector =
                ".tree-slide img";

        } else if (type === "product") {

            selector =
                ".product-image img";

        } else if (type === "shipping") {

            selector =
                ".shipping-promotion-image img";

        } else if (type === "review") {

            selector =
                ".review-slide img";

        }


        if (!selector) {
            return [];
        }


        return Array.from(
            document.querySelectorAll(selector)
        ).filter(function (img) {

            /*
             * 只使用实际存在并且加载成功的图片。
             * 防止未来 tree-04 / tree-05 尚未准备时
             * 破坏图片放大。
             */

            return (
                img &&
                img.complete &&
                img.naturalWidth > 0
            );

        });
    }


    /* -----------------------------------------
       设置 Lightbox 图片
    ----------------------------------------- */

    function updateLightboxImage() {

        if (
            !lightboxImage ||
            currentGallery.length === 0
        ) {
            return;
        }


        const image =
            currentGallery[currentImageIndex];


        if (!image) {
            return;
        }


        /*
         * 使用 currentSrc 优先，
         * 避免部分浏览器 lazy loading 问题。
         */

        lightboxImage.src =
            image.currentSrc ||
            image.src;


        lightboxImage.alt =
            image.alt || "图片";
    }


    /* -----------------------------------------
       打开图片
    ----------------------------------------- */

    function openLightbox(
        galleryType,
        imageElement
    ) {

        if (
            !imageElement ||
            !lightbox
        ) {
            return;
        }


        const gallery =
            getGallery(galleryType);


        if (gallery.length === 0) {
            return;
        }


        const index =
            gallery.indexOf(imageElement);


        if (index === -1) {
            return;
        }


        currentGallery = gallery;

        currentImageIndex = index;


        updateLightboxImage();


        lightbox.classList.add("active");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";
    }


    /* -----------------------------------------
       关闭图片
    ----------------------------------------- */

    function closeLightbox() {

        lightbox.classList.remove("active");

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";
    }


    /* -----------------------------------------
       下一张
    ----------------------------------------- */

    function showNextImage() {

        if (
            currentGallery.length <= 1
        ) {
            return;
        }


        currentImageIndex++;


        if (
            currentImageIndex >=
            currentGallery.length
        ) {
            currentImageIndex = 0;
        }


        updateLightboxImage();
    }


    /* -----------------------------------------
       上一张
    ----------------------------------------- */

    function showPreviousImage() {

        if (
            currentGallery.length <= 1
        ) {
            return;
        }


        currentImageIndex--;


        if (currentImageIndex < 0) {

            currentImageIndex =
                currentGallery.length - 1;
        }


        updateLightboxImage();
    }


    /* =========================================================
       6. 图片点击
       
       使用事件委托，不依赖 clone。
       手机端也可以正常触发。
    ========================================================= */

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


            /*
             * 如果点击的是轮播按钮附近，
             * 不打开图片。
             */

            if (
                event.target.closest(
                    ".slider-button, .review-button"
                )
            ) {
                return;
            }


            let galleryType = "";


            if (
                image.closest(".tree-slide")
            ) {

                galleryType = "tree";

            } else if (
                image.closest(".product-image")
            ) {

                galleryType = "product";

            } else if (
                image.closest(
                    ".shipping-promotion-image"
                )
            ) {

                galleryType = "shipping";

            } else if (
                image.closest(".review-slide")
            ) {

                galleryType = "review";

            }


            if (!galleryType) {
                return;
            }


            event.preventDefault();


            openLightbox(
                galleryType,
                image
            );

        }
    );


    /* =========================================================
       7. Lightbox 关闭按钮
    ========================================================= */

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


    /* =========================================================
       8. Lightbox 上一张
    ========================================================= */

    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                showPreviousImage();

            }
        );
    }


    /* =========================================================
       9. Lightbox 下一张
    ========================================================= */

    if (lightboxNext) {

        lightboxNext.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                showNextImage();

            }
        );
    }


    /* =========================================================
       10. 点击黑色背景关闭
    ========================================================= */

    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* =========================================================
       11. 手机端 Lightbox 左右滑动
    ========================================================= */

    let lightboxStartX = 0;
    let lightboxStartY = 0;
    let lightboxTouching = false;


    lightbox.addEventListener(
        "touchstart",
        function (event) {

            if (
                !event.touches ||
                event.touches.length === 0
            ) {
                return;
            }


            lightboxStartX =
                event.touches[0].clientX;

            lightboxStartY =
                event.touches[0].clientY;

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
                event.changedTouches.length === 0
            ) {
                return;
            }


            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;


            const diffX =
                endX - lightboxStartX;

            const diffY =
                endY - lightboxStartY;


            if (
                Math.abs(diffX) < 50 ||
                Math.abs(diffX) <= Math.abs(diffY)
            ) {
                return;
            }


            if (diffX < 0) {

                showNextImage();

            } else {

                showPreviousImage();

            }

        },
        {
            passive: true
        }
    );


    /* =========================================================
       12. ESC / 键盘控制
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox.classList.contains("active")
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

                showPreviousImage();

            }


            if (
                event.key === "ArrowRight"
            ) {

                showNextImage();

            }

        }
    );


    /* =========================================================
       13. 防止页面加载时图片 Lightbox 闪现
    ========================================================= */

    lightbox.classList.remove("active");

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

});