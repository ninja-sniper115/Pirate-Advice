const searchHistUL = document.querySelector(`#search-history`);
const imgContainerEl = document.getElementById(`img-container`);
const btnContainerEl = document.getElementById(`button-container`);
btnContainerEl.classList.add(`is-grouped`);
const adviceContainerEl = document.getElementById(`advice-container`);

let displayheroImg = function() {
    imgContainerEl.innerHTML = "";
    let heroImg = document.createElement('img');
    heroImg.setAttribute("src", "./assets/images/treasure.svg");
    heroImg.style.width = "20vw";
    //heroImg.classList.add("column", "is-2");
    imgContainerEl.appendChild(heroImg);
}

const getAdvice = function(searchTerm){
    fetch(`https://api.adviceslip.com/advice/search/${searchTerm}`).then(function(response) {
        console.log(response)
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                if (!data.slips) {
                    console.log(data.message.text);
                    displayheroImg();
                    adviceContainerEl.textContent = "ARRRRGGGHHH! Ain't no pirate dat knows nothing 'bout " + searchTerm;
                    // will log: "No advice slips found matching that search term." Display to page
                } else {
                    advice = data.slips[0].advice;
                    console.log(advice);
                    transPirate(advice);
                    pirateGif();
                }
            })
        }
    })
};

const pirateGif = function() {
    fetch(`https://api.giphy.com/v1/gifs/search?q=pirate&limit=20&offset=${Math.floor(Math.random() * (10))}&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN&limit=1`).then(function(response) {
        console.log(response)
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var gifDiv = document.querySelector(`#img-container`);
                gifDiv.innerHTML = "";
                var gifImg = document.createElement('img');
                gifImg.setAttribute('src', data.data[Math.floor(Math.random() * (20))].images.fixed_height.url);
                gifDiv.appendChild(gifImg);

            })
        }
    });
}
// pirate API link: https://api.funtranslations.com/translate/pirate.json

const transPirate = function(advice){
    // splitAdvice = advice.split(` `);
    // urlAdvice = splitAdvice.join(`+`);
    let urlAdvice = encodeURIComponent(advice);
    console.log(urlAdvice);
    fetch(`https://api.funtranslations.com/translate/pirate.json?text=${urlAdvice}`).then(function(response) {
        console.log(response)
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                console.log(data.contents.translated)
                adviceContainerEl.textContent = data.contents.translated;
            })
        }
    })
};

const saveSearch = function(searchTerm) {
    var savePull = JSON.parse(localStorage.getItem("searchHist")) || [];
    savePull.push({
        search: searchTerm
    });
    localStorage.setItem("searchHist", JSON.stringify(savePull));
};

const loadSearch = function() {
    var saves = JSON.parse(localStorage.getItem("searchHist"));
    searchHistUL.innerHTML="";
    if (!saves) {
        return
    } else {
        for (i = 0; i < saves.length; i++) {
            historyAdd(saves[i].search); 
        }
    }
}

let displayFavorites = function() {
    searchHistUL.classList.remove('invisible')
}

var historyAdd = function(searchTerm) {
    var newHisEl = document.createElement(`button`);
    newHisEl.classList.add("button", "is-danger", "is-light");
    var newHis = document.createTextNode(`${searchTerm}`);
    newHisEl.appendChild(newHis)
    searchHistUL.append(newHisEl);

    newHisEl.addEventListener("click", function() {
        getAdvice(searchTerm);
    });
};

var clearSearchHistory = function(clear) {
    var clear = document.getElementById('search-history');
    clear.innerHTML = '';
    localStorage.clear();
}

