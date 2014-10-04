/* Author:

*/


$(document).ready(function(){
	
	yep();
	placeholders();
	modals();
	slideshow();
	formLogic(); 
	
});






function yep(){
	Modernizr.load([
		{
			test: Modernizr.placeholder,
			nope: placeholders()			
		}
	]);
}

function placeholders(){
	//Assign to those input elements that have 'placeholder' attribute
	if(!Modernizr.input.placeholder){
		$('input[placeholder]').each(function(){  
	        var input = $(this); 
			console.log(input);       
	        $(input).val(input.attr('placeholder'));
	        $(input).focus(function(){
	             if (input.val() == input.attr('placeholder')) {
	                 input.val('');
	             }
	        });
	        
	        $(input).blur(function(){
				console.log(input);
	            if (input.val() == '' || input.val() == input.attr('placeholder')) {
	                input.val(input.attr('placeholder'));
	            }
	        });
	    });
	}
}
function modals(){
	//Tooltips
	$('[rel="tooltip"]').tooltip();
	//Datepicker functionality 
	if ($('.input-append.date').length > 0){
		$('.input-append.date').each(function(){
			var thisCal = $(this).attr('id');
			$('#'+thisCal).datepicker({
				format: 'mm-dd-yyyy'
			});
		});
	}
	
	function checkModalEmail(){
		if($('#ModalEmail').val()=='' || $('#ModalEmail').val() == $('#ModalEmail').attr('placeholder')){
			$("#ModalEmailControl").addClass('error');
			$("#ModalEmailControl .help-inline").html('Enter an email address');
			return 'Enter an email address<br />';
		}else if(!validateEmail($('#ModalEmail').val())){
			$("#ModalEmailControl").addClass('error');
			$("#ModalEmailControl .help-inline").html('Please check your email address for errors');
			return 'Please check your email address for errors.<br/>';
		}else{
			$("#ModalEmailControl").removeClass('error');
			$("#ModalEmailControl .help-inline").html('');
			return '';
		}
	}
	
	function checkModalPhone(){
		if( ($('#phone1').val()=='' || $('#phone1').val() == $('#phone1').attr('placeholder')) 
	|| $('#phone2').val()=='' || $('#phone2').val() == $('#phone2').attr('placeholder')
	|| $('#phone3').val()=='' || $('#phone3').val() == $('#phone3').attr('placeholder')){
			$("#PhoneControl").addClass('error');
			$("#PhoneControl .help-inline").html('Enter a phone number');
			return 'Enter a phone number<br/>';
		}else{
			$("#PhoneControl").removeClass('error');
			$("#PhoneControl .help-inline").html('');
			return '';
		}
	}
	
	numbersOnly(".phone");

	function validateContact(){
		var errors = "";
		errors += checkForBlank('#Name','#NameControl','Enter a name.');
		errors += checkModalPhone();
		errors += checkModalEmail();
		errors += checkForSelected('#Subject','#SubjectControl','Select your subject.');
		errors += checkForBlank('#Message','#MessageControl','Enter a message.');
		$("#ModalErrors").html(errors);
		if(errors!='')return false;
		else return true;
	}
	//Modal submit, gather information for receipt
	$('.modal .btn.submit').on('click',function(){
		if(validateContact()){
			$('#modal-contact form').submit(); //This is where you submit to the backend via POST
		//For demo purposes we will add the receipt code here but the following would be propogated by the backend.
		}else{ return; }
		var values = {};
		$.each($('#modal-contact form').serializeArray(), function(i, field) {
		    values[field.name] = field.value;
		});
		formElements = [];
		formElements = ["firstName","lastName","emailAddress","phoneNumber1","phoneNumber2","phoneNumber3","weddingDate","weddingZip","msgInquiry"];
		firstName =    $('[data-receipt="firstName"]').val();
		lastName = 	   $('[data-receipt="lastName"]').val();
		emailAddress = $('[data-receipt="emailAddress"]').val();
		phoneNumber1 = $('[data-receipt="phoneNumber1"]').val();
		phoneNumber2 = $('[data-receipt="phoneNumber2"]').val();
		phoneNumber3 = $('[data-receipt="phoneNumber3"]').val();
		weddingDate =  $('[data-receipt="weddingDate"]').val();
		weddingZip =   $('[data-receipt="weddingZip"]').val();
		msgInquiry =   $('[data-receipt="msgInquiry"]').val();
		$('#modal-receipt').find('span[data-receipt="firstName"]').text(firstName);
		$('#modal-receipt').find('span[data-receipt="lastName"]').text(lastName);
		$('#modal-receipt').find('span[data-receipt="emailAddress"]').text(emailAddress);
		$('#modal-receipt').find('.vendorEmail').text(emailAddress);
		$('#modal-receipt').find('span[data-receipt="phoneNumber1"]').text(phoneNumber1);
		$('#modal-receipt').find('span[data-receipt="phoneNumber2"]').text(phoneNumber2);
		$('#modal-receipt').find('span[data-receipt="phoneNumber3"]').text(phoneNumber3);
		$('#modal-receipt').find('span[data-receipt="weddingDate"]').text(weddingDate);
		$('#modal-receipt').find('span[data-receipt="weddingZip"]').text(weddingZip);
		$('#modal-receipt').find('span[data-receipt="msgInquiry"]').text(msgInquiry);
		$('#modal-contact').modal('hide');
		$('#modal-receipt').modal('show');
	});
	$('#modal-contact form').submit(function(){   // USE THIS WHEN SUBMITTING TO BACKEND
		var values = {};
		$.each($('#modal-contact form').serializeArray(), function(i, field) {
		    values[field.name] = field.value;
		});
		console.log(values);
		console.log('submitting text');
		$('#modal-contact').modal('hide');
		$('#modal-receipt').modal('show');
		return false;
	});
	
}

