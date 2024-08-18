import { URLSearchParams } from "url";

let API_KEY = 'olostep_headstarter_api_Cco42mZirSwlh7OZJ5Cewe28HEk3q';

export default function olostep(url_to_scrape)
{

    console.log('API KEYS:',API_KEY)

    console.log('In OloStep')
    const options = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + API_KEY,
        }
    };


    const oloResp = fetch('https://agent.olostep.com/olostep-p2p-incomingAPI?'+ new URLSearchParams({
        "url_to_scrape" : url_to_scrape,
        "htmlTransformer" : "postlightParser",
        "expandHTML" : true,
        "removeImages" : true,
        "saveMarkdown" : false
    }), options).then(resp=> resp.json()).then(resp=>{console.log('Olostep Resp', resp);return resp}).catch(err=>{console.log('Error occurred.'); return {error:err}});

    return oloResp
}
