//frameworks
const axios = require('axios');
const cheerio = require('cheerio');

// url which we gonna use
url_soccer = "https://www.soccerstats.com/leagues.asp";

const headers = {
    headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0"
    }
}

const leagues = [];
const allData = [];
const teams = [];

// setting a default url in order to merge with all links we gonna get
axios.default.baseURL = "https://www.soccerstats.com/"

// function we gonna take the links then use it to get the tables
async function getData(url) {
    try {
        const response = await axios.get(url, headers, withCredentials=true)
        const $ = cheerio.load(response.data)
        const links = $("table:nth-child(3) tr[height=34]"); 

        links.each(function() {
            const link = $(this).find("td[align=center] a[class=vsmall]").attr("href");
            leagues.push(axios.default.baseURL + link);
        })


        for(let league of leagues) {
            const data = await getTable(league);
            allData.push(data);
            
        }

        // here we could save the data into a file
        // the index 0 was used because objects are inside a list which is inside another one (teams list)
        console.log(JSON.stringify(allData[0]));
        

    } catch (error) {
        console.log(error);
    }
}

// function for scraping the tables of each league
async function getTable(url) {
    try {
        const response = await axios.get(url, headers, withCredentials=true);
        const $ = cheerio.load(response.data);
        
        const table = $("table:nth-child(9) tr[class=odd]");
        
        table.each(function() {
            const h1 = $("h1").text();
            const team = $(this).find('td[align=left] a').text();
            const ppg = Number($(this).find('td:nth-child(12) > font[color=black]').text());
            const last_8 = Number($(this).find('td:nth-child(13)').text());
            teams.push({h1, team, ppg, last_8});
        })
        
        return teams;
        

    } catch (error) {
        console.log(error);
    }
}

// call the function
getData(url_soccer);



