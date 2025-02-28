const API_KEY = "eb0514986c0a4e94b99595bc04e58b9b";

/* 변수선언&이벤트 START */
let newsList = [];
let searchToggle = false;
let searchBox = document.querySelector(".search-input-box");

const menuBox = document.querySelector(".menu-box");
const barIcon = document.querySelector(".bar-icon");

const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const userInput = document.getElementById("input-box");
userInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    getNewsByKeyword();
  }
});

// let url = new URL(
//   `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
// );

// 제출용 url
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);

/* 변수선언&이벤트 END */

/* 공통 함수 START */
const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
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

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

/* 공통 함수 END */

/* url 호출 함수 START */
const getLatesNews = async () => {
  // 제출용 url
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );
  getNews();
};

getLatesNews();

//  카테코리로 뉴스 검색하기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
  // );

  // 제출용 url
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );

  getNews();
};

// 검색버튼으로 키워드 검색하기
const getNewsByKeyword = async () => {
  const keyword = userInput.value;
  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
  // );

  // 제출용 url
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );

  getNews();
};

/* url 호출 함수 END */

/* HTML 제어 START */
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
/* HTML 제어 END */