let displayInitialPage = function() {
    //hide favorites and empty divs
    searchHistUL.classList.add('invisible');
    btnContainerEl.innerHTML = "";
    imgContainerEl.innerHTML = "";
    displayheroImg();

    //create searchbar 
    let form = document.createElement('form');
    form.classList.add("field", "has-addons")
    let searchBar = document.createElement("input");
    searchBar.setAttribute("type", "text");
    searchBar.setAttribute("name", "searchTerm");
    searchBar.setAttribute("placeholder", "Search");
    searchBar.classList.add("input","is-danger", "is-medium")
    let searchBtn =  document.createElement("input");
    // searchBtn.textContent = "SEARCH"; 
    searchBtn.setAttribute("type", "button");  
    searchBtn.setAttribute("value", "Search");
                    
    searchBtn.classList.add("button","is-danger", "is-medium", "has-text-white", "ml-4");
    form.appendChild(searchBar);
    form.appendChild(searchBtn);
    btnContainerEl.appendChild(form);

    const inputButtonContainerEl = document.createElement('div');
    btnContainerEl.appendChild(inputButtonContainerEl);

    let favBtnDiv = document.createElement("div");
    inputButtonContainerEl.appendChild(favBtnDiv); 

    inputButtonContainerEl.classList.add("field","has-addons");
    //old favorites button
    favBtnDiv.classList.add("control")
    let favBtn = document.createElement('button');
    favBtn.textContent = "Favorites";
    favBtn.classList.add("button","is-danger", "is-normal", "has-text-white", "control");
    favBtnDiv.appendChild(favBtn);
             
    let searchValue = searchBar.value;
    
    searchBtn.addEventListener("click",function() {
        
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {.3
            getAdvice(searchTerm);
            saveTerm(searchTerm);
            //saveSearch(searchTerm);
            //goes to favorite button
        } else {
            return; //add modal if time
        }
        
    })

   

    let saveBtnDiv = document.createElement("div");
    inputButtonContainerEl.appendChild(saveBtnDiv); 

    var saveTerm = function(save){
        // let searchValue = searchBar.value;
        saveBtnDiv.innerHTML="";
        saveBtnDiv.classList.add("control")
        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Save Search";
        saveBtnDiv.appendChild(saveBtn);
        saveBtn.classList.add("button","is-danger", "is-normal", "has-text-white");
        saveBtn.addEventListener("click", function(){
        saveSearch(save);
        loadSearch();
        })
    }    
             
    let backbtnDiv = document.createElement("div");
    inputButtonContainerEl.appendChild(backbtnDiv);    

    let clearBtnDiv = document.createElement("div");
    inputButtonContainerEl.appendChild(clearBtnDiv);
    //btnContainerEl.appendChild(saveBtnDiv);     

       

    favBtn.addEventListener("click", function() {
        displayFavorites();
        loadSearch(searchValue);
        form.classList.add("invisible");
        //make backbtn div, append to btn container
                    
        backbtnDiv.innerHTML="";
        backbtnDiv.classList.add("control")
        let backButton = document.createElement("button");
        backButton.textContent = "Back";
        backbtnDiv.appendChild(backButton);
        backButton.classList.add("button","is-danger", "is-normal", "has-text-white");
        backButton.addEventListener("click", function() {
            displayInitialPage();  
            adviceContainerEl.innerHTML = ""; 
        })
        clearBtnDiv.innerHTML="";
        clearBtnDiv.classList.add("control")
        let clearBtn = document.createElement("button");
        clearBtn.textContent = "Clear All";
        clearBtnDiv.appendChild(clearBtn);
        clearBtn.classList.add("button","is-danger", "is-normal", "has-text-white");
        clearBtn.addEventListener("click", function(){
            clearSearchHistory();
        })

        
    }) 
};



displayInitialPage();



//get button style layout working better (css/bulma)

//non-repeatable history buttons (this one will take time...)

//open chest icon if possible (something something interval 5000 or 3000)

//possible css animations to be added in

//search button activates with the ENTER button (possible switch to submit form instead of input?)
//prevent.eventdefault for ENTER button switch 

//fix the background when you are changing sizes (don't use responsive, use actually sizes)

//possible set size for giphy (giphy size changes background size)
//ensure that div for background and white div remain the same^^
