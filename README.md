# Access deployed link
- I have deployed this app on s3 and can be accessd [here](taskmanager.vinodvellampalli.com)

# How To Run
- Clone the repository
- add .env.local with the below variables
- - REACT_APP_BASE_URL="https://devza.com/tests/"
- - REACT_APP_DEVZA_API_KEY="your api key here"
- run `yarn` to install dependencies
- run `yarn start` to start local server

# Gotchas
The API is protected for cors attacks and the localhost domain is not white listed. <br/>
So you may have to install a chrome pluging like [this one](https://chrome.google.com/webstore/detail/mjhpgnbimicffchbodmgfnemoghjakai).
The same will be applicable for deployed version as well

