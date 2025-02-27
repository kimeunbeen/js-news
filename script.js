const API_KEY = "eb0514986c0a4e94b99595bc04e58b9b";
let newsList = [];
let searchToggle = false;
let searchBox = document.querySelector(".search-input-box");

const menuBox = document.querySelector(".menu-box");
const barIcon = document.querySelector(".bar-icon");

const getLatesNews = async () => {
  // const url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  // );

  // 제출용 url
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  const response = await fetch(url);
  const data = await response.json();

  newsList = data.articles;
  render();
  console.log("response: ", response);
  console.log("data: ", data);

  console.log("news: ", newsList);
};

const render = () => {
  const newsHTML = newsList
    .map((news) => {
      const urlImg = news.urlToImage
        ? news.urlToImage
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";

      return `<div class="row news">
          <div class="col-lg-4">
            <img class="news-img-size" src=${urlImg} />
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${
              news.description == null || news.description == ""
                ? "No content"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name || "no source"} * ${moment(
        news.publishedAt
      ).fromNow()}</div>
          </div>
        </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const openMenu = () => {
  document.querySelector(".menu-box").classList.add("show");
};

const closeMenu = () => {
  document.querySelector(".menu-box").classList.remove("show");
};

const search = () => {
  searchBox.style.display =
    searchBox.style.display === "block" ? "none" : "block";
};

getLatesNews();