function showModal(vendorID,vendorName){
	$('#modal-contact').find('#vendorID').attr('value',vendorID);
	$('#modal-contact,#modal-receipt').find('#vendorName').text(vendorName);
	$('#modal-contact').modal('show');
}
function slideshow(){
	if($('.picsSlideshow').length>0){
		$('.picsSlideshow').each(function(){
			var thisSlideshow = $(this).attr('id');
			$('#'+thisSlideshow).after('<ul id="navSlideshow">').cycle({
				fx:     'fade',
				speed:  'fast',
				timeout: 0,
				next: $('#gallery-next'),
				prev: $('#gallery-prev'),
				pager:  '#navSlideshow',
				pagerAnchorBuilder: function(idx, slide) {
					var thumb = $(slide).attr('src').replace('gallery','thumb');
					return '<li><a href="#"><img src="' + thumb + '" /></a></li>';
				}
			});
		})
	}
	
	
}


function formLogic(){
	
	function dataUnlock(){
		$('[data-unlock="true"]').change(function(){
			$(this).next($('select:disabled')).attr('disabled', false);
			var firstOption = $(this).children('option:eq(0)').val();
		});
	}
	dataUnlock();
	
	$(".btnActivator").click(function(){
		if(this.checked){
			$(".btnToBeActivated").removeAttr("disabled");
			$(".btnToBeActivated").removeClass("disabled");
		}else{
			$(".btnToBeActivated").attr("disabled", true); 
			$(".btnToBeActivated").addClass("disabled");
		}
	});
	
	$('[data-function]').on('click',function(e){
		var whichFunction = $(this).attr('data-function');
		switch(whichFunction){
		case("service-area"): 
			var myfunction = $('.btn[data-function="'+whichFunction+'"]');
			$('#service-area').find('.controls').last().clone().appendTo('#'+whichFunction).hide().fadeIn(200);
			$('.region_clone').last().attr('disabled',true);
			dataUnlock();
				$('a[data-function="remove-control"]').click(function(){
					$(this).parent('.controls').fadeOut(150);
				});
			e.preventDefault();
			break
		case("change-email"):
			$("#"+whichFunction).modal();
			e.preventDefault();
			break;
		case("change-password"):
			$("#"+whichFunction).modal();
			e.preventDefault();
			break;
		case("payment-information"):
			$("#"+whichFunction).modal();
			e.preventDefault();
			break;
		case("payment-schedule"):
			$("#"+whichFunction).modal();
			e.preventDefault();
			break;
		//case("reviewpayment-schedule"):
		//case("updatepayment-schedule"):
		default:
			e.preventDefault();
			$('#'+whichFunction).modal('show');	
			break			
		}
	});	
	
	//$('#Password').change(checkPassword);
	//$('#PasswordConfirm').change(checkPasswordConfirm);
	//$('#Email').change(checkEmail);
	//$('#EmailConfirm').change(checkEmailConfirm);
		
	function validateSignup(){
		var err = '';
		if($(".btnActivator").attr('checked')){
			err += checkForSelected("#ServiceProvided",'#ServiceControl','Select your service.');
			err += checkForBlank('#BusinessName','#BusinessControl','Enter your business name.');
			err += checkEmail();
			err += checkEmailConfirm();
			err += checkPassword();
			err += checkPasswordConfirm();
		}
		$("#PageErrors").html(err);
	}
	$("#ContinueBtn").click(validateSignup);
	
	function validateVendorSignupPayment(){
		var err = '';
		err += checkRegions('<br>Select a service area.');
		err += checkForBlank('#FirstName','#NameControl','Enter a cardholder name.');
		err += checkForBlank('#BillingAddress1','#BAddressControl','Enter a billing address.');
		err += checkForBlank('#BillingCity','#BCityControl','Enter a billing city.');
		err += checkForSelectedSpecial('#BillingState','#BStateControl','Select a billing state.','#BStateTarg');
		err += checkForBlankSpecial('#BillingZip','#BZipControl','Enter a billing zip code.','#BZipTarg');
		err += checkForBlank('#BillingPhone','#BPhoneControl','Enter a billing phone number.');
		err += checkForBlank('#BillingCardNumber','#BCardControl','Enter a credit card number.');
		err += checkForSelectedSpecial('#BillingCardType','#BCardTypeControl','<br>Select a card type.','#BCTypeTarg');
		err += checkForBlankSpecial('#BillingCCV','#BCCVControl','Enter a CCV code.','#BCCVTarg');
		$("#PageErrors").html(err);
	}
	$("#VendorContinueBtn").click(validateVendorSignupPayment);
	
	function validateVendorWelcome(){
		var err = '';
		err += checkForBlank('#FirstName','#NameControl','Enter a contact name.');
		err += checkForBlank('#LastName','#NameControl','Enter a contact full name.');
		err += checkForBlank('#Address1','#BAddressControl','Enter an address.');
		err += checkForBlank('#City','#BCityControl','Enter a city.');
		err += checkForSelected('#State','#BStateControl','Select a state.');
		err += checkForBlank('#Zip','#BZipControl','Enter a zip code.');
		err += checkForBlank('#Phone','#BPhoneControl','Enter a phone number.');
		err += checkForBlank('#Website','#WebsiteControl','Enter your website address.');
		err += checkForSelected('#HowHeard','#HowHeardControl','Select how you heard about us.');
		err += checkForSelected('#StoreState','.StoreControl','Select a David Bridal Store.');
		err += checkForSelected('#StoreName','.StoreControl','Select a David Bridal Store.');
		$("#PageErrors").html(err);
	}
	$("#VendorWelcomeBtn").click(validateVendorWelcome);
	
	function validateAd(){
		var err = '';
		err += checkForBlank('.vendor-adtext-aboutus','.aboutControl','Make sure you complete the "About Us" section of your ad.');
		$("#PageErrors").html(err);
	}
	$("#VendorAdBtn").click(validateAd);
	
	$("#HowHeard").change(function(){
		if($(this).val()!='') $("#HowHeardInput").show();
		else $("#HowHeardInput").hide();
	});
	
	$("#aboutAd .textLimit").keydown(function(){ limitText("#aboutAd",250); });
	$("#aboutServices .textLimit").keydown(function(){ limitText("#aboutServices",250); });
	$("#aboutSpecialTitle .textLimit").keydown(function(){ limitText("#aboutSpecialTitle",50); });
	$("#aboutSpecialContent .textLimit").keydown(function(){ limitText("#aboutSpecialContent",250); });
	
	function populateWelcome(){
		$("#FirstName").val('Client');
		$("#LastName").val('Bob');
		$("#Address1").val('1 Empire State Bldg');
		$("#City").val('New York');
		$("#State option").eq('NY').attr('selected','selected');
		$("#Zip").val('10003');
		$("#Phone").val('(555)555-5555');
		return false;
	}
	$("#populateWelcome").click(populateWelcome);
}

