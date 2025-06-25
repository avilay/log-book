import type { PageLoad } from './$types';
import { PUBLIC_API } from "$env/static/public";

export const load = async ({fetch}) => {
    console.log("Starting fetch");
    try {
        let url = `${PUBLIC_API}/logs?grouped=true`;
        const response = await fetch(url);
        let glogs = [];
        if (response.ok) {
            console.log("Got OK response");
            glogs = await response.json();
            for (let glog of glogs) {
                glog.datestamp = new Date(Date.parse(glog.datestamp));
                for (let log of glog["logs"]) {
                    log.timestamp = new Date(Date.parse(log.timestamp));
                }
            }
        } else {
            console.log("Did not get OK response");
        }
        return {logs: glogs};
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching data:', err.message);
        throw new Error("Unable to fetch the latest posts!");
    }
}
