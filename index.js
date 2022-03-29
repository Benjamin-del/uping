//////////////////////////////////////
//  2022 Benjamin M                 //
//////////////////////////////////////

// Paste into cloudflare worker...


// Forked from benjamin-del/cors4json

const cronData = {
  thisUrl : "https://yourURL.username.workers.dev",
  // The url of the worker. 
  secured : "s",
  // Is it secured? If is is use s if not use u
  getUrl :"link.benja.ml"
  // What Url are you going to get
}
// This data will be used when a cron job is run.

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json());
  } else if (contentType.includes('application/text')) {
    return response.text();
  } else if (contentType.includes('text/html')) {
    return response.text();
  } else {
    return response.text();
  }
}

async function handleRequest(cli_url,doRetrun) {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  };
    console.log(cli_url)
    console.log(cli_url.split("/").slice(-1)[0])
    const fetchURL = (cli_url.split("/").slice(-1)[0]).replace("s:","https://").replace("u:","http://")
    console.log(fetchURL)
    const response = await fetch(fetchURL, init);
    const results = await gatherResponse(response);
    console.log(typeof response.status)
    const status = response.status
    var infoCode = ""
    if (status > 100 && status < 199) {
        console.log("INFO")
        infoCode = "INFO"
    } else if (status > 200 && status < 299) {
        console.log("OK")
        infoCode = "OK"
    } else if (status > 300 && status < 399) {
        console.log("REDIRECT")
        infoCode = "REDIRECT"
    } else if (status > 400 && status < 499) {
        console.log("CLI ERR")
        infoCode = "CLI ERR"
    } else if (status > 500 && status < 599) {
        console.log("SVR ERR")
        infoCode = "SVR ERR"
    }
  var data = {
    status: response.status,
    cat: "https://http.cat/" + response.status,
    discription: infoCode
  }
  return new Response(JSON.stringify(data), init);
}

addEventListener('fetch', event => {
    console.log(event.request.url)
  return event.respondWith(handleRequest(event.request.url,true));
});

async function handleScheduled() {
  const response = await fetch(cronData.thisUrl + "/" + cronData.secured + ":" + cronData.getUrl);
}
addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled());
  console.log("CRON TRIGGERED!")
  console.log("FETCHING:" + cronData.thisUrl + "/" + cronData.secured + ":" + cronData.getUrl)
});
