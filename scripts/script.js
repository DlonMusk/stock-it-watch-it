// Global Variables
let query = "";
let regEx = new RegExp('[a-zA-Z]');

let stockSearchEl = $('#stockSearch');
let searchBtnEl = $('#btnSearch');
let newWatchlistBtnEl = $('.new-watchlist');
let watchListsEl = $('#watchlists');
let modalEl = $('.modal');


let url = 'https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=AAPL';

const options = {
  method: 'GET',
  headers: {
    'x-api-key': '8zF1gtbfEHaIOQPxuiS6c8qefNIML8YL7kx2wXnF'
  }
};

//_____________________________________________________________________________________________________________________________________________
// DYLAN's CODES (YOU CAN FUCK WITH THIS)

let createModal = () => {
  let symbol = stockSearchEl.val().split(':');

  symbol = symbol[0];
  console.log(symbol);
  let url = `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbol}`
  fetch(url, options).then(function (response) {
    return response.json();
  }).then(function (data) {
    modalEl.empty();
    modalEl.append($('<p>').text(`Current Price: ${data.bid}`));
    modalEl.append($('<p>').text(`Day Range: ${data.regularMarketDayRange}`));

    let watchlistName = "";

    // select the watchlist you want to add too, if only 1 then add to that
    if (watchListsEl.children().length == 0) {
      createNewWatchlist();
      return;
    }


    $(function () {
      modalEl.dialog({
        dialogClass: 'no-close',
        title: data.displayName,
        resizable: false,
        height: "auto",
        width: 'auto',
        modal: true,
        buttons: {
          "Add": function () {
            // create new modal to select the watchlist
            console.log(watchListsEl.children().length)
            if (watchListsEl.children().length == 1) {
              watchlistName = watchListsEl.children()[0].dataset.name
            }

            if (watchListsEl.children().length > 1) {
              modalEl.empty();
              // create buttons object with children
              let buttons = {};
              for (let i = 0; i < watchListsEl.children().length; i++) {
                buttons[`${watchListsEl.children()[i].dataset.name}`] = function () {
                  watchlistName = watchListsEl.children()[i].dataset.name;

                  // REFACTOR
                  $(`.${watchlistName}-watchlist`).append(
                    `<div class="card col-3 mx-3" style="width: 18rem;">
                                  <div class="card-header">${data.displayName}</div>
                                  <div class="card-body">
                                      <h6 class="card-subtitle mb-2 text-muted">${data.symbol}</h6>
                                      <p class="card-text">Current Price: ${data.bid}</p>
                                      <p class="card-text">Day Range: ${data.regularMarketDayRange}</p>
                                  </div>
                              </div>`);
                  $(this).dialog('close');
                }
              }
              console.log(buttons);
              $(function () {
                modalEl.dialog({
                  title: 'Choose Your Watchlist',
                  resizable: false,
                  height: "auto",
                  width: 400,
                  modal: true,
                  buttons: buttons
                });
              });
              console.log(watchlistName)


            }


            // REFACTOR
            $(`.${watchlistName}-watchlist`).append(
              `<div class="card col-3 mx-3" style="width: 18rem;">
                      <div class="card-header">${data.displayName}</div>
                      <div class="card-body">
                          <h6 class="card-subtitle mb-2 text-muted">${data.symbol}</h6>
                          <p class="card-text">Current Price: ${data.bid}</p>
                          <p class="card-text">Day Range: ${data.regularMarketDayRange}</p>
                      </div>
                  </div>`)
            $(this).dialog("close");
          },
          Cancel: function () {
            $(this).dialog("close");
          }
        }
      });
    })

  })


}

let deleteWatchList = (event) => {
  console.log(event);
}

// DO NOT ALLOW MORE THAN 5 WATCHLISTS
let createNewWatchlist = () => {
  modalEl.empty();
  modalEl.append(`<input type='text' class='get-name'>`);
  let title = 'New WatchList';


  // if no watchlists
  if (watchListsEl.children().length == 0) {
    title = 'First Create A WatchList';
    console.log(title);

  }

  if (watchListsEl.children().length !== 0) {
    console.log("HERE " + watchListsEl.children()[0].dataset)
  }


  $(function () {
    modalEl.dialog({
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
          console.log(name);
          let newWatchListEl = $('<div>').attr(`data-name`, name).addClass('watchlist').append(`
                      <button class="btn btn-primary col-12" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapse${name}" aria-expanded="false" aria-controls="collapseExample">
                      Show ${name} WatchList
                      </button>
                      <div class="collapse" id="collapse${name}">
                          <div class="row card-body ${name}-watchlist">

                          </div>
                          <button class="btn btn-danger col-12 delete-${name}">Delete Watchlist</button>
                      </div>
                  `);
          console.log(newWatchListEl);
          watchListsEl.append(newWatchListEl);
          $(`delete-${name}`).on('click', deleteWatchList)
          //localStorage.setItem('watchlists', JSON.stringify(watchListsEl))  
          $(this).dialog("close");
        },
        Cancel: function () {
          $(this).dialog("close");
        }
      }
    });
  })

}



// auto complete function for search
const autoCompleteSearch = (event) => {
  let availableTags = [];
  if (regEx.test(event.originalEvent.key) && event.originalEvent.key != 'Backspace') {
    query += event.originalEvent.key;
  } else if (event.originalEvent.key == 'Backspace' || event.originalEvent.key == 'Delete') {
    let newStringArr = query.split('');
    newStringArr.pop();
    query = newStringArr.join('');
  }
  console.log(query);

  let url = `https://yfapi.net/v6/finance/autocomplete/?lang=en&query=${query}`

  fetch(url, options).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data.ResultSet.Result);
    for (let i = 0; i < data.ResultSet.Result.length; i++) {
      console.log(data.ResultSet.Result[i].name);
      let newSelectName = data.ResultSet.Result[i].name;
      let newSelectTicker = data.ResultSet.Result[i].symbol;
      if (availableTags.length < 6) {
        availableTags.push(`${newSelectTicker}: ${newSelectName}`)
      }
    }
    console.log(availableTags);
  }).then(function () {
    $("#stockSearch").autocomplete({
      source: availableTags
    });
  });
}


// Event Listeners

newWatchlistBtnEl.on('click', createNewWatchlist);
stockSearchEl.on('keyup', autoCompleteSearch);
searchBtnEl.on('click', createModal);


//_____________________________________________________________________________________________________________________________________________



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
//____________________________________________________________________________________________________________________________________________ 





