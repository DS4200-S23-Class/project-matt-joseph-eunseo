const url = 'http://127.0.0.1:8000/data'

fetch(url)
  .then(response => response.json())
  .then(d => console.log(d))

  



