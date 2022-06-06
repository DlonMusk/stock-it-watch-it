// Global Variables
let query = "";
let regEx = new RegExp('[a-zA-Z]');
let themecount = 0;
let stockSearchEl = $('#stockSearch');
let searchBtnEl = $('#btnSearch');
let newWatchlistBtnEl = $('.new-watchlist');
let watchListsEl = $('#watchlists');
let modalEl = $('.modal');


// api call variables
let url = 'https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=AAPL';

const options = {
  method: 'GET',
  headers: {
    'x-api-key': '8zF1gtbfEHaIOQPxuiS6c8qefNIML8YL7kx2wXnF'
  }
};

//_____________________________________________________________________________________________________________________________________________
// DYLAN's CODE

// function to create modal to add searched stock
let createModal = (event) => {
  event.preventDefault();
  //code for autocomplete
  let symbol = stockSearchEl.val().split(':');
  symbol = symbol[0].trim();

  // complete url
  let url = `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbol}`;

  fetch(url, options).then(function (response) {
    return response.json();
  }).then(function (data) {
    data = data.quoteResponse.result[0];

    // empty modal and show stock data
    modalEl.empty();
    modalEl.append($('<p>').text(`Current Price: ${data.bid}`));
    modalEl.append($('<p>').text(`Day Range: ${data.regularMarketDayRange}`));

    let watchlistName = "";

    // select the watchlist you want to add too, if only 1 then add to that if none prompt the user to create one
    if (watchListsEl.children().length == 0) {
      createNewWatchlist();
      return;
    }

    // if more than one watchlist create modal to let user select watchlist
    $(function () {
      modalEl.dialog({
        position: { my: 'center', at: 'top+80px', of: $('#watchlists') },
        dialogClass: 'no-close',
        title: data.displayName,
        resizable: false,
        height: "auto",
        width: 'auto',
        modal: true,
        buttons: {
          "Add": function () {
            // create new modal to select the watchlist, if only 1 do not prompt and put stock in current watchlist
            if (watchListsEl.children().length == 1) {
              watchlistName = watchListsEl.children()[0].dataset.name
            }

            else if (watchListsEl.children().length > 1) {
              modalEl.empty();
              // create buttons object with children
              let buttons = {};
              // create buttons for modal and add functions to add stock data to selected watchlist
              for (let i = 0; i < watchListsEl.children().length; i++) {
                buttons[`${watchListsEl.children()[i].dataset.name}`] = function () {
                  watchlistName = watchListsEl.children()[i].dataset.name;


                  $(`.${watchlistName}-watchlist`).append(
                    `<div class="card col-3 m-3" style="width: 18rem;">
                                  <div class="card-header">${data.displayName}</div>
                                  <div data-ticker="${data.symbol}" class="card-body">
                                      <h6 class="card-subtitle mb-2 text-muted">${data.symbol}</h6>
                                      <p class="card-text">Current Price: ${data.bid}$</p>
                                      <p class="card-text">Day Range: ${data.regularMarketDayRange}</p>
                                      <p class="card-text">Day Change: ${data.regularMarketChangePercent.toFixed(2)}%</p>
                                  </div>
                                  <button class="btn btn-danger remove-stock-btn">remove</button>
                              </div>`);
                  $('.remove-stock-btn').on('click', removeStock);
                  savePortfolio();
                  $(this).dialog('close');
                }
              }

              $(function () {
                modalEl.dialog({
                  position: { my: 'center', at: 'top+80px', of: $('#watchlists') },
                  title: 'Choose Your Watchlist',
                  resizable: false,
                  height: "auto",
                  width: 400,
                  modal: true,
                  buttons: buttons
                });
              });
            }


            // add to watchlist if only 1
            $(`.${watchlistName}-watchlist`).append(
              `<div class="card col-3 m-3" style="width: 18rem;">
                      <div class="card-header">${data.displayName}</div>
                      <div data-ticker="${data.symbol}" class="card-body">
                          <h6 class="card-subtitle mb-2 text-muted">${data.symbol}</h6>
                          <p class="card-text">Current Price: ${data.bid}$</p>
                          <p class="card-text">Day Range: ${data.regularMarketDayRange}</p>
                          <p class="card-text">Day Change: ${data.regularMarketChangePercent.toFixed(2)}%</p>
                      </div>
                      <button class="btn btn-danger remove-stock-btn">remove</button>
                  </div>`);
            $('.remove-stock-btn').on('click', removeStock);

            // save changes to local storage
            savePortfolio();
            $(this).dialog("close");
          },
          Cancel: function () {
            $(this).dialog("close");
          }
        }
      });
    })

  })
  savePortfolio();
}

// deletes selected watchlist
let deleteWatchList = (event) => {
  $(`.${event.currentTarget.dataset.delete}-delete`).remove();
  savePortfolio();
}

// removes selected stock from watchlist
let removeStock = (event) => {
  event.currentTarget.offsetParent.remove();
  savePortfolio();
}

// save the watchlists html to localstorage
let savePortfolio = () => {
  localStorage.setItem('portfolio', JSON.stringify($('#watchlists').html()));
}

