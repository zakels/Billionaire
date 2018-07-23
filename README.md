# Billionaire

# Table of contents
1. [Purpose](#Purpose)
2. [Functional Requirements](#Func)
3. [High-Level Overview of the System](#overview)
4. [Flow of Events](#flow)
5. [Design Decision](#decision)
6. [Further Information](#further)

## Purpose <a name="Purpose"></a>
Billionaire is a program or application that attempts to reproduce or duplicate some or all features of a live stock market on a computer so that a player may practice trading stocks without financial risk. Virtual stock trading is a simulated trading process in which would-be investors can 'practice' investing without committing real money.

This is done by the manipulation of imaginary money and investment positions that behave in a manner similar to the real markets. Before the widespread use of online trading for the general public, paper trading was considered too difficult by many new investors. Now that computers do most of the calculations, new investors can practice making (or losing) fortunes time and time again before actually committing financially. Investors also use paper trading to test new and different investment strategies. Stock market games are often used for educational purposes.


## Functional Requirements <a name="Func"></a>

1.	Profile Page
  a.	As a user, I would like to create a new account.
  b.	As a user, I would like to reset my password via email if I do not remember the original one.
  c.	As a user, I would like to modify my password.
  d.	As a user, I would like to get free virtual cash once I create an account.
  e.	As a user, I would like to gain some free virtual cash (wage) for logging onto the page consecutively for a week. 
  f.	As a user, I would like to view the total coins that I have.
  g.	(If time allows) As a user, I would like to log in with my facebook or any other social media account without creating a new    account.
2.	Stock Page
  a.	As a user, I would like to search the stock
  b.	As a user, I would like to add my search stock into my watchlist after I login
  c.	As a user, I would like to see the stock chart pattern for the stock that I searched
  d.	As a user, I would like to check out the related news articles for the stock that I searched
  e.	As a user, I would like to jump to the Game trading page to trade my search stock
3.	Game Page
  a.	As a user, I would like to see my total game capital for the game.
  b.	As a user, I would like to see the stocks I have bought and how much they worth.
  c.	As a user, I would like to search stock information in the game page
  d.	As a user, I would like to see the most active stocks by volume list on my game page.
  e.	As a user, I would like to see a recent trading history
  f.	As a user, I would like to see what stocks I have in my watchlist
  g.	As a user, I would like to go directly to the stock page from the watchlist
  h.	As a user, I would like to remove the stocks from the watchlist
  i.	As a user, I would like to set values in the notification setting for the stocks in my watchlist
  j.	As a user, I would like to receive emails if the price of the stocks in my watchlist drops or goes up
  k.	As a user, I would like to see my rank among players. (If time allowed)
4.	Trading Page
  a.	As a user, I would like to see all of my trading history
  b.	As a user, I would like to place an order on the stock
  c.	As a user, I would like to see my account value in the game trading page
  d.	As a user, I would like to preview the order I placed
  e.	As a user, I would like to know if the order I placed failed or not
5.	Main Page
  a.	As a user, I would like to search a specific stock on the main page.
  b.	As a user, I would like to see rolling news summary in current stock market
  c.	As a user, I would like to login my account from the main page.
  d.	As a user, I would like to logout from my account
  e.	As a user, I would like to see pictures of rolling news
  f.	As a user, I would like to login with facebook from the main page
6.	Tutorial Page
  a.	As a user, I would like to study basic of stock market  
  b.	As a user, I would like to know how to buy stock and sell stock 
  c.	As a user, I would like to see basic stock concepts and strategies
  d.	As a user, I would like to know how to play the game
7.	Miscellaneous
  a.	As a user, I would like to know who made the website. 
  b.	As a user, I would like to fill in the feedback form to developers.
  c.	As a user, I would like to know the passing percentage of each course for last semester.
  d.	As a user, I would like to see the introduction about the website main purpose on the front page.


## High-Level Overview of the System <a name="overview"></a>
Client-server model will be used for our project. Server will response to the request made by client and the information sent by client. Database will process the request from the server by providing the information server needs, which are requested by the client. Database will respond to server’s request and record the information sent by the server. 

A.	Client
  a.	Response-data and given-data from database are processed by NodeJS
  b.	Client will receive response from the server by AJAX
  c.	Response-data and given-data from database are processed by NodeJS
B.	Server
  a.	Processes all of the data and requests which are sent by users
  b.	Checks the correctness of the request and format of data before processing
  c.	Generates user’s requested data and information by accessing the database 
  d.	Regularly requesting the course updated information from the alphavantage API
C.	Database
  a.	Stock information will be recorded in the database.
  b.	All of the user information such as user profiles, their trade history, and stock profits will be recorded in the database.
  c.	All of the stock resources are recorded to the database.
  
  
## Flow of Events <a name="flow"></a>
Our general idea of the events are described as above. Users will make their requests on the browser and the requested the data will be sent to the server by using AJAX that forms Json object. Server will response to the request by interpreting the Json data, and make request to the database, in order to get what client needs. Database will response to server’s request by processing the query and sent the requested information back to the server. At the end, server’s request and information also will be sent by AJAX from the server to the browser for the clients. 


## Design Decision <a name="decision"></a>
**Functional Issues 

1. Do users have to login to use our service, such as news, games, and tutorial?

Option 1: Users have to create an account that is unique to our website to use all the function.
Option 2: Users can login using Facebook or any other social media account to use all the function and join the game.	
**Option 3: Users have to create an account to join the stock game and watch the tutorial but they do not have to create an account to use the other services such as search an stock and read stock news, etc 

We decide that users have to create an account to join the stock game and view the tutorials, but they do not have to create an account to use the other services such as stock information, and market news etc. Since the purpose of our website is to assist stock beginners to have an virtual trading experiences	at stock market, and teach them some trading strategies. Only if user has an account, we can record the transactions,and the profits and loss situations of different users.

2. How do users access to a specific stock?

Option 1: Navigate through menus 
**Option 2: Use search bar

We decide to use search bar only. Traversing through different menus is tedious to users while providing users with a search bar to search a specific stock is much more efficient. Since users may already have a targeted stock, there is no need to have separate menus for navigation.

**Non-Functional Issues
1. Do users need to create an account to get on our website?
Option 1: User must have  an account to use our website.
Option 2: User does not need an account to use our website
**Option 3: Users do not need an account to use our website, but users need an account for functions other than searching stocks.

We decided to go with option 3,  because option 1 is unlikely to attract users and option 2 is unlikely to maintain consistent users.

2. What should we use for our database?
Option 1: We use a non relational database such as mySQL
**Option 2: We use a non relational database such as MongoDB

It was a hard decision for us, since half of the members are more familiar with MongoDB, and the other half are more familiar with mySQL. In the end, we decide to use MongoDB, as we believe it is easier to get specific data using mongoDB.

3. What front end framework should we use?
*Option 1: Angular*
Option 2: vue.js
Option 3: Ember.js

We decided to use Angular as a front end for multiple reasons. It has client-side MVC and creates a single page application that is responsive. It has excellent data binding (only one with two way data binding which was the largest difference in our other options). It is built for easy testing as it comes bundled with Protractor. 	

4. What back end framework(s) should we use?
Option 1: PHP
**Option 2: Node.js with Express.js

We are using Node.js because it is extremely lightweight and efficient
Express is linked tightly to Node as well, and we will be using that as a “fast, unopinionated, minimalist” web framework with Node. Express abstracts out some low level logic that can could cause unnecessary problems if we went without. Express also helps with file organization for a MVC structure and we will use it for routing. Using Node.js would also allow us to code in JavaScript on the client and server; we wouldn’t have to switch gears. Node.js, however, when compared to PHP, does not integrate with as many older technologies, which is not an issue for us because we don’t plan to be working with any obscure API’s.

5. Which method of authentication should we use
Option 1: Cookie based authentication 
Option 2: Token based authentication 
**Option 3: Passport.js

We chose to use passport.js, a node.js middleware, because it is easiest to implement, since we are already using Express. The other two options have a steeper learning curve and passport would allow us to easily add multiple user login options (Facebook, Twitter,  Google, etc)


## Further Information <a name="further"></a>
**For further information on sequence events, flow map, Frontend UI mock ups, etc.
**Please check out the directory /doc
