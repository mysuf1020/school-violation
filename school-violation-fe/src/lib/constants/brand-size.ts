export const BRAND_SIZE = [
  'UMI',
  'URE',
  'UKE',
  'UME',
  'UBE',
  'SPBU',
  'PSO',
  'BLU',
  'NIRLABA',
  'P2G',
  'G2P',
  'BANSOS',
  'PENDIDIKAN',
]

export const LABELED_BRAND_SIZE: Record<string, string> = {
  UMI: 'UMI - Usaha Mikro',
  URE: 'URE - Usaha Reguler',
  UKE: 'UKE - Usaha Kecil',
  UME: 'UME - Usaha Menengah',
  UBE: 'UBE - Usaha Besar',
  SPBU: 'SPBU',
  PSO: 'PSO',
  BLU: 'BLU',
  NIRLABA: 'NIRLABA',
  P2G: 'P2G',
  G2P: 'G2P',
  BANSOS: 'BANSOS',
  PENDIDIKAN: 'PENDIDIKAN',
}

export const BRAND_SIZE_OPTION = Object.keys(LABELED_BRAND_SIZE).map((key) => ({
  label: LABELED_BRAND_SIZE[key],
  value: key,
}))
