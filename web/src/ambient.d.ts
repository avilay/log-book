type Log = {
    userId?: string,
    logId?: string,
    createdAtUtc: Date, 
    activity: string
}

type GroupedLogs = {
    datestamp: Date,
    logs: Log[]
}
