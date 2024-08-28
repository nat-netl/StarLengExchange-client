
async function getCoinByIdJson(name) {
  const file = "/assets/js/currencies.json";
  try {
    let res = await fetch(file);
    let data = await res.json();

    for (key in data.currencies) {
      if (data.currencies[key].name === name) {
        return data.currencies[key];
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getBankByIdJson(id) {
  const file = "/assets/js/banks.json";
  try {
    let res = await fetch(file);
    let data = await res.json();

    for (key in data.banks) {
      if (data.banks[key].id === id) {
        return data.banks[key];
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function getDataById(id, valute) {
  const url = "https://starlengexchange-server.onrender.com";
  const endPoint = "api/v1/coin";
  const baseUrl = `${url}/${endPoint}?id=${id}&valute=${valute}`;
  try {
    let res = await fetch(baseUrl);
    if (!res.ok) {
      throw new Error(res.statusText || res.status);
    }
    let data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function currentOrder(page) {
  const url = "https://starlengexchange-server.onrender.com";
  const endPoint = "api/v1/page";
  const baseUrl = `${url}/${endPoint}?page=${page}`;
  try {
    let res = await fetch(baseUrl);
    if (!res.ok) {
      throw new Error(res.statusText || res.status);
    }
    let data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

async function getProccentByCurrency(currency) {
  const url = "https://starlengexchange-server.onrender.com";
  const endPoint = "api/v1/sheet/proccent";
  const baseUrl = `${url}/${endPoint}?currency=${currency}`;
  try {
    let res = await fetch(baseUrl);
    if (!res.ok) {
      throw new Error(res.statusText || res.status);
    }
    let data = await res.json();
    const proccent = data.data[0].proccent / 100
    console.log (proccent)
    return proccent;
  } catch (err) {
    console.error(err);
  }
}

$(document).ready(function () {
  localStorage.setItem("stage", "order")

  $(".calculator-exchange-details__form").validate({
    rules: {
      name: {
        required: true,
        minlength: 2,
      },
      email: {
        required: true,
        email: true,
      },
      phone: {
        required: true,
      },
      personal: {
        required: true,
      },
      KYC: {
        required: true,
      },
    },
    messages: {
      name: {
        minlength: "Name at least 2 characters",
      },
      email: "Please enter your email",
      phone: "Please enter your phone number or UPI",
      KYC: "Please enter",
    },
    submitHandler: function (form) {
      const data = $(".calculator-exchange-details__form").serializeArray();
      localStorage.setItem("user", JSON.stringify(data));
      window.location.replace("/order.html")
    },
  });
});