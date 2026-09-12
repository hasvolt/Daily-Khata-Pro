/**
 * Daily Khata Pro — Service Worker
 * Version: 2.8.0
 * 100% Offline-First Architecture, Resilient Asset Caching, Background Sync & Push Capabilities
 */

const CACHE_NAME = 'daily-khata-pro-v2.8.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/daily-khata-pro-v4.png',
  '/daily-Khata-Pro.png',
  '/daily-Khata-Pro-aap-icon.png',
  '/md-zafeer-hasan-yazdaan.jpg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/screenshots/screenshot-desktop.png',
  '/screenshots/screenshot-mobile.png',
  '/robots.txt',
  '/sitemap.xml'
];

// Helper: Cache a response under multiple URL representations (full & pathname)
async function putInCacheSafe(cache, requestOrUrl, response) {
  try {
    if (!response || !response.ok) return;
    const clone1 = response.clone();
    const clone2 = response.clone();
    await cache.put(requestOrUrl, clone1);
    if (typeof requestOrUrl === 'string' && requestOrUrl.startsWith('/')) {
      try {
        await cache.put(new Request(requestOrUrl, { mode: 'cors' }), clone2);
      } catch (e) {}
    } else if (requestOrUrl instanceof Request) {
      try {
        const u = new URL(requestOrUrl.url);
        await cache.put(u.pathname, clone2);
      } catch (e) {}
    }
  } catch (err) {
    // Non-blocking
  }
}

