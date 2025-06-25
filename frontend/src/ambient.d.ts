type Log = {
    logId?: string,
    timestamp: Date, 
    activity: string
}

type GroupedLogs = {
    datestamp: Date,
    logs: Log[]
}
