//****************************** Coupon code Started ***************************************//

flagCoupon = [];
couponsArray = [];
savingsArray = [];
coupArray = [];
bestCouponFound = 0;
var newtime, oldtime, newtime1, oldtime1;
function changeFlag(i, coupon){
  //var status = $('.pgLoading').attr("style").split("display:")[1].split(";")[0].trim();
  //if(status=="none"){
    flagCoupon[i] = 1;
    postProcessor(coupon, i);
  //}
  //else {
   // setTimeout(function(){changeFlag(i, initialamount, coupon);},2000);
  //}
}

function changeFlag2(i, coupon){
  flagCoupon[i] = 0;
  /*if($('#couponCode').not(':enabled').length==1){
    var elem = $(document.getElementsByClassName("cart-rem-coupon")[0]).find('a');
    elem.click();
    $('.cart-page-mask:eq(0)').find('a:eq(0)').click();
    $('.cart-rem-coupon:eq(1)').find('a').click();
    console.log($('.cart-page-mask:eq(0)').find('a:eq(0)'));
    $('.cart-rem-coupon:eq(1)').find('a:eq(0)').click();
    setTimeout(function(){changeFlag2(i, initialamount, coupon);},2000);
  }
  else {
  var status = $('.pgLoading').attr("style").split("display:")[1].split(";")[0].trim();
  console.log("Status found " + status);
  if(status=="none"){
    flagCoupon[i] = 0;
    //$('#removeMask').find('a:eq(1)').click();
  }
  else {
    setTimeout(function(){changeFlag2(i, initialamount, coupon);},2000);
  }
 } */
}

function removeCompletely(){
   // $('#removeMask').find('a:eq(1)').click();
}

function postProcessor(coupon, i){
    newtime1 = new Date();
    console.log('postProcessor :: ', i, ':', newtime1, ':', (newtime1 - oldtime1)/1000, 'secs');
    oldtime1 = newtime1;
    if($('#ajax_error').css('display') != 'none'){
      savings = 0;
    }
    else {
      savings = 0;
      for(k=0;k<1;k++){
          var amount = $('#roPageErrorDiv b').text().split('Rs.')[1];
          savings = parseFloat(amount);
          console.log($('#roPageErrorDiv b').text(), $('#roPageErrorDiv b').text().split('Rs.'), amount, savings);
      }
    }
    if(savings > parseFloat($('.valuetag-sav-amt:eq(0)').text())){
    var currentSavAmt = parseFloat($('.valuetag-sav-amt:eq(0)').text()),
        finalSavAmt = savings;
       $({c: currentSavAmt}).animate({c: finalSavAmt}, {
            step: function(now) {
                $('.valuetag-sav-amt:eq(0)').text(Math.round(now))
            },
            duration: 1000,
            easing: "linear"
        });
    }
    
    savingsArray[i] = savings;
    $('#couponRemove').removeAttr("disabled");
    console.log('couponRemove', i, ": Savings for " + coupon + " is " + savings, ' :: old savings ', $('.valuetag-sav-amt:eq(0)').text(), ':', parseFloat($('.valuetag-sav-amt:eq(0)').text()));
    if(!/undefined/.test($('#couponRemove')[0]))    $('#couponRemove')[0].click();
    changeFlag2(i, coupon);
}

function preProcessor(i, coupon){
    //$('#couponRemove').click();
    $('#promoCode').removeAttr("disabled");
    $('#applyPromoCode').removeAttr("disabled");
    $('#promoCode').val(coupon);
   $('#applyPromoCode').click();
    console.log(i, ": Coupon Code applied " + coupon);
    setTimeout(function(){changeFlag(i, coupon);},3000);
}

function temp(i, lenArray){
    newtime = new Date();
    console.log('temp :: ', i, ':', newtime, ':', (newtime - oldtime)/1000, 'secs');
    oldtime = newtime;
    if(lenArray==i){
      return;
    }
    else{
        $('.valuetag-loading').html('Trying code <span class="valuetag-load-curr valuetag-bold">' + (i+1) + '</span> of <span class="valuetag-load-tot valuetag-bold">' + lenArray + '</span>');
        var perDone = i/(lenArray-1);
        perDone = perDone*100;
        perDone = parseInt(perDone);
        $('.valuetag-lb-progress').text(perDone + "% Complete");
        $('.valuetag-lb-fg').css("width", perDone + "%");
        var cur = couponsArray[i];
            coupArray[i] = cur;
        preProcessor(i, cur);
        i = i+1;
        setTimeout(function(){temp(i, lenArray);},4500);
    }
  //setTimeout(function(){preProcessor(i, coupon, initialamount);},7000*i);
  //setTimeout(function(){couponApplied(initialamount);},7000*(i) + 3500); 
}

