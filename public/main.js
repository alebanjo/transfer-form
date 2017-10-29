var numberField = document.getElementById('number_field');
var phoneNumber = '';

numberField.onkeydown = function() {
	event.preventDefault();
	var key = event.key;

	if(Number(key) === 0){
		phoneNumber = phoneNumber.concat('0');
		updateInput();
	}
	
	if(!Number(key) && key !== 'Backspace' && Number(key) !== 0){
		return false;	
	}
	
	if(Number(key) && phoneNumber.length < 10){
		phoneNumber = phoneNumber.concat(key);
		updateInput();
	}
	
	if( key === 'Backspace' ){
		phoneNumber = phoneNumber.slice(0, -1);
		updateInput();
	}
};

function updateInput(){
	var arr = [];
	for(var i = 0; i < 10; i++){
		if(phoneNumber[i]){
			arr.push(phoneNumber[i]);
		}
		else{
			arr.push(' ');
		}
	}
	
	numberField.value = `(${arr.slice(0,3).join('')}) ${arr.slice(3,6).join('')}-${arr.slice(6,10).join('')}`;
	focus();
}

function focus(){
  var focusNumber = 0;
  if(phoneNumber.length < 3 && phoneNumber.length >= 1){
    focusNumber = phoneNumber.length + 1;	
  }
  else if(phoneNumber.length < 6){
    focusNumber = phoneNumber.length + 3;	
  }
  else{
    focusNumber = phoneNumber.length + 4;	
  }
  if(phoneNumber.length === 10) focusNumber = 14;
  numberField.setSelectionRange(focusNumber, focusNumber);
}