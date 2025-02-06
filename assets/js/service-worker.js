const CACHE_NAME = "oh-my-todo-v1";
const urlsToCache = [
    "/",
    "index.html",

    "assets/css/banner-top.css",
    "assets/css/color-variabel.css",
    "assets/css/fontawsome.all.css",
    "assets/css/index.css",
    "assets/css/input-todo.css",
    "assets/css/keyframes.css",
    "assets/css/pop-up.css",
    "assets/css/reset.css",
    "assets/css/root.css",
    "assets/css/size-variabel.css",
    "assets/css/todo-list.css",

    "assets/fonts/fa-brands-400.ttf",
    "assets/fonts/fa-brands-400.woff2",
    "assets/fonts/fa-light-300.ttf",
    "assets/fonts/fa-light-300.woff2",
    "assets/fonts/Poppins-Light.ttf",

    "assets/images/background.jpg",
    "assets/images/icon-192×192.png",
    "assets/images/icon-512×512.png",

    "assets/js/calendar.js",
    "assets/js/category.js",
    "assets/js/date.js",
    "assets/js/index.js",
    "assets/js/theme.js",
    "assets/js/todo.js",
    "assets/js/typing-effect.js"
];

// Install Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            alert("Caching files...");
            console.log("Caching files...");
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch Files (get file from cache or server)
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Service Worker activation
self.addEventListener("activate", event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
