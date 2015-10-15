/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 
 // -- Define Global Variables -- //
var address,
	platform,
	desiredName = "SSV1_00000",
	serviceUuid = "ffe0",
	charUuid = "ffe1";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
		$.mobile.hashListeningEnabled = false;
		if (typeof jQuery == 'undefined') {  
			alert('jQuery has not been loaded!');  
		}	
		$('#reconnectPopup, #forceReconnectPopup, #confirmHatPopup, #connectPopup, #timeoutPopup, #noDevicesPopup, #noDataPopup, #forgetPopup, #startPopup, #endPopup, #noSavedPopup, #ratingPopup, #syncFailPopup, #algPrefPopup, #bluetoothPopup, #loadingPopup, #lastSleepHelp, #sleepLabHelp, #trendsHelp, #settingsHelp,#languageHelp, #startingPopup, #processingPopup, #retrievingPopup, #connectingPopup, #disconnectingPopup,#changingPopup, #loadingCover').enhanceWithin().popup({positionTo: "window"});

		if (device.platform == "iOS"){
			StatusBar.backgroundColorByHexString("#33495D");
		}
		//--------------- Intial setup: element resizing, iScroll loading, popup instanitation, Highcharts settings/colors----------------//
		
		alert('before bluetooth init');
		
		$('#toPage1').on('click',function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#page1");
		});
		
		$('#toPage2').on('click',function(){
			$( ":mobile-pagecontainer" ).pagecontainer( "change", "#page2");
		});
		
		bluetoothle.initialize(initSuccess, initFail,{"request":true,"statusReceiver":true});
		
		
		
		
		
    }, // onDeviceReady end tag
    
};

// -- FUNCTIONS -- //

function initSuccess() {
	var connectBtn = $('#connectBtn');
	
	connectBtn.on('click',function(){
		bluetoothle.startScan(scanSuccess,scanFail,null);
	});
	
	
} // initSuccess - End Bracket

// Success Callbacks
        
function scanSuccess(data){
	alert('scan success');
	if (data.status == "scanResult"){
		if (data.name === desiredName){
			address = data.address;
			bluetoothle.stopScan(stopSuccess,stopFail);
		}else{
			console.log('No devices found');
		}
	}
}

function stopSuccess(data){
	bluetoothle.connect(connectSuccess,connectFail,{"address":address});
}
		
function connectSuccess(data){
	//alert('connect success');
	if (data.status === "connected"){
		if (platform == "iOS"){
			bluetoothle.services(servSuccess,servFail,{ "address": address,"serviceUuids": [] });
		}else if (platform == "Android"){
			bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
		}else{
		// Unsupported Platform
		}
		
	}else if(data.status === "disconnected"){
		bluetoothle.close(closeSuccess,closeFail,{"address":address});
	}
}
        
function servSuccess(data){
	//alert("service success");
	bluetoothle.characteristics(charSuccess,charFail,{"address":address,"serviceUuid":serviceUuid,"characteristicUuids":[]});
}

        
function charSuccess(data){
	//alert("char success");
	bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
}
        
function disconnectSuccess(data){
	if (data.status == "disconnected"){
		//alert("disconnect success");	
		bluetoothle.close(closeSuccess, closeFail,{ "address": address});
	}
}
        
function closeSuccess(data){
	alert("close success");	
}
		
function writeSuccess(data){
}
        
function readDescSuccess(){
	console.log("Read Descriptor Success");
}
        
function discoverSuccess(data){
	console.log(JSON.stringify(data));
	//alert("services: "+serviceUuid+" chars: "+charUuid);
	bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
}
                
function subSuccess(data){
	//alert("subscribe success");
	
	if (data.status == "subscribed"){
		
	}else if(data.status == "subscribedResult"){
		var returnedBytes = bluetoothle.encodedStringToBytes(data.value);
		//alert("received: "+JSON.stringify(returnedBytes));
	}
}
        
function readSuccess(data){

}
		
        //Failure Callbacks
        
function initFail(e){
	//alert('Init fail. Is bluetooth enabled?');
	//--- Fallback click handlers for bluetooth disabled ---//
	$("#connectBtn, #cBtn").removeClass("ui-state-disabled").html(labelConnect);
	$('#connectCircle').css('background','radial-gradient(#333,black)');
	$('#volumeControl').slider('disable').slider('refresh');
	$('#volumeBalance').slider('disable').slider('refresh');
	$('#sleepBtn, #connectBtn2').off('click').on('click',function(){
		$('#bluetoothPopup').popup('open');
	});
	$('#bluetoothPopup').popup('open');
}
        
        
        
