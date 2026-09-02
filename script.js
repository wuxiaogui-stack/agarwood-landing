/* =========================================================
   CONFIG
========================================================= */

const META_PIXEL_ID = "882833290918835";

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
        "wa_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 12)
    );

}


/* =========================================================
   COOKIE
========================================================= */

function getCookie(name) {

    const match =
        document.cookie.match(
            new RegExp(
                "(^| )" +
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

    return {

        fbclid:
            params.get("fbclid"),

        ttclid:
            params.get("ttclid"),

        gclid:
            params.get("gclid")

    };

}


/* =========================================================
   META CONTACT
========================================================= */

function sendMetaContact(eventId) {

    try {

        if (
            typeof window.fbq ===
            "function"
        ) {

            window.fbq(
                "track",
                "Contact",
                {},
                {
                    eventID: eventId
                }
            );

        }

    } catch (error) {

        console.warn(
            "Meta browser event error:",
            error
        );

    }

}


/* =========================================================
   META CAPI
========================================================= */

async function sendMetaCAPI(eventId) {

    try {

        const params =
            getUrlParams();

        const payload = {

            event_name: "Contact",

            event_id: eventId,

            event_source_url:
                window.location.href,

            action_source: "website",

            fbclid:
                params.fbclid,

            fbp:
                getCookie("_fbp"),

            fbc:
                getCookie("_fbc")

        };


        await fetch(
            META_CAPI_URL,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        payload
                    ),

                keepalive: true

            }
        );

    } catch (error) {

        console.warn(
            "Meta CAPI error:",
            error
        );

    }

}


/* =========================================================
   TIKTOK CONTACT
========================================================= */

function sendTikTokContact() {

    try {

        if (
            window.ttq &&
            typeof window.ttq.track ===
                "function"
        ) {

            window.ttq.track(
                "Contact"
            );

        }

    } catch (error) {

        console.warn(
            "TikTok browser event error:",
            error
        );

    }

}


/* =========================================================
   TIKTOK EVENTS API
========================================================= */

