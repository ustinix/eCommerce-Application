type CountryData = {
  isoCode: string;
  cities: string[];
};

export type CountryCityData = Record<string, CountryData>;
