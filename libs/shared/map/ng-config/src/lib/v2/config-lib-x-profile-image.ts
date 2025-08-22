import { V2Config_ApiDep, V2Config_MapDep } from './config.interfaces';
import { v1MiscFixPath } from '@x/shared-util-formatters';

/* ////////////////////////////////////////////////////////////////////////// */
/* Mapping `assets`                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

export function libXProfileImageInjectAssets(
  data: V2Config_ApiDep['assets'],
  assetsFolderName: string,
) {
  // Defaults.
  const map: Partial<V2Config_MapDep['assets']> = {
    libXprofileImageImgAvatar: `./${assetsFolderName}/images/libs/x-profile-image/img-profile.jpg`,
  };

  // Mapping.
  if (data) {
    if (
      data.lib_xprofileimage_img_avatar &&
      data.lib_xprofileimage_img_avatar !== ''
    ) {
      map.libXprofileImageImgAvatar = v1MiscFixPath(
        data.lib_xprofileimage_img_avatar,
      );
    }
  }

  return map;
}
