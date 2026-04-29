import { CommonEnum } from "@/common/common.enum";

export const LocalStorageConfig = {
  getToken: () => localStorage.getItem(CommonEnum.TOKEN),
  getCompanyId: () => localStorage.getItem(CommonEnum.COMPANY_ID),
  getChangePassword: () => localStorage.getItem(CommonEnum.CHANGE_PASSWORD)
};
