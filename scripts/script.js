

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
        for (var i = 0; i < news.length; i++) {
            var newsURL = news[i].news_url;
            var imageURL = news[i].image_url;
            var newsSent = news[i].sentiment;
            var newsSource = news[i].source_name;
            var newsTitle = news[i].title;
            var newsText = news[i].text;
            var newsType = news[i].type;
            $(".currentNews").append(
                `<div class="newscard mt-3">

                 <a target="_blank" href="${newsURL}" class="imagePreview"><img src="${imageURL}" class="newsImage"></a>
                 <div class="titlesearch"><a target="_blank" href="${newsURL}">${newsTitle}</a></div>


                </div>`
            );
        }
      })
};
GRABNEWS();


//____________________________________________________________________________________________________________________________________________ 

