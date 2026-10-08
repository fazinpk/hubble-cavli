export interface ShowSummary {
  name: string;
  exhibitorCount: number;
}

export interface CountryCount {
  name: string;
  companyCount: number;
}

export interface ExhibitorLogo {
  name: string;
  logoUrl: string;
}

export interface CavliBooth {
  showName: string;
  boothCode: string | null;
  hall: string | null;
}

export interface ExhibitorSummary {
  eventTitle: string;
  city: string | null;
  startsAt: Date;
  endsAt: Date;
  shows: ShowSummary[];
  totalExhibitors: number;
  countryCount: number;
  topCountries: CountryCount[];
  logos: ExhibitorLogo[];
  cavliBooth: CavliBooth | null;
  lastSyncedAt: Date;
}
