window.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       网站数据追踪系统

       Meta Pixel
       Pixel ID:
       882833290918835

       Meta Conversions API
       Cloudflare Worker:
       https://meta-capi.717560552.workers.dev/

       TikTok Pixel
       Pixel ID:
       DA4P6OBC77UES973S3SG

       TikTok Events API
       Cloudflare Worker:
       https://tiktok-events-api.717560552.workers.dev/

       Supabase
       用于自动轮询在线 WhatsApp 客服
    ===================================================== */


    /* =====================================================
       配置
    ===================================================== */

    const META_PIXEL_ID =
        "882833290918835";

    const META_CAPI_URL =
        "https://meta-capi.717560552.workers.dev/";

    const TIKTOK_PIXEL_ID =
        "DA4P6OBC77UES973S3SG";

    const TIKTOK_EVENTS_API =
        "https://tiktok-events-api.717560552.workers.dev/";

    const SUPABASE_URL =
        "https://tvythmezaecdtqlqtwnh.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_SMgtLo5Zh15EWzVgTKoKHg_ci8lOFp6";


    /* =====================================================
       生成唯一 Event ID
    ===================================================== */

    function generateEventId(prefix = "contact") {

        return (
            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 12)
        );

    }


    /* =====================================================
       获取 Cookie
    ===================================================== */

    function getCookie(name) {

        try {

            const cookies =
                document.cookie
                    ? document.cookie.split("; ")
                    : [];

            for (const cookie of cookies) {

                const parts =
                    cookie.split("=");

                const key =
                    parts.shift();

                const value =
                    parts.join("=");

                if (key === name) {

                    try {

                        return decodeURIComponent(
                            value || ""
                        );

                    } catch (error) {

                        return value || "";

                    }

                }

            }

        } catch (error) {

            console.warn(
                "Cookie读取失败:",
                error
            );

        }

        return "";

    }


    /* =====================================================
       获取 URL 参数
    ===================================================== */

    function getUrlParameter(name) {

        try {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            return (
                params.get(name) ||
                ""
            );

        } catch (error) {

            return "";

        }

    }


    /* =====================================================
       获取 Meta fbp
    ===================================================== */

    function getMetaFbp() {

        return getCookie("_fbp");

    }


    /* =====================================================
       获取 Meta fbc
    ===================================================== */

    function getMetaFbc() {

        const cookieFbc =
            getCookie("_fbc");

        if (cookieFbc) {

            return cookieFbc;

        }


        const fbclid =
            getUrlParameter("fbclid");

        if (!fbclid) {

            return "";

        }


        return (
            "fb.1." +
            Date.now() +
            "." +
            fbclid
        );

    }


    /* =====================================================
       Meta Pixel Contact

       只有成功获取客服号码后才调用
    ===================================================== */

    function trackMetaPixelContact(eventId) {

        try {

            if (
                typeof window.fbq !== "function"
            ) {

                console.warn(
                    "Meta Pixel 尚未加载"
                );

                return;

            }


            window.fbq(
                "track",
                "Contact",
                {
                    content_name:
                        "WhatsApp Contact",

                    content_category:
                        "agarwood",

                    contact_method:
                        "WhatsApp"
                },
                {
                    eventID:
                        eventId
                }
            );


            console.log(
                "✅ Meta Pixel Contact:",
                eventId
            );

        } catch (error) {

            console.error(
                "Meta Pixel Contact Error:",
                error
            );

        }

    }


    /* =====================================================
       Meta Conversions API Contact

       只有成功获取客服号码后才调用
    ===================================================== */

    function trackMetaCAPIContact(eventId) {

        try {

            const eventTime =
                Math.floor(
                    Date.now() / 1000
                );


            const fbp =
                getMetaFbp();


            const fbc =
                getMetaFbc();


            const userData = {};


            /* =============================================
               Meta Browser ID
            ============================================= */

            if (fbp) {

                userData.fbp =
                    fbp;

            }


            /* =============================================
               Meta Click ID
            ============================================= */

            if (fbc) {

                userData.fbc =
                    fbc;

            }


            const capiEvent = {

                data: [

                    {

                        event_name:
                            "Contact",

                        event_time:
                            eventTime,

                        event_id:
                            eventId,

                        action_source:
                            "website",

                        event_source_url:
                            window.location.href,

                        user_data:
                            userData,

                        custom_data: {

                            content_name:
                                "WhatsApp Contact",

                            content_category:
                                "agarwood",

                            contact_method:
                                "WhatsApp"

                        }

                    }

                ]

            };


            fetch(
                META_CAPI_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            capiEvent
                        ),

                    keepalive:
                        true

                }
            )
            .then(
                async function (response) {

                    const text =
                        await response.text();


                    console.log(
                        "Meta CAPI:",
                        response.status,
                        text
                    );

                }
            )
            .catch(
                function (error) {

                    console.error(
                        "Meta CAPI Error:",
                        error
                    );

                }
            );


        } catch (error) {

            console.error(
                "Meta CAPI处理错误:",
                error
            );

        }

    }


    /* =====================================================
       TikTok Click ID
    ===================================================== */

    function getTikTokClickId() {

        try {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            return (
                params.get("ttclid") ||
                ""
            );

        } catch (error) {

            return "";

        }

    }


    /* =====================================================
       TikTok Contact

       只有成功获取客服号码后才调用
    ===================================================== */

    function trackTikTokContact(eventId) {

        try {

            const ttclid =
                getTikTokClickId();


            const ttp =
                getCookie("_ttp");


            const pageUrl =
                window.location.href;


            const eventTime =
                Math.floor(
                    Date.now() / 1000
                );


            const pixelProperties = {

                contact_method:
                    "WhatsApp",

                content_name:
                    "WhatsApp Contact",

                content_category:
                    "agarwood",

                event_id:
                    eventId

            };


            /* =============================================
               TikTok Pixel
            ============================================= */

            try {

                if (
                    typeof window.ttq !== "undefined" &&
                    typeof window.ttq.track === "function"
                ) {

                    window.ttq.track(
                        "Contact",
                        pixelProperties
                    );


                    console.log(
                        "✅ TikTok Pixel Contact:",
                        eventId
                    );

                } else {

                    console.warn(
                        "TikTok Pixel 尚未加载"
                    );

                }

            } catch (error) {

                console.error(
                    "TikTok Pixel Contact Error:",
                    error
                );

            }


            /* =============================================
               TikTok Events API
            ============================================= */

            const serverEvent = {

                event:
                    "Contact",

                event_time:
                    eventTime,

                event_id:
                    eventId,

                user: {},

                page: {

                    url:
                        pageUrl

                },

                properties: {

                    contact_method:
                        "WhatsApp",

                    content_name:
                        "WhatsApp Contact",

                    content_category:
                        "agarwood"

                }

            };


            if (ttclid) {

                serverEvent.user.ttclid =
                    ttclid;

            }


            if (ttp) {

                serverEvent.user.ttp =
                    ttp;

            }


            fetch(
                TIKTOK_EVENTS_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            serverEvent
                        ),

                    keepalive:
                        true

                }
            )
            .then(
                async function (response) {

                    const text =
                        await response.text();


                    console.log(
                        "TikTok Events API:",
                        response.status,
                        text
                    );

                }
            )
            .catch(
                function (error) {

                    console.error(
                        "TikTok Events API Error:",
                        error
                    );

                }
            );


        } catch (error) {

            console.error(
                "TikTok Events API Error:",
                error
            );

        }

    }


    /* =====================================================
       手机端导航
    ===================================================== */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const mainNav =
        document.getElementById(
            "mainNav"
        );


    function closeMenu() {

        if (
            !menuToggle ||
            !mainNav
        ) {

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


    if (
        menuToggle &&
        mainNav
    ) {

        menuToggle.addEventListener(
            "click",
            function (event) {

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
                    isOpen
                        ? "true"
                        : "false"
                );

            }
        );


        mainNav
            .querySelectorAll("a")
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            closeMenu();

                        }
                    );

                }
            );


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
    ===================================================== */

    function initSlider(config) {

        const slider =
            document.querySelector(
                config.slider
            );


        if (!slider) {

            return;

        }


        const track =
            slider.querySelector(
                config.track
            );


        if (!track) {

            return;

        }


        const slides =
            Array.from(
                track.querySelectorAll(
                    config.slide
                )
            );


        const prev =
            slider.querySelector(
                config.prev
            );


        const next =
            slider.querySelector(
                config.next
            );


        const dotsContainer =
            document.querySelector(
                config.dots
            );


        const dots =
            dotsContainer
                ? Array.from(
                    dotsContainer.querySelectorAll(
                        config.dot
                    )
                )
                : [];


        if (
            slides.length === 0
        ) {

            return;

        }


        slides.forEach(
            function (slide) {

                const img =
                    slide.querySelector(
                        "img"
                    );


                if (!img) {

                    return;

                }


                img.loading =
                    "eager";


                img.decoding =
                    "async";


                if (
                    img.dataset &&
                    img.dataset.src &&
                    (
                        !img.getAttribute("src") ||
                        img.getAttribute("src") === ""
                    )
                ) {

                    img.src =
                        img.dataset.src;

                }

            }
        );


        if (
            slides.length === 1
        ) {

            track.style.transition =
                "none";


            track.style.transform =
                "translate3d(0,0,0)";


            if (prev) {

                prev.style.display =
                    "none";

            }


            if (next) {

                next.style.display =
                    "none";

            }


            dots.forEach(
                function (dot) {

                    dot.style.display =
                        "none";

                }
            );


            return;

        }


        const firstClone =
            slides[0].cloneNode(true);


        const lastClone =
            slides[
                slides.length - 1
            ].cloneNode(true);


        firstClone.classList.add(
            "slider-clone"
        );


        lastClone.classList.add(
            "slider-clone"
        );


        [
            firstClone,
            lastClone
        ].forEach(
            function (clone) {

                const img =
                    clone.querySelector(
                        "img"
                    );


                if (img) {

                    img.loading =
                        "eager";

                    img.decoding =
                        "async";

                }

            }
        );


        track.insertBefore(
            lastClone,
            track.firstChild
        );


        track.appendChild(
            firstClone
        );


        const total =
            slides.length;


        let current =
            1;


        let isMoving =
            false;


        function updateDots() {

            let realIndex =
                current - 1;


            if (
                realIndex < 0
            ) {

                realIndex =
                    total - 1;

            }


            if (
                realIndex >= total
            ) {

                realIndex =
                    0;

            }


            dots.forEach(
                function (
                    dot,
                    index
                ) {

                    dot.classList.toggle(
                        "active",
                        index === realIndex
                    );

                }
            );

        }


        function setPosition(
            animated
        ) {

            track.style.transition =
                animated
                    ? "transform 0.45s ease"
                    : "none";


            track.style.transform =
                "translate3d(-" +
                (
                    current * 100
                ) +
                "%,0,0)";


            updateDots();

        }


        function move(
            direction
        ) {

            if (isMoving) {

                return;

            }


            isMoving =
                true;


            current +=
                direction;


            setPosition(
                true
            );

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


                if (
                    current ===
                    total + 1
                ) {

                    current =
                        1;


                    setPosition(
                        false
                    );

                }

                else if (
                    current === 0
                ) {

                    current =
                        total;


                    setPosition(
                        false
                    );

                }


                isMoving =
                    false;

            }
        );


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


        dots.forEach(
            function (
                dot,
                index
            ) {

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


                        isMoving =
                            true;


                        setPosition(
                            true
                        );

                    }
                );

            }
        );


        let startX =
            0;

        let startY =
            0;

        let isTouching =
            false;


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


                isTouching =
                    true;

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


                isTouching =
                    false;


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
                    endX -
                    startX;


                const deltaY =
                    endY -
                    startY;


                if (
                    Math.abs(deltaX) < 40 ||
                    Math.abs(deltaX) <= Math.abs(deltaY)
                ) {

                    return;

                }


                if (
                    deltaX < 0
                ) {

                    move(1);

                } else {

                    move(-1);

                }

            },
            {
                passive: true
            }
        );


        setPosition(
            false
        );

    }


    /* =====================================================
       沉香树轮播
    ===================================================== */

    initSlider({

        slider:
            ".tree-slider",

        track:
            ".tree-track",

        slide:
            ".tree-slide",

        prev:
            ".slider-prev",

        next:
            ".slider-next",

        dots:
            ".slider-dots",

        dot:
            ".slider-dot"

    });


    /* =====================================================
       客户评价轮播
    ===================================================== */

    initSlider({

        slider:
            ".review-slider",

        track:
            ".review-track",

        slide:
            ".review-slide",

        prev:
            ".review-prev",

        next:
            ".review-next",

        dots:
            ".review-dots",

        dot:
            ".review-dot"

    });


    /* =====================================================
       图片 Lightbox
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

        const imageGroups =
            [];


        const treeImages =
            Array.from(
                document.querySelectorAll(
                    ".tree-slide:not(.slider-clone) img"
                )
            );


        if (
            treeImages.length > 0
        ) {

            imageGroups.push({

                name:
                    "trees",

                images:
                    treeImages

            });

        }


        const productImages =
            Array.from(
                document.querySelectorAll(
                    ".product-image img"
                )
            );


        if (
            productImages.length > 0
        ) {

            imageGroups.push({

                name:
                    "products",

                images:
                    productImages

            });

        }


        const reviewImages =
            Array.from(
                document.querySelectorAll(
                    ".review-slide:not(.slider-clone) img"
                )
            );


        if (
            reviewImages.length > 0
        ) {

            imageGroups.push({

                name:
                    "reviews",

                images:
                    reviewImages

            });

        }


        const shippingImages =
            Array.from(
                document.querySelectorAll(
                    ".shipping-promotion-image img"
                )
            );


        if (
            shippingImages.length > 0
        ) {

            imageGroups.push({

                name:
                    "shipping",

                images:
                    shippingImages

            });

        }


        let currentGroup =
            null;


        let currentImageIndex =
            0;


        function findImageGroup(
            image
        ) {

            for (
                let groupIndex = 0;
                groupIndex < imageGroups.length;
                groupIndex++
            ) {

                const group =
                    imageGroups[groupIndex];


                const imageIndex =
                    group.images.indexOf(
                        image
                    );


                if (
                    imageIndex !== -1
                ) {

                    return {

                        group:
                            group,

                        index:
                            imageIndex

                    };

                }

            }


            return null;

        }


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


            const showNavigation =
                currentGroup.images.length > 1;


            if (lightboxPrev) {

                lightboxPrev.style.display =
                    showNavigation
                        ? "flex"
                        : "none";

            }


            if (lightboxNext) {

                lightboxNext.style.display =
                    showNavigation
                        ? "flex"
                        : "none";

            }

        }


        function openLightbox(
            image
        ) {

            const result =
                findImageGroup(
                    image
                );


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

                        lightboxImage.src =
                            "";

                    }

                },
                200
            );

        }


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

                currentImageIndex =
                    0;

            }


            updateLightboxImage();

        }


        imageGroups.forEach(
            function (group) {

                group.images.forEach(
                    function (image) {

                        image.addEventListener(
                            "click",
                            function (event) {

                                event.preventDefault();

                                event.stopPropagation();

                                openLightbox(
                                    image
                                );

                            }
                        );

                    }
                );

            }
        );


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


        let lightboxStartX =
            0;

        let lightboxStartY =
            0;

        let lightboxTouching =
            false;


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


                lightboxTouching =
                    true;

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
                    event.changedTouches.length !== 1
                ) {

                    return;

                }


                const endX =
                    event.changedTouches[0].clientX;


                const endY =
                    event.changedTouches[0].clientY;


                const deltaX =
                    endX -
                    lightboxStartX;


                const deltaY =
                    endY -
                    lightboxStartY;


                if (
                    Math.abs(deltaX) < 50 ||
                    Math.abs(deltaX) <= Math.abs(deltaY)
                ) {

                    return;

                }


                if (
                    deltaX < 0
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

                    showPreviousImage();

                }


                if (
                    event.key === "ArrowRight"
                ) {

                    showNextImage();

                }

            }
        );

    }


    /* =====================================================
       Supabase 获取在线 WhatsApp 客服
    ===================================================== */

    async function getNextWhatsAppNumber() {

        try {

            const response =
                await fetch(

                    SUPABASE_URL +
                    "/rest/v1/rpc/get_next_whatsapp",

                    {

                        method:
                            "POST",

                        headers: {

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                "Bearer " +
                                SUPABASE_KEY,

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            "{}"

                    }

                );


            if (!response.ok) {

                const errorText =
                    await response.text();


                console.error(
                    "Supabase客服轮询失败:",
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
                "Supabase返回客服:",
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
                "获取客服号码失败:",
                error
            );


            return null;

        }

    }


    /* =====================================================
       WhatsApp 核心功能

       重要：

       只有成功获取在线客服号码，
       并且电话号码有效以后，

       才发送：

       Meta Pixel Contact
       Meta CAPI Contact
       TikTok Pixel Contact
       TikTok Events API Contact
    ===================================================== */

    async function openWhatsApp() {

        console.log(
            "开始获取在线 WhatsApp 客服..."
        );


        /* =================================================
           第一步：
           先获取在线客服
        ================================================= */

        const customerService =
            await getNextWhatsAppNumber();


        /* =================================================
           如果没有在线客服
           
           这里直接结束

           不发送任何 Contact
        ================================================= */

        if (!customerService) {

            console.warn(
                "❌ 没有获取到在线客服，不发送 Contact"
            );


            alert(
                "客服暂时无法接通，请稍后再试。"
            );


            return;

        }


        /* =================================================
           第二步：
           清理电话号码
        ================================================= */

        const phone =
            String(
                customerService.phone ||
                ""
            )
            .replace(
                /\D/g,
                ""
            );


        /* =================================================
           电话号码无效

           同样不发送 Contact
        ================================================= */

        if (!phone) {

            console.error(
                "❌ 客服号码无效，不发送 Contact"
            );


            alert(
                "客服号码配置错误，请联系客服。"
            );


            return;

        }


        console.log(
            "✅ 成功获取在线客服:",
            customerService.name || "",
            phone
        );


        /* =================================================
           第三步：
           到这里才算真正获得有效客服

           现在生成 Event ID
        ================================================= */

        const metaEventId =
            generateEventId(
                "meta_contact"
            );


        /* =================================================
           第四步：
           Meta Pixel Contact
        ================================================= */

        trackMetaPixelContact(
            metaEventId
        );


        /* =================================================
           第五步：
           Meta CAPI Contact
        ================================================= */

        trackMetaCAPIContact(
            metaEventId
        );


        /* =================================================
           第六步：
           TikTok Contact

           使用独立 Event ID
        ================================================= */

        const tiktokEventId =
            generateEventId(
                "tiktok_contact"
            );


        trackTikTokContact(
            tiktokEventId
        );


        /* =================================================
           第七步：
           WhatsApp URL
        ================================================= */

        const whatsappUrl =
            "https://wa.me/" +
            phone;


        console.log(
            "正在打开在线客服:",
            customerService.name || "",
            phone
        );


        /* =================================================
           第八步：
           跳转 WhatsApp
        ================================================= */

        window.location.href =
            whatsappUrl;

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
                target.getAttribute(
                    "href"
                );


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
                )
                .toLowerCase();


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
       提供给 HTML onclick 使用
    ===================================================== */

    window.openWhatsApp =
        openWhatsApp;


    /* =====================================================
       初始化完成
    ===================================================== */

    console.log(
        "网站脚本加载完成"
    );


    console.log(
        "Meta Pixel ID:",
        META_PIXEL_ID
    );


    console.log(
        "Meta CAPI:",
        META_CAPI_URL
    );


    console.log(
        "TikTok Pixel ID:",
        TIKTOK_PIXEL_ID
    );


});