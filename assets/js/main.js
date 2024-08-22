const swiper = new Swiper(".swiper", {
  loop: true,
  slidesPerView: 1,
  centeredSlides: true,
  loop: true,
  spaceBetween: 68,
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
  },
  breakpoints: {
    740: {
      slidesPerView: 2,
      spaceBetween: 72,
    },
  },
});

async function getCoinByIdJson(id) {
  const file = "/assets/js/currencies.json";
  try {
    let res = await fetch(file);
    let data = await res.json();

    for (key in data.currencies) {
      if (data.currencies[key].id === id) {
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

async function getAllData() {
  const url = "http://localhost:8001";
  const endPoint = "api/v1/coins";
  const baseUrl = `${url}/${endPoint}`;
  try {
    let res = await fetch(baseUrl);
    if (!res.ok) {
      throw new Error(res.statusText || res.status);
    }
    let data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
  }
}

async function getDataById(id, valute) {
  const url = "http://localhost:8001";
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

$(document).ready(function () {
  function updateValues() {
    const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
    const receive = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));

    if (send && receive) {
      // Изменение в send и receive названия и иконки
      if (send) {
        $(".send-icon").attr("src", `assets/${send.img}`);
        $(".send-type").html(send.altName);
        if (send.altName) {
          $(".send-type").html(send.altName);
        } else {
          $(".send-type").html(send.currency);
        }
      }
      if (receive) {
        $(".receive-icon").attr("src", `assets/${receive.img}`);
        $(".receive-type").html(receive.altName);
        if (receive.altName) {
          $(".receive-type").html(receive.altName);
        } else {
          $(".receive-type").html(receive.currency);
        }
      }

      //exchange__rates
      

      if (send.type === "coin") {
        // Reserve
        $(".calculator-recerve-top__total").html(
          `${send.minExchange} ${send.altName}`
        );

      } else if (receive.type === "coin" && send.type === "bank") {
        // Reserve
        $(".calculator-recerve-top__total").html(
          `${receive.minExchange} ${receive.altName}`
        );
      }
    }
  }
  // updateValues();

  let calculator = {
    send: async function (item) {
      let totalPrice = 0;
      const currentItem = await item;
      if (currentItem.code) {
        // Логика крипты в поле send
        currentItem.type = "coin";
        let bank = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"))
          ? JSON.parse(localStorage.getItem("cryptoCurrencyReceive"))
          : "bank";
        if (currentItem.type != bank.type) {
          this.receive(bank);

          if (currentItem.minExchange) {
            $(".crypto-value").val(currentItem.minExchange);
          } else {
            $(".crypto-value").val(0);
          }
        } else {
          // Коневертация крипты в крипту
          let coin = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
          this.receive(coin);
          if (currentItem.minExchange) {
            $(".crypto-value").val(currentItem.minExchange);
          } else {
            $(".crypto-value").val(0);
          }
        }
      } else if (!currentItem.code) {
        // Логика банка в поле send
        currentItem.type = "bank";
        let coin = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
        //Проверка на конвертации валюты в валюту

        if (currentItem.type != coin.type) {
          const fetchCoin = await getDataById(coin.id, currentItem.currency);
          // Цена крипты
          totalPrice = Number(
            coin.minExchange * fetchCoin.data[0].price
          ).toFixed(2);
          $(".crypto-value").val(totalPrice);

          $(".exchange__rate").children("td").eq(1).html(`1 ${coin.altName} = ${fetchCoin.data[0].price}`);
          $(".max-exchange__rate").children("td").eq(1).html(`${coin.maxExchange} ${coin.altName}`);
          $(".min-exchange__rate").children("td").eq(1).html(`${coin.minExchange} ${coin.altName}`);
        } else {
          $(".crypto-value").val("");
          $(".valute-value").val("");
          alert("Conversion from currency is prohibited");
        }
      } else {
        console.log("Что-то пошло не так");
      }
      localStorage.setItem("cryptoCurrencySend", JSON.stringify(currentItem));
      localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

      return updateValues();
    },
    receive: async function (item) {
      let totalPrice = 0;
      const currentItem = await item;
      if (currentItem.code) {
        // Логика крипты в поле receive
        currentItem.type = "coin";
        let bank = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
        if (currentItem.type != bank.type) {
          this.send(bank);
          if (currentItem.minExchange) {
            $(".valute-value").val(currentItem.minExchange);
          } else {
            $(".valute-value").val(0);
          }
        } else {
          // Коневертация крипты в крипту
          let coin = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
          const fetchCoin = await getDataById(coin.id, currentItem.altName);
          // Цена крипты
          totalPrice = Number(
            coin.minExchange * fetchCoin.data[0].price
          ).toFixed(3);
          $(".valute-value").val(totalPrice);

          $(".exchange__rate").children("td").eq(1).html(`1 ${coin.altName} = ${fetchCoin.data[0].price}`);
          $(".max-exchange__rate").children("td").eq(1).html(`${coin.maxExchange} ${coin.altName}`);
          $(".min-exchange__rate").children("td").eq(1).html(`${coin.minExchange} ${coin.altName}`);
        }
      } else if (!currentItem.code) {
        // Логика банка в поле receive
        currentItem.type = "bank";
        let coin = JSON.parse(localStorage.getItem("cryptoCurrencySend"));

        //Проверка на конвертации валюты в валюту
        if (currentItem.type != coin.type) {
          const fetchCoin = await getDataById(coin.id, currentItem.currency);
          // Цена крипты
          totalPrice = Number(
            coin.minExchange * fetchCoin.data[0].price
          ).toFixed(2);
          $(".valute-value").val(totalPrice);
          $(".exchange__rate").children("td").eq(1).html(`1 ${coin.altName} = ${fetchCoin.data[0].price}`);
          $(".max-exchange__rate").children("td").eq(1).html(`${coin.maxExchange} ${coin.altName}`);
          $(".min-exchange__rate").children("td").eq(1).html(`${coin.minExchange} ${coin.altName}`);

        } else {
          $(".crypto-value").val("");
          $(".valute-value").val("");
          alert("Conversion from currency is prohibited");
        }
      } else {
        console.log("Что-то пошло не так");
      }
      localStorage.setItem(
        "cryptoCurrencyReceive",
        JSON.stringify(currentItem)
      );
      localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

      return updateValues();
    },
  };

  $(".crypto-value").on("input", function () {
    let curVal = parseFloat($(this).val());
    const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));

    if (send.type === "coin") {
      send.minExchange = curVal;
      calculator.send(send);
    }
  });

  $(".valute-value").on("input", function () {
    let curVal = parseFloat($(this).val());
    const receive = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
    const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));

    if (receive.type === "coin" && send.type === "bank") {
      receive.minExchange = curVal;
      calculator.receive(receive);
    }
  });

  // Табы
  $(".calculator-bottom__send #calculator__tabs").tabs();
  $(".calculator-bottom__send #tabs-1").each(function () {
    var sharedElement = $(
      ".calculator-bottom__send .item-block__currency"
    ).clone();
    $(this).append(sharedElement);
  });

  $(".calculator-bottom__receive #calculator__tabs").tabs();
  $(".calculator-bottom__receive #tabs-1").each(function () {
    var sharedElement = $(
      ".calculator-bottom__receive .item-block__currency"
    ).clone();
    $(this).append(sharedElement);
  });

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
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
    },
  });

  // send click item
  $("body").on(
    "click touchstart",
    ".calculator-bottom__send .item-block_valute__currency, .calculator-bottom__send .item-block_bank__currency",
    function () {
      let dataCurrency = $(this).data("currency");
      const type = $(this).data("type");

      // Добавление класса выделения
      $(
        `.calculator-bottom__send .item-block_valute__currency, 
      .calculator-bottom__send .item-block_bank__currency`
      ).removeClass("_active-valute");

      $(
        ".calculator-bottom__send .item-block__currency[data-currency='" +
          dataCurrency +
          "']"
      ).addClass("_active-valute");

      // Добавление/удаления класса по клику
      let otherElements = $(
        ".item-block__currency[data-currency='" + dataCurrency + "']"
      ).not(this);
      // $(".item-block__currency").show();
      $(".item-block__currency").not(this).show();
      $(
        ".calculator-bottom__receive .item-block__currency[data-currency='" +
          dataCurrency +
          "']"
      ).hide();

      if (type === "coin") {
        const id = $(this).data("id");
        const coin = getCoinByIdJson(id);
        calculator.send(coin);
      } else if (type === "bank") {
        const id = $(this).data("id");
        const bank = getBankByIdJson(id);
        calculator.send(bank);
      }
    }
  );

  // receive click item
  $("body").on(
    "click touchstart",
    ".calculator-bottom__receive .item-block_valute__currency, .calculator-bottom__receive .item-block_bank__currency",
    function () {
      let dataCurrency = $(this).data("currency");
      const type = $(this).data("type");

      // Добавление класса выделения
      $(
        `.calculator-bottom__receive .item-block_valute__currency, 
      .calculator-bottom__receive .item-block_bank__currency`
      ).removeClass("_active-receive");

      $(
        ".calculator-bottom__receive .item-block__currency[data-currency='" +
          dataCurrency +
          "']"
      ).addClass("_active-receive");

      // Добавление/удаления класса по клику
      let otherElements = $(
        ".item-block__currency[data-currency='" + dataCurrency + "']"
      ).not(this);
      // $(".item-block__currency").show();
      $(".item-block__currency").not(this).show();
      $(
        ".calculator-bottom__send .item-block__currency[data-currency='" +
          dataCurrency +
          "']"
      ).hide();

      if (type === "coin") {
        const id = $(this).data("id");
        const coin = getCoinByIdJson(id);
        calculator.receive(coin);
      } else if (type === "bank") {
        const id = $(this).data("id");
        const bank = getBankByIdJson(id);
        calculator.receive(bank);
      }
    }
  );

  // $(".calculator-bottom__send ._active-valute").first().trigger("click");
  // $(".calculator-bottom__receive ._active-receive").first().trigger("click");
});
