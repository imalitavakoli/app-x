import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MapConfigWithExtra, DepConfigWithExtra } from './config.interfaces';
import { v1MiscAddAlreadyMappedProps } from '@x/shared-util-formatters';

/**
 * Here we proxify the object that we receive from
 * `shared-map-ng-config` lib.
 *
 * @export
 * @param {DepConfigWithExtra} data
 * @param {string} [assetsFolderName='x-assets']
 * @returns {MapConfigWithExtra}
 */
export function mapConfigExtra(
  data: DepConfigWithExtra,
  assetsFolderName = 'x-assets',
): MapConfigWithExtra {
  // Let's save the response in the way we like it to be
  const map: MapConfigWithExtra = {
    extra: {},
  };

  // Let's add any other property that we didn't map at above codes (I mean
  // the properties that we've already mapped in
  // `shared-map-ng-config` lib).
  v1MiscAddAlreadyMappedProps(data, map);

  // Let's return the final object
  return map;
}