function checkRegions(errMsg){
	var has_select = false;
	$('.region_clone').each(function(){
		if($(this).has('[selected]') && $(this).val()!=$(this).attr('defaultVal')){
			has_select = true;
		}
	});
	if(has_select){
		$("#ServiceControl").removeClass('error');
		$("#ServiceError .help-inline").html('');
		return '';
	}else{
		$("#ServiceControl").addClass('error');
		$("#ServiceError .help-inline").html(errMsg);
		return errMsg+'<br>';
	}
}

function checkForBlank(id,control,errMsg){
	if($(id).val()=='' || $(id).val() == $(id).attr('placeholder')){
		$(control).addClass('error');
		$(control+" .help-inline").html(errMsg);
		return errMsg+'<br>';
	}else{
		$(control).removeClass('error');
		$(control+" .help-inline").html('');
		return '';
	}
}

function checkForBlankSpecial(id,control,errMsg,errTarget){
	if($(id).val()=='' || $(id).val() == $(id).attr('placeholder')){
		$(control).addClass('error');
		$(errTarget).html(errMsg);
		return errMsg+'<br>';
	}else{
		$(control).removeClass('error');
		$(errTarget).html('');
		return '';
	}
}

function checkForSelected(id, control, errMsg){
	if( $(id).has('[selected]') && $(id).val()!=$(id+" option:first").val() ){
		$(control).removeClass('error');
		$(control+" .help-inline").html('');
		return '';
	}else{
		$(control).addClass('error');
		$(control+" .help-inline").html(errMsg);
		return errMsg+'<br>';
	}
}

