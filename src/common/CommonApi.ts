import type { ApiItem } from "@/components/common/dropdown/NetworkDropdown";
import { BaseApi } from "@/config/base_service/base.api";
import { APIS } from "@/config/base_service/http.config";


const commonApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDropdownValues: builder.query<ApiItem[] | undefined, any>({
      query: (params) => ({
        url: APIS.Dropdown.getValues,
        method: 'get',
        params: params
      })
    })
  })
});

export const { useLazyGetDropdownValuesQuery } = commonApi;
