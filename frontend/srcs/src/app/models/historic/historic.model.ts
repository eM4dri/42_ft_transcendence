export interface HistoricData {
  localId: string
  localName: string
  localAvatar: string
  visitorId: string
  visitorName: string
  visitorAvatar: string
  localGoals: number
  visitorGoals: number
  winLocal: boolean
  winVisitor: boolean
  draw: boolean
  pointsLocal: number
  pointsVisitor: number
  gameDate: string
}

export interface TotalHistoricData {
  total: number
  skip: number
  take: number
  result: HistoricData[]
}