function scanFail(e){
	alert('Scan failed: '+JSON.stringify(e));
}
        
        
        
function stopFail(e){
	alert('Stop failed: '+JSON.stringify(e));
}
        
        
        
function connectFail(e){
	if (e.error === 'isNotDisconnected'){
		alert('Connect failed: '+JSON.stringify(e));
	}else{
		alert('Connect failed: '+JSON.stringify(e));
	}
}
        
        
        
function servFail(){
	alert('Service failed: '+JSON.stringify(e));
}



function charFail(){
	alert('Char failed: '+JSON.stringify(e));
}



function disconnectFail(){
	alert("Disconnect Fail: "+JSON.stringify(e));
}



function writeFail(e){
	alert("Write Fail " +JSON.stringify(e)+" "+currentWrite);
}



function readDescFail(e){
	alert("Read Descriptor Fail: "+JSON.stringify(e));
}



function discoverFail(e){
	alert("Discovery Fail: "+JSON.stringify(e));
	console.log("Discovery Fail: "+JSON.stringify(e));
}

function readFail(){
	alert("Read Fail"+JSON.stringify(e));
}

function subFail(e){
	alert("Subscribe Fail:"+JSON.stringify(e));
}

function closeFail(e){
	alert("Close Fail: " + JSON.stringify(e));
}
		
function pack(byteArray) {
	byteArray.reverse();
	var value = 0;
	for ( var i = byteArray.length - 1; i >= 0; i--) {
		value = (value * 256) + byteArray[i];
	}
	
	if (value > Math.pow(2,8*byteArray.length-1)-1){
		value -= Math.pow(2,8*byteArray.length);
	}
	return value;
}

		
function packUnsigned(byteArray) {
	byteArray.reverse();
	var value = 0;
	for ( var i = byteArray.length - 1; i >= 0; i--) {
		value = (value * 256) + byteArray[i];
	}

	return value;
}

function unpack(intSize) {
	var numBytes = Math.ceil((Math.log(intSize)/Math.log(2) + 1)/8);
	var bytes = [];
	for (i = numBytes-1; i >= 0; i--){
		bytes[i] = intSize & (255);
		intSize >> 8;
	}
	
	
	return bytes();
}

function intToBytes(number,arrayLen){
	var hex = number.toString(16);
	if (hex.length % 2){
		hex = '0' + hex;
	}
	var array = hex.match(/.{1,2}/g); //.map(function(entry){return parseInt(entry,16);});
	while (array.length < arrayLen){
		array.unshift("00");
	}
	return array;
}

function getChecksum(array){
	var sum = array.reduce(function(pv, cv){return pv + cv;},0);
	return 255 - sum%256;
}


function hexToUint8(hexArray){
	var writeArray2 = new Array();
	for ( i = 0; i < hexArray.length; i++){
		writeArray2[i] = parseInt(hexArray[i],16);
	}
	writeArray2[writeArray2.length-1] = getChecksum(writeArray2.slice(3,3+writeArray2[2]));
	// alert("Decimal byte array: "+JSON.stringify(writeArray2));
	writeArray2 = new Uint8Array(writeArray2);
	return writeArray2;
}


