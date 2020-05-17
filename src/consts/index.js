export const ERROR_STATUS = 'error';

export const API_INTERVAL = 60000;

export const QUERY_ATTRIBUTES = ['bestBuyQty', 'fiftyTwoWeekLowPrice', 'absoluteChange', 'companyId', 'value', 'current', 'companyTypeId', 'bargraphValue', 'bestBuyPrice', 'bestSellQty', 'volumeInThousand', 'fiftyTwoWeekHighPrice', 'percentChange', 'volume', 'high', 'low',
    'bestSellPrice', 'highPercentGap', 'lowPercentGap', 'belowDaysHigh', 'belowDaysHighPerChange', 'aboveDaysLow',
    'aboveDaysLowPerChange', 'weekHighPrice', 'monthHighPrice', 'month3HighPrice', 'month6HighPrice', 'yearHighPrice',
    'weekLowPrice', 'monthLowPrice', 'month3LowPrice', 'month6LowPrice', 'yearLowPrice', 'barGraphValue1W',
    'barGraphValue1M', 'barGraphValue3M', 'barGraphValue6M', 'barGraphValue1Y', 'noOfShares', 'open', 'totalTradedValue'];


export const STOCK_ATTRIBUTES = [
    {
        'key': 'segment',
        'type': 'string',
        'displayName': 'segment'
    },
    {
        'key': 'companyShortName',
        'type': 'string',
        'displayName': 'companyShortName'
    },
    {
        'key': 'bestBuyQty',
        'type': 'number',
        'displayName': 'bestBuyQty'
    },
    {
        'key': 'nseScripCode',
        'type': 'string',
        'displayName': 'nseScripCode'
    },
    {
        'key': 'fiftyTwoWeekLowPrice',
        'type': 'number',
        'displayName': 'fiftyTwoWeekLowPrice'
    },
    {
        'key': 'absoluteChange',
        'type': 'number',
        'displayName': 'absoluteChange'
    },
    {
        'key': 'companyId',
        'type': 'number',
        'displayName': 'companyId'
    },
    {
        'key': 'updatedDateTime',
        'type': 'date',
        'displayName': 'updatedDateTime'
    },
    {
        'key': 'ticker',
        'type': 'string',
        'displayName': 'ticker'
    },
    {
        'key': 'value',
        'type': 'number',
        'displayName': 'value'
    },
    {
        'key': 'current',
        'type': 'number',
        'displayName': 'current price'
    },
    {
        'key': 'sparklineURL',
        'type': 'url',
        'displayName': 'sparklineURL'
    },
    {
        'key': 'sectorName',
        'type': 'string',
        'displayName': 'sectorName'
    },
    {
        'key': 'companyType',
        'type': 'string',
        'displayName': 'companyType'
    },
    {
        'key': 'companyTypeId',
        'type': 'number',
        'displayName': 'companyTypeId'
    },
    {
        'key': 'bargraphValue',
        'type': 'number',
        'displayName': 'bargraphValue'
    },
    {
        'key': 'eventCount',
        'type': 'number',
        'displayName': 'eventCount'
    },
    {
        'key': 'bestBuyPrice',
        'type': 'number',
        'displayName': 'bestBuyPrice'
    },
    {
        'key': 'bestSellQty',
        'type': 'number',
        'displayName': 'bestSellQty'
    },
    {
        'key': 'companyName',
        'type': 'string',
        'displayName': 'companyName'
    },
    {
        'key': 'exchangeID',
        'type': 'number',
        'displayName': 'exchangeID'
    },
    {
        'key': 'volumeInThousand',
        'type': 'number',
        'displayName': 'volumeInThousand'
    },
    {
        'key': 'fiftyTwoWeekHighPrice',
        'type': 'number',
        'displayName': 'fiftyTwoWeekHighPrice'
    },
    {
        'key': 'percentChange',
        'type': 'number',
        'displayName': 'percentChange'
    },
    {
        'key': 'volume',
        'type': 'number',
        'displayName': 'volume'
    },
    {
        'key': 'companyName2',
        'type': 'string',
        'displayName': 'companyName2'
    },
    {
        'key': 'high',
        'type': 'number',
        'displayName': 'high'
    },
    {
        'key': 'low',
        'type': 'number',
        'displayName': 'low'
    },
    {
        'key': 'seoName',
        'type': 'string',
        'displayName': 'seoName'
    },
    {
        'key': 'bestSellPrice',
        'type': 'number',
        'displayName': 'bestSellPrice'
    },
    {
        'key': 'fiftytwoWeekHighDateTime',
        'type': 'date',
        'displayName': 'fiftytwoWeekHighDateTime'
    },
    {
        'key': 'fiftytwoWeekLowDateTime',
        'type': 'date',
        'displayName': 'fiftytwoWeekLowDateTime'
    },
    {
        'key': 'highPercentGap',
        'type': 'number',
        'displayName': 'highPercentGap'
    },
    {
        'key': 'lowPercentGap',
        'type': 'number',
        'displayName': 'lowPercentGap'
    },
    {
        'key': 'isPsu',
        'type': 'number',
        'displayName': 'isPsu'
    },
    {
        'key': 'belowDaysHigh',
        'type': 'number',
        'displayName': 'belowDaysHigh'
    },
    {
        'key': 'belowDaysHighPerChange',
        'type': 'number',
        'displayName': 'belowDaysHighPerChange'
    },
    {
        'key': 'aboveDaysLow',
        'type': 'number',
        'displayName': 'aboveDaysLow'
    },
    {
        'key': 'aboveDaysLowPerChange',
        'type': 'number',
        'displayName': 'aboveDaysLowPerChange'
    },
    {
        'key': 'weekHighPrice',
        'type': 'number',
        'displayName': 'weekHighPrice'
    },
    {
        'key': 'monthHighPrice',
        'type': 'number',
        'displayName': 'monthHighPrice'
    },
    {
        'key': 'month3HighPrice',
        'type': 'number',
        'displayName': 'month3HighPrice'
    },
    {
        'key': 'month6HighPrice',
        'type': 'number',
        'displayName': 'month6HighPrice'
    },
    {
        'key': 'yearHighPrice',
        'type': 'number',
        'displayName': 'yearHighPrice'
    },
    {
        'key': 'weekLowPrice',
        'type': 'number',
        'displayName': 'weekLowPrice'
    },
    {
        'key': 'monthLowPrice',
        'type': 'number',
        'displayName': 'monthLowPrice'
    },
    {
        'key': 'month3LowPrice',
        'type': 'number',
        'displayName': 'month3LowPrice'
    },
    {
        'key': 'month6LowPrice',
        'type': 'number',
        'displayName': 'month6LowPrice'
    },
    {
        'key': 'yearLowPrice',
        'type': 'number',
        'displayName': 'yearLowPrice'
    },
    {
        'key': 'barGraphValue1W',
        'type': 'number',
        'displayName': 'barGraphValue1W'
    },
    {
        'key': 'barGraphValue1M',
        'type': 'number',
        'displayName': 'barGraphValue1M'
    },
    {
        'key': 'barGraphValue3M',
        'type': 'number',
        'displayName': 'barGraphValue3M'
    },
    {
        'key': 'barGraphValue6M',
        'type': 'number',
        'displayName': 'barGraphValue6M'
    },
    {
        'key': 'barGraphValue1Y',
        'type': 'number',
        'displayName': 'barGraphValue1Y'
    },
    {
        'key': 'noOfShares',
        'type': 'number',
        'displayName': 'noOfShares'
    },
    {
        'key': 'open',
        'type': 'number',
        'displayName': 'open'
    },
    {
        'key': 'totalTradedValue',
        'type': 'number',
        'displayName': 'totalTradedValue'
    }
];