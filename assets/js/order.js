$(document).ready(function () {
  const stage = localStorage.getItem("stage")

  if (!localStorage.getItem("user")) {
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
      console.log(minutes);
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
});
