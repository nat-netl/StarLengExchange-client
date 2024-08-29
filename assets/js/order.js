$(document).ready(function () {
  const stage = localStorage.getItem("stage")
  const BASE_URL = "https://starlengexchange-server.onrender.com"

  if (!localStorage.getItem("user") || !localStorage.getItem("cryptoCurrencyReceive") || !localStorage.getItem("cryptoCurrencySend")) {
    window.location.replace("/");
  }

  function countTime(timer2) {
    var interval = setInterval(function () {
      var timer = timer2.split(":");
      var minutes = parseInt(timer[0], 10);
      var seconds = parseInt(timer[1], 10);
      --seconds;
      minutes = seconds < 0 ? --minutes : minutes;
      if (minutes < 0) clearInterval(interval);
      seconds = seconds < 0 ? 59 : seconds;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      $(".title-header-under-order__counter").html(minutes + ":" + seconds);
      timer2 = minutes + ":" + seconds;
      if (timer2 == "0:00") {
        window.location.replace("/");
        localStorage.removeItem("user");
      }
    }, 1000);
  }

   if (stage !== "final") countTime("10:00");

  
  if (stage === "final") {
    $(".order-payment__under").css("display", "none")
    $(".order-payment__final  ").css("display", "block")
  }


  async function sendOrderData(orderNumber, name, mail, addressTransaction, send, sendCurrency, receive, receiveCurrency) {
    try {
      const response = await fetch(`http://localhost:8001/api/v1/sheet/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          orderNumber,
          name,
          mail,
          addressTransaction,
          send,
          sendCurrency,
          receive,
          receiveCurrency
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Data sent successfully:', data);
  
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

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
      const send = JSON.parse(localStorage.getItem("cryptoCurrencySend"));
      const receive = JSON.parse(localStorage.getItem("cryptoCurrencyReceive"));
      const totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
      const user = JSON.parse(localStorage.getItem("user"));
      const orderNumber = JSON.parse(localStorage.getItem("orderNumber"))

      if (user && receive && send) {
        if (send.type === "coin" && receive.type === "bank") {
          sendOrderData (orderNumber, user[0].value, user[2].value, send.code, send.amount, send.name, totalPrice, receive.currency)
        } else if (send.type === "bank" && receive.type === "coin") {
          sendOrderData (orderNumber, user[0].value, user[2].value, send.mail, String(send.amount), send.name, totalPrice, receive.name)
        } else if (send.type === "coin" && receive.type === "coin") {
          sendOrderData (orderNumber, user[0].value, user[2].value, send.code, send.amount, send.name, totalPrice, receive.name)
        }
      }
      
      $(".order-payment__under").css("display", "none")
      $(".order-payment__final  ").css("display", "block")

      $(".stages-order__order-stage").removeClass("_active-stage")
      $(".stages-order__final-stage").addClass("_active-stage")

      localStorage.setItem("stage", "final")
      localStorage.removeItem("orderNumber")
    }
  );
});
