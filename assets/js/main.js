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

if (document.documentElement.clientWidth <= 920) {
  const swiperFeedback = new Swiper(".feedbacks-swiper", {
    loop: true,
    slidesPerView: 2,
    centeredSlides: true,
    loop: true,
    spaceBetween: 40,
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
    
  });
}

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

async function currentOrder(page) {
  const url = "http://localhost:8001";
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

function transformationAddress (address) {
  const first = address.substring(0, 11);
  const last = address.substring(address.length - 11);
  
  return `${first}...${last}`
}

$(document).ready(function () {
  async function updateValues() {
    const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
    const receive = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
    const totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    const user = JSON.parse(localStorage.getItem("user"));

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
      if (send.type === "coin" && receive.type === "bank") {
        // Reserve
        $(".calculator-recerve-top__total").html(
          `${send.amount} ${send.altName}`
        );

      } else if (send.type === "bank" && receive.type === "coin") {
        // Reserve
        $(".calculator-recerve-top__total").html(
          `${receive.amount} ${receive.altName}`
        );
      } else if (send.type === "coin" && receive.type === "coin") {
        $(".calculator-recerve-top__total").html(
          `${send.amount} ${send.altName}`
        );
      }
      //order
      if (send.type === "coin" && receive.type === "bank") {
        //images in details
        $(".first-convert-item .icon-item-order__img").attr("src", `assets/${send.img}`);
        $(".second-convert-item .icon-item-order__img").attr("src", `assets/${receive.img}`);

        $(".send, .address-info-final-payment__amount").html(`${send.amount} ${send.altName}`)
        $(".recieve").html(`${totalPrice} ${receive.currency}`)
        // upi address in details
        if (user) $(".upi-address").html(`Address: UPI ${user[1].value}`)
        //qr img
        $(".qr-info__image img").attr("src", `assets/${send.qrCode}`);
        // qr code
        $(".qr-info__code, .content-address-info-details-under__code").html(send.code)
        // final stage address
        $(".address-info-final-payment__code").html(transformationAddress(send.code))
      } else if (send.type === "bank" && receive.type === "coin") {
        //images in details
        $(".first-convert-item .icon-item-order__img").attr("src", `assets/${receive.img}`);
        $(".second-convert-item .icon-item-order__img").attr("src", `assets/${send.img}`);

        $(".send, .address-info-final-payment__amount").html(`${receive.amount} ${receive.altName}`)
        $(".recieve").html(`${totalPrice} ${send.currency}`)
        // upi address in details
        if (user) $(".upi-address").html(`Address: UPI ${user[1].value}`)
        //qr img
        $(".qr-info__image img").attr("src", `assets/${receive.qrCode}`);
        // qr code
        $(".qr-info__code, .content-address-info-details-under__code").html(receive.code)
        // final stage address
        $(".address-info-final-payment__code").html(transformationAddress(receive.code))
      } else if (send.type === "coin" && receive.type === "coin") {
        //images in details
        $(".first-convert-item .icon-item-order__img").attr("src", `assets/${send.img}`);
        $(".second-convert-item .icon-item-order__img").attr("src", `assets/${receive.img}`);

        $(".send, .address-info-final-payment__amount").html(`${send.amount} ${send.altName}`)
        $(".recieve").html(`${totalPrice} ${receive.altName}`)
        // upi address in details
        if (user) $(".upi-address").html(`Address: UPI ${user[1].value}`)
        //qr img
        $(".qr-info__image img").attr("src", `assets/${send.qrCode}`);
        // qr code
        $(".qr-info__code, .content-address-info-details-under__code").html(send.code)
        // final stage address
        $(".address-info-final-payment__code").html(transformationAddress(send.code))
      }

      if (totalPrice) $(".total__price ").html(totalPrice)

      //order number
      if (localStorage.getItem("orderNumber")) {
        const orderNumber = JSON.parse(localStorage.getItem("orderNumber"))
        $(".order-title__number").html(`№${orderNumber}`)
      } else {
        const orderNumber = await currentOrder("order")
        $(".order-title__number").html(`№${orderNumber.data}`)
        localStorage.setItem("orderNumber", JSON.stringify(orderNumber.data))
      }
    }
  }
  updateValues();

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

          if (currentItem.amount) {
            $(".crypto-value").val(currentItem.amount);
          } else {
            $(".crypto-value").val("");
          }
        } else {
          // Коневертация крипты в крипту
          let coin = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
          this.receive(coin);
          if (currentItem.amount) {
            $(".crypto-value").val(currentItem.amount);
          } else {
            $(".crypto-value").val("");
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
            coin.amount * fetchCoin.data[0].price
          ).toFixed(2);
          $(".crypto-value").val(totalPrice);

          $(".exchange__rate").children("td").eq(1).html(`1 ${coin.altName} = ${fetchCoin.data[0].price}`);
          $(".max-exchange__rate").children("td").eq(1).html(`${coin.maxExchange} ${coin.altName}`);
          $(".min-exchange__rate").children("td").eq(1).html(`${coin.minExchange} ${coin.altName}`);
        } else {
          $(".crypto-value").val("");
          $(".valute-value").val("");
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
          if (currentItem.amount) {
            $(".valute-value").val(currentItem.amount);
          } else {
            $(".valute-value").val("");
          }
        } else {
          // Коневертация крипты в крипту
          let coin = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
          const fetchCoin = await getDataById(coin.id, currentItem.altName);
          // Цена крипты
          totalPrice = Number(
            coin.amount * fetchCoin.data[0].price
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
            coin.amount * fetchCoin.data[0].price
          ).toFixed(2);
          $(".valute-value").val(totalPrice);
          $(".exchange__rate").children("td").eq(1).html(`1 ${coin.altName} = ${fetchCoin.data[0].price}`);
          $(".max-exchange__rate").children("td").eq(1).html(`${coin.maxExchange} ${coin.altName}`);
          $(".min-exchange__rate").children("td").eq(1).html(`${coin.minExchange} ${coin.altName}`);

        } else {
          $(".crypto-value").val("");
          $(".valute-value").val("");
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
      send.amount = curVal;
      calculator.send(send);
    }
  });

  $(".valute-value").on("input", function () {
    let curVal = parseFloat($(this).val());
    const receive = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
    const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));

    if (receive.type === "coin" && send.type === "bank") {
      receive.amount = curVal;
      calculator.receive(receive);
    }
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
      localStorage.setItem("user", JSON.stringify(data));
      window.location.replace("/order.html")
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


  // cancel order
  $("body").on(
    "click touchstart",
    ".cancel-order",
    function () {
      window.location.replace("/")
      localStorage.clear();
    }
  );
  // paid
  $("body").on(
    "click touchstart",
    ".paid",
    function () {
      $(".order-payment__under").css("display", "none")
      $(".order-payment__final  ").css("display", "block")

      $(".stages-order__order-stage").removeClass("_active-stage")
      $(".stages-order__final-stage").addClass("_active-stage")

      localStorage.setItem("stage", "final")
    }
  );
   // Open element
   $('.order__details .js-open').click(function(){
		$(this).children('.js-arrow').toggleClass("open-arrow");	 
		$(this).next('.js-content, .js-open').toggleClass("open-element");	 
    $(this).next('.js-content').slideToggle(400);	 
	});

  // copy by click
});
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
