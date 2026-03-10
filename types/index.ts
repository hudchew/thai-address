export interface ThaiName {
  th: string;
  en: string;
}

export interface ThaiSubdistrict {
  n: ThaiName;
  z: string;
}

export interface ThaiDistrict {
  n: ThaiName;
  s: ThaiSubdistrict[];
}

export interface ThaiProvince {
  p: ThaiName;
  d: ThaiDistrict[];
}
