new WOW().init();

async function currentOrder(page) {
  const endPoint = "api/v1/page";
  const baseUrl = `${BASE_URL}/${endPoint}?page=${page}`;
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

const swiper = new Swiper(".swiper", {
  loop: true,
  slidesPerView: 1,
  centeredSlides: true,
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
    slidesPerView: 2,
    centeredSlides: true,
    loop: true,
    spaceBetween: 20,
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

$(".help__wrapper-tabs").tabs();  


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

      //order
      if (send.type === "coin" && receive.type === "bank") {
        // total amount
        $(".total__price").html(`${send.amount} ${send.altName}`)
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
        // phone input
        if (receive.currency === "INR") {
          $(".phone_number .calculator-exchange-details-form-block__name").html(`Phone number & UPI`)
          $(".phone_number .calculator-exchange-details-form-block__input").attr("placeholder", `Phone number & UPI`);
        } else if (receive.currency === "BRL") {
          $(".phone_number .calculator-exchange-details-form-block__name").html(`Number card`)
          $(".phone_number .calculator-exchange-details-form-block__input").attr("placeholder", `Number card`);
        }
         // payment details
        $(".recieve-info-details-under__icon").attr("src", `assets/${send.img}`)
        $(".recieve-info-details-under__name").html(send.name)
        // memo tag   
        if (send.tag) {
          $( ".info-details-under__address-box" ).append( `
            <div class="info-details-under__address">
              <div class="address-info-details-under__title">${send.altName} Tag Memo:</div>
              <div class="address-info-details-under__content tag-memo">
                <div class="content-address-info-details-under__code copy-item" id="qrCode0">${send.tag[0].code}</div>
                <div class="content-address-info-details-under__icon-box">
                  <a class="content-address-info-details-under__qrIcon qrIcon" href="#qr0" rel="modal:open"></a>
                  <span class="content-address-info-details-under__copyIcon copyIcon" onClick="copyToClipboard('#qrCode0')"></span>
                </div>
  
                <div id="qr0" class="modal">
                  <a href="#" rel="modal:close"></a>
                  <div class="qr__info">
                    <div class="qr-info__image">
                      <img src="" alt="qr code js-qr">
                    </div>
                    <div class="qr-info__code js-code"></div>
                  </div>
                </div>
              </div>
            </div>
            ` );
          $("#qr0 .qr-info__code").html(send.tag[0].code)
          $("#qr0 .qr-info__image img").attr("src", `assets/${send.tag[0].qrCode}`);
        }
      } else if (send.type === "bank" && receive.type === "coin") {
        // total amount
        $(".total__price").html(`${send.amount} ${send.currency}`)
        //images in details
        $(".first-convert-item .icon-item-order__img").attr("src", `assets/${send.img}`);
        $(".second-convert-item .icon-item-order__img").attr("src", `assets/${receive.img}`);

        $(".send, .address-info-final-payment__amount").html(`${send.amount} ${send.currency}`)
        $(".recieve").html(`${totalPrice} ${receive.altName }`)
        // upi address in details
        if (user) $(".upi-address").html(`Address: ${user[1].value}`)
        //qr img
        $(".qr-info__image img").attr("src", `assets/${receive.qrCode}`);
        // qr code
        $(".qr-info__code, .content-address-info-details-under__code").html(send.mail)
        // final stage address
        $(".address-info-final-payment__code").html(transformationAddress(receive.code))
        // phone input
        if (send.currency === "INR") {
          $(".phone_number .calculator-exchange-details-form-block__name").html(`You "Token" address`)
          $(".phone_number .calculator-exchange-details-form-block__input").attr("placeholder", `You "Token" address`);

          $(".address-info-details-under__title").html("UPI:")
        } else if (send.currency === "BRL") {
          $(".phone_number .calculator-exchange-details-form-block__name").html(`You "Token" address`)
          $(".phone_number .calculator-exchange-details-form-block__input").attr("placeholder", `You "Token" address`);
       
          $(".address-info-details-under__title").html("PIX:")
        }
         // payment details
        $(".recieve-info-details-under__icon").attr("src", `assets/${send.img}`)
        $(".recieve-info-details-under__name").html(send.name)
        
        $(".qrIcon").hide()
      } else if (send.type === "coin" && receive.type === "coin") {
        // total amount
        $(".total__price").html(`${send.amount} ${send.altName}`)
        //images in details
        $(".first-convert-item .icon-item-order__img").attr("src", `assets/${send.img}`);
        $(".second-convert-item .icon-item-order__img").attr("src", `assets/${receive.img}`);

        $(".send, .address-info-final-payment__amount").html(`${send.amount} ${send.altName}`)
        // upi address in details
        if (user) {
          $(".recieve").html(`${totalPrice} ${receive.altName}`)
          $(".upi-address").html(`Address: ${user[1].value}`)
        } 
        //qr img
        $("#qr .qr-info__image img").attr("src", `assets/${send.qrCode}`);
        // qr code
        $("#qr .qr-info__code, .content-address-info-details-under__code").html(send.code)
        // final stage address
        // phone input
        $(".phone_number .calculator-exchange-details-form-block__name").html(`You ${receive.altName} address`)
        $(".phone_number .calculator-exchange-details-form-block__input").attr("placeholder", `You ${receive.altName} address`);
        // payment details
        $(".recieve-info-details-under__icon").attr("src", `assets/${send.img}`)
        $(".recieve-info-details-under__name").html(send.name)
        // memo tag        
        if (send.tag) {
          $( ".info-details-under__address-box" ).append( `
            <div class="info-details-under__address">
              <div class="address-info-details-under__title">${send.altName} Tag Memo:</div>
              <div class="address-info-details-under__content tag-memo">
                <div class="content-address-info-details-under__code copy-item" id="qrCode0">${send.tag[0].code}</div>
                <div class="content-address-info-details-under__icon-box">
                  <a class="content-address-info-details-under__qrIcon qrIcon" href="#qr0" rel="modal:open"></a>
                  <span class="content-address-info-details-under__copyIcon copyIcon" onClick="copyToClipboard('#qrCode0')"></span>
                </div>
  
                <div id="qr0" class="modal">
                  <a href="#" rel="modal:close"></a>
                  <div class="qr__info">
                    <div class="qr-info__image">
                      <img src="" alt="qr code js-qr">
                    </div>
                    <div class="qr-info__code js-code"></div>
                  </div>
                </div>
              </div>
            </div>
            ` );
          $("#qr0 .qr-info__code").html(send.tag[0].code)
          $("#qr0 .qr-info__image img").attr("src", `assets/${send.tag[0].qrCode}`);
        }
      }

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
      // $('#loading').css("display", "flex");
      
      let totalPrice = 0;
      const currentItem = await item;
      if (localStorage.getItem("cryptoCurrencyReceive") != null && localStorage.getItem("cryptoCurrencySend") != null) {
        $('#loading').css("display", "flex");
      } 
      
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
          // Получаем coin
          const fetchCoin = await getDataById(coin.id, currentItem.currency);
          if (currentItem.amount) {
            $(".crypto-value").val(currentItem.amount);
            this.receive(coin);
          }


          $(".exchange__rate").children("td").eq(1).html(`1 ${coin.altName} = ${fetchCoin.data[0].price}`);
          $(".max-exchange__rate").children("td").eq(1).html(`${coin.maxExchange} ${coin.altName}`);
          $(".min-exchange__rate").children("td").eq(1).html(`${coin.minExchange} ${coin.altName}`);
        } else {
          $(".crypto-value").val("");
          localStorage.removeItem("cryptoCurrencyReceive")
        }
      } else {
        console.log("Что-то пошло не так");
      }
      localStorage.setItem("cryptoCurrencySend", JSON.stringify(currentItem));
      localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

      return updateValues();
    },
    receive: async function (item) {
      // $('#loading').css("display", "flex");
      let totalPrice = 0;
      const currentItem = await item;
      if (localStorage.getItem("cryptoCurrencySend") != null && localStorage.getItem("cryptoCurrencyReceive") != null) {
        $('#loading').css("display", "flex");
      } 

      if (currentItem.code) {
        // Логика крипты в поле receive
        currentItem.type = "coin";

        let bank = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
        if (currentItem.type != bank.type) {
          if (bank.amount) {
            const fetchCoin = await getDataById(currentItem.id, bank.currency);
            // Получаем процент
            const proccent = await getProccentByCurrency(currentItem.altName)
  
            totalPrice = Number(
              bank.amount / Number(Number(fetchCoin.data[0].price) - (Number(fetchCoin.data[0].price) * Number(proccent)))
            ).toFixed(5);

            $(".valute-value").val(totalPrice);
          }

        } else {
          // Коневертация крипты в крипту
          let coin = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
          const fetchCoin = await getDataById(coin.id, currentItem.altName);

          // console.log (await getDataById(1, "INR"))
          
          // Получаем процент
          const proccent = await getProccentByCurrency(currentItem.altName)
          // Цена крипты
          totalPrice = Number(
            coin.amount * (Number(fetchCoin.data[0].price) + (fetchCoin.data[0].price * proccent))
          ).toFixed(5);
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
          // Получаем coin
          const fetchCoin = await getDataById(coin.id, currentItem.currency);
          // Получаем процент
          const proccent = await getProccentByCurrency(currentItem.currency)
          // Цена крипты
          totalPrice = Number(
            coin.amount * (Number(fetchCoin.data[0].price) + (fetchCoin.data[0].price * proccent))
          ).toFixed(5);
         
          $(".valute-value").val(totalPrice);
          $(".exchange__rate").children("td").eq(1).html(`1 ${coin.altName} = ${fetchCoin.data[0].price}`);
          $(".max-exchange__rate").children("td").eq(1).html(`${coin.maxExchange} ${coin.altName}`);
          $(".min-exchange__rate").children("td").eq(1).html(`${coin.minExchange} ${coin.altName}`);

        } else {
          localStorage.removeItem("cryptoCurrencySend")
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
        const coin = getCoinByIdJson(dataCurrency);
        calculator.send(coin);

        $('.calculator-bottom__receive .item-block__currency[data-type="bank"]').show();
      } else if (type === "bank") {
        const id = $(this).data("id");
        const bank = getBankByIdJson(id);
        calculator.send(bank);

        $('.calculator-bottom__receive .item-block__currency[data-type="bank"]').hide();
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
        const coin = getCoinByIdJson(dataCurrency);
        calculator.receive(coin);

        $('.calculator-bottom__send .item-block__currency[data-type="bank"]').show();
      } else if (type === "bank") {
        const id = $(this).data("id");
        const bank = getBankByIdJson(id);
        calculator.receive(bank);

        $('.calculator-bottom__send .item-block__currency[data-type="bank"]').hide();
      }
    }
  );

  $(".crypto-value").on("input", function () {
    let curVal = $(this).val();

    if(isNaN(curVal)){
      curVal = curVal.replace(/[^0-9\.]/g,'');
         if(curVal.split('.').length>2) 
          curVal =curVal.replace(/\.+$/,"");
    }
    $(this).val(curVal); 

    const receive = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
    const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));

    if (send.type === "coin") {
      send.amount = curVal;
      calculator.send(send);
    } else if (send.type === "bank" && receive.type === "coin") {
      send.amount = curVal;
      calculator.send(send);
    }
  });

  $(".valute-value").on("input", function () {
    let curVal = $(this).val();

    if(isNaN(curVal)){
      curVal = curVal.replace(/[^0-9\.]/g,'');
         if(curVal.split('.').length>2) 
          curVal =curVal.replace(/\.+$/,"");
    }
    $(this).val(curVal); 

    const receive = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
    const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));

    if (receive.type === "coin" && send.type === "bank") {
      receive.amount = curVal;
      calculator.receive(receive);
    }
  });

  // Open element
  $('.order__details .js-open').click(function(){
		$(this).children('.js-arrow').toggleClass("open-arrow");	 
		$(this).next('.js-content, .js-open').toggleClass("open-element");	 
    $(this).next('.js-content').slideToggle(400);	 
	});

  // Open menu
  $('.menu-btn').click(function(){
    $(".header__wrapper").toggleClass("_active-menu")
	});

  // Open help
  $('.item-help-tabs__title').click(function(){
    $(this).parent('.content-help-tabs__item').toggleClass('_active-help');
    $(this).siblings('.item-help-tabs__text').slideToggle(500);
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
