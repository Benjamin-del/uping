const cronData = {
  thisUrl : "https://uping.benja-products.workers.dev",
  secured : "s",
  getUrl :"link.benja.ml"
}

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

async function handleRequest(fetchURL,doReturn) {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  };


    const response = await fetch(fetchURL, init);
    const results = await gatherResponse(response);

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
  if (doReturn === true) {
  return new Response(JSON.stringify(data), init);
  } else {
      console.log("The point of no (return)")
  }
}

addEventListener('fetch', event => {
    console.log(event.request.url)
    const fetchURL = ((event.request.url).split("/").slice(-1)[0]).replace("s:","https://").replace("u:","http://")
    return event.respondWith(handleRequest(fetchURL,true));
});

async function handleScheduled() {
    const response = await fetch(cronData.thisUrl + "/" + cronData.secured + ":" + cronData.getUrl);
}
addEventListener('scheduled', event => {
    const fetchURL = cronData.secured.replace("s","https://").replace("u","http://") + cronData.getUrl
    event.waitUntil(handleRequest(fetchURL,false));
    console.log("CRON TRIGGERED!")
    console.log("UPING CRON 1.2")
});
