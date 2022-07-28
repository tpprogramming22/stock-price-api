const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json("Welcome to the stock API");
});

app.get("/stock/:stockId", async (req, res) => {
const articles = [];
  
  const stockChoice = req.params.stockId;
  const site = `https://uk.finance.yahoo.com/quote/${stockChoice}`
  axios
    .get(site)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('fin-streamer:contains("")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("data-symbol");
        articles.push({
          title,
          url,
        });
      });
    }).then(
        ()=>{
            if(articles[18] && articles[18] != '""'){
                console.log('Success')
                const stockPrice = articles[18].title;
                res.json(stockPrice);
            }
            else{
                console.log('Failed')
                res.json('Stock not found.')
            }
        }
    );



});

app.listen(PORT, () => console.log(`Working on port: ${PORT}`));