// 1. Install Event: Resilient Pre-cache Essential App Shell & Dynamic Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Precache known static assets
      await Promise.all(
        STATIC_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: 'reload' });
            if (response && response.ok) {
              await putInCacheSafe(cache, url, response);
            }
          } catch (err) {
            console.warn('[SW] Non-blocking asset fetch warning:', url);
          }
        })
      );

      // 2. Dynamically extract and precache scripts and styles referenced in index.html
      try {
        const htmlRes = await fetch('/index.html', { cache: 'reload' });
        if (htmlRes && htmlRes.ok) {
          const htmlClone = htmlRes.clone();
          await cache.put('/index.html', htmlRes);
          await cache.put('/', htmlClone);

          const htmlText = await htmlClone.text();
          const assetRegex = /(?:src|href)=["']([^"']+\.(?:js|css|woff2?|svg|png|jpg))["']/gi;
          let match;
          const foundUrls = new Set();
          while ((match = assetRegex.exec(htmlText)) !== null) {
            const assetUrl = match[1];
            if (assetUrl &&
                !assetUrl.startsWith('http') &&
                !assetUrl.startsWith('//') &&
                !assetUrl.includes('hot-update')) {
              foundUrls.add(assetUrl.startsWith('/') ? assetUrl : `/${assetUrl}`);
            }
          }

          await Promise.all(
            Array.from(foundUrls).map(async (u) => {
              try {
                const aRes = await fetch(u, { cache: 'reload' });
                if (aRes && aRes.ok) {
                  await putInCacheSafe(cache, u, aRes);
                }
              } catch (e) {
                // Non-blocking
              }
            })
          );
        }
      } catch (htmlErr) {
        console.warn('[SW] Dynamic HTML precache warning:', htmlErr);
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up Old Caches & Claim Clients Immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Stale-While-Revalidate & Rock-Solid Offline Fallback Strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass ONLY browser extensions and dev hot updates
  if (url.protocol.startsWith('chrome-extension') ||
      url.pathname.includes('hot-update') ||
      url.pathname.includes('/@vite/client') ||
      url.pathname.includes('socket.io')) {
    return;
  }

  // Navigation requests (HTML pages / SPA routes like /history, /goals, /add, etc.)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        // If device is offline, immediately return cached index.html shell
        if (!self.navigator.onLine) {
          const cachedShell = (await caches.match('/index.html', { ignoreSearch: true, ignoreVary: true })) ||
                              (await caches.match('/', { ignoreSearch: true, ignoreVary: true })) ||
                              (await caches.match(event.request, { ignoreSearch: true, ignoreVary: true }));
          if (cachedShell) return cachedShell;
        }

        try {
          // Attempt network fetch with 3s timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const networkResponse = await fetch(event.request, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
              cache.put('/index.html', clone.clone());
              cache.put('/', clone.clone());
            });
            return networkResponse;
          }

          // Fallback to cached index.html if network returns non-200
          const shell = (await caches.match('/index.html', { ignoreSearch: true, ignoreVary: true })) ||
                        (await caches.match('/', { ignoreSearch: true, ignoreVary: true }));
          if (shell) return shell;
          return networkResponse;
        } catch (fetchErr) {
          // Offline navigation fallback: serve cached index.html for ANY route (/history, /goals, etc.)
          const cachedResponse = (await caches.match('/index.html', { ignoreSearch: true, ignoreVary: true })) ||
                                 (await caches.match('/', { ignoreSearch: true, ignoreVary: true })) ||
                                 (await caches.match(event.request, { ignoreSearch: true, ignoreVary: true }));
          if (cachedResponse) return cachedResponse;

          return new Response('Daily Khata Pro is offline. Please reconnect to the internet to load.', {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        }
      })()
    );
    return;
  }

  // Static Assets, Scripts, Styles, Images, Fonts -> Cache-First with Stale-While-Revalidate
  event.respondWith(
    (async () => {
      // 1. Try cache first (both request & pathname, ignoring query string and vary)
      const cachedResponse = (await caches.match(event.request, { ignoreSearch: true, ignoreVary: true })) ||
                             (await caches.match(url.pathname, { ignoreSearch: true, ignoreVary: true }));

      if (cachedResponse) {
        // Revalidate in background when online
        if (self.navigator.onLine) {
          fetch(event.request)
            .then(async (networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const contentType = networkResponse.headers.get('content-type') || '';
                // Avoid caching HTML 404 responses for script/css chunks
                if ((event.request.destination === 'script' || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) &&
                    contentType.includes('text/html')) {
                  return;
                }
                const cache = await caches.open(CACHE_NAME);
                await putInCacheSafe(cache, event.request, networkResponse);
              }
            })
            .catch(() => {});
        }
        return cachedResponse;
      }

      // 2. Not in cache: fetch from network and store in cache
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          const contentType = networkResponse.headers.get('content-type') || '';
          if ((event.request.destination === 'script' || url.pathname.endsWith('.js')) && contentType.includes('text/html')) {
            return new Response('Asset not found', { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'text/plain' } });
          }
          const cache = await caches.open(CACHE_NAME);
          await putInCacheSafe(cache, event.request, networkResponse);
        }
        return networkResponse;
      } catch (netErr) {
        // 3. Network failed & not in cache: offline fallback
        if (event.request.destination === 'image') {
          const fallbackImg = (await caches.match('/daily-khata-pro-v4.png', { ignoreSearch: true, ignoreVary: true })) ||
                              (await caches.match('/icons/icon-192x192.png', { ignoreSearch: true, ignoreVary: true }));
          if (fallbackImg) return fallbackImg;
        }
        if (event.request.destination === 'font') {
          return new Response('', { status: 200, headers: { 'Content-Type': 'font/woff2' } });
        }
        return new Response('', { status: 408, statusText: 'Offline asset unavailable' });
      }
    })()
  );
});

// 4. Background Sync for Offline Ledger & Goal Updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-ledger-data' || event.tag === 'sync-khata') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'BACKGROUND_SYNC_TRIGGERED' });
        });
      })
    );
  }
});

// 5. Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-khata-sync' || event.tag === 'periodic-backup') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'PERIODIC_SYNC_TRIGGERED' });
        });
      })
    );
  }
});

