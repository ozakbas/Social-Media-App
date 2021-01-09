export function postRequest(data, endpoint, parse) {
  return new Promise((resolve, reject) => {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    var myUrl = `http://192.168.1.32:3000/mobile/${endpoint}`;
    if (parse) {
      fetch(myUrl, req)
        .then((response) => response.text())
        .then((result) => JSON.parse(result))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("error", error);
          reject();
        });
    } else {
      fetch(myUrl, req)
        .then((response) => response.text())
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("error", error);
          reject();
        });
    }
  });
}
