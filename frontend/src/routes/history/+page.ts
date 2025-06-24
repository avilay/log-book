import type { PageLoad } from './$types';
import { PUBLIC_API } from "$env/static/public";

export const load = async ({fetch}) => {
    console.log("Starting fetch");
    try {
        let url = `${PUBLIC_API}/logs?grouped=true`;
        const response = await fetch(url);
        let logs = [];
        if (response.ok) {
            console.log("Got OK response");
            logs = await response.json();
        } else {
            console.log("Did not get OK response");
        }
        return {logs: logs};
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching data:', err.message);
        throw new Error("Unable to fetch the latest posts!");
    }
}
