function getAddress(event)
{
	var obj = this;
	var event = {
		setCurrentLocation:function(event)
		{
			obj.value = this.dataset.address;
			resultList.innerHTML = '';
		}
	}
	var debug = document.querySelector('#debug');
	if(debug === null)
		debug = new Object();

	var resultList = document.querySelector('*[data-element="result"]');
	resultList.innerHTML = '';

	if( obj.value.length < 3 ) {
		debug.innerHTML = 'Минимум 3 символа';
		return false;
	}

	var result = xhr('http://codebuster.ru/marina.dudnik/api/getAddress?addr='+obj.value);
	result = JSON.parse( result );

	if( result.success )
	{
		debug.innerHTML = '';
		var ul = document.createElement('ul');

		for (var i = result.data.length - 1; i >= 0; i--) {

			var li = document.createElement('li');
			li.innerHTML = result.data[i];

			li.setAttribute( 'data-address', result.data[i] );

			addEvent_personal( li, 'click', event.setCurrentLocation )

			ul.appendChild( li );
		}

		resultList.appendChild( ul );

	} else {
		debug.innerHTML = result.error;
	}
}