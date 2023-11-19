self.addEventListener("push", function (e) {
  const data = e.data.json();

  let url = "https://joint-dapp-dev.vercel.app";
  if (data.orderId !== undefined && data.orderId != null) {
    url = `${url}/swap/${data.orderId}`;
  } else if (data.offerId !== undefined && data.offerId != null) {
    url = `${url}/offer/${data.offerId}`;
  }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/images/logo-mark.png",
      data: {
        url,
      },
    }),
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  self.clients.openWindow(event.notification.data.url);
});