function endProcess(i){
    console.log("called with " + i);
    if(flagCoupon[i]==0){
        console.log("Process terminated");
        max = -111111;
        ind_req = 1000;
        for(m=0;m<savingsArray.length;m++){
            if(max < savingsArray[m]){
                max = savingsArray[m];
                ind_req = m;
            }
        }
        if(max>0){
            bestCouponFound = 1;
            coup_req = coupArray[ind_req];
            if(!/undefined/.test($('#couponRemove')[0]))    $('#couponRemove')[0].click();
            $('#promoCode').removeAttr("disabled");      $('#applyPromoCode').removeAttr("disabled");
            $('#promoCode').val(coup_req);                 $('#applyPromoCode').click();
            flagCoupon[0] = 2;
            
            $('.valuetag-discount-cover').css("display", "none");
            savings = $('.valuetag-sav-amt:eq(0)').text();
            $('.valuetag-discount-cover:eq(1)').css("display", "block");
            var currentSavAmt = 0,
            finalSavAmt = max;
            $({c: currentSavAmt}).animate({c: finalSavAmt}, {
                step: function(now) {
                    $('.valuetag-sav-amt').text(Math.round(now))
                },
                duration: 1000,
                easing: "linear"
            });
            $('.valuetag-sav-amt:eq(0)').text('0');
            chrome.runtime.sendMessage({savings: max}, function(response) {});
        }
        else {
            $('.valuetag-discount-cover').css("display", "none");
            $('.valuetag-discount-cover:eq(2)').css("display", "block");
        } 
        console.log(savingsArray);
    }
    else {
        setTimeout(function(){endProcess(i);},4000);
    }
}

function applyCoupons(coupons){
    for( i = 0; i < coupons['response']['numFound']; i++ )      couponsArray[i] = coupons['response']['docs'][i]['coupenCode'];
    var savings = [];
    oldtime = oldtime1 = new Date();
    for(var i=0;i<couponsArray.length && i<1;i++){
        if(couponsArray[i]!=""&&couponsArray[i]!=" "){
            temp(i, couponsArray.length);
        }
    }
    endProcess(couponsArray.length-1);
}

function getCoupons(){
    for(var i=0;i < 200; i++){
      flagCoupon[i] = 2;
    }
    bestCouponFound = 0;
    $('.valuetag-discount-cover:eq(0)').css("display", "block");
    $('a.prmocode').click();
    $.ajax({
        url: "http://65.111.164.36/valueTag/appWebService/getcoupon.php?store=macys",
        type: "POST",
        dataType: 'json',
        processData: false
    }).done(function (data) {
        //console.log("Coupons " + data);
        couponsLength = data['response']['numFound'];
        $('.valuetag-c-line:eq(0)').text("We are automatically trying " + couponsLength + " coupon codes for you !");
        applyCoupons(data);
    });
}

function removeTheCover(){
  if($('.valuetag-discount-cover').length>0){
    $('.valuetag-discount-cover').css("display", "none"); 
  }
}

