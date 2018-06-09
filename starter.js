globalVars = {
		s:false ,
		f:[]
};

(function () {

	if ( typeof window.CustomEvent === "function" ) return false;

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	 }

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();


function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
	options = options || {};
	var expires = options.expires;
	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}
	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;
	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}
	document.cookie = updatedCookie;
}
function deleteCookie(name) {
	setCookie(name, "", {
		expires: -1
	})
}

function keysListener(event, key, listener )
{

	var handled = false;
	if (event.key !== undefined) {
		handled = true;
	} else if (event.keyIdentifier !== undefined) {
		handled = true;
	} else if (event.keyCode !== undefined) {
		handled = true;
	}
	if (handled) {
	}

	var f = {
		first:function(event)
		{
		}
	}
}


function xhr( url ) {

	var resText = false;
	var event = {
		status:function(event)
		{
			resText = this.responseText
		}
	}

	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", event.status );
	xhr.open("GET",  url, false );
	xhr.send();

	return resText;
}

function addEvent(event) {

	if( window.urlChange != undefined ) {
		window.onpopstate = urlChange;
	}


	var auto_start = [];
	var elements = document.querySelectorAll("*[data-event]");

	for ( var i=0; i<elements.length; i++ ) {

		listeners = elements[i].dataset.listener;
		events = elements[i].dataset.event;

		listeners = listeners.split("|");
		events = events.split("|");
		for ( var j=0; j<listeners.length; j++ ) {
			var listener = window[ listeners[j] ];
			var event = events[j];

			if( event == "keydown" || event == "keyup" ) {
				if( elements[i].dataset.key != undefined ) {
					keys = elements[i].dataset.key.split("|");
					for ( var k=0; k<keys.length; k++ ) {
						keysListener(event, keys[k], listener);
					}
				} else 
				{
					keys = false;
				}
			} else {
				keys = false;
			}
			keys = false;
			if( event == "custom_autostart" )
			{
				auto_start.push(elements[i]);
			}
			if( !keys ) {
				if (elements[i].addEventListener) {
					elements[i].addEventListener(event, listener, false); 
				} else if (elements[i].attachEvent)  {
					elements[i].attachEvent("on"+event, listener);
				}
			}
		}
	}

	formForEnterSubmit = [];
	var submit_element = document.querySelectorAll("*[data-submit]");
	for ( var i=0; i<submit_element.length; i++ ) {
		addEvent_personal( submit_element[i] , "click", form_submit);

		if(submit_element[i].dataset.byEnter != undefined )
		{
			formForEnterSubmit.push( submit_element[i] );
			addEvent_personal( window , "keydown", form_submit );
		}

	}


	if(!globalVars['s'])
	{
		globalVars['s'] = true;
		for(var i=0;i<globalVars['f'].length;i++)
		{
			globalVars['f'][i]();
		}
	}

	for ( var i=0; i<auto_start.length; i++ ) {
		fireEvent_personal( auto_start[i] , "custom_autostart" );
	}

}


if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", addEvent); 
} else if (document.attachEvent)  {
	document.attachEvent("DOMContentLoaded", addEvent);
}
function addEvent_personal(element, event, listener){
	
	if (element.addEventListener) {
		element.addEventListener(event, listener, false); 
	} else if (element.attachEvent)  {
		element.attachEvent("on"+event, listener);
	}
}
function removeEvent_personal(element, event, listener){

	if (element.removeEventListener) {
		element.removeEventListener( event, listener );
	} else if (element.detachEvent)  {
		element.detachEvent("on"+event, listener);
	}
}
function fireEvent_personal(element, event){
	var event = new CustomEvent(event);
	if( element != null )
	{
		element.dispatchEvent(event);
	}
	
}
function AET(element, listener){
	addEvent_personal( element, "webkitTransitionEnd", listener );
	addEvent_personal( element, "transitionend", listener );
	addEvent_personal( element, "msTransitionEnd", listener );
	addEvent_personal( element, "oTransitionEnd", listener );
}
function RET(element, listener){
	removeEvent_personal( element, "webkitTransitionEnd", listener );
	removeEvent_personal( element, "transitionend", listener );
	removeEvent_personal( element, "msTransitionEnd", listener );
	removeEvent_personal( element, "oTransitionEnd", listener );
}