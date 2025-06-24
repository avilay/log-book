type Log = {
    logId?: string,
    timestamp: string, 
    activity: string
}

type GroupedLogs = {
    datestamp: string,
    logs: Log[]
}
