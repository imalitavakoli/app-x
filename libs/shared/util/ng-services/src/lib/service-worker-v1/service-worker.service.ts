import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class V1ServiceWorkerService {
  /**
   * Unregister 'ngsw-worker.js' Service worker (or other SWs in other names)
   * from our app, if it's already registered.
   *
   * @param {string} [serviceWorkerName='ngsw-worker.js']
   * @returns {Promise<void>}
   */
  unregister(serviceWorkerName = 'ngsw-worker.js'): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            if (
              registration.active &&
              registration.active.scriptURL.endsWith(serviceWorkerName)
            ) {
              registration
                .unregister()
                .then(() => {
                  console.log(
                    '@V1ServiceWorkerService/unregister: Service worker unregistered.',
                  );
                  resolve();
                })
                .catch((error) => {
                  console.error('@V1ServiceWorkerService/unregister:', error);
                  reject(error);
                });
            }
          }
        });
      } else {
        console.log(
          '@V1ServiceWorkerService/unregister: Service workers are not supported in this browser.',
        );
        resolve(); // Resolve if service workers are not supported
      }
    });
  }
}
