// Global Variables
let query = "";
let regEx = new RegExp('[a-zA-Z]');

let stockSearchEl = $('#stockSearch');

let url = 'https://yfapi.net/v6/finance/autocomplete/?lang=en&query=A';

const options = {
  method: 'GET',
  headers: {
    'x-api-key': '8zF1gtbfEHaIOQPxuiS6c8qefNIML8YL7kx2wXnF'
  }
};

//_____________________________________________________________________________________________________________________________________________
// DYLAN's CODES (YOU CAN FUCK WITH THIS)

// auto complete function for search
const autoCompleteSearch = (event) => {
  let availableTags = [];
  if (regEx.test(event.originalEvent.key) && event.originalEvent.key != 'Backspace') {
    
      query += event.originalEvent.key;
  }else if(event.originalEvent.key == 'Backspace' || event.originalEvent.key == 'Delete'){
      let newStringArr = query.split('');
      newStringArr.pop();
      query = newStringArr.join('');
  }
  console.log(query);

  url = `https://yfapi.net/v6/finance/autocomplete/?lang=en&query=${query}`

  fetch(url, options).then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data.ResultSet.Result);
    for (let i = 0; i < data.ResultSet.Result.length; i++) {
      console.log(data.ResultSet.Result[i].name);
      let newSelectName = data.ResultSet.Result[i].name;
      let newSelectTicker = data.ResultSet.Result[i].symbol;
      if(availableTags.length < 6){
        availableTags.push(`${newSelectTicker}: ${newSelectName}`)
      }
    }
    console.log(availableTags);
  }).then(function() {
    $( "#stockSearch" ).autocomplete({
      source: availableTags
    });
  });
}


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
          var newsDate = news[i].date.substring(0,22);
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


// event listeners
stockSearchEl.on('keyup', autoCompleteSearch);

