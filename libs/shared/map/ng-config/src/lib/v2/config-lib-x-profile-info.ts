import { V2Config_ApiDep, V2Config_MapDep } from './config.interfaces';
import { v1MiscFixPath } from '@x/shared-util-formatters';

/* ////////////////////////////////////////////////////////////////////////// */
/* Mapping `assets`                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

export function libXProfileInfoInjectAssets(
  data: V2Config_ApiDep['assets'],
  assetsFolderName: string,
) {
  // Defaults.
  const map: Partial<V2Config_MapDep['assets']> = {
    libXprofileInfoIcoInfo: `./${assetsFolderName}/images/libs/shared/icon-info.svg`,
  };

  // Mapping.
  if (data) {
    if (
      data.lib_xprofileinfo_ico_info &&
      data.lib_xprofileinfo_ico_info !== ''
    ) {
      map.libXprofileInfoIcoInfo = v1MiscFixPath(
        data.lib_xprofileinfo_ico_info,
      );
    }
  }

  return map;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Mapping inputs                                                             */
/* ////////////////////////////////////////////////////////////////////////// */

export function libXProfileInfoInjectV1Inputs(data: V2Config_ApiDep['libs']) {
  // Defaults.
  const map: V2Config_MapDep['libs']['xProfileInfoV1'] = {
    hasInfoIcon: false,
    hasBg: false,
  };

  // Mapping from 1st DEP version config of the lib.
  const v1_0_0 = data.find((item) => item.X_PROFILE_INFO_1_0_0);
  if (v1_0_0 && !Array.isArray(v1_0_0.items)) {
    const hasInfoIcon = v1_0_0.items.show_info_icon ?? false;
    map.hasInfoIcon = hasInfoIcon;
  }

  // Mapping from 2nd DEP version config of the lib (overrides prev config).
  const v1_1_0 = data.find((item) => item.X_PROFILE_INFO_1_1_0);
  if (v1_1_0 && !Array.isArray(v1_1_0.items)) {
    const hasInfoIcon = v1_1_0.items.show_info_icon ?? false;
    map.hasInfoIcon = hasInfoIcon;

    const hasBg = v1_1_0.items.show_bg ?? false;
    map.hasBg = hasBg;
  }

  return map;
}
