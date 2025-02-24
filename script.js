const API_KEY = "eb0514986c0a4e94b99595bc04e58b9b";
let news = [];

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

  news = data.articles;

  console.log("response: ", response);
  console.log("data: ", data);

  console.log("news: ", news);
};

getLatesNews();
