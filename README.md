# All the News That's Fit to Scrape

This is web app that lets users view and leave comments on the latest news.

Whenever a user visits this site, the app scrapes stories from a news outlet and displays them for the user. Each scraped article is saved to the application database. 

The app displays the following:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article
  
     * Additional content (photos, bylines, and so on).

Users are able to leave comments on the articles displayed and revisit them later. The comments are saved to the database as and are associated with their articles. Users are able to delete comments left on articles. All stored comments are visible to every user.


## Built With

* Body-parser
* Cheerio
* CSS
* Express
* Express-Handlebars
* Heroku
* HTML5
* JavaScript
* Mongoose
* Morgan
* Request
