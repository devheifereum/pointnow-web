import { api } from "./client";
import type { RegionsCountryCodeResponse } from "../types/regions";

export const regionsApi = {
  getCountryCodes: async (): Promise<RegionsCountryCodeResponse> => {
    return api.get<RegionsCountryCodeResponse>("/regions/country-code");
  },
};









