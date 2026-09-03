/* =========================================================
   CONFIG
========================================================= */

const META_PIXEL_ID =
    "882833290918835";

const META_CAPI_URL =
    "https://meta-capi.717560552.workers.dev/";

const TIKTOK_PIXEL_ID =
    "DA4P6OBC77UES973S3SG";

const TIKTOK_EVENTS_API_URL =
    "https://tiktok-events-api.717560552.workers.dev/";

const SUPABASE_URL =
    "https://tvythmezaecdtqlqtwnh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_SMgtLo5Zh15EWzVgTKoKHg_ci8lOFp6";

const SUPABASE_RPC =
    "/rest/v1/rpc/get_next_whatsapp";


/* =========================================================
   EVENT ID
========================================================= */

function generateEventId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );

}


/* =========================================================
   COOKIE
========================================================= */

function getCookie(name) {

    const match = document.cookie.match(
        new RegExp(
            "(^|;\\s*)" +
            name +
            "=([^;]+)"
        )
    );

    return match
        ? decodeURIComponent(match[2])
        : null;

}


/* =========================================================
   URL PARAMS
========================================================= */

function getUrlParams() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const result = {};

    params.forEach(
        (value, key) => {

            result[key] = value;

        }
    );

    return result;

}


/* =========================================================
   META PIXEL
========================================================= */

function sendMetaBrowserContact(eventId) {

    try {

        if (
            typeof window.fbq === "function"
        ) {

            window.fbq(
                "track",
                "Contact",
                {},
                {
                    eventID: eventId
                }
            );

            console.log(
                "Meta Contact:",
                eventId
            );

        } else {

            console.warn(
                "Meta Pixel fbq not available"
            );

        }

    } catch (error) {

        console.error(
            "Meta browser event error:",
            error
        );

    }

}


/* =========================================================
   META CAPI
========================================================= */

function sendMetaCAPIContact(eventId) {

    try {

        const payload = {

            event_name:
                "Contact",

            event_id:
                eventId,

            event_source_url:
                window.location.href,

            action_source:
                "website",

            fbp:
                getCookie("_fbp"),

            fbc:
                getCookie("_fbc"),

            external_id:
                eventId,

            url_params:
                getUrlParams()

        };


        fetch(
            META_CAPI_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(payload),

                keepalive: true

            }
        )
        .then(
            () => {

                console.log(
                    "Meta CAPI sent"
                );

            }
        )
        .catch(
            error => {

                console.error(
                    "Meta CAPI error:",
                    error
                );

            }
        );

    } catch (error) {

        console.error(
            "Meta CAPI error:",
            error
        );

    }

}


/* =========================================================
   TIKTOK PIXEL
========================================================= */

function sendTikTokBrowserContact() {

    try {

        if (
            window.ttq &&
            typeof window.ttq.track === "function"
        ) {

            window.ttq.track(
                "Contact"
            );

            console.log(
                "TikTok Contact sent"
            );

        } else {

            console.warn(
                "TikTok Pixel ttq not available"
            );

        }

    } catch (error) {

        console.error(
            "TikTok browser event error:",
            error
        );

    }

}


/* =========================================================
   TIKTOK EVENTS API
========================================================= */

