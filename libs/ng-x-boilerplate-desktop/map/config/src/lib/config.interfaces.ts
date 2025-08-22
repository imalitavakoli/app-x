/**
 * Interface of the json file we're going to receive from
 * `shared-map-ng-config` lib.
 *
 * @export
 * @interface DepConfigWithExtra
 * @typedef {DepConfigWithExtra}
 */
export interface DepConfigWithExtra {
  /**
   * All of the other settings that might be available in the config file and
   * is already handled by `shared-map-ng-config` lib.
   *
   * @type {*}
   */
  [key: string]: any;

  extra: {
    //...
  };
}

/**
 * Simplified interface of the config data (`DepConfigWithExtra` interface),
 * after we proxify it.
 *
 * @export
 * @interface MapConfigWithExtra
 * @typedef {MapConfigWithExtra}
 */
export interface MapConfigWithExtra {
  /**
   * All of the other settings that might be available in the config file and
   * is already handled by `shared-map-ng-config` lib.
   *
   * @type {*}
   */
  [key: string]: any;

  extra: {
    //...
  };
}