function isConnectedCallback(data){
	//alert("in isConnectedCallback: "+JSON.stringify(data));
	if (data.error === "neverConnected"){ // hits if you haven't been connected to the device since opening the app
		//scan as usual...
		// alert("never connected");
		/* var d = new Date();
		syncStartTime = d.getTime();
		bluetoothle.startScan(scanSuccess, scanFail,null);

		setTimeout(function(){
	
			bluetoothle.stopScan(stopSuccess,stopFail)
		
		}
		, 1000); */
		//alert('here');
		if (promptToConnect){
			// alert("prompt to connect = true");
			// open connectPopup: yes calls connect fcn, no does nothing
			neverConnected = true;
			//$('#connectPopup').popup('open');
			/* var reply = confirm("In order to use this page, you must connect to your Sleep Shepherd. Connect now?");
			if (reply){
				$.mobile.loading('show', {text: 'Connecting...',textVisible: true, theme:'b'});
				bluetoothle.connect(connectSuccess, connectFail, {"address": address});
			} */
		}else if (forgettingDevice){
			// alert('got here');
			address = null;
			localStorage.removeItem('address');
			forgettingDevice = false;
			deviceSetup = false;
		}else{
			$('#connectingPopup').popup('open');
			// alert("prompt to connect = false");
			bluetoothle.connect(connectSuccess, connectFail, {"address": address});
		}
		
		if (afterForcedDisconnect){
			// alert("after forced disconnect = true");
			// bluetoothle.connect(connectSuccess, connectFail, {"address": address});
		}else{
			// alert("after forced disconnect = false");
		}
		
		
	}
	if (platform === "iOS"){
		// alert(" data.isConnected : "+data.isConnected);
		if (data.isConnected === false){ // connected to previously-connected device; hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
			
			
			if (forgettingDevice){
				$('#disonnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});		
			}else if(settingsConnect){
				//alert('here?');
				disconnecting = true;
				$('#disconnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});	
				clearTimeout(connectTimeout);
			}else{
				var blah = {status: "subscribed"};
				subSuccess(blah);
			}
		}else if (data.isConnected === true){ // not connected to a previously-connected device
			// alert('here' + +reconnect+" "+accidentalDisconnect+" "+settingsConnect+" "+forgettingDevice);
			if (reconnect){
				// alert('did we get here?');
				$('#connectingPopup').popup('open');
				//bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
				
				bluetoothle.close(closeSuccess,closeFail, {"address": address});
			}else if(accidentalDisconnect && !settingsConnect && !forgettingDevice){
				// alert("i get in here huh?");
				//$('#connectPopup').popup('open');
			}else if (settingsConnect){
				$('#connectingPopup').popup('open');
				bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
			}else if (forgettingDevice){
				// alert('or did we get here?');
				address = null;
				localStorage.removeItem('address');
				forgettingDevice = false;
				deviceSetup = false;
			}
		}
	}else if (platform === "Android"){
		if (data.isConnected === true){ // connected to previously-connected device; hits if you have have connected before or are connected now. on iOS returns false when connected/true when not... on Android works as expected  
			
			if (forgettingDevice){
				$('#disonnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});		
			}else if(settingsConnect){
				//alert('here?');
				disconnecting = true;
				$('#disconnectingPopup').popup('open');
				bluetoothle.disconnect(disconnectSuccess, disconnectFail, {"address":address});	
				clearTimeout(connectTimeout);
			}else{
				var blah = {status: "subscribed"};
				subSuccess(blah);
			}
		}else if (data.isConnected === false){ // not connected to a previously-connected device
			// alert('here' + +reconnect+" "+accidentalDisconnect+" "+settingsConnect+" "+forgettingDevice);
			if (reconnect){
				// alert('did we get here?');

				//bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
				$('#connectingPopup').popup('open');
				bluetoothle.close(closeSuccess,closeFail, {"address": address});

			}else if(accidentalDisconnect && !settingsConnect && !forgettingDevice){
				// alert("i get in here huh?");
				//$('#connectPopup').popup('open');
			}else if (settingsConnect){
				$('#connectingPopup').popup('open');
				bluetoothle.reconnect(connectSuccess, connectFail, {"address": address});
			}else if (forgettingDevice){
				// alert('or did we get here?');
				address = null;
				localStorage.removeItem('address');
				forgettingDevice = false;
				deviceSetup = false;
			}
		}
	}
}
		
		function isDiscoveredCallBack(data){
			connected = true;
			//alert(JSON.stringify(data));
			if (data === null){
				bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });
			}else if (data.isDiscovered === false){
				bluetoothle.discover(discoverSuccess,discoverFail,{"address":address});
			}else{
				bluetoothle.subscribe(subSuccess, subFail, {"address":address,"serviceUuid":serviceUuid,"characteristicUuid":charUuid, "isNotification":true });

			}
		}


function checkConnection(){
	if (!connected){
		//alert('in check connection()');
		//$.mobile.loading('hide');
		//alert('popup 10');
		$('.ui-popup').popup('close');
		endBtnPressed = false;
		startBtnPressed = false;
		forgettingDevice = false;
		disconnecting = false;
		notEnoughData = false;
		setTimeout(function(){
			$('#timeoutPopup').popup('open');
		},100);
	}
}