// 6. Push Notifications Capability
self.addEventListener('push', (event) => {
  let data = {
    title: 'Daily Khata Pro',
    body: 'Don’t forget to log your daily financial transactions!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: { url: '/' }
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [100, 50, 100],
    data: data.data,
    actions: [
      { action: 'open_app', title: 'Open Khata' },
      { action: 'add_entry', title: '+ Add Entry' }
    ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 7. Notification Click Action
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  let targetUrl = '/?open=reminders';
  if (event.action === 'open_reminders' || event.action === 'view_reminder') {
    targetUrl = '/?open=reminders';
  } else if (event.action === 'add_entry') {
    targetUrl = '/?open=add';
  } else if (event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// 8. Communication Channel with Client App (Force Update, Cache Purge, and Scheduled Reminders)
const activeScheduledTimers = new Map();

self.addEventListener('message', (event) => {
  if (!event.data) return;

  // Trigger device notification requested from client
  if (event.data.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(
      self.registration.showNotification(event.data.title, event.data.options)
    );
  }

  // Scheduled background reminders engine
  if (event.data.type === 'SCHEDULE_REMINDERS') {
    const reminders = event.data.reminders || [];
    const isHindi = !!event.data.isHindi;
    const now = Date.now();

    event.waitUntil(
      (async () => {
        const activeIds = new Set();

        for (const rem of reminders) {
          if (rem.isCompleted || rem.notifyViaBrowser === false) continue;
          activeIds.add(rem.id);

          const targetTs = rem.targetTimestamp;
          if (!targetTs || targetTs <= now) continue;

          const diff = targetTs - now;

          // Prepare options
          const title = isHindi ? `⏰ रिमाइंडर: ${rem.title}` : `⏰ Reminder: ${rem.title}`;
          const parts = [];
          if (rem.amount) parts.push(`₹${Number(rem.amount).toLocaleString('en-IN')}`);
          if (rem.dueTime) parts.push(`समय: ${rem.dueTime}`);
          if (rem.description) parts.push(rem.description);
          else parts.push(isHindi ? 'निर्धारित कार्य या भुगतान का समय आ चुका है।' : 'Your scheduled task or bill is due now.');

          const notifOptions = {
            body: parts.join(' • '),
            icon: '/daily-khata-pro-v4.png',
            badge: '/icons/icon-192x192.png',
            tag: `rem-${rem.id}`,
            renotify: true,
            requireInteraction: true,
            vibrate: [400, 200, 400, 200, 500],
            data: { url: '/?open=reminders', reminderId: rem.id },
            actions: [
              { action: 'open_reminders', title: isHindi ? 'देखें' : 'View' },
              { action: 'add_entry', title: '+ Add Entry' }
            ]
          };

          // 1. Native OS Notification Triggers API (Android OS AlarmManager)
          if ('showTrigger' in self.Notification.prototype || typeof TimestampTrigger !== 'undefined') {
            try {
              await self.registration.showNotification(title, {
                ...notifOptions,
                showTrigger: new TimestampTrigger(targetTs)
              });
            } catch (triggerErr) {
              console.warn('[SW] TimestampTrigger error:', triggerErr);
            }
          }

          // 2. Exact Service Worker timer for upcoming reminders due within 2 hours
          if (diff <= 2 * 60 * 60 * 1000) {
            if (activeScheduledTimers.has(rem.id)) {
              clearTimeout(activeScheduledTimers.get(rem.id));
            }

            const timerId = setTimeout(async () => {
              try {
                await self.registration.showNotification(title, notifOptions);
              } catch (e) {
                console.warn('[SW] Timer showNotification error:', e);
              }
              activeScheduledTimers.delete(rem.id);
            }, diff);

            activeScheduledTimers.set(rem.id, timerId);
          }
        }

        // Clean up cancelled / completed reminder timers
        for (const [id, timerId] of activeScheduledTimers.entries()) {
          if (!activeIds.has(id)) {
            clearTimeout(timerId);
            activeScheduledTimers.delete(id);
          }
        }
      })()
    );
  }

  // Lock-screen delivery test (e.g. user locks screen and receives alert 10 seconds later)
  if (event.data.type === 'SCHEDULE_LOCK_SCREEN_TEST') {
    const delaySeconds = event.data.delaySeconds || 10;
    const isHindi = !!event.data.isHindi;
    const delayMs = delaySeconds * 1000;
    const targetTime = Date.now() + delayMs;

    const testTitle = isHindi ? '🔔 Daily Khata Pro: लॉक स्क्रीन टेस्ट' : '🔔 Daily Khata Pro: Lock Screen Test';
    const testBody = isHindi
      ? 'परीक्षण सफल! फोन लॉक होने पर भी रिमाइंडर और वाइब्रेशन समय पर काम कर रहे हैं।'
      : 'Test alert delivered! Reminders, sound & vibration are working on your lock screen.';

    const testOptions = {
      body: testBody,
      icon: '/daily-khata-pro-v4.png',
      badge: '/icons/icon-192x192.png',
      tag: 'lock-screen-test',
      renotify: true,
      requireInteraction: true,
      silent: false,
      vibrate: [500, 200, 500, 200, 500],
      data: { url: '/?open=reminders' },
      actions: [
        { action: 'open_reminders', title: isHindi ? 'खाता खोलें' : 'Open Khata' }
      ]
    };

    event.waitUntil(
      new Promise((resolve) => {
        // Schedule with native OS TimestampTrigger if available
        if ('showTrigger' in self.Notification.prototype || typeof TimestampTrigger !== 'undefined') {
          try {
            self.registration.showNotification(testTitle, {
              ...testOptions,
              showTrigger: new TimestampTrigger(targetTime)
            });
          } catch (e) {
            console.warn('[SW] TimestampTrigger test failed, using timer fallback:', e);
          }
        }

        // High precision worker timer with waitUntil keep-alive
        setTimeout(async () => {
          try {
            await self.registration.showNotification(testTitle, testOptions);
          } catch (err) {
            console.error('[SW] Test notification dispatch error:', err);
          }
          resolve();
        }, delayMs);
      })
    );
  }

  // Cancel specific reminder tag
  if (event.data.type === 'CANCEL_REMINDER' && event.data.reminderId) {
    const id = event.data.reminderId;
    if (activeScheduledTimers.has(id)) {
      clearTimeout(activeScheduledTimers.get(id));
      activeScheduledTimers.delete(id);
    }
    event.waitUntil(
      self.registration.getNotifications({ tag: `rem-${id}` }).then((notifs) => {
        notifs.forEach((n) => n.close());
      })
    );
  }

  // Immediate worker takeover when requested by client
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Precache explicit URLs requested by running client
  if (event.data.type === 'CACHE_URLS' && Array.isArray(event.data.urls)) {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.all(
          event.data.urls.map(async (url) => {
            try {
              const matched = await cache.match(url, { ignoreSearch: true, ignoreVary: true });
              if (!matched) {
                const res = await fetch(url);
                if (res && res.ok) {
                  await putInCacheSafe(cache, url, res);
                }
              }
            } catch (err) {
              // Non-blocking
            }
          })
        );
      })
    );
  }

  // Safe cache refresh & update handler
  if (event.data.type === 'PURGE_CACHE' || event.data.type === 'REFRESH_CACHE') {
    event.waitUntil(
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          // Re-fetch fresh index.html into active cache
          const htmlRes = await fetch('/index.html', { cache: 'reload' });
          if (htmlRes && htmlRes.ok) {
            await cache.put('/index.html', htmlRes.clone());
            await cache.put('/', htmlRes);
          }
          // Clean up any legacy caches
          const names = await caches.keys();
          await Promise.all(
            names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
          );
          self.skipWaiting();
          if (event.source && event.source.postMessage) {
            event.source.postMessage({ type: 'CACHE_PURGED_SUCCESS', version: CACHE_NAME });
          }
        } catch (e) {
          if (event.source && event.source.postMessage) {
            event.source.postMessage({ type: 'CACHE_PURGED_SUCCESS', version: CACHE_NAME });
          }
        }
      })()
    );
  }
});