async function sendTikTokEventsAPI(eventId) {

    try {

        const params =
            getUrlParams();

        const payload = {

            event_name: "Contact",

            event_id: eventId,

            event_source_url:
                window.location.href,

            ttclid:
                params.ttclid,

            user_agent:
                navigator.userAgent

        };


        await fetch(
            TIKTOK_EVENTS_API_URL,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        payload
                    ),

                keepalive: true

            }
        );

    } catch (error) {

        console.warn(
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

        return;

    }


    menuToggle.addEventListener(
        "click",
        function () {

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
        function (link) {

            link.addEventListener(
                "click",
                function () {

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

}


/* =========================================================
   REVIEW SLIDER
========================================================= */

function initReviewSlider() {

    const slider =
        document.querySelector(
            ".review-slider"
        );

    const track =
        document.querySelector(
            ".review-track"
        );

    const slides =
        document.querySelectorAll(
            ".review-slide"
        );

    const prevButton =
        document.querySelector(
            ".review-prev"
        );

    const nextButton =
        document.querySelector(
            ".review-next"
        );

    const dots =
        document.querySelectorAll(
            ".review-dot"
        );


    if (
        !slider ||
        !track ||
        slides.length === 0
    ) {

        return;

    }


    let currentIndex = 0;

    const totalSlides =
        slides.length;


    function updateSlider() {

        track.style.transform =
            "translateX(-" +
            (currentIndex * 100) +
            "%)";


        dots.forEach(
            function (dot, index) {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            }
        );

    }


    function nextSlide() {

        currentIndex =
            (currentIndex + 1) %
            totalSlides;

        updateSlider();

    }


    function previousSlide() {

        currentIndex =
            (currentIndex - 1 +
                totalSlides) %
            totalSlides;

        updateSlider();

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextSlide
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            previousSlide
        );

    }


    dots.forEach(
        function (dot, index) {

            dot.addEventListener(
                "click",
                function () {

                    currentIndex =
                        index;

                    updateSlider();

                }
            );

        }
    );


    let touchStartX = 0;

    let touchEndX = 0;


    slider.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    slider.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0]
                    .screenX;


            const distance =
                touchStartX -
                touchEndX;


            if (
                Math.abs(distance) < 50
            ) {

                return;

            }


            if (distance > 0) {

                nextSlide();

            } else {

                previousSlide();

            }

        },
        {
            passive: true
        }
    );


    updateSlider();

}


/* =========================================================
   LIGHTBOX
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


    const imageSelectors = [

        ".selection-image img",

        ".product-image img",

        ".review-slide:not(.slider-clone) img",

        ".shipping-promotion-image img",

        'img[data-lightbox="true"]'

    ];


    const images = [];


    imageSelectors.forEach(
        function (selector) {

            const elements =
                document.querySelectorAll(
                    selector
                );


            elements.forEach(
                function (img) {

                    if (
                        !images.includes(img)
                    ) {

                        images.push(img);

                    }

                }
            );

        }
    );


    if (images.length === 0) {

        return;

    }


    let currentIndex = 0;


    function showImage(index) {

        if (
            index < 0
        ) {

            index =
                images.length - 1;

        }


        if (
            index >= images.length
        ) {

            index = 0;

        }


        currentIndex = index;


        const image =
            images[currentIndex];


        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt || "عرض الصورة";


        lightbox.classList.add(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        if (
            prevButton
        ) {

            prevButton.style.display =
                images.length > 1
                    ? "flex"
                    : "none";

        }


        if (
            nextButton
        ) {

            nextButton.style.display =
                images.length > 1
                    ? "flex"
                    : "none";

        }

    }


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        lightboxImage.src = "";

        document.body.style.overflow =
            "";

    }


    images.forEach(
        function (img, index) {

            img.addEventListener(
                "click",
                function () {

                    showImage(index);

                }
            );

        }
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                showImage(
                    currentIndex - 1
                );

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                showImage(
                    currentIndex + 1
                );

            }
        );

    }


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
                event.key === "ArrowRight"
            ) {

                showImage(
                    currentIndex - 1
                );

            }


            if (
                event.key === "ArrowLeft"
            ) {

                showImage(
                    currentIndex + 1
                );

            }

        }
    );


    let touchStartX = 0;


    lightbox.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        function (event) {

            const touchEndX =
                event.changedTouches[0]
                    .screenX;

            const distance =
                touchStartX -
                touchEndX;


            if (
                Math.abs(distance) < 50
            ) {

                return;

            }


            if (distance > 0) {

                showImage(
                    currentIndex + 1
                );

            } else {

                showImage(
                    currentIndex - 1
                );

            }

        },
        {
            passive: true
        }
    );

}


/* =========================================================
   VIDEO
========================================================= */

function initVideos() {

    const videos =
        document.querySelectorAll(
            "video"
        );


    videos.forEach(
        function (video) {

            video.playsInline = true;

            /*
             * 不强制播放，
             * 避免移动端浏览器拦截。
             */

        }
    );

}


/* =========================================================
   GET ONLINE WHATSAPP
========================================================= */

async function getNextWhatsAppNumber() {

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


    if (!response.ok) {

        throw new Error(
            "Supabase request failed: " +
            response.status
        );

    }


    const data =
        await response.json();


    let number = null;


    if (
        Array.isArray(data)
    ) {

        number =
            data[0];

    } else {

        number =
            data;

    }


    if (!number) {

        throw new Error(
            "No WhatsApp number returned"
        );

    }


    return number;

}


/* =========================================================
   NORMALIZE PHONE
========================================================= */

function normalizePhone(phone) {

    if (!phone) {

        return "";

    }


    return String(phone)
        .replace(
            /[^\d]/g,
            ""
        );

}


/* =========================================================
   WHATSAPP
========================================================= */

async function openWhatsApp() {

    const eventId =
        generateEventId();


    try {

        const number =
            await getNextWhatsAppNumber();


        const phone =
            normalizePhone(
                number.phone ||
                number.mobile ||
                number.number
            );


        if (!phone) {

            throw new Error(
                "Invalid WhatsApp phone"
            );

        }


        /*
         * Tracking is only sent
         * after a valid online number
         * has been returned.
         */

        sendMetaContact(
            eventId
        );

        sendMetaCAPI(
            eventId
        );

        sendTikTokContact();

        sendTikTokEventsAPI(
            eventId
        );


        const message =
            "السلام عليكم، أريد معرفة المزيد عن العود الطبيعي والأسعار.";


        const whatsappUrl =
            "https://wa.me/" +
            phone +
            "?text=" +
            encodeURIComponent(
                message
            );


        window.location.href =
            whatsappUrl;


    } catch (error) {

        console.error(
            "WhatsApp error:",
            error
        );


        /*
         * 如果号码池暂时无法返回号码，
         * 不随机跳转到一个可能离线的号码。
         */

        alert(
            "نعتذر، خدمة التواصل غير متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً."
        );

    }

}


/* =========================================================
   AUTO WHATSAPP LINKS
========================================================= */

function initWhatsAppLinks() {

    const elements =
        document.querySelectorAll(
            "a, button"
        );


    elements.forEach(
        function (element) {

            const text =
                (
                    element.textContent ||
                    ""
                )
                .trim()
                .toLowerCase();


            const href =
                element.getAttribute(
                    "href"
                );


            const isWhatsAppText =
                text.includes(
                    "whatsapp"
                );


            const isWhatsAppHref =
                href &&
                (
                    href.includes(
                        "wa.me"
                    ) ||
                    href.includes(
                        "whatsapp.com"
                    )
                );


            if (
                isWhatsAppText ||
                isWhatsAppHref
            ) {

                if (
                    element.getAttribute(
                        "onclick"
                    ) ===
                    "openWhatsApp()"
                ) {

                    return;

                }


                element.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        openWhatsApp();

                    }
                );

            }

        }
    );

}


/* =========================================================
   PAGE INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initMobileMenu();

        initReviewSlider();

        initLightbox();

        initVideos();

        initWhatsAppLinks();

    }
);


/* =========================================================
   GLOBAL
========================================================= */

window.openWhatsApp =
    openWhatsApp;