// grab portfolio data from localstorage on page load, set buttons on html
let getPortfolio = () => {
  $('#watchlists').html(JSON.parse(localStorage.getItem('portfolio')));
  $('.delete-watchlist').on('click', deleteWatchList);
  $('.remove-stock-btn').on('click', removeStock);
  updateWatchlists();
}

// creates a new watchlist, the user can create a max of 5 
let createNewWatchlist = () => {
  modalEl.empty();
  modalEl.append(`<input type='text' class='get-name' maxlength='20'>`);
  let title = 'New WatchList';


  // user adds a stock before creating a watchlist change prompt title
  if (watchListsEl.children().length == 0) {
    title = 'Create A WatchList';
  }


  

  // if the user has created 5 watchlists prompt them with the info
  if (watchListsEl.children().length == 5) {
    modalEl.empty();
    $(function () {
      modalEl.dialog({
        position: { my: 'center', at: 'top+80px', of: $('#watchlists') },
        title: 'Max of 5 watchlists',
        resizable: false,
        height: "15vh",
        width: '20vw',
        modal: true,
        buttons: {
          'Close': function () { $(this).dialog('close') }
        }
      })
    })
    return;
  }

  // prompt the user to create the watchlist and add it to the watchlists area
  $(function () {
    modalEl.dialog({
      position: { my: 'center', at: 'top+80px', of: $('#watchlists') },
      dialogClass: 'no-close',
      title: title,
      resizable: false,
      height: "auto",
      width: 'auto',
      modal: true,
      buttons: {
        "Add": function () {
          let name = $('.get-name').val();
          if (name == "") { $(this).dialog('close'); $('.get-name').text(""); return }
          // checking for watchlist with same name
          if (watchListsEl.children().length > 0) {
            for (let i = 0; i < watchListsEl.children().length; i++) {
              if ($('.get-name').val() == watchListsEl.children()[i].dataset.name) {
                modalEl.empty();
                $(function () {
                  modalEl.dialog({
                    position: { my: 'center', at: 'top+80px', of: $('#watchlists') },
                    title: 'Name Taken',
                    resizable: false,
                    height: "15vh",
                    width: '20vw',
                    modal: true,
                    buttons: {
                      'Close': function () { $(this).dialog('close') }
                    }
                  })
                })
                return;
              }
            }
          }

          let newWatchListEl = $('<div>').attr(`data-name`, name).addClass(`${name}-delete watchlist mb-3`).append(`
                      <button class="btn watchlist-btn col-12" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapse${name}" aria-expanded="false" aria-controls="collapseExample" style="background-color: var(--skyblue)">
                      Show ${name} WatchList
                      </button>
                      <div class="collapse inner-watchlist" id="collapse${name}">
                          <div class="row card-body ${name}-watchlist">
                          </div>
                          <button data-delete="${name}" class="btn btn-danger col-12 delete-watchlist">Delete Watchlist</button>
                      </div>
                  `);
          watchListsEl.append(newWatchListEl);
          $('.delete-watchlist').on('click', deleteWatchList);
          $(this).dialog("close");
        },
        Cancel: function () {
          $(this).dialog("close");
        }
      }
    });
  })

}

let updateWatchlists = () => {
  let watchlists = $('.inner-watchlist');

  for(let i = 0; i < watchlists.length; i++){
    let tickers = watchlists[i].children[0].children;
    for(let j = 0; j < tickers.length; j++){

      let symbol = tickers[j].children[1].dataset.ticker

      fetch(`https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbol}`, options).then(function(response){
        return response.json();
      }).then(function(data){

        data = data.quoteResponse.result[0];
        tickers[j].children[1].innerHTML = `
        <h6 class="card-subtitle mb-2 text-muted">${data.symbol}</h6>
        <p class="card-text">Current Price: ${data.bid}$</p>
        <p class="card-text">Day Range: ${data.regularMarketDayRange}</p>
        <p class="card-text">Day Change: ${data.regularMarketChangePercent.toFixed(2)}%</p>`;

      })
    }
  }
}




// // auto complete function for search
// const autoCompleteSearch = (event) => {
//   let availableTags = [];
//   if (regEx.test(event.originalEvent.key) && event.originalEvent.key != 'Backspace') {
//     query += event.originalEvent.key;
//   } else if (event.originalEvent.key == 'Backspace' || event.originalEvent.key == 'Delete') {
//     let newStringArr = query.split('');
//     newStringArr.pop();
//     query = newStringArr.join('');
//   }
//   console.log(query);

//   let url = `https://yfapi.net/v6/finance/autocomplete/?lang=en&query=${query}`

//   fetch(url, options).then(function (response) {
//     return response.json();
//   }).then(function (data) {
//     console.log(data.ResultSet.Result);
//     for (let i = 0; i < data.ResultSet.Result.length; i++) {
//       console.log(data.ResultSet.Result[i].name);
//       let newSelectName = data.ResultSet.Result[i].name;
//       let newSelectTicker = data.ResultSet.Result[i].symbol;
//       if (availableTags.length < 6) {
//         availableTags.push(`${newSelectTicker}: ${newSelectName}`)
//       }
//     }
//     console.log(availableTags);
//   }).then(function () {
//     $("#stockSearch").autocomplete({
//       source: availableTags
//     });
//   });
// }



