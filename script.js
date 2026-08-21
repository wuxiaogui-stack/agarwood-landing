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

        menuToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const isOpen =
                    mainNav.classList.toggle(
                        "mobile-open"
                    );

                menuToggle.classList.toggle(
                    "active",
                    isOpen
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
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
                    !mainNav.contains(event.target) &&
                    !menuToggle.contains(event.target)
                ) {
                    closeMenu();
                }

            }
        );
    }


    /* =========================================================
       2. 通用轮播系统
       
       不使用 clone。
       每个轮播完全独立。
    ========================================================= */

    function createSlider(options) {

        const slider =
            document.querySelector(options.slider);

        const track =
            slider
                ? slider.querySelector(options.track)
                : null;


        if (!slider || !track) {
            return;
        }


        const slides =
            Array.from(
                track.querySelectorAll(
                    options.slide
                )
            );


        const prev =
            slider.querySelector(
                options.prev
            );

        const next =
            slider.querySelector(
                options.next
            );

        const dots =
            Array.from(
                slider.querySelectorAll(
                    options.dot
                )
            );


        if (slides.length === 0) {
            return;
        }


        let currentIndex = 0;

        let isMoving = false;


        /* -----------------------------------------------------
           更新圆点
        ----------------------------------------------------- */

        function updateDots() {

            dots.forEach(
                function (dot, index) {

                    if (
                        index === currentIndex
                    ) {

                        dot.classList.add(
                            "active"
                        );

                    } else {

                        dot.classList.remove(
                            "active"
                        );

                    }

                }
            );
        }


        /* -----------------------------------------------------
           更新图片位置
        ----------------------------------------------------- */

        function updatePosition(
            animate
        ) {

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


        /* -----------------------------------------------------
           切换图片
        ----------------------------------------------------- */

        function goTo(index) {

            if (
                slides.length <= 1
            ) {
                return;
            }


            if (isMoving) {
                return;
            }


            if (index < 0) {

                index =
                    slides.length - 1;
            }


            if (
                index >= slides.length
            ) {

                index = 0;
            }


            currentIndex = index;


            /*
             * 先更新圆点，
             * 保证圆点和当前图片同步。
             */

            updateDots();


            isMoving = true;


            updatePosition(true);
        }


        /* -----------------------------------------------------
           上一张
        ----------------------------------------------------- */

        function goPrevious() {

            goTo(
                currentIndex - 1
            );
        }


        /* -----------------------------------------------------
           下一张
        ----------------------------------------------------- */

        function goNext() {

            goTo(
                currentIndex + 1
            );
        }


        /* -----------------------------------------------------
           动画结束
        ----------------------------------------------------- */

        track.addEventListener(
            "transitionend",
            function () {

                isMoving = false;

                updateDots();

            }
        );


        /* -----------------------------------------------------
           上一张按钮
        ----------------------------------------------------- */

        if (prev) {

            prev.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    goPrevious();

                }
            );
        }


        /* -----------------------------------------------------
           下一张按钮
        ----------------------------------------------------- */

        if (next) {

            next.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    goNext();

                }
            );
        }


        /* -----------------------------------------------------
           圆点按钮
        ----------------------------------------------------- */

        dots.forEach(
            function (dot, index) {

                dot.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        goTo(index);

                    }
                );

            }
        );


        /* =====================================================
           手机端左右滑动
        ===================================================== */

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


                /*
                 * 只有明显的横向滑动
                 * 才切换图片。
                 */

                if (
                    Math.abs(diffX) < 50
                ) {
                    return;
                }


                if (
                    Math.abs(diffX) <=
                    Math.abs(diffY)
                ) {
                    return;
                }


                if (diffX < 0) {

                    goNext();

                } else {

                    goPrevious();

                }

            },
            {
                passive: true
            }
        );


        /* -----------------------------------------------------
           初始化
        ----------------------------------------------------- */

        updatePosition(false);

        updateDots();
    }


    /* =========================================================
       3. 沉香树与工厂轮播
       
       tree-01
       tree-02
       tree-03
       tree-04
       tree-05
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
       5. 图片放大系统
       
       每个区域独立：
       
       tree
       product
       shipping
       review
    ========================================================= */

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


    let currentGallery = [];

    let currentImageIndex = 0;


    /* =========================================================
       6. 获取指定图库
    ========================================================= */

    function getGallery(
        galleryType
    ) {

        let selector = "";


        if (
            galleryType === "tree"
        ) {

            selector =
                ".tree-slide img";

        } else if (
            galleryType === "product"
        ) {

            selector =
                ".product-image img";

        } else if (
            galleryType === "shipping"
        ) {

            selector =
                ".shipping-promotion-image img";

        } else if (
            galleryType === "review"
        ) {

            selector =
                ".review-slide img";
        }


        if (!selector) {
            return [];
        }


        const images =
            Array.from(
                document.querySelectorAll(
                    selector
                )
            );


        /*
         * 只使用已经正常加载的图片。
         *
         * 因此：
         * tree-04.jpg
         * tree-05.jpg
         * shipping-01.jpg
         *
         * 暂时不存在时不会导致报错。
         */

        return images.filter(
            function (image) {

                return (
                    image &&
                    image.complete &&
                    image.naturalWidth > 0
                );

            }
        );
    }


    /* =========================================================
       7. 更新放大图片
    ========================================================= */

    function updateLightboxImage() {

        if (
            currentGallery.length === 0
        ) {
            return;
        }


        const image =
            currentGallery[
                currentImageIndex
            ];


        if (!image) {
            return;
        }


        lightboxImage.src =
            image.currentSrc ||
            image.src;


        lightboxImage.alt =
            image.alt ||
            "图片放大查看";
    }


    /* =========================================================
       8. 打开图片
    ========================================================= */

    function openLightbox(
        galleryType,
        imageElement
    ) {

        if (!imageElement) {
            return;
        }


        const gallery =
            getGallery(
                galleryType
            );


        if (
            gallery.length === 0
        ) {
            return;
        }


        const imageIndex =
            gallery.indexOf(
                imageElement
            );


        if (
            imageIndex === -1
        ) {
            return;
        }


        currentGallery =
            gallery;

        currentImageIndex =
            imageIndex;


        updateLightboxImage();


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


    /* =========================================================
       9. 关闭图片
    ========================================================= */

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


    /* =========================================================
       10. 放大图片下一张
    ========================================================= */

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


    /* =========================================================
       11. 放大图片上一张
    ========================================================= */

    function showPreviousImage() {

        if (
            currentGallery.length <= 1
        ) {
            return;
        }


        currentImageIndex--;


        if (
            currentImageIndex < 0
        ) {

            currentImageIndex =
                currentGallery.length - 1;
        }


        updateLightboxImage();
    }


    /* =========================================================
       12. 图片点击事件
       
       使用事件委托。
       
       这样即使轮播发生移动，
       手机端也可以正常点击图片。
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
             * 如果点击的是轮播按钮，
             * 不打开图片。
             */

            if (
                event.target.closest(
                    ".slider-button"
                )
            ) {
                return;
            }


            if (
                event.target.closest(
                    ".review-button"
                )
            ) {
                return;
            }


            let galleryType = "";


            if (
                image.closest(
                    ".tree-slide"
                )
            ) {

                galleryType =
                    "tree";

            } else if (
                image.closest(
                    ".product-image"
                )
            ) {

                galleryType =
                    "product";

            } else if (
                image.closest(
                    ".shipping-promotion-image"
                )
            ) {

                galleryType =
                    "shipping";

            } else if (
                image.closest(
                    ".review-slide"
                )
            ) {

                galleryType =
                    "review";
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
       13. 关闭按钮
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
       14. Lightbox 上一张
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
       15. Lightbox 下一张
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
       16. 点击黑色背景关闭
    ========================================================= */

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


    /* =========================================================
       17. 手机端放大图片左右滑动
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

            if (
                !lightboxTouching
            ) {
                return;
            }


            lightboxTouching =
                false;


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
                endX -
                lightboxStartX;

            const diffY =
                endY -
                lightboxStartY;


            if (
                Math.abs(diffX) < 50
            ) {
                return;
            }


            if (
                Math.abs(diffX) <=
                Math.abs(diffY)
            ) {
                return;
            }


            if (
                diffX < 0
            ) {

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
       18. 键盘控制
    ========================================================= */

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

                return;
            }


            if (
                event.key === "ArrowLeft"
            ) {

                showPreviousImage();

                return;
            }


            if (
                event.key === "ArrowRight"
            ) {

                showNextImage();

                return;
            }

        }
    );


    /* =========================================================
       19. 初始化 Lightbox
    ========================================================= */

    lightbox.classList.remove(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

});