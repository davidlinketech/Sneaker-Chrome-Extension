async function postData(url = '', data = {}, postRes='text', headers={}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });
    if(postRes == 'text'){
        return response.text()
    }else{
        return response.json()
    }
}

async function getData(url = '', getRes='text') {
    const response = await fetch(url, {
      method: 'GET'
    });
    if(getRes == 'text'){
        return response.text()
    }else if(getRes == 'json'){
        return response.json()
    }else{
        return response
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

 function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function selectBtn(){
    if(this.style.backgroundColor == "rgb(44, 63, 130)"){
        this.style.backgroundColor = "#d406b5";
    }else{
        this.style.backgroundColor = "#2c3f82";
    }
}

const readLocalStorage = async (indx) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("settingsValues", function (result) {
        if (result["settingsValues"][indx] === undefined) {
          reject();
        } else {
          resolve(result["settingsValues"][indx]);
        }
      });
    });
};