// Event Listeners

newWatchlistBtnEl.on('click', createNewWatchlist);
//stockSearchEl.on('keydown', autoCompleteSearch);
searchBtnEl.on('click', createModal);

getPortfolio();

//_____________________________________________________________________________________________________________________________________________
// ALTHEA'S CODE (NERVOUS)

// Use Fetch API to GET data from OpenWeather API
function getWeatherData() {
  let coordinates = "";
  const APIKEY = '8cd7970543abb6bc1241aa086789ff58';

  // to be able to get the current browser location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      coordinates = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
      console.log(typeof coordinates);

      let URL = `https://api.openweathermap.org/data/2.5/onecall?${coordinates}&units=metric&appid=${APIKEY}`;
      let nameURL = `http://api.openweathermap.org/geo/1.0/reverse?${coordinates}&appid=${APIKEY}`;


      fetch(URL).then(function (response) {
        return response.json()
      }).then(function (data) {
        fetch(nameURL).then(function (response) {
          return response.json()
        }).then(function (info) {
          console.log(data);
          console.log(info);
          renderData(data.current, info[0].name);
        })
      })
    })
  } else {
    console.log('unable to retrieve location from browser')
  }
}
getWeatherData();



// Get data info to post on the frontend
let renderData = (weather, cityName) => {
  console.log(weather, cityName);
  //  These items exist
  const myWeather = document.getElementsByClassName('weather')[0];

  // These items do not exist yet
  const currentLocation = document.createElement("div");
  currentLocation.innerHTML = cityName;
  const currentTemp = document.createElement("div");
  console.log(weather);
  currentTemp.innerHTML = Math.round(weather.temp) + "°C";

  const foreCast = document.createElement("div");
  foreCast.innerHTML = (weather.weather[0].description);

  //  These will make my items exist
  currentLocation.appendChild(foreCast);
  currentLocation.appendChild(currentTemp);
  myWeather.appendChild(currentLocation);
}




//_____________________________________________________________________________________________________________________________________________
// TONY's CODES (DONT FUCK WITH THIS)
function GRABNEWS() {
  var requestURL = 'https://stocknewsapi.com/api/v1/category?section=general&items=9&page=1&token=rvngq2ylyqtk4trw2lpddxrqsfdndxsw1yrea2eh'
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      news = data.data;
      console.log(news);
      $(".currentNews").empty();
      for (var i = 0; i < news.length; i++) {
        var newsURL = news[i].news_url;
        var newsDate = news[i].date.substring(0, 22);
        var imageURL = news[i].image_url;
        var newsSent = news[i].sentiment;
        var sentColor = "";
        if (newsSent == "Neutral") {
          var sentColor = "sentOrange";
        } else if (newsSent == "Negative") {
          var sentColor = "sentRed";
        } else if (newsSent == "Positive") {
          var sentColor = "sentGreen";
        }
        var newsSource = news[i].source_name;
        var newsTitle = news[i].title;
        var texttext = news[i].text;
        var textLength = 100;
        var newsText = texttext.substring(0, textLength) + "...";
        var newsType = news[i].type;
        $(".currentNews").append(
          `<div class="newscard mt-3">
               <div target="_blank" href="${newsURL}" class="imagePreview"><img src="${imageURL}" class="newsImage"></div>
               <div class="titlesearch lead"><a class="link" href="${newsURL}">${newsTitle}</a> <hr></div>
               <div class="textsearch"> ${newsSource} | ${newsDate} </div>
               <div class="sentiment"> 
                <div class="${sentColor}">${newsSent}</div>
               </div>
              </div>`
        );
      }
    })
};
GRABNEWS();
$('body').css('font-family', 'Quicksand');

function CHANGETHEME() {
  themecount++;
  if (themecount == 1) {
    document.documentElement.style.setProperty('--slate', '#b49fcc');
    document.documentElement.style.setProperty('--skyblue', '#ead7d7');
    document.documentElement.style.setProperty('--emerald', '#6d466b');
    $('body').css('font-family', 'Kdam Thmor Pro');
  } else if (themecount == 2) {
    document.documentElement.style.setProperty('--slate', 'rgb(100 116 139)');
    document.documentElement.style.setProperty('--skyblue', 'rgb(14 165 233)');
    document.documentElement.style.setProperty('--emerald', 'rgb(16 185 129)');
    $('body').css('font-family', 'Quicksand');
  } else if (themecount == 3) {
    themecount = 0;
    document.documentElement.style.setProperty('--slate', '#ef7674');
    document.documentElement.style.setProperty('--skyblue', '#EC5766');
    document.documentElement.style.setProperty('--emerald', '#DA344D');
    $('body').css('font-family', 'Indie Flower');
  }
}

$('#theme').on("click", CHANGETHEME)
//____________________________________________________________________________________________________________________________________________ 
