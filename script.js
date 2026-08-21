```javascript
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


    /* =========================
       无限循环轮播
    ========================= */

    function createInfiniteSlider(options) {

        const track =
            document.querySelector(options.track);

        if (!track) {
            return;
        }

        const slides =
            Array.from(
                track.querySelectorAll(
                    options.slide
                )
            );

        const prev =
            document.querySelector(options.prev);

        const next =
            document.querySelector(options.next);

        const dots =
            Array.from(
                document.querySelectorAll(options.dot)
            );

        if (slides.length === 0) {
            return;
        }

        if (slides.length === 1) {

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


        function setPosition(animate) {

            track.style.transition =
                animate
                    ? "transform 0.45s ease"
                    : "none";

            track.style.transform =
                "translate3d(-" +
                (index * 100) +
                "%,0,0)";

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
            function (event) {

                if (
                    event.propertyName &&
                    event.propertyName !== "transform"
                ) {
                    return;
                }

                if (index === total + 1) {

                    index = 1;

                    setPosition(false);

                } else if (index === 0) {

                    index = total;

                    setPosition(false);
                }

                locked = false;
            }
        );


        if (next) {

            next.addEventListener(
                "click",
                function () {
                    move(1);
                }
            );
        }


        if (prev) {

            prev.addEventListener(
                "click",
                function () {
                    move(-1);
                }
            );
        }


        dots.forEach(function (dot, dotIndex) {

            dot.addEventListener(
                "click",
                function () {

                    if (locked) {
                        return;
                    }

                    index = dotIndex + 1;

                    setPosition(true);
                }
            );

        });


        /* =========================
           手机左右滑动
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

                const diffX =
                    endX - startX;

                const diffY =
                    endY - startY;

                if (
                    Math.abs(diffX) > 50 &&
                    Math.abs(diffX) > Math.abs(diffY)
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


        setPosition(false);
    }


    /* =========================
       沉香树 + 工厂轮播
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
       图片放大查看
    ========================= */

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


    /*
       只获取原始图片。
       排除轮播程序自动复制的 slider-clone，
       避免图片放大时出现重复。
    */

    const zoomImages =
        Array.from(
            document.querySelectorAll(
                ".tree-slide:not(.slider-clone) img, " +
                ".product-image img, " +
                ".review-slide:not(.slider-clone) img, " +
                ".shipping-promotion-image img"
            )
        );


    let currentImage = 0;


    function getImageSource(image) {

        if (!image) {
            return "";
        }

        return (
            image.getAttribute("data-full") ||
            image.currentSrc ||
            image.src ||
            ""
        );
    }


    function openLightbox(index) {

        if (
            !lightbox ||
            !lightboxImage ||
            !zoomImages[index]
        ) {
            return;
        }

        currentImage = index;

        lightboxImage.src =
            getImageSource(
                zoomImages[currentImage]
            );

        lightboxImage.alt =
            zoomImages[currentImage].alt || "";

        lightbox.classList.add("active");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove("active");

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

        setTimeout(function () {

            if (
                !lightbox.classList.contains("active") &&
                lightboxImage
            ) {
                lightboxImage.src = "";
            }

        }, 200);
    }


    function showImage(direction) {

        if (
            !lightbox ||
            !lightboxImage ||
            zoomImages.length === 0
        ) {
            return;
        }

        currentImage += direction;

        if (currentImage < 0) {
            currentImage =
                zoomImages.length - 1;
        }

        if (
            currentImage >=
            zoomImages.length
        ) {
            currentImage = 0;
        }

        lightboxImage.src =
            getImageSource(
                zoomImages[currentImage]
            );

        lightboxImage.alt =
            zoomImages[currentImage].alt || "";
    }


    zoomImages.forEach(function (image, index) {

        image.addEventListener(
            "click",
            function () {

                openLightbox(index);

            }
        );

    });


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                closeLightbox();

            }
        );
    }


    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                showImage(-1);

            }
        );
    }


    if (lightboxNext) {

        lightboxNext.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                showImage(1);

            }
        );
    }


    /* =========================
       点击黑色区域关闭
    ========================= */

    if (lightbox) {

        lightbox.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === lightbox ||
                    event.target ===
                    document.querySelector(".lightbox-image-wrap")
                ) {
                    closeLightbox();
                }

            }
        );
    }


    /* =========================
       放大图片手机左右滑动
    ========================= */

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
                    Math.abs(diffX) > Math.abs(diffY)
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


    /* =========================
       ESC + 键盘左右键
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !lightbox ||
                !lightbox.classList.contains("active")
            ) {
                return;
            }

            if (event.key === "Escape") {

                closeLightbox();

            } else if (event.key === "ArrowLeft") {

                showImage(-1);

            } else if (event.key === "ArrowRight") {

                showImage(1);

            }

        }
    );


    /* =========================
       防止图片拖动造成页面异常
    ========================= */

    document.querySelectorAll("img").forEach(
        function (image) {

            image.addEventListener(
                "dragstart",
                function (event) {
                    event.preventDefault();
                }
            );

        }
    );

});
```
