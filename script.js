 `script.js`

```javascript
document.addEventListener("DOMContentLoaded", function () {

    /* ==================================================
       手机端导航
    ================================================== */

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


    /* ==================================================
       无限循环轮播
    ================================================== */

    function createInfiniteSlider(options) {

        const track =
            document.querySelector(options.track);

        if (!track) {
            return;
        }

        /*
         * 只获取原始图片。
         *
         * 注意：
         * 初始化时这里还没有克隆图片，
         * 所以之后放大图片不会受到克隆图影响。
         */

        const originalSlides =
            Array.from(
                track.querySelectorAll(options.slide)
            );

        const total =
            originalSlides.length;

        if (total <= 1) {
            return;
        }


        const prev =
            document.querySelector(options.prev);

        const next =
            document.querySelector(options.next);

        const dots =
            Array.from(
                document.querySelectorAll(options.dot)
            );


        /*
         * 保存原始图片到全局图片组
         */

        if (options.imageGroup) {

            imageGroups[options.imageGroup] =
                originalSlides
                    .map(function (slide) {

                        return slide.querySelector("img");

                    })
                    .filter(Boolean);

        }


        /*
         * 创建首尾克隆
         */

        const firstClone =
            originalSlides[0].cloneNode(true);

        const lastClone =
            originalSlides[total - 1].cloneNode(true);


        track.insertBefore(
            lastClone,
            track.firstChild
        );

        track.appendChild(firstClone);


        /*
         * 当前实际位置
         *
         * 0 = 最后一张克隆
         * 1 = 第一张真实图片
         * 2 = 第二张真实图片
         * ...
         * total = 最后一张真实图片
         * total + 1 = 第一张克隆
         */

        let index = 1;

        let locked = false;


        function getRealIndex() {

            let realIndex =
                index - 1;

            if (realIndex < 0) {
                realIndex = total - 1;
            }

            if (realIndex >= total) {
                realIndex = 0;
            }

            return realIndex;
        }


        function updateDots() {

            const realIndex =
                getRealIndex();

            dots.forEach(function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === realIndex
                );

            });

        }


        function setPosition(animate) {

            track.style.transition =
                animate
                    ? "transform 0.45s ease"
                    : "none";

            track.style.transform =
                "translate3d(-" +
                (index * 100) +
                "%, 0, 0)";

            updateDots();
        }


        function move(direction) {

            if (locked) {
                return;
            }

            locked = true;

            index += direction;

            setPosition(true);
        }


        track.addEventListener(
            "transitionend",
            function () {

                /*
                 * 第一张克隆
                 * 回到第一张真实图片
                 */

                if (index === total + 1) {

                    index = 1;

                    setPosition(false);

                }

                /*
                 * 最后一张克隆
                 * 回到最后一张真实图片
                 */

                else if (index === 0) {

                    index = total;

                    setPosition(false);
                }

                locked = false;
            }
        );


        /*
         * 下一张
         */

        if (next) {

            next.addEventListener(
                "click",
                function () {
                    move(1);
                }
            );

        }


        /*
         * 上一张
         */

        if (prev) {

            prev.addEventListener(
                "click",
                function () {
                    move(-1);
                }
            );

        }


        /*
         * 指示点
         */

        dots.forEach(function (dot, dotIndex) {

            dot.addEventListener(
                "click",
                function () {

                    if (locked) {
                        return;
                    }

                    index =
                        dotIndex + 1;

                    setPosition(true);

                }
            );

        });


        /* ==================================================
           手机左右滑动轮播
        ================================================== */

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
                 * 才切换图片
                 */

                if (
                    Math.abs(diffX) > 50 &&
                    Math.abs(diffX) >
                    Math.abs(diffY)
                ) {

                    if (diffX < 0) {
                        move(1);
                    } else {
                        move(-1);
                    }

                }

            },
            {
                passive: true
            }
        );


        /*
         * 初始化到第一张真实图片
         */

        setPosition(false);
    }


    /* ==================================================
       图片组
    ================================================== */

    const imageGroups = {};


    /* ==================================================
       沉香树 + 工厂
       5 张图片独立循环
    ================================================== */

    createInfiniteSlider({

        track: ".tree-track",

        slide: ".tree-slide",

        prev: ".slider-prev",

        next: ".slider-next",

        dot: ".slider-dot",

        imageGroup: "trees"

    });


    /* ==================================================
       客户反馈
       3 张图片独立循环
    ================================================== */

    createInfiniteSlider({

        track: ".review-track",

        slide: ".review-slide",

        prev: ".review-prev",

        next: ".review-next",

        dot: ".review-dot",

        imageGroup: "reviews"

    });


    /* ==================================================
       产品图片
       4 张独立图片
    ================================================== */

    imageGroups.products =
        Array.from(
            document.querySelectorAll(
                ".product-image img"
            )
        );


    /* ==================================================
       配送活动图片
       如果图片存在则加入
    ================================================== */

    const shippingImage =
        document.querySelector(
            ".shipping-promotion-image img"
        );

    imageGroups.shipping =
        shippingImage
            ? [shippingImage]
            : [];


    /* ==================================================
       图片放大 Lightbox
    ================================================== */

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


    /*
     * 当前图片组
     */

    let currentGroup = [];

    let currentImageIndex = 0;


    /*
     * 打开图片
     */

    function openLightbox(
        group,
        index
    ) {

        if (
            !lightbox ||
            !lightboxImage ||
            !group ||
            !group[index]
        ) {
            return;
        }


        currentGroup = group;

        currentImageIndex = index;


        updateLightboxImage();


        lightbox.classList.add(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * 防止手机页面在图片放大时继续滚动
         */

        document.body.style.overflow =
            "hidden";
    }


    /*
     * 更新放大图片
     */

    function updateLightboxImage() {

        if (
            !lightboxImage ||
            !currentGroup ||
            !currentGroup[currentImageIndex]
        ) {
            return;
        }


        const image =
            currentGroup[currentImageIndex];


        /*
         * 使用 currentSrc / src
         * 兼容浏览器缓存和懒加载
         */

        lightboxImage.src =
            image.currentSrc ||
            image.src;


        lightboxImage.alt =
            image.alt || "";
    }


    /*
     * 关闭图片
     */

    function closeLightbox() {

        if (!lightbox) {
            return;
        }


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


    /*
     * 切换放大图片
     *
     * 只在当前图片组内循环。
     *
     * 沉香树：
     * 01 → 02 → 03 → 04 → 05 → 01
     *
     * 产品：
     * 01 → 02 → 03 → 04 → 01
     *
     * 客户反馈：
     * 01 → 02 → 03 → 01
     */

    function showImage(direction) {

        if (
            !currentGroup ||
            currentGroup.length === 0
        ) {
            return;
        }


        currentImageIndex += direction;


        if (
            currentImageIndex < 0
        ) {

            currentImageIndex =
                currentGroup.length - 1;

        }


        if (
            currentImageIndex >=
            currentGroup.length
        ) {

            currentImageIndex = 0;

        }


        updateLightboxImage();
    }


    /* ==================================================
       绑定沉香树图片
    ================================================== */

    if (imageGroups.trees) {

        imageGroups.trees.forEach(
            function (image, index) {

                image.addEventListener(
                    "click",
                    function () {

                        openLightbox(
                            imageGroups.trees,
                            index
                        );

                    }
                );

            }
        );

    }


    /* ==================================================
       绑定产品图片
    ================================================== */

    if (imageGroups.products) {

        imageGroups.products.forEach(
            function (image, index) {

                image.addEventListener(
                    "click",
                    function () {

                        openLightbox(
                            imageGroups.products,
                            index
                        );

                    }
                );

            }
        );

    }


    /* ==================================================
       绑定客户反馈图片
    ================================================== */

    if (imageGroups.reviews) {

        imageGroups.reviews.forEach(
            function (image, index) {

                image.addEventListener(
                    "click",
                    function () {

                        openLightbox(
                            imageGroups.reviews,
                            index
                        );

                    }
                );

            }
        );

    }


    /* ==================================================
       绑定配送活动图片
    ================================================== */

    if (imageGroups.shipping.length > 0) {

        imageGroups.shipping.forEach(
            function (image, index) {

                image.addEventListener(
                    "click",
                    function () {

                        openLightbox(
                            imageGroups.shipping,
                            index
                        );

                    }
                );

            }
        );

    }


    /* ==================================================
       Lightbox 关闭
    ================================================== */

    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            function () {

                closeLightbox();

            }
        );

    }


    /* ==================================================
       Lightbox 上一张
    ================================================== */

    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                showImage(-1);

            }
        );

    }


    /* ==================================================
       Lightbox 下一张
    ================================================== */

    if (lightboxNext) {

        lightboxNext.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                showImage(1);

            }
        );

    }


    /* ==================================================
       点击黑色背景关闭
    ================================================== */

    if (lightbox) {

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

    }


    /* ==================================================
       手机端放大图片左右滑动
    ================================================== */

    let lightboxStartX = 0;
    let lightboxStartY = 0;


    if (lightbox) {

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

            },
            {
                passive: true
            }
        );


        lightbox.addEventListener(
            "touchend",
            function (event) {

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

    }


    /* ==================================================
       ESC / 键盘操作
    ================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox ||
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
```
