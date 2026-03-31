export function validateString(value: unknown, fieldName: string, min = 1, max = 255): string {
  if (typeof value !== 'string') throw new Error(`${fieldName} doit être une chaîne de caractères.`)
  const trimmed = value.trim()
  if (trimmed.length < min) throw new Error(`${fieldName} doit contenir au moins ${min} caractères.`)
  if (trimmed.length > max) throw new Error(`${fieldName} ne peut pas dépasser ${max} caractères.`)
  return trimmed
}

export function validateEmail(value: unknown): string {
  if (typeof value !== 'string') throw new Error(`L'email est invalide.`)
  const trimmed = value.trim()
  const regex = /^\S+@\S+\.\S+$/
  if (!regex.test(trimmed)) throw new Error(`L'email est invalide.`)
  return trimmed
}

export function validatePassword(value: unknown): string {
  if (typeof value !== 'string') throw new Error(`Le mot de passe est invalide.`)
  const trimmed = value.trim()
  if (trimmed.length < 8) throw new Error(`Le mot de passe doit faire au moins 8 caractères.`)
  if (!/[A-Z]/.test(trimmed)) throw new Error(`Le mot de passe doit contenir au moins une majuscule.`)
  if (!/[0-9]/.test(trimmed)) throw new Error(`Le mot de passe doit contenir au moins un chiffre.`)
  return trimmed
}

export function validateCodePostal(value: unknown): string {
  if (typeof value !== 'string') throw new Error(`Le code postal est invalide.`)
  const trimmed = value.trim()
  if (!/^\d{5}$/.test(trimmed)) throw new Error(`Le code postal doit contenir exactement 5 chiffres.`)
  return trimmed
}

export function validateSiret(value: unknown): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) return null
  if (typeof value !== 'string') throw new Error(`Le SIRET est invalide.`)
  const trimmed = value.replace(/\s/g, '')
  if (!/^\d{14}$/.test(trimmed)) throw new Error(`Le SIRET doit contenir exactement 14 chiffres (sans espaces).`)
  return trimmed
}

export function validateInt(value: unknown, fieldName: string, min?: number, max?: number): number {
  if (typeof value !== 'string' && typeof value !== 'number') throw new Error(`${fieldName} doit être un nombre.`)
  const num = typeof value === 'string' ? parseInt(value, 10) : value
  if (isNaN(num)) throw new Error(`${fieldName} doit être un nombre valide.`)
  if (min !== undefined && num < min) throw new Error(`${fieldName} doit être au moins ${min}.`)
  if (max !== undefined && num > max) throw new Error(`${fieldName} ne peut pas dépasser ${max}.`)
  return num
}

export function validateEnum<T extends string>(value: unknown, allowed: T[], fieldName: string): T {
  if (typeof value !== 'string') throw new Error(`${fieldName} est invalide.`)
  if (!allowed.includes(value as T)) throw new Error(`${fieldName} n'est pas une option valide.`)
  return value as T
}
