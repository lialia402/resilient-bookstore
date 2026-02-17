export const FAVORITE_ICON = { active: '♥', inactive: '♡' } as const

export function getFavoriteLabel(isFavorite: boolean): string {
  return isFavorite ? 'Remove from favorites' : 'Add to favorites'
}
