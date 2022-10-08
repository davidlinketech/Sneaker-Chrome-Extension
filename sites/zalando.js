var runScript     //keeps the script running till the stop btn was pressed
var sizes = {}
var websiteType = window.location.toString().split('.zalando')[0].split('://')[1]       //used to support all kind of subdomains
var shoename

getData(window.location.toString()).then(function(text) {           //GET shoepage the user is currently on
    //get shoeinfo for webhook
    shoename = text.split('","name":"')[1].split('","')[0]
    shoeimage = text.split('leryMediaZoom":[{"__typename":"Image","uri":"')[1].split('"}')[0]
    
    var sizeInfoArr = text.split('SubscribableSimple":false,"simples":[{')[1].split('"}}}],')[0].split('"sku":"')
    sizeInfoArr.splice(0,1)
    var btnHtml = ""          //html for sizebuttons
    for (p=0; p<sizeInfoArr.length; p++){
        try{
            //sizeinfo
            var sizename = sizeInfoArr[p].split('"')[0]
            var size = sizeInfoArr[p].split('"size":"')[1].split('"')[0]
            var stock = sizeInfoArr[p].split('"quantity":"')[1].split('"')[0]
            
            //every size with its info is beeing stored in the sizes object
            sizes[size] = {}
            sizes[size]["sizename"] = sizename
            sizes[size]["stock"] = stock

            //gives size button a color depending on the stock of the size 
            if(stock=="MANY"){
                btnHtml += '<button id="btn'+p.toString()+'" style="background-color: #2c3f82; height: 25px; width: 50px; text-align: center; cursor: pointer; border-radius: 4px; border: 3px solid #00d92f; color: white; font-size: 15px; margin: 2px;">'+size+'</button>'
            }else if(stock=="TWO" || stock=="ONE"){
                btnHtml += '<button id="btn'+p.toString()+'" style="background-color: #2c3f82; height: 25px; width: 50px; text-align: center; cursor: pointer; border-radius: 4px; border: 3px solid #ed8013; color: white; font-size: 15px; margin: 2px;">'+size+'</button>'
            }else{
                btnHtml += '<button id="btn'+p.toString()+'" style="background-color: #2c3f82; height: 25px; width: 50px; text-align: center; cursor: pointer; border-radius: 4px; border: 3px solid #e60f0b; color: white; font-size: 15px; margin: 2px;">'+size+'</button>'
            }

        }
        catch(e){
            break
        }
    }

    //creates div elementd that will be injected into the website
    //div element contains sizebuttons etc.
    const div = document.createElement('div');
    div.className = 'ownSizes';
    div.innerHTML = '<div style="display: inline-grid; grid-template-columns: auto; background-color: #1d76ce; border-radius: 8px; padding: 10px;"> <div style="display: inline-grid; grid-template-columns: auto auto auto auto; background-color: #3895f1; border-radius: 8px; padding: 10px;">'+btnHtml+'</div> <div style="display: inline-grid; grid-template-columns:auto auto; background-color: #1d76ce; border-radius: 8px; padding: 5px; margin-top: 10px;"> <input id="scriptTimer" style="background-color: #2c3f82; height: 30px; width: 60px; text-align: center; cursor: pointer; border-radius: 4px; color: white; border: 1px solid rgba(0, 0, 0, 0.8); font-size: 13px; margin-left: 32px;"></input> <button id="startTimer" style="background-color: #2c3f82; height: 30px; width: 60px; text-align: center; cursor: pointer; border-radius: 4px; color: white; border: 1px solid rgba(0, 0, 0, 0.8); font-size: 13px; margin-right: -8px;">start Timer</button></div><div style="display: inline-grid; grid-template-columns:auto auto; background-color: #1d76ce; border-radius: 8px; padding: 5px; margin-top: 10px;"> <button id="startScript" style="background-color: #2c3f82; height: 30px; width: 60px; text-align: center; cursor: pointer; border-radius: 4px; color: white; border: 1px solid rgba(0, 0, 0, 0.8); font-size: 15px; margin-left: 32px;">Start</button> <button id="stopScript" style="background-color: #2c3f82; height: 30px; width: 60px; text-align: center; cursor: pointer; border-radius: 4px; color: white; border: 1px solid rgba(0, 0, 0, 0.8); font-size: 15px; margin-right: -8px;">Stop</button></div></div>'
    
    document.getElementsByClassName('Q1UH4S')[0].appendChild(div);      

    //adds button select logic
    //if a sizebutton gets clicked its color changes
    for(p=0; p<Object.keys(sizes).length; p++){
        btn = document.getElementById('btn'+p.toString())
        btn.addEventListener('click', selectBtn)
    }

    //adds function to start/stop button
    document.getElementById('startScript').addEventListener('click', mainZalando)       
    document.getElementById('stopScript').addEventListener('click', stopMain)
});

