const API_KEY = "eb0514986c0a4e94b99595bc04e58b9b";

/* 변수선언&이벤트 START */
let newsList = [];
let searchToggle = false;
let searchBox = document.querySelector(".search-input-box");

const barIcon = document.querySelector(".bar-icon");

const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
const sideMenuBox = document.querySelectorAll(".side-menu-box button");
sideMenuBox.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

const userInput = document.getElementById("input-box");
userInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    getNewsByKeyword();
  }
});
userInput.addEventListener("focus", () => {
  userInput.value = "";
});

// let url = new URL(
//   `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
// );

// 제출용 url
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

/* 변수선언&이벤트 END */

/* 공통 함수 START */
const getNews = async () => {
  try {
    console.log("page", page);
    url.searchParams.set("page", page); // => &page=page url 호출전에 붙여서 fetch
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }

      // console.log("rrr", response);
      // console.log("ddd", data);
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
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
            <img class="news-img-size" src=${urlImg} 
            onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';"/>
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

  // 페이지 초기화
  page = 1;
  getNews();

  if (document.querySelector(".side-menu-box").classList.contains("show")) {
    document.querySelector(".side-menu-box").classList.remove("show");
  }
};

// 검색버튼으로 키워드 검색하기
const getNewsByKeyword = async () => {
  const keyword = userInput.value;

  if (keyword == "") {
    userInput.focus();
  }

  // url = new URL(
  //   `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
  // );

  // 제출용 url
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );

  // 페이지 초기화
  page = 1;
  getNews();
};

/* url 호출 함수 END */

/* 페이징 START */
const paginationRender = () => {
  // totalResults => api에서 제공
  // page ,pageSize ,groupSize => 내가 지정
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // lastPage
  let lastPage =
    pageGroup * groupSize > totalPages ? totalPages : pageGroup * groupSize;
  // 마지막페이지 그룹이 그룹사이즈보다 작을경우 => lastPage는 totalPage
  // if (lastPage > totalPages) {
  //   lastPage = totalPages;
  // }
  // firstPage
  let firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "now-page" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item">
        <a class="page-link" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;

  //   <nav aria-label="Page navigation example">
  //   <ul class="pagination">
  //     <li class="page-item">
  //       <a class="page-link" href="#" aria-label="Previous">
  //         <span aria-hidden="true">&laquo;</span>
  //       </a>
  //     </li>
  //     <li class="page-item"><a class="page-link" href="#">1</a></li>
  //     <li class="page-item"><a class="page-link" href="#">2</a></li>
  //     <li class="page-item"><a class="page-link" href="#">3</a></li>
  // <li class="page-item">
  //   <a class="page-link" href="#" aria-label="Next">
  //     <span aria-hidden="true">&raquo;</span>
  //   </a>
  // </li>
  //   </ul>
  // </nav>
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};
/* 페이징 END */
/* HTML 제어 START */
const openMenu = () => {
  document.querySelector(".side-menu-box").classList.add("show");
};

const closeMenu = () => {
  document.querySelector(".side-menu-box").classList.remove("show");
};

const search = () => {
  searchBox.style.display =
    searchBox.style.display === "block" ? "none" : "block";
};
/* HTML 제어 END */