function checkForSelectedSpecial(id, control, errMsg, errTarget){
	if( $(id).has('[selected]') && $(id).val()!=$(id+" option:first").val() ){
		$(control).removeClass('error');
		$(errTarget).html('');
		return '';
	}else{
		$(control).addClass('error');
		$(errTarget).html(errMsg);
		return errMsg+'<br>';
	}
}

function numbersOnly(id){
	 $(id).keydown(function(event) { 
        // Allow: backspace, delete, tab, escape, and enter 
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||  
             // Allow: Ctrl+A 
            (event.keyCode == 65 && event.ctrlKey === true) ||  
             // Allow: home, end, left, right 
            (event.keyCode >= 35 && event.keyCode <= 39)) { 
                 // let it happen, don't do anything 
                 return; 
        } 
        else { 
            // Ensure that it is a number and stop the keypress 
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) { 
                event.preventDefault();  
            }    
        } 
    }); 
}
function forms(){
	//Datepicker functionality 
	if ($('.input-append.date').length > 0){
		$('.input-append.date').each(function(){
			var thisCal = $(this).attr('id');
			$('#'+thisCal).datepicker({
				format: 'mm-dd-yyyy'
			});
		});
	}
	//Disabled selects
	/*if ($('select[disabled="true"]').length > 0){
		$('select[disabled="true"]').each(function(){
			if ($(this).prev('select').value == "undefined" || 0 || ""){
				$(this).attr('disabled','true');
			} else {
				$(this).attr('disabled', 'false');
			}
		});
	}*/
	
	
	//Giving each modal an ID
	if ($('.modal .btn.submit').length > 0){
		var i = 1;
		$('.modal').each(function(i){
			$(this).attr('id','modal-'+i);
			$(this).find('.btn.submit').attr('id','btn-submit-'+i);
			i++
		});		
	}
	//Thank you modal
	$('.modal .btn.submit').on('click',function(){
		/*var thisModal = $(this).attr('id').replace('btn-submit','modal');
		var thisReceipt = thisModal.replace
		$('#'+thisModal).modal('hide',function(){
			$('#'+thisReceipt).fadeIn(300);
		});
		console.log(thisModal);*/
		//$('#modal-contact form').submit(); 
/*		var thisID = $(this).attr('id');
		console.log()
	*/	
	});
	$('#modal-contact form').submit(function(){
		console.log('submitting text')
	});
}

