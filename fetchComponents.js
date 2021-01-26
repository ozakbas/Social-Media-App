export function postRequest(data, endpoint, parse) {
  return new Promise((resolve, reject) => {
    var req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    var myUrl = `http://192.168.207.209:3000/mobile/${endpoint}`;
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

export function getRequest(email) {
  return new Promise((resolve, reject) => {
    var data = {
      email: email,
    };

    var req = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(
      `http://192.168.207.209:3000/user/mobile/email/${encodeURIComponent(
        data.email
      )}`,
      req
    )
      .then((response) => response.text())
      .then((result) => JSON.parse(result))
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}

export function getPost(postId) {
  return new Promise((resolve, reject) => {
    var data = {
      postId: postId,
    };

    var req = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(
      `http://192.168.207.209:3000/mobile/post/${encodeURIComponent(
        data.postId
      )}`,
      req
    )
      .then((response) => response.text())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("error", error);
        reject();
      });
  });
}