async function mainZalando(){
    runScript = true;
    while(runScript){
        try{
            var cartDelay = await readLocalStorage(0)
            var checkoutDelay = await readLocalStorage(1)
            var preloadItem = await readLocalStorage(2)
            var autoPreload = await readLocalStorage(3)
            var webhook = await readLocalStorage(4)
            var region = await readLocalStorage(5)
        }//error handling:
        catch{
            //iziToast is the fancy popup that shows up on the top left
            iziToast.error({
                title: 'Sneaker Extension',
                message: 'Settings not setted!',
                theme: 'light',
                color: 'red',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });

            iziToast.info({
                title: 'Sneaker Extension',
                message: 'Stopping script...',
                theme: 'light',
                color: 'yellow',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });
            return
        }
        if(cartDelay == undefined || cartDelay == "" || checkoutDelay == undefined || checkoutDelay == "" || region == undefined || region == ""){
            iziToast.error({
                title: 'Sneaker Extension',
                message: 'Settings not setted!',
                theme: 'light',
                color: 'red',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });

            iziToast.info({
                title: 'Sneaker Extension',
                message: 'Stopping script...',
                theme: 'light',
                color: 'yellow',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });
            return
        }
        if(autoPreload == "true" && preloadItem == "" || preloadItem == undefined){
            iziToast.error({
                title: 'Sneaker Extension',
                message: 'Autopreload activated but no preload-item specified!',
                theme: 'light', 
                color: 'red',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });

            iziToast.info({
                title: 'Sneaker Extension',
                message: 'Stopping script...',
                theme: 'light',
                color: 'yellow',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });
            return
        }

        //pushes the selected sizes(identified by color) to selectedSizes array
        //each pushed size is an array that contains the SKU and the cleartext Size
        var selectedSizes = []
        for(p=0; p<Object.keys(sizes).length; p++){
            btn = document.getElementById('btn'+p.toString())
            if(btn.style.backgroundColor != "rgb(44, 63, 130)"){
                selectedSizes.push([btn.innerHTML, sizes[btn.innerHTML]["sizename"]])
            }
        }

        //cart item logic:
        var carted = false;         //if carted loop breaks
        while(runScript){
            var randomSizeArr = selectedSizes[getRandomInt(selectedSizes.length-1)]
            var SKU = randomSizeArr[1]
            var clearTextSize = randomSizeArr[0]
            
            let cartBody = {
                id: "e7f9dfd05f6b992d05ec8d79803ce6a6bcfb0a10972d4d9731c6b94f6ec75033",
                variables: {
                    addToCartInput : {
                        productId: SKU,
                        clientMutationId: "addToCartMutation"
                    }
                }
            }

            //posting to add-to-cart endpoint of zalando
            await postData('https://'+websiteType+'.zalando.'+region+'/api/graphql/add-to-cart/', cartBody, postRes='json', headers={"Content-Type":"application/json"}).then(async function(jsonres){
                try{
                    if(jsonres["data"]["addToCart"]["__typename"]){     //if item successfully addet to cart
                        iziToast.success({
                            title: 'Sneaker Extension',
                            message: 'Successfully addet item to cart!',
                            theme: 'light',
                            color: 'green',
                            iconText: '',
                            iconColor: '',
                            iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                            position: 'topLeft',
                        });
                        carted = true;
                    }
                    else{                       //if carting the item failed:
                        iziToast.info({
                            title: 'Sneaker Extension',
                            message: 'Adding to cart failed!',
                            theme: 'light',
                            color: 'yellow',
                            iconText: '',
                            iconColor: '',
                            iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                            position: 'topLeft',
                        });
                        await sleep(cartDelay)
                    }
                }catch{             //if carting the item failed:
                    iziToast.info({
                        title: 'Sneaker Extension',
                        message: 'Adding to cart failed!',
                        theme: 'light',
                        color: 'yellow',
                        iconText: '',
                        iconColor: '',
                        iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                        position: 'topLeft',
                    });
                    await sleep(cartDelay)
                }
            });
            if(carted){         //if carted successful break the loop
                break;
            }
        }

        //await sleep(200)              delay between next request is optional but recommended
        
        //get tokens needed for checkout:
        var checkoutEtag = "";
        var checkoutID = "";
        var gotTokens = false;          //flag if getting tokens worked
        for(var o=0; runScript && o<3; o++){        //only try it 3 times, if didnt worked retry whole process
            iziToast.info({
                title: 'Sneaker Extension',
                message: 'Getting tokens...',
                theme: 'light',
                color: 'blue',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });
            try{
                //getting tokens from endpoint
                await getData('https://'+websiteType+'.zalando.'+region+'/checkout/confirm').then(async function(text){
                    checkoutEtag = text.split('eTag&quot;:&quot;\\&quot;')[1].split('\\&quot;&quot;')[0]
                    checkoutEtag = '"' + checkoutEtag + '"'     //needed because etag has a weird formatting in request-body
                    checkoutID = text.split('checkoutId&quot;:&quot;')[1].split('&quot;,&quot')[0]
                    gotTokens = true
                    iziToast.info({
                        title: 'Sneaker Extension',
                        message: 'Submitting order...',
                        theme: 'light',
                        color: 'blue',
                        iconText: '',
                        iconColor: '',
                        iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                        position: 'topLeft',
                    });
                })
            }catch{
                await sleep(200)        //retry get tokens delay
            }

            if(gotTokens == true){      //if getting tokens worked break loop
                break
            }
        }
        if(!gotTokens){             //if getting tokens failed after 3 times retry whole process
            iziToast.info({
                title: 'Sneaker Extension',
                message: 'Getting tokens failed! Retrying...',
                theme: 'light',
                color: 'yellow',
                iconText: '',
                iconColor: '',
                iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                position: 'topLeft',
            });
            continue
        }
        
        await sleep(checkoutDelay)
        
        var checkoutBody
        var checkoutHeaders
        var checkedOut = false;         //flag if checkout worked
        while(runScript){
            checkoutBody = {
                checkoutId: checkoutID,
                eTag: checkoutEtag
            }
            checkoutHeaders = {
                "Content-Type": "application/json", 
                "x-xsrf-token": document.cookie.split("frsx=")[1].split(";")[0]
            }
            //posting to checkout endpoint
            await postData('https://'+websiteType+'.zalando.'+region+'/api/checkout/buy-now', checkoutBody, 'json', checkoutHeaders).then(async function(res){
                try{
                    paypalLink = res["url"]         //paypal checkout-link
                    checkedOut = true;
                    iziToast.success({
                        title: 'Sneaker Extension',
                        message: 'Successfully checked out!',
                        theme: 'light',
                        color: 'green',
                        iconText: '',
                        iconColor: '',
                        iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                        position: 'topLeft',
                    });
                    window.open(paypalLink, "Checkout", "width=450, height=470")       //open checkout-link in another window
                    if(webhook){        //if webhook setted send webhook
                        var webhook_body = {
                            "content": null,
                            "embeds": [
                                {
                                    "title": "Successfully checked out!",
                                    "color": 720640,
                                    "fields": [
                                        {
                                            "name": "**Product:**",
                                            "value": shoename
                                        },
                                        {
                                            "name": "**Checkout:**",
                                            "value": "[CLICK HERE!]("+paypalLink+")"
                                        },
                                        {
                                            "name": "**Size:**",
                                            "value": clearTextSize,
                                            "inline": true
                                        },
                                        {
                                            "name": "**Cart-Delay:**",
                                            "value": "||"+cartDelay+"||",
                                            "inline": true
                                        },
                                        {
                                            "name": "**Checkout-Delay:**",
                                            "value": "||"+checkoutDelay+"||",
                                            "inline": true
                                        }
                                    ],
                                    "thumbnail": {
                                        "url": shoeimage
                                    }
                                }
                            ],
                            "username": "Sneaker Extension",
                            "avatar_url": "https://cdn.discordapp.com/attachments/844207571744194590/940369187874930768/Download.png"
                        }
                        await postData(webhook, webhook_body, 'text', {"Content-Type":"application/json"})
                    }
                }catch(err){
                    iziToast.error({
                        title: 'Sneaker Extension',
                        message: 'Checkout failed!',
                        theme: 'light',
                        color: 'red',
                        iconText: '',
                        iconColor: '',
                        iconUrl: "https://cdn.discordapp.com/attachments/818903818796138558/950434734671036436/zalando_logo_icon_144713.png",
                        position: 'topLeft',
                    });
                    await sleep(checkoutDelay)
                }
            })
            if(checkedOut){
                break
            }
        }

        //hier auto preload einabauen
        break;      //if done with whole process brake loop/stop script
    }
}

function stopMain(){
    runScript = false;
}