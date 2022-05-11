const getBtn = document.getElementById('get-btn');

const sendHttpRequest = (method, url, data) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = 'json';


    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject('Something went wrong!');
    };

    xhr.send(JSON.stringify(data));
  

}

const getData = () => {
  sendHttpRequest('GET', 'https://rest.busradar.conterra.de/prod/haltestellen').then(responseData => {
    console.log(responseData);
  });
};



getBtn.addEventListener('click', getData);
