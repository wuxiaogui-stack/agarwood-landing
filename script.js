document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       手机端导航
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    function closeMenu() {
        if (!menuToggle || !mainNav) {
            return;
        }

        mainNav.classList.remove("mobile-open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
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


    /* =====================================================
       通用轮播
       每个轮播完全独立
    ===================================================== */

    function initSlider(config) {

        const slider = document.querySelector(config.slider);

        if (!slider) {
            return;
        }

        const track =
            slider.querySelector(config.track);

        const slides =
            Array.from(
                track.querySelectorAll(config.slide)
            );

        const prev =
            slider.querySelector(config.prev);

        const next =
            slider.querySelector(config.next);

        const dotsContainer =
            document.querySelector(config.dots);

        const dots =
            dotsContainer
                ? Array.from(
                    dotsContainer.querySelectorAll(config.dot)
                )
                : [];

        if (!track || slides.length === 0) {
            return;
        }


        /* -----------------------------
           单张图片
        ----------------------------- */

        if (slides.length === 1) {

            track.style.transform =
                "translate3d(0,0,0)";

            if (prev) {
                prev.style.display = "none";
            }

            if (next) {
                next.style.display = "none";
            }

            dots.forEach(function (dot) {
                dot.style.display = "none";
            });

            return;
        }


        /* -----------------------------
           克隆首尾图片
        ----------------------------- */

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


        const total = slides.length;

        let current = 1;

        let isMoving = false;


        /* -----------------------------
           更新圆点
        ----------------------------- */

        function updateDots() {

            const realIndex =
                current - 1;

            dots.forEach(function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === realIndex
                );

            });

        }


        /* -----------------------------
           设置位置
        ----------------------------- */

        function setPosition(animated) {

            if (animated) {

                track.style.transition =
                    "transform 0.45s ease";

            } else {

                track.style.transition =
                    "none";

            }

            track.style.transform =
                "translate3d(-" +
                (current * 100) +
                "%, 0, 0)";

            updateDots();
        }


        /* -----------------------------
           移动
        ----------------------------- */

        function move(direction) {

            if (isMoving) {
                return;
            }

            isMoving = true;

            current += direction;

            setPosition(true);
        }


        /* -----------------------------
           处理无限循环
        ----------------------------- */

        track.addEventListener(
            "transitionend",
            function (event) {

                if (
                    event.propertyName &&
                    event.propertyName !== "transform"
                ) {
                    return;
                }

                if (current === total + 1) {

                    current = 1;

                    setPosition(false);

                } else if (current === 0) {

                    current = total;

                    setPosition(false);
                }

                isMoving = false;
            }
        );


        /* -----------------------------
           上一张
        ----------------------------- */

        if (prev) {

            prev.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    move(-1);
                }
            );

        }


        /* -----------------------------
           下一张
        ----------------------------- */

        if (next) {

            next.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    move(1);
                }
            );

        }


        /* -----------------------------
           圆点
        ----------------------------- */

        dots.forEach(function (dot, index) {

            dot.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (isMoving) {
                        return;
                    }

                    current = index + 1;

                    setPosition(true);

                    isMoving = true;
                }
            );

        });


        /* -----------------------------
           手机左右滑动
        ----------------------------- */

        let startX = 0;
        let startY = 0;
        let isTouching = false;

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
                    event.touches[0].clientX;

                startY =
                    event.touches[0].clientY;

                isTouching = true;

            },
            {
                passive: true
            }
        );


        track.addEventListener(
            "touchend",
            function (event) {

                if (!isTouching) {
                    return;
                }

                isTouching = false;

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


                /* 只处理水平滑动 */

                if (
                    Math.abs(deltaX) < 50 ||
                    Math.abs(deltaX) <= Math.abs(deltaY)
                ) {
                    return;
                }


                if (deltaX < 0) {

                    move(1);

                } else {

                    move(-1);

                }

            },
            {
                passive: true
            }
        );


        /* 初始位置 */

        setPosition(false);

    }


    /* =====================================================
       沉香树与工厂轮播
       独立 5 张
    ===================================================== */

    initSlider({

        slider: ".tree-slider",

        track: ".tree-track",

        slide: ".tree-slide",

        prev: ".slider-prev",

        next: ".slider-next",

        dots: ".slider-dots",

        dot: ".slider-dot"

    });


    /* =====================================================
       客户反馈轮播
       独立 3 张
    ===================================================== */

    initSlider({

        slider: ".review-slider",

        track: ".review-track",

        slide: ".review-slide",

        prev: ".review-prev",

        next: ".review-next",

        dots: ".review-dots",

        dot: ".review-dot"

    });


    /* =====================================================
       图片放大系统
       
       重点：
       每一个图片区域都是独立图片组
    ===================================================== */

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


    /* =====================================================
       图片组
    ===================================================== */

    const imageGroups = [];


    /* -----------------------------
       沉香树与工厂
       只使用原始 5 张
       不使用轮播克隆图片
    ----------------------------- */

    const treeImages =
        Array.from(
            document.querySelectorAll(
                ".tree-slide:not(.slider-clone) img"
            )
        );

    if (treeImages.length > 0) {

        imageGroups.push({
            name: "trees",
            images: treeImages
        });

    }


    /* -----------------------------
       产品
    ----------------------------- */

    const productImages =
        Array.from(
            document.querySelectorAll(
                ".product-image img"
            )
        );

    if (productImages.length > 0) {

        imageGroups.push({
            name: "products",
            images: productImages
        });

    }


    /* -----------------------------
       客户反馈
       只使用原始图片
    ----------------------------- */

    const reviewImages =
        Array.from(
            document.querySelectorAll(
                ".review-slide:not(.slider-clone) img"
            )
        );

    if (reviewImages.length > 0) {

        imageGroups.push({
            name: "reviews",
            images: reviewImages
        });

    }


    /* -----------------------------
       配送活动
    ----------------------------- */

    const shippingImages =
        Array.from(
            document.querySelectorAll(
                ".shipping-promotion-image img"
            )
        );

    if (shippingImages.length > 0) {

        imageGroups.push({
            name: "shipping",
            images: shippingImages
        });

    }


    let currentGroup = null;
    let currentImageIndex = 0;


    /* =====================================================
       获取图片组
    ===================================================== */

    function findImageGroup(image) {

        for (
            let groupIndex = 0;
            groupIndex < imageGroups.length;
            groupIndex++
        ) {

            const group =
                imageGroups[groupIndex];

            const imageIndex =
                group.images.indexOf(image);

            if (imageIndex !== -1) {

                return {
                    group: group,
                    index: imageIndex
                };

            }

        }

        return null;
    }


    /* =====================================================
       更新放大图片
    ===================================================== */

    function updateLightboxImage() {

        if (
            !currentGroup ||
            !currentGroup.images ||
            currentGroup.images.length === 0
        ) {
            return;
        }

        const image =
            currentGroup.images[currentImageIndex];

        if (!image) {
            return;
        }

        /*
           使用 currentSrc 优先，
           避免部分浏览器 lazy loading
           导致 src 状态异常。
        */

        lightboxImage.src =
            image.currentSrc ||
            image.src;

        lightboxImage.alt =
            image.alt || "图片放大查看";


        /*
           如果当前组只有一张图片，
           隐藏左右按钮。
        */

        if (currentGroup.images.length <= 1) {

            if (lightboxPrev) {
                lightboxPrev.style.display =
                    "none";
            }

            if (lightboxNext) {
                lightboxNext.style.display =
                    "none";
            }

        } else {

            if (lightboxPrev) {
                lightboxPrev.style.display =
                    "flex";
            }

            if (lightboxNext) {
                lightboxNext.style.display =
                    "flex";
            }

        }

    }


    /* =====================================================
       打开图片
    ===================================================== */

    function openLightbox(image) {

        const result =
            findImageGroup(image);

        if (!result) {
            return;
        }

        currentGroup =
            result.group;

        currentImageIndex =
            result.index;

        updateLightboxImage();

        lightbox.classList.add("active");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "lightbox-open"
        );

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       关闭图片
    ===================================================== */

    function closeLightbox() {

        lightbox.classList.remove("active");

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "lightbox-open"
        );

        document.body.style.overflow =
            "";

        /*
           清空 src，避免关闭后继续占用图片资源
        */

        setTimeout(function () {

            if (
                !lightbox.classList.contains("active")
            ) {

                lightboxImage.src = "";

            }

        }, 200);

    }


    /* =====================================================
       放大图片上一张
    ===================================================== */

    function showPreviousImage() {

        if (
            !currentGroup ||
            currentGroup.images.length <= 1
        ) {
            return;
        }

        currentImageIndex--;

        if (currentImageIndex < 0) {

            currentImageIndex =
                currentGroup.images.length - 1;

        }

        updateLightboxImage();
    }


    /* =====================================================
       放大图片下一张
    ===================================================== */

    function showNextImage() {

        if (
            !currentGroup ||
            currentGroup.images.length <= 1
        ) {
            return;
        }

        currentImageIndex++;

        if (
            currentImageIndex >=
            currentGroup.images.length
        ) {

            currentImageIndex = 0;

        }

        updateLightboxImage();
    }


    /* =====================================================
       给所有图片绑定点击事件
    ===================================================== */

    imageGroups.forEach(function (group) {

        group.images.forEach(function (image) {

            image.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    openLightbox(image);

                }
            );

        });

    });


    /* =====================================================
       关闭按钮
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
       放大图片上一张
    ===================================================== */

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


    /* =====================================================
       放大图片下一张
    ===================================================== */

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


    /* =====================================================
       点击黑色背景关闭
    ===================================================== */

    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === lightbox ||
                event.target ===
                document.querySelector(
                    ".lightbox-image-wrap"
                )
            ) {

                closeLightbox();

            }

        }
    );


    /* =====================================================
       手机端放大图片左右滑动
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
                event.changedTouches.length !== 1
            ) {
                return;
            }

            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;

            const deltaX =
                endX - lightboxStartX;

            const deltaY =
                endY - lightboxStartY;


            if (
                Math.abs(deltaX) < 50 ||
                Math.abs(deltaX) <= Math.abs(deltaY)
            ) {
                return;
            }


            if (deltaX < 0) {

                showNextImage();

            } else {

                showPreviousImage();

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       ESC / 键盘控制
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox.classList.contains("active")
            ) {
                return;
            }

            if (event.key === "Escape") {

                closeLightbox();

            }

            if (event.key === "ArrowLeft") {

                showPreviousImage();

            }

            if (event.key === "ArrowRight") {

                showNextImage();

            }

        }
    );

});