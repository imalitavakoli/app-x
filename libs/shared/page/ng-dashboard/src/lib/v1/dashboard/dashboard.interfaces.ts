export interface V1IDashboardPageError {
  lib:
    | 'locationProfile'
    | 'controllerLocation'
    | 'chartConsumption'
    | 'advisoryCard'
    | 'budgetCard'
    | 'billCard'
    | 'co2'
    | 'connectMeter'
    | 'energySummary'
    | 'infoCards'
    | 'locationImage'
    | 'smrCard'
    | 'summaryCard'
    | 'marketPriceCard';
  key: string;
  value: string;
}
