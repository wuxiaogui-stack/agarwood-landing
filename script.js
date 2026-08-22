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


    /* =====================================================
       通用轮播
       修正版：
       不改变原始图片顺序
       支持 PC + 手机
    ===================================================== */

    function initSlider(config) {

        const slider =
            document.querySelector(config.slider);

        if (!slider) {
            return;
        }

        const track =
            slider.querySelector(config.track);

        if (!track) {
            return;
        }

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
                    dotsContainer.querySelectorAll(
                        config.dot
                    )
                )
                : [];

        if (slides.length === 0) {
            return;
        }

        /*
         * 强制保证每一张图片都可以加载
         */
        slides.forEach(function (slide) {

            const img =
                slide.querySelector("img");

            if (img) {

                img.loading = "eager";

                img.decoding = "async";

                /*
                 * 如果图片暂时没有加载完成，
                 * 主动触发浏览器重新读取
                 */
                if (
                    img.dataset &&
                    img.dataset.src &&
                    !img.src
                ) {
                    img.src = img.dataset.src;
                }

            }

        });


        /* =================================================
           只有一张图片
        ================================================= */

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


        /* =================================================
           创建无缝轮播克隆
        ================================================= */

        const firstClone =
            slides[0].cloneNode(true);

        const lastClone =
            slides[slides.length - 1]
                .cloneNode(true);

        firstClone.classList.add(
            "slider-clone"
        );

        lastClone.classList.add(
            "slider-clone"
        );

        /*
         * 克隆图片也强制加载
         */
        [
            firstClone,
            lastClone
        ].forEach(function (clone) {

            const img =
                clone.querySelector("img");

            if (img) {
                img.loading = "eager";
                img.decoding = "async";
            }

        });


        track.insertBefore(
            lastClone,
            track.firstChild
        );

        track.appendChild(
            firstClone
        );


        const total =
            slides.length;

        /*
         * current：
         *
         * 0 = 最后克隆图
         * 1 = 第一张真实图片
         * 2 = 第二张真实图片
         * ...
         * total = 最后一张真实图片
         * total + 1 = 第一张克隆图
         */

        let current = 1;

        let isMoving = false;


        /* =================================================
           更新圆点
        ================================================= */

        function updateDots() {

            const realIndex =
                current - 1;

            dots.forEach(
                function (dot, index) {

                    dot.classList.toggle(
                        "active",
                        index === realIndex
                    );

                }
            );

        }


        /* =================================================
           设置位置
        ================================================= */

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
                "%,0,0)";

            updateDots();

        }


        /* =================================================
           移动
        ================================================= */

        function move(direction) {

            if (isMoving) {
                return;
            }

            isMoving = true;

            current += direction;

            setPosition(true);

        }


        /* =================================================
           动画结束
        ================================================= */

        track.addEventListener(
            "transitionend",
            function (event) {

                if (
                    event.propertyName &&
                    event.propertyName !== "transform"
                ) {
                    return;
                }


                /*
                 * 从第一张克隆图
                 * 瞬间跳回第一张真实图片
                 */

                if (current === total + 1) {

                    current = 1;

                    setPosition(false);

                }


                /*
                 * 从最后一张克隆图
                 * 瞬间跳回最后一张真实图片
                 */

                else if (current === 0) {

                    current = total;

                    setPosition(false);

                }


                isMoving = false;

            }
        );


        /* =================================================
           上一张
        ================================================= */

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


        /* =================================================
           下一张
        ================================================= */

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


        /* =================================================
           圆点
        ================================================= */

        dots.forEach(
            function (dot, index) {

                dot.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        if (isMoving) {
                            return;
                        }

                        current =
                            index + 1;

                        setPosition(true);

                        isMoving = true;

                    }
                );

            }
        );


        /* =================================================
           手机触摸滑动
        ================================================= */

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


                /*
                 * 垂直滑动不处理
                 */

                if (
                    Math.abs(deltaX) < 40 ||
                    Math.abs(deltaX) <=
                    Math.abs(deltaY)
                ) {
                    return;
                }


                /*
                 * 手指向左：
                 * 下一张
                 */

                if (deltaX < 0) {

                    move(1);

                }

                /*
                 * 手指向右：
                 * 上一张
                 */

                else {

                    move(-1);

                }

            },
            {
                passive: true
            }
        );


        /* =================================================
           初始化
        ================================================= */

        setPosition(false);

    }


    /* =====================================================
       工厂 / 沉香树轮播
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
       客户评价轮播
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
        lightbox &&
        lightboxImage
    ) {

        const imageGroups = [];


        /* =================================================
           工厂图片
        ================================================= */

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


        /* =================================================
           产品图片
        ================================================= */

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


        /* =================================================
           客户评价图片
        ================================================= */

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


        /* =================================================
           活动图片
        ================================================= */

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


        /* =================================================
           查找图片所属分组
        ================================================= */

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


        /* =================================================
           更新放大图片
        ================================================= */

        function updateLightboxImage() {

            if (
                !currentGroup ||
                !currentGroup.images ||
                currentGroup.images.length === 0
            ) {
                return;
            }

            const image =
                currentGroup.images[
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


            if (
                currentGroup.images.length <= 1
            ) {

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


        /* =================================================
           打开图片
        ================================================= */

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

            lightbox.classList.add(
                "active"
            );

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


        /* =================================================
           关闭图片
        ================================================= */

        function closeLightbox() {

            lightbox.classList.remove(
                "active"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "lightbox-open"
            );

            document.body.style.overflow =
                "";

            setTimeout(
                function () {

                    if (
                        !lightbox.classList.contains(
                            "active"
                        )
                    ) {

                        lightboxImage.src = "";

                    }

                },
                200
            );

        }


        /* =================================================
           放大图片上一张
        ================================================= */

        function showPreviousImage() {

            if (
                !currentGroup ||
                currentGroup.images.length <= 1
            ) {
                return;
            }

            currentImageIndex--;

            if (
                currentImageIndex < 0
            ) {

                currentImageIndex =
                    currentGroup.images.length - 1;

            }

            updateLightboxImage();

        }


        /* =================================================
           放大图片下一张
        ================================================= */

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


        /* =================================================
           图片点击
        ================================================= */

        imageGroups.forEach(
            function (group) {

                group.images.forEach(
                    function (image) {

                        image.addEventListener(
                            "click",
                            function (event) {

                                event.preventDefault();
                                event.stopPropagation();

                                openLightbox(image);

                            }
                        );

                    }
                );

            }
        );


        /* =================================================
           关闭
        ================================================= */

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


        /* =================================================
           放大图片上一张
        ================================================= */

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


        /* =================================================
           放大图片下一张
        ================================================= */

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


        /* =================================================
           点击背景关闭
        ================================================= */

        lightbox.addEventListener(
            "click",
            function (event) {

                const imageWrap =
                    document.querySelector(
                        ".lightbox-image-wrap"
                    );

                if (
                    event.target === lightbox ||
                    event.target === imageWrap
                ) {

                    closeLightbox();

                }

            }
        );


        /* =================================================
           手机放大图片滑动
        ================================================= */

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
                    Math.abs(deltaX) <=
                    Math.abs(deltaY)
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


        /* =================================================
           键盘操作
        ================================================= */

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

    }


    /* =====================================================
       Supabase 客服系统
    ===================================================== */

    const SUPABASE_URL =
        "https://tvythmezaecdtqlqtwnh.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_SMgtLo5Zh15EWzVgTKoKHg_ci8lOFp6";


    async function getNextWhatsAppNumber() {

        try {

            const response =
                await fetch(

                    SUPABASE_URL +
                    "/rest/v1/rpc/get_next_whatsapp",

                    {
                        method: "POST",

                        headers: {

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                "Bearer " +
                                SUPABASE_KEY,

                            "Content-Type":
                                "application/json"

                        },

                        body: "{}"

                    }

                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Supabase客服轮询失败：",
                    response.status,
                    errorText
                );

                throw new Error(
                    "客服轮询请求失败"
                );

            }


            const result =
                await response.json();


            console.log(
                "Supabase返回客服：",
                result
            );


            if (
                !result ||
                result.success !== true ||
                !result.phone
            ) {

                throw new Error(
                    "目前没有在线客服"
                );

            }


            return result;

        } catch (error) {

            console.error(
                "获取客服号码失败：",
                error
            );

            return null;

        }

    }


    /* =====================================================
       WhatsApp
    ===================================================== */

    async function openWhatsApp() {

        const customerService =
            await getNextWhatsAppNumber();


        if (!customerService) {

            alert(
                "客服暂时无法接通，请稍后再试。"
            );

            return;

        }


        const phone =
            String(
                customerService.phone || ""
            )
            .replace(
                /\D/g,
                ""
            );


        if (!phone) {

            alert(
                "客服号码配置错误，请联系客服。"
            );

            return;

        }


        const whatsappUrl =
            "https://wa.me/" +
            phone;


        console.log(
            "正在打开在线客服：",
            customerService.name || "",
            phone
        );


        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );

    }


    /* =====================================================
       自动接管 WhatsApp 链接
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    "a, button"
                );

            if (!target) {
                return;
            }


            const href =
                target.getAttribute("href");


            const hasWhatsAppHref =
                href &&
                (
                    href.includes("wa.me") ||
                    href.includes("whatsapp.com")
                );


            const hasWhatsAppAttribute =
                target.hasAttribute(
                    "data-whatsapp"
                );


            const buttonText =
                (
                    target.textContent ||
                    ""
                ).toLowerCase();


            const hasWhatsAppText =
                buttonText.includes(
                    "whatsapp"
                );


            if (
                !hasWhatsAppHref &&
                !hasWhatsAppAttribute &&
                !hasWhatsAppText
            ) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();


            openWhatsApp();

        },
        true
    );


    /* =====================================================
       提供给 HTML onclick
    ===================================================== */

    window.openWhatsApp =
        openWhatsApp;

});