function addToDOM(){
  $('body').append('<div class="valuetag-discount-cover" style="display:none;"><div class="valuetag-cover-bg"></div><div class="valuetag-cover-main"><a href="#" class="valuetag-cover-close">x</a><div class="valuetag-cover-wrap"><header class="valuetag-cover-head"><a href="http://www.valuetagapp.com" target="_blank"><img src="http://www.valuetagapp.com/in/catalog/view/theme/journal/images/logo.png"></a></header><div class="valuetag-cover_content"><h3 class="valuetag-head">Finding out the best coupon for you !</h3><div class="valuetag-content-main"><div class="valuetag-c-line">We are automatically getting coupon codes for you.</div><div class="valuetag-loading_bar"><div class="valuetag-lb-bg valuetag-lb"><span class="valuetag-lb-progress">40% Complete</span><div class="valuetag-lb valuetag-lb-fg" style="width:40%;"></div></div></div><div class="valuetag-c-line valuetag-center"><div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div><span class="valuetag-loading"></span></div><div class="valuetag-savings"><div class="valuetag-total-savings"><span class="WebRupee">Rs.</span> <span class="valuetag-sav-amt">0</span></div> saved till now</div></div></div></div></div></div>');

  $('body').append('<div class="valuetag-discount-cover" style="display:none;"><div class="valuetag-cover-bg"></div><div class="valuetag-cover-main"><a href="#" class="valuetag-cover-close">x</a><div class="valuetag-cover-wrap"><header class="valuetag-cover-head"><a href="http://www.valuetagapp.com" target="_blank"><img src="http://www.valuetagapp.com/in/catalog/view/theme/journal/images/logo.png"></a></header><div class="valuetag-cover_content"><h3 class="valuetag-head">Hurray !</h3><div class="valuetag-content-main"><div class="valuetag-c-line">Congratulations! You have saved a total of <div class="valuetag-total-savings"><span class="WebRupee">Rs.</span> <span class="valuetag-sav-amt">0</span>!</div></div><div class="valuetag-button-wrap"><div href="#" class="valuetag-button"><div class="valuetag-share"><span class="its-title">Share Your Joy:</span> <div class="is-sp is-fb"><a href="https://www.facebook.com/sharer/sharer.php?s=100&p%5Btitle%5D=Start%20saving%20via%20ValueTag%20 !&p%5Bsummary%5D=Hurray%20!%20ValuTag%20just%20saved%20me%20my %20money%20by%20automatically%20applying%20best%20coupons%20&p%5Burl%5D=http%3A%2F%2Fwww.valuetagapp.com&p%5Bimages%5D%5B0%5D=http://www.valuetagapp.com/in/catalog/view/theme/journal/images/logo.png" target="_blank" class="is-logo is-l-fb"></a></div><div class="is-sp is-tw"><a href="http://twitter.com/home?status=Try%20the%20amazing%20ValueTag%20App%20or%20Browser%20Extension!+http%3A%2F%2Fwww.valuetagapp.com" target="_blank" class="is-logo is-l-tw"></a></div><div class="is-sp is-gp"><a href="https://plus.google.com/share?url=http%3A%2F%2Fwww.valuetagapp.com" target="_blank" class="is-logo is-l-gp"></a></div></div></div><a href="#" class="valuetag-button">Finish</a></div><footer class="valuetag-footer"><div class="valuetag-feedback"> </div></footer></div></div></div></div></div>');

  $('body').append('<div class="valuetag-discount-cover" style="display:none;"><div class="valuetag-cover-bg"></div><div class="valuetag-cover-main"><a href="#" class="valuetag-cover-close">x</a><div class="valuetag-cover-wrap"><header class="valuetag-cover-head"><a href="http://www.valuetagapp.com" target="_blank"><img src="http://www.valuetagapp.com/in/catalog/view/theme/journal/images/logo.png"></a></header><div class="valuetag-cover_content"><h3 class="valuetag-head">Sorry! No Coupons Found</h3><div class="valuetag-content-main"><div class="valuetag-c-line">Sorry. We were unable to find any suitable coupons for your product.</div><div class="valuetag-c-line"> But still you saved your precious time ! :)</div><div class="valuetag-button-wrap"><a href="#" class="valuetag-button">Finish</a></div><footer class="valuetag-footer"><div class="valuetag-feedback"></div><div class="valuetag-share"><span class="its-title">Share:</span><div class="is-sp is-fb"><a href="https://www.facebook.com/sharer/sharer.php?s=100&p%5Btitle%5D=Start%20saving%20via%20ValueTag%20 !&p%5Bsummary%5D=Hurray%20!%20ValuTag%20just%20saved%20me%20my %20money%20by%20automatically%20applying%20best%20coupons%20&p%5Burl%5D=http%3A%2F%2Fwww.valuetagapp.com&p%5Bimages%5D%5B0%5D=http://www.valuetagapp.com/in/catalog/view/theme/journal/images/logo.png" target="_blank" class="is-logo is-l-fb"></a></div><div class="is-sp is-tw"><a href="http://twitter.com/home?status=Try%20the%20amazing%20ValueTag%20App%20or%20Browser%20Extension!+http%3A%2F%2Fwww.valuetagapp.com" target="_blank" class="is-logo is-l-tw"></a></div><div class="is-sp is-gp"><a href="https://plus.google.com/share?url=http%3A%2F%2Fwww.valuetagapp.com" target="_blank" class="is-logo is-l-gp"></a></div></div></footer></div></div></div></div></div>');

    var buttons = document.getElementsByClassName('valuetag-cover-close');
    buttons[0].addEventListener("click", function(){
        removeTheCover();
    }, false);
    buttons[1].addEventListener("click", function(){
        removeTheCover();
    }, false);
    buttons[2].addEventListener("click", function(){
        removeTheCover();
    }, false);


    var buttons2 = document.getElementsByClassName('valuetag-button');
    buttons2[1].addEventListener("click", function(){
        removeTheCover();
    }, false);
    buttons2[2].addEventListener("click", function(){
        removeTheCover();
    }, false);
}

function couponCheck(){
    var curURL = window.location.href;
    console.log("CP Check was called");
    if(curURL.split('bag').length>1){
        var imgURL = chrome.extension.getURL("valtick128.png");
        console.log("TEst passed", document.getElementById("couponClick") );
        if($('#promoCode').length>0  && !document.getElementById("couponClick")){
            $('.promocodeContainer:eq(0)').after("<a id='couponClick' href='javascript:void();'><img style='margin-left:65px;' src='" + imgURL + "'></a>");
            addToDOM();
            var button = document.getElementById("couponClick");
            button.addEventListener("click", function(){
                getCoupons();
            }, false);
        }
        else if(!document.getElementById("couponClick")) {
            setTimeout(function(){couponCheck();},2000);
        }
    }
}

couponCheck();

$(document.body).delegate(".buymenow", 'click', function () {
    console.log(document.getElementById("couponClick"), "adding on click");
    couponCheck();
});

//****************************** Coupon code ended ***************************************//
