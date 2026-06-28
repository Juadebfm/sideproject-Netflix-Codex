export type TaxonomyKind =
  | 'genre'
  | 'mood'
  | 'group'
  | 'region'
  | 'runtime'
  | 'language'

export type TaxonomyEntry = {
  _id?: string
  slug: string
  label: string
  kind: TaxonomyKind
  description?: string
  createdAt: string
  updatedAt: string
}
