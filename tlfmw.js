
(()=>{
    const maindiv = document.querySelector("div#tlfmw")

    let key = maindiv.getAttribute("apikey")
    let username = maindiv.getAttribute("username")

    maindiv.innerHTML = `
    <p>LOADING</p>
    
    <div class="tlfmw-container">
        <div class="tlfmw-nowplaying">
            <div class="tlfmw-nowplaying-rows">
                <h3><span>user placeholder</span> <span>is now playing</span></h3>
                <h1 class="tlfmw-header"><span>song placeholder</span><span style="width:50px"></span><span>song placeholder</span></h1>
                <h3 class="tlfmw-header"><span>album placeholder</span><span style="width:50px"></span><span>album placeholder</span></h3>
                <h2 class="tlfmw-header"><span>artist placeholder</span><span style="width:50px"></span><span>artist placeholder</span></h2>
            </div>
            <img src="" class="tlfmw-cover">
        </div>
    
        <div class="tlfmw-list"></div>
    </div>
    <img src="" class="tlfmw-bg">
    `




    let recognizeTP = {"jan Opa":true,"tomo suno":true,"kqa":2}


    
    let url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${key}&format=json&limit=10`
    
    async function updateWidget() {
        fetch(url).then(response => {
            if (!response.ok)  throw new Error(`HTTP error ${response.status}`);
            
            return response.json();
        }).then(renderWidget)
    }
    
    function renderWidget(data) {
        let nowplaying
        console.log(data)
        data.recenttracks.track.forEach(v => {if (v["@attr"] && v["@attr"].nowplaying) nowplaying = v});
    
        
        if (nowplaying) {
            const isTP = recognizeTP[nowplaying.artist["#text"]];

            document.querySelector("div#tlfmw .tlfmw-nowplaying h3:not(.tlfmw-header)>span").innerText = username
            document.querySelectorAll("div#tlfmw .tlfmw-nowplaying h3.tlfmw-header>span").forEach((v,k)=>{if (k!=1) v.innerText=nowplaying.album["#text"]})
            document.querySelectorAll("div#tlfmw .tlfmw-nowplaying h2.tlfmw-header>span").forEach((v,k)=>{if (k!=1) v.innerText=nowplaying.artist["#text"]})
            document.querySelectorAll("div#tlfmw .tlfmw-nowplaying h1.tlfmw-header>span").forEach((v,k)=>{if (k!=1) v.innerText=nowplaying.name})
            document.querySelector("div#tlfmw .tlfmw-cover").src = nowplaying.image[2]["#text"]
            document.querySelector("div#tlfmw .tlfmw-bg").src = nowplaying.image[0]["#text"]
                
            document.querySelectorAll("div#tlfmw .tlfmw-nowplaying .tlfmw-header").forEach((v,k)=>{
                if (isTP && isTP!=k) 
                    v.classList.add("tlfmw-toki-pona")
                else
                    v.classList.remove("tlfmw-toki-pona")
                
                if (v.clientWidth<v.scrollWidth) 
                    v.classList.add("tlfmw-animate")
                else
                    v.classList.remove("tlfmw-animate")
                
            })

            document.querySelector("div#tlfmw .tlfmw-nowplaying").style.display = null
        } else {
            document.querySelector("div#tlfmw .tlfmw-nowplaying").style.display = "none"
            document.querySelector("div#tlfmw .tlfmw-bg").src = data.recenttracks.track[0].image[0]["#text"]
        }
            
    
        document.querySelector("div#tlfmw > p").style.display = "none"
    
        let result = `<h3 style="margin-top: 0px;">${username} played recently</h3>`
    
        let added = 0
        for (let i = 0; i < data.recenttracks.track.length; i++) {
            const v = data.recenttracks.track[i];

            
            const prev = data.recenttracks.track[i-1];
            if (nowplaying && nowplaying.image[0]["#text"]+nowplaying.name == v.image[0]["#text"]+v.name) continue
            if (prev && prev.image[0]["#text"]+prev.name == v.image[0]["#text"]+v.name) continue
            
            if (added == 4) break;
            
            const isTP = recognizeTP[v.artist["#text"]];

            added++;
            

            result += ` <div ${isTP?'class="tlfmw-toki-pona"':""}><img src="${v.image[2]["#text"]}">
                <span>${v.name}<br>
                <span style="opacity: 0.5;">${v.album["#text"]}</span><br>
                <span ${isTP==2?"class='tlfmw-font'":""}>${v.artist["#text"]}</span>
                </span>
                <!--span>${v.date["#text"]}</span-->
            </div>`
        }
    
        document.querySelector("div#tlfmw .tlfmw-list").innerHTML = result

    
    }
    
    
    
    updateWidget()
    setInterval(updateWidget,15000)

})()
