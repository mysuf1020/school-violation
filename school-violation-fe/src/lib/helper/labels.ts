export const entityTypeLabels = (type: string) => {
  switch (type) {
    case 'pt':
      return 'PT'
    case 'cv':
      return 'CV'
    case 'firma':
      return 'Firma'
    case 'koperasi':
      return 'Koperasi'
    case 'individual':
      return 'Individual'
    case 'lainnya':
      return 'Lainnya'
    default:
      return '-'
  }
}

export const registrationTypeLabels = (type: string) => {
  switch (type) {
    case 'self-registration':
      return 'Self Registration'
    case 'manual-registration':
      return 'Manual Registration'
    default:
      return '-'
  }
}

export const paymentChannelLabels = (channel: string) => {
  switch (channel) {
    case 'qris-mpm':
      return 'QRIS MPM'
    default:
      return '-'
  }
}
