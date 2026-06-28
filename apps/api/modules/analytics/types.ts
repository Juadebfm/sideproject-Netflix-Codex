export type AnalyticsEventName =
  | 'page_view'
  | 'search_submitted'
  | 'code_copied'
  | 'open_in_netflix_clicked'
  | 'recommendation_selected'

export type AnalyticsEvent = {
  _id?: string
  name: AnalyticsEventName
  sessionId: string
  occurredAt: string
  metadata?: Record<string, string | number | boolean | null>
}
