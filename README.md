# proxyAPI

## Basic HTTP Proxy API created with NodeJS.

### Prerequisites to run the application:
- Node.js® should be installed in the system. (You can download it from the following link: https://nodejs.org/)

### Running the application:
-  Just execute the following command on the root folder of the application:
   #### > node proxy_app.js

Application only supports GET and POST requests at the moment. 

Application is running on localhost:8000. Here are the example usages for the APIs.

### On a GET request, it makes a get request to http://localhost:8000/proxy/<url> 

$ curl  http://localhost:8000/proxy/http://httpbin.org/get

{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.35.0"
  }, 
  "origin": "99.250.201.200", 
  "url": "http://httpbin.org/get"
}

### On a POST request, it makes a post request to http://localhost:8000/proxy/<url>, passing through any form data.
It sets the 'User-Agent' header to the same User-Agent that it is being called by (note curl/7.35.0 in the examples)
  
$ curl -X POST -d asdf=blah  http://localhost:8000/proxy/http://httpbin.org/post

{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "asdf": "blah"
  }, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Content-Length": "9", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.35.0"
  }, 
  "json": null, 
  "origin": "99.250.201.200", 
  "url": "http://httpbin.org/post"
}
