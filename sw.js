/**
 * Service Worker
 */

const staticAssets = [
	"./",
	"./src/stylesheets/style.css",
	"./src/stylesheets/progress.css",
	"./src/stylesheets/responsive.css",
	"./src/assets/favicon.png",
	"./index.js"
];

self.addEventListener("install", async event => {
	const cache = await caches.open("static-tn");
	cache.addAll(staticAssets);
});

self.addEventListener("fetch", event => {
	const { request } = event;
	const url = new URL(request.url);

	if (url.origin === location.origin) {
		event.respondWith(cacheData(request));
	} else {
		event.respondWith(networkFirst(request));
	}
});

async function cacheData(request) {
	const cachedResponse = await caches.match(request);
	return cachedResponse || fetch(request);
}

async function networkFirst(request) {
	const cache = await caches.open("dynamic-tn");

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (error) {
		return await cache.match(request);
	}
}
