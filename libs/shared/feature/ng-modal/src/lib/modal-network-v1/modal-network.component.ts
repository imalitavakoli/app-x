import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { V1ModalNetworkComponent } from '@x/shared-ui-ng-modal';
import { V1CapacitorNetworkService } from '@x/shared-util-ng-capacitor';

@Component({
  selector: 'x-modal-network-fea-v1',
  standalone: true,
  imports: [V1ModalNetworkComponent],
  templateUrl: './modal-network.component.html',
  styleUrl: './modal-network.component.scss',
})
export class V1ModalNetworkFeaComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _networkService = inject(V1CapacitorNetworkService);

  /** True when the device has no network connection → show the modal. */
  protected readonly showModal = signal(false);

  /** Mirrors the real-time network connectivity state. */
  protected readonly connected = signal(false);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    if (typeof document === 'undefined') return; // If we are in SSR env (not in browser), just return.
    this._initNetworkStatus();
    this._initNetworkListener();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Private helpers                                                          */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Reads the current network status on load. */
  private _initNetworkStatus(): void {
    this._networkService.getStatus().then((status) => {
      this.connected.set(status.connected);
      this.showModal.set(!status.connected);
    });
  }

  /** Subscribes to ongoing network status changes. */
  private _initNetworkListener(): void {
    this._networkService.onNetworkStatusChange
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((status) => {
        this.connected.set(status.connected);
        if (!status.connected) {
          this.showModal.set(true);
        }
        // NOTE: When connection is restored we intentionally do nothing here —
        // we just update the `connected` signal so the UI enables the Refresh
        // button, and leave it to the user to trigger the reload herself.
        //
        // WHY NOT AUTO-RELOAD ON RECONNECTION?
        // The Capacitor Network plugin has a known bug on Android where it fires
        // the `networkStatusChange` event multiple times in quick succession when
        // the connection comes back (e.g. switching from Wi-Fi to mobile data).
        // Auto-reloading inside this listener would therefore cause the app to
        // reload repeatedly in a row, creating a very jarring UX. Letting the
        // user press Refresh herself sidesteps the bug entirely.
      });
  }

  /**
   * Called when the user clicks the Refresh button inside the modal.
   *
   * We use `window.location` instead of the Angular Router deliberately:
   * the goal is a **full browser reload** that wipes the entire JS runtime,
   * including the NgRx store and any stale HTTP/error states that accumulated
   * while the device was offline. Angular Router navigation is a SPA operation —
   * it does not reload the page and would leave all that stale state in memory.
   *
   * Special case: if the current route is `/shell` (an intermediate
   * bootstrapping route), we navigate to `/` instead of reloading in place.
   * This ensures the app re-bootstraps from a proper entry point rather than
   * getting stuck on the shell loading screen.
   */
  protected _onClickedRefresh(): void {
    if (window.location.href.includes('/shell')) {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  }
}