function sendTikTokEventsAPIContact(eventId) {

    try {

        const params =
            getUrlParams();


        const payload = {

            event_name:
                "Contact",

            event_id:
                eventId,

            event_source_url:
                window.location.href,

            pixel_code:
                TIKTOK_PIXEL_ID,

            url_params:
                params,

            ttclid:
                params.ttclid || null,

            external_id:
                eventId

        };


        fetch(
            TIKTOK_EVENTS_API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(payload),

                keepalive: true

            }
        )
        .then(
            () => {

                console.log(
                    "TikTok Events API sent"
                );

            }
        )
        .catch(
            error => {

                console.error(
                    "TikTok Events API error:",
                    error
                );

            }
        );

    } catch (error) {

        console.error(
            "TikTok Events API error:",
            error
        );

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initMobileMenu() {

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const mainNav =
        document.getElementById(
            "mainNav"
        );


    if (
        !menuToggle ||
        !mainNav
    ) {

        console.warn(
            "Mobile menu elements not found"
        );

        return;

    }


    if (
        menuToggle.dataset.initialized ===
        "true"
    ) {

        return;

    }


    menuToggle.dataset.initialized =
        "true";


    menuToggle.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                mainNav.classList.toggle(
                    "mobile-open"
                );


            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );


    const navLinks =
        mainNav.querySelectorAll(
            "a"
        );


    navLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                function() {

                    mainNav.classList.remove(
                        "mobile-open"
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );


    document.addEventListener(
        "click",
        function(event) {

            if (
                !mainNav.contains(
                    event.target
                ) &&
                !menuToggle.contains(
                    event.target
                )
            ) {

                mainNav.classList.remove(
                    "mobile-open"
                );

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   NORMALIZE PHONE
========================================================= */

function normalizePhone(phone) {

    if (!phone) {

        return "";

    }


    let normalized =
        String(phone)
            .trim()
            .replace(
                /[^0-9+]/g,
                ""
            );


    /*
     * +974...
     * ↓
     * 974...
     */

    normalized =
        normalized.replace(
            /^\+/,
            ""
        );


    /*
     * 00974...
     * ↓
     * 974...
     */

    normalized =
        normalized.replace(
            /^00/,
            ""
        );


    return normalized;

}


/* =========================================================
   GET NEXT WHATSAPP NUMBER
========================================================= */

async function getNextWhatsAppNumber() {

    try {

        const response =
            await fetch(
                SUPABASE_URL +
                SUPABASE_RPC,
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_KEY

                    },

                    body:
                        JSON.stringify({})

                }
            );


        if (
            !response.ok
        ) {

            const errorText =
                await response.text();

            console.error(
                "Supabase error:",
                response.status,
                errorText
            );

            return null;

        }


        const data =
            await response.json();


        console.log(
            "Supabase result:",
            data
        );


        if (
            Array.isArray(data)
        ) {

            return data[0] || null;

        }


        return data || null;

    } catch (error) {

        console.error(
            "Supabase WhatsApp error:",
            error
        );

        return null;

    }

}


/* =========================================================
   SEND ALL CONVERSION EVENTS
========================================================= */

function sendWhatsAppConversionEvents() {

    const eventId =
        generateEventId();


    /*
     * Meta Browser
     */

    sendMetaBrowserContact(
        eventId
    );


    /*
     * Meta CAPI
     */

    sendMetaCAPIContact(
        eventId
    );


    /*
     * TikTok Browser
     */

    sendTikTokBrowserContact();


    /*
     * TikTok Events API
     */

    sendTikTokEventsAPIContact(
        eventId
    );


    console.log(
        "Conversion event ID:",
        eventId
    );

}


/* =========================================================
   OPEN WHATSAPP
========================================================= */

async function openWhatsApp(event) {

    /*
     * -----------------------------------------------------
     * 1. 阻止默认行为
     * -----------------------------------------------------
     */

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    /*
     * -----------------------------------------------------
     * 2. 用户点击的同步阶段立即打开窗口
     * -----------------------------------------------------
     */

    let whatsappWindow = null;


    try {

        whatsappWindow =
            window.open(
                "about:blank",
                "_blank"
            );

    } catch (error) {

        console.warn(
            "Could not open WhatsApp window:",
            error
        );

    }


    /*
     * -----------------------------------------------------
     * 3. 获取在线客服
     * -----------------------------------------------------
     */

    const number =
        await getNextWhatsAppNumber();


    /*
     * -----------------------------------------------------
     * 4. 没有客服
     * -----------------------------------------------------
     */

    if (!number) {

        if (
            whatsappWindow &&
            !whatsappWindow.closed
        ) {

            try {

                whatsappWindow.close();

            } catch (error) {

                console.warn(
                    "Could not close blank window:",
                    error
                );

            }

        }


        alert(
            "عذراً، لا يتوفر موظف خدمة عملاء حالياً. يرجى المحاولة مرة أخرى لاحقاً."
        );

        return;

    }


    /*
     * -----------------------------------------------------
     * 5. 获取电话号码
     * -----------------------------------------------------
     */

    const phone =
        normalizePhone(
            number.phone ||
            number.whatsapp ||
            number.number ||
            number.mobile ||
            number.mobile_number
        );


    console.log(
        "Selected WhatsApp number:",
        phone
    );


    /*
     * -----------------------------------------------------
     * 6. 检查电话号码
     * -----------------------------------------------------
     */

    if (!phone) {

        console.error(
            "Invalid WhatsApp number:",
            number
        );


        if (
            whatsappWindow &&
            !whatsappWindow.closed
        ) {

            try {

                whatsappWindow.close();

            } catch (error) {

                console.warn(
                    "Could not close window:",
                    error
                );

            }

        }


        alert(
            "عذراً، حدث خطأ في رقم WhatsApp. يرجى المحاولة مرة أخرى."
        );

        return;

    }


    /*
     * -----------------------------------------------------
     * 7. 广告转化
     * -----------------------------------------------------
     */

    sendWhatsAppConversionEvents();


    /*
     * -----------------------------------------------------
     * 8. WhatsApp 消息
     * -----------------------------------------------------
     */

    const message =
        encodeURIComponent(
            "السلام عليكم، أريد معرفة تفاصيل العود الطبيعي والأسعار."
        );


    /*
     * -----------------------------------------------------
     * 9. WhatsApp URL
     * -----------------------------------------------------
     */

    const whatsappUrl =
        "https://wa.me/" +
        phone +
        "?text=" +
        message;


    console.log(
        "WhatsApp URL:",
        whatsappUrl
    );


    /*
     * -----------------------------------------------------
     * 10. 优先使用已经创建的窗口
     * -----------------------------------------------------
     */

    if (
        whatsappWindow &&
        !whatsappWindow.closed
    ) {

        try {

            whatsappWindow.location.href =
                whatsappUrl;


            try {

                whatsappWindow.focus();

            } catch (error) {

                console.warn(
                    "Could not focus window:",
                    error
                );

            }


            return;

        } catch (error) {

            console.warn(
                "Popup navigation failed:",
                error
            );

        }

    }


    /*
     * -----------------------------------------------------
     * 11. 如果浏览器阻止新窗口
     *     使用当前页面跳转
     * -----------------------------------------------------
     */

    try {

        window.location.assign(
            whatsappUrl
        );

    } catch (error) {

        console.error(
            "WhatsApp redirect failed:",
            error
        );

        try {

            window.location.href =
                whatsappUrl;

        } catch (finalError) {

            console.error(
                "Final WhatsApp redirect failed:",
                finalError
            );

        }

    }

}


/* =========================================================
   WHATSAPP BUTTONS
========================================================= */

function initWhatsAppLinks() {

    /*
     * 这里不再只依赖按钮文字。
     *
     * 直接识别你当前 HTML 中的所有 WhatsApp CTA。
     */

    const whatsappElements =
        document.querySelectorAll(
            [
                ".nav-whatsapp",
                ".header-button",
                ".hero-whatsapp-button",
                ".secondary-cta",
                ".shipping-button",
                ".whatsapp-button",
                'a[href*="wa.me"]',
                'a[href*="whatsapp.com"]'
            ].join(",")
        );


    console.log(
        "WhatsApp buttons found:",
        whatsappElements.length
    );


    whatsappElements.forEach(
        element => {

            /*
             * 防止重复绑定
             */

            if (
                element.dataset.whatsappInitialized ===
                "true"
            ) {

                return;

            }


            element.dataset.whatsappInitialized =
                "true";


            /*
             * 不修改 href。
             *
             * 只在点击时阻止默认行为，
             * 然后交给 openWhatsApp。
             */

            element.addEventListener(
                "click",
                openWhatsApp,
                false
            );

        }
    );

}


/* =========================================================
   NORMAL NAVIGATION
========================================================= */

function initNavigation() {

    const navigationLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    console.log(
        "Navigation links found:",
        navigationLinks.length
    );


    navigationLinks.forEach(
        link => {

            /*
             * WhatsApp 按钮交给 WhatsApp 处理。
             */

            if (
                link.dataset.whatsappInitialized ===
                "true"
            ) {

                return;

            }


            const href =
                link.getAttribute(
                    "href"
                );


            /*
             * 单独的 # 不进行导航。
             */

            if (
                !href ||
                href === "#" ||
                href === "#!"
            ) {

                return;

            }


            let target = null;


            try {

                target =
                    document.querySelector(
                        href
                    );

            } catch (error) {

                console.warn(
                    "Invalid navigation selector:",
                    href
                );

                return;

            }


            if (!target) {

                console.warn(
                    "Navigation target not found:",
                    href
                );

                return;

            }


            link.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();


                    const header =
                        document.querySelector(
                            ".header"
                        );


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.pageYOffset -
                        headerHeight;


                    window.scrollTo(
                        {
                            top:
                                Math.max(
                                    0,
                                    targetPosition
                                ),

                            behavior:
                                "smooth"
                        }
                    );


                    /*
                     * 移动端点击导航后关闭菜单
                     */

                    const mainNav =
                        document.getElementById(
                            "mainNav"
                        );

                    const menuToggle =
                        document.getElementById(
                            "menuToggle"
                        );


                    if (mainNav) {

                        mainNav.classList.remove(
                            "mobile-open"
                        );

                    }


                    if (menuToggle) {

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                },
                false
            );

        }
    );

}


/* =========================================================
   IMAGE LIGHTBOX
========================================================= */

function initLightbox() {

    const lightbox =
        document.getElementById(
            "imageLightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    const closeButton =
        document.getElementById(
            "lightboxClose"
        );

    const prevButton =
        document.getElementById(
            "lightboxPrev"
        );

    const nextButton =
        document.getElementById(
            "lightboxNext"
        );


    if (
        !lightbox ||
        !lightboxImage
    ) {

        return;

    }


    const images =
        Array.from(
            document.querySelectorAll(
                ".selection-image img, " +
                ".product-image img, " +
                ".shipping-promotion-image img, " +
                'img[data-lightbox="true"]'
            )
        );


    if (!images.length) {

        return;

    }


    let currentIndex = 0;


    function showImage(index) {

        currentIndex =
            (
                index +
                images.length
            ) %
            images.length;


        const image =
            images[currentIndex];


        lightboxImage.src =
            image.currentSrc ||
            image.src;


        lightboxImage.alt =
            image.alt || "";


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


    function showNext() {

        showImage(
            currentIndex + 1
        );

    }


    function showPrevious() {

        showImage(
            currentIndex - 1
        );

    }


    images.forEach(
        (image, index) => {

            image.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    showImage(index);

                }
            );

        }
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                closeLightbox();

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                showNext();

            }
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                showPrevious();

            }
        );

    }


    lightbox.addEventListener(
        "click",
        function(event) {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event) {

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

                showPrevious();

            }


            if (
                event.key === "ArrowRight"
            ) {

                showNext();

            }

        }
    );


    let touchStartX = 0;


    lightbox.addEventListener(
        "touchstart",
        function(event) {

            if (
                event.changedTouches &&
                event.changedTouches.length
            ) {

                touchStartX =
                    event.changedTouches[0].clientX;

            }

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        function(event) {

            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {

                return;

            }


            const touchEndX =
                event.changedTouches[0].clientX;


            const difference =
                touchEndX -
                touchStartX;


            if (
                Math.abs(difference) < 50
            ) {

                return;

            }


            if (
                difference > 0
            ) {

                showPrevious();

            } else {

                showNext();

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   VIDEOS
========================================================= */

function initVideos() {

    const videos =
        document.querySelectorAll(
            "video"
        );


    videos.forEach(
        video => {

            video.playsInline =
                true;

            video.setAttribute(
                "playsinline",
                ""
            );

        }
    );

}


/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

function initializeWebsite() {

    console.log(
        "================================="
    );

    console.log(
        "Website JS initializing..."
    );

    console.log(
        "================================="
    );


    try {

        initMobileMenu();

    } catch (error) {

        console.error(
            "Mobile menu error:",
            error
        );

    }


    try {

        initWhatsAppLinks();

    } catch (error) {

        console.error(
            "WhatsApp initialization error:",
            error
        );

    }


    try {

        initNavigation();

    } catch (error) {

        console.error(
            "Navigation initialization error:",
            error
        );

    }


    try {

        initLightbox();

    } catch (error) {

        console.error(
            "Lightbox initialization error:",
            error
        );

    }


    try {

        initVideos();

    } catch (error) {

        console.error(
            "Video initialization error:",
            error
        );

    }


    console.log(
        "Website JS initialized successfully."
    );

}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWebsite
    );

} else {

    initializeWebsite();

}


/* =========================================================
   GLOBAL
========================================================= */

window.openWhatsApp =
    openWhatsApp;