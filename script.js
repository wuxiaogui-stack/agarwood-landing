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

    const match =
        document.cookie.match(
            new RegExp(
                "(^| )" +
                name +
                "=([^;]+)"
            )
        );

    return match
        ? match[2]
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
   META BROWSER EVENT
========================================================= */

function sendMetaBrowserContact(eventId) {

    try {

        if (
            typeof fbq === "function"
        ) {

            fbq(
                "track",
                "Contact",
                {},
                {
                    eventID: eventId
                }
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

async function sendMetaCAPIContact(eventId) {

    try {

        const params =
            getUrlParams();

        const payload = {

            event_name: "Contact",

            event_id: eventId,

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
                params

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
                    JSON.stringify(payload),

                keepalive: true
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
   TIKTOK BROWSER EVENT
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

async function sendTikTokEventsAPIContact(eventId) {

    try {

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
                getUrlParams(),

            ttclid:
                getUrlParams().ttclid,

            external_id:
                eventId

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
                    JSON.stringify(payload),

                keepalive: true
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

        return;

    }


    menuToggle.addEventListener(
        "click",
        () => {

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
                () => {

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


    const images = Array.from(
        document.querySelectorAll(
            `
            .selection-image img,
            .product-image img,
            .shipping-promotion-image img,
            img[data-lightbox="true"]
            `
        )
    );


    if (!images.length) {

        return;

    }


    let currentIndex = 0;


    function showImage(index) {

        if (!images.length) {

            return;

        }


        currentIndex =
            (
                index +
                images.length
            ) %
            images.length;


        const image =
            images[currentIndex];


        lightboxImage.src =
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
                () => {

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


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            showNext
        );

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            showPrevious
        );

    }


    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

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

                showNext();

            }


            if (
                event.key === "ArrowRight"
            ) {

                showPrevious();

            }

        }
    );


    let touchStartX = 0;


    lightbox.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].clientX;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        event => {

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
            .replace(
                /[^0-9+]/g,
                ""
            );


    normalized =
        normalized.replace(
            /^\+/,
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

            throw new Error(
                "Supabase request failed"
            );

        }


        const data =
            await response.json();


        if (
            Array.isArray(data)
        ) {

            return data[0] || null;

        }


        return data;

    } catch (error) {

        console.error(
            "WhatsApp number error:",
            error
        );

        return null;

    }

}


/* =========================================================
   OPEN WHATSAPP
========================================================= */

async function openWhatsApp(event) {

    if (event) {

        event.preventDefault();

    }


    const number =
        await getNextWhatsAppNumber();


    if (!number) {

        alert(
            "عذراً، لا يتوفر موظف خدمة عملاء حالياً. يرجى المحاولة مرة أخرى لاحقاً."
        );

        return;

    }


    const phone =
        normalizePhone(
            number.phone ||
            number.whatsapp ||
            number.number
        );


    if (!phone) {

        alert(
            "عذراً، حدث خطأ في رقم WhatsApp. يرجى المحاولة مرة أخرى."
        );

        return;

    }


    const eventId =
        generateEventId();


    /*
       Track only after a valid
       WhatsApp number is returned.
    */

    sendMetaBrowserContact(
        eventId
    );

    sendMetaCAPIContact(
        eventId
    );

    sendTikTokBrowserContact();

    sendTikTokEventsAPIContact(
        eventId
    );


    const message =
        encodeURIComponent(
            "السلام عليكم، أريد معرفة تفاصيل العود الطبيعي والأسعار."
        );


    const whatsappUrl =
        "https://wa.me/" +
        phone +
        "?text=" +
        message;


    window.location.href =
        whatsappUrl;

}


/* =========================================================
   WHATSAPP LINKS
========================================================= */

function initWhatsAppLinks() {

    const elements =
        document.querySelectorAll(
            "a, button"
        );


    elements.forEach(
        element => {

            const text =
                (
                    element.textContent ||
                    ""
                ).toLowerCase();


            const href =
                (
                    element.getAttribute(
                        "href"
                    ) ||
                    ""
                ).toLowerCase();


            const isWhatsApp =
                text.includes(
                    "whatsapp"
                ) ||
                href.includes(
                    "wa.me"
                ) ||
                href.includes(
                    "whatsapp.com"
                );


            if (
                !isWhatsApp
            ) {

                return;

            }


            /*
               Do not attach a second
               handler if the element
               already has inline openWhatsApp.
            */

            const inlineHandler =
                element.getAttribute(
                    "onclick"
                );


            if (
                inlineHandler &&
                inlineHandler.includes(
                    "openWhatsApp"
                )
            ) {

                return;

            }


            element.addEventListener(
                "click",
                openWhatsApp
            );

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initMobileMenu();

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