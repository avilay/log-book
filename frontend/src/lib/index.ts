// place files you want to import through the `$lib` alias in this folder.
export function formatDay(dt: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "2-digit"
    };
    return dt.toLocaleDateString("en-US", options);
}

export function formatTime(dt: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit"
    };
    return dt.toLocaleTimeString("en-US", options);
}

export function toDateTimeLocalISOString(dt: Date): string {
    let year = dt.getFullYear();
    let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    let day = (dt.getDate()).toString().padStart(2, "0");
    let hour = (dt.getHours()).toString().padStart(2, "0");
    let min = (dt.getMinutes()).toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${min}`;
}