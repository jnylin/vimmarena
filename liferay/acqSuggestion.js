(function ($){
	var urlValidationPlugin = 'http://ajax.aspnetcdn.com/ajax/jquery.validate/1.13.0/jquery.validate.min.js';
	$.getScript(urlValidationPlugin).done(function (script, textStatus) {
	
		var urlFormPlugin = 'http://oss.maxcdn.com/jquery.form/3.50/jquery.form.min.js';
		$.getScript(urlFormPlugin).done(function (script, textStatus) {

			var validation = {};
 
			validation =	{
				setupFormValidation: function() {
					$("#acqSuggestion").validate({
						rules: {
							name: "required",
							email: {
								required: true,
								email: true
							},
							title: "required"
						},
						messages: {
							name: "Du glömde skriva in ditt namn",
							email: "Du måste ange en e-postadress vi kan nå dig på",
							title: "Titel måste anges"
						},
						submitHandler: function(form) {
							console.log( $('html.ie').length );
							if ( $('html.ie').length === 0 ) {
						
								// Förbered formuläret
								var options = { 
									success:       showResponse,  // post-submit callback 
									url:       'http://jnylin.name/bibl/arena/send_wish.php'         // override for form's 'action' attribute 
	
								}; 						

								// Skicka det
								$(form).ajaxSubmit(options);
								$('#acqSuggestion').slideUp();								
							}						
							else {
								// IE och CORS är ingen rolig kombination, skicka på vanligt sätt
								// och lägg resultatet i en iframe
								$('iframe[name="outputForIE"]').slideDown();
								form.submit();
								$('#acqSuggestion').slideUp();								
							}
						}
					});
				}
			};
		
			$(function() {
				// Sätt lånekortsnummer
				var card = $('div.arena-external-link > a').attr('href');
				$('input[name=card]').attr('value',card);
				
				console.log("card = " + card);
				if ( card && card !== "1234" ) {
					$("#acqSuggestion").show();
					$(".acqSuggestion .feedbackPanelERROR").hide();
				}
			
				// Sätt valideringsregler
				validation.setupFormValidation();
			});			

		}).fail(function (jqxhr, settings, exception) {
			console.log("Failed loading script: " + urlFormPlugin);
		});
	
	}).fail(function (jqxhr, settings, exception) {
		console.log("Failed loading script: " + urlValidationPlugin);
	});
	
	// Hantera svaret från servern
	function showResponse(data, statusText, xhr, $form)  { 
		if ( data.success === true ) {
			$('#acqSuggestionOutput').html('<li class="feedbackPanelINFO"><span class="fa fa-info"></span> <span class="feedbackPanelINFO">'+data.message+'</span></li>');
			$('#acqSuggestion').hide();
		}
		else {
			$('#acqSuggestionOutput').html('<li class="feedbackPanelERROR"><span class="fa fa-warning"></span> <span class="feedbackPanelERROR">'+data.message+'</span></li>');
		}
	} 
		
})(jQuery);