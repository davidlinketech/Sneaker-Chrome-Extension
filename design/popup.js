var itemlist = ["cartDelay", "checkoutDelay", "preloadItem", "autoPreload", "webhook", "region"]

function saveData(){
    var values = []
    for(x=0; x<itemlist.length; x++){
        values.push(document.getElementById(itemlist[x]).value)     //push settings values into values array
    }
    chrome.storage.local.get("settingsValues", async function(result) {
        if(result["settingsValues"][4] != document.getElementById("webhook").value){        //if webhook value changed
            await fetch(document.getElementById("webhook").value, {                               //send msg to webhook
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({"content": null, "embeds": [{"title": "Successfully changed webhook!","color": 720640}],"username": "Zalando Extension","avatar_url": "https://cdn.discordapp.com/attachments/844207571744194590/940369187874930768/Download.png"})
              });
        }
    });
    chrome.storage.local.set({"settingsValues": values});           //set new values in local storage
}
document.addEventListener('DOMContentLoaded', function () {
    itemlist.forEach(function(item, i) {
        try{
            chrome.storage.local.get("settingsValues", function(result) {
                document.getElementById(item).value = result["settingsValues"][i];
            });
        }
        catch{
            console.log('error - values not setted yet')
        }
    });
    document.getElementById('saveBtn').addEventListener('click', saveData);
});