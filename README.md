# Quantative Trading API
This is a trading API which helps you to test the performance of your custom Traing Algorithm in quantative trading. Currently It supports Binance API for crypto trading


![alt](public/images/trading.gif)


## Setup:
1. Clone the git repo and run ```npm install```
2. Setup your keys in ```./config/keys.json.example``` and change the file name to  ```./config/keys.json``` by removing ```.example``` extension
3. run ```node app.js```

## Developer Guide:
1. Developers who like to contribute can add more trading platforms in the folder ```data```
2. ```decisions``` allow you to add custom algorithms with a simple interface. Currently there are some simple algorithms which are readily available. 

__Currently this repo is still ```work in progress```.__

__NOTE__ : If you are getting error because of new mysql 8.0.0^ version on ubuntu do this

``` mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
```