function limitText(id, limit) {
    if ($(id+' .textLimit').val().length > limit) {
        $(id+' .textLimit').val($(id+' .textLimit').val().substring(0, limit));
		$(id+' .textCount').html('0');
    } else {
        $(id+' .textCount').html(limit - $(id+' .textLimit').val().length);
    }
}

function validatePassword(password){
	var err = "";
	if(!validatePasswordLength(password)) err+="Must be 6 or more characters."
	if(!validatePasswordContent(password)) err+=" Must contain at least one letter and one number."
	return err;
}

function validatePasswordLength(password){
	return password.length >= 6;
}

function validatePasswordContent(password){
	return password.search(/(a-z)+/) && password.search(/(0-9)+/);
}

function validateEmail(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

//data validation for email fields
function checkEmail(){
	if(!validateEmail($('#Email').val())){
		$("#EmailControl").addClass('error');
		$("#EmailControl .help-inline").html('Please check your email address for errors.');
		return 'Please check your email address for errors.'+'<br>';
	}else{
		$("#EmailControl").removeClass('error');
		$("#EmailControl .help-inline").html('');
		return '';
	}
}

function checkEmailConfirm(){
	if($('#EmailConfirm').val()!=$("#Email").val()){
		$("#EmailConfirmControl").addClass('error');
		$("#EmailConfirmControl .help-inline").html('Make sure your email addresses match.');
		return 'Make sure your email addresses match.'+'<br>';
	}else{
		$("#EmailConfirmControl").removeClass('error');
		$("#EmailConfirmControl .help-inline").html('');
		return '';
	}
}

//data validation for password fields
function checkPassword(){
	var passError = validatePassword($('#Password').val());
	if(passError!=''){
		$("#PasswordControl").addClass('error');
		$("#PasswordControl .help-inline").html('Your password must be at least 6 characters long and contain both letters and numbers.');
		return 'Your password must be at least 6 characters long and contain both letters and numbers.'+'<br>';
	}else{
		$("#PasswordControl").removeClass('error');
		$("#PasswordControl .help-inline").html('');
		return '';
	}
}
function checkPasswordConfirm(){
	if($('#PasswordConfirm').val()!=$("#Password").val()){
		$("#PasswordConfirmControl").addClass('error');
		$("#PasswordConfirmControl .help-inline").html('Please be sure your passwords match');
		return 'Please be sure your passwords match.'+'<br>';
	}else{
		$("#PasswordConfirmControl").removeClass('error');
		$("#PasswordConfirmControl .help-inline").html('');
		return '';
	}
}

function confirmAdExit(){
	if($(".vendor-adtext-aboutus").val()!='' && $(".vendor-adtext-aboutus").val() == $(".vendor-adtext-aboutus").attr('placeholder'))
		return "You are about to navigate away from this page without saving your changes. Click 'Save and Continue' to save them";
}

//checksum algorithm + validation for visa/mastercard/bankcard, might come in handy
function checksum(id){
   var ccnum = $(id).value;
   var month = 0;
   var year = 0;
   var checksum = 0;
   var factor = 0;

   // do checksum validation on credit card number and
   // reformat so it is easy to read by a human
   ccnum = ccnum.replace(/[^0-9]/gi,"");
   if(ccnum.length < 16)
   {
      //alert("Please enter a valid credit card number");
      return false;
   }

   if(ccnum.length %2 ) factor = 1;
   else factor = 2;

   for(x=0; x< ccnum.length; x++){
      digit = ccnum.charAt(x);

      if(digit * factor > 9) checksum += (digit * factor) - 9;
      else checksum += digit * factor;
	  
      factor = (factor%2)+1;
   }

   if(checksum % 10){
      //alert("The card number you entered is not valid.\nPlease try again...");
      return false;
   }
   // VISA is 4xxx xxxx xxxx xxxx
   // MC is 5{0-5}xx xxxx xxxx xxxx
   // BC is 56xx xxxx xxxx xxxx
   if ((ccnum.charAt(0)) == 4 || (ccnum.charAt(0)) == 5){
      return true;
   } else {
      //alert("We only accept VISA, Mastercard and Bankcard.\nPlease use one of these cards to pay your account.");
      return false;
   }
   return true;
}
