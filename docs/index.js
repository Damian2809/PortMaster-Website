var articles = [];
var jsonData = {};
var articleIndex = 0;

function populateArticles() {

    const articleElement = document.createElement('article');
    articleElement.setAttribute("class", "blog-post");

    const titleElement = document.createElement('h2');
    titleElement.setAttribute("class", "display-5 link-body-emphasis mb-1");
    titleElement.textContent = articles[articleIndex].title;

    const authorElement = document.createElement('p');
    authorElement.setAttribute("class", "blog-post-meta");
    authorElement.textContent = articles[articleIndex].author;

    const contentElement = document.createElement('p');
    var converter = new showdown.Converter();
    contentElement.innerHTML = converter.makeHtml(articles[articleIndex].content);

    articleElement.appendChild(titleElement);
    articleElement.appendChild(authorElement);
    articleElement.appendChild(contentElement);

    var articlesElement = document.getElementById("articles-section");
    articlesElement.innerHTML = "";
    articlesElement.appendChild(articleElement);

 

    if (articleIndex + 1 < articles.length) {
        document.getElementById("olderButton").disabled = false;
        
    }
    else {
        document.getElementById("olderButton").disabled = true;
    }

  
    if (articleIndex < 1) {
        document.getElementById("newerButton").disabled = true;
        
    }
    else {
        document.getElementById("newerButton").disabled = false;
    }

}

function updateArticles(value) {
    if (articleIndex + value > -1 && articleIndex + value < articles.length) {
        articleIndex += value;
        populateArticles();
    }




}

function populateRecentPorts() {

    const list = document.getElementById("recents");
    jsonData.sort(function (a, b) {
        if (Date.parse(a.date_updated) > Date.parse(b.date_updated))
            return -1
    });
    for (var key of Object.keys(jsonData.slice(0, 5))) {

        const listItem = document.createElement('li');

        const main = document.createElement('a');
        main.setAttribute("class", "d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top");

        const image = document.createElement("img");
        var source = "https://raw.githubusercontent.com/PortsMaster/PortMaster-Website/main/no.image.png";
        if (jsonData[key].attr.media.screenshot !== null) {
            source = "https://raw.githubusercontent.com/christianhaitian/PortMaster/main/images/" + jsonData[key].attr.media.screenshot;
        }
        image.src = source;
        image.setAttribute("width", "40%%");
        image.setAttribute("height", "40%");
        image.setAttribute("class", "bd-placeholder-img");


        const divElement = document.createElement('div');
        divElement.setAttribute("class", "col-lg-8");

        const titleElement = document.createElement('h6');
        titleElement.setAttribute("class", "mb-0");
        titleElement.textContent = jsonData[key].attr.title;

        const dateElement = document.createElement('small');
        dateElement.setAttribute("class", "text-body-secondary");
        dateElement.textContent = jsonData[key].date_updated;

        divElement.appendChild(titleElement);
        divElement.appendChild(dateElement);
        main.appendChild(image);
        main.appendChild(divElement);

        listItem.appendChild(main);
        list.appendChild(listItem);
    };


}


async function getPageContent() {

    try {
        var response = await fetch('https://raw.githubusercontent.com/PortsMaster/PortMaster-Website/main/ports.json'); // Replace 'YOUR_JSON_URL_HERE' with the actual URL of your JSON data.
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        jsonData = await response.json();
        jsonData = jsonData.ports;
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }

    try {
        var response = await fetch('https://raw.githubusercontent.com/PortsMaster/PortMaster-Website/main/news.json'); // Replace 'YOUR_JSON_URL_HERE' with the actual URL of your JSON data.
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        articles = await response.json();
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }

    articles.reverse();
    populateArticles();
    populateRecentPorts();

}



window.onload = function () {
    getPageContent();
};
