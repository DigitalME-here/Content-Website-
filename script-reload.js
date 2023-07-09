function getTotalTime() {
    const TotalTime = getCookie('total-time');
    if (TotalTime === null) {
        return 0;
    } else {
        return TotalTime;
    }
}
function getTotalReloadCount() {
    const TotalReloadCount = getCookie('total-reload-count');
    if (TotalReloadCount === null) {
        return 0;
    } else {
        return TotalReloadCount;
    }
}
function getJSONReloadElement(url, time) {
    let mObject = {};
    mObject.time = time;
    mObject.url = url;
    return JSON.stringify(mObject);
}
function storeReloadingProgress(url, time) {
    // Add TotalTime
    let TotalTime = getCookie('total-time');
    if (TotalTime == null) {
        TotalTime = 0;
    }
    TotalTime = parseInt(TotalTime) + parseInt(time);
    setCookie('total-time', TotalTime);

    // Add TotalReload Count
    let TotalReloadCount = getCookie('total-reload-count');
    if (TotalReloadCount == null) {
        TotalReloadCount = 0;
    }
    TotalReloadCount = parseInt(TotalReloadCount) + 1;
    setCookie('total-reload-count', TotalReloadCount);

    // Add Single Entry to JSON
    let JSONArray = JSON.parse(getCookie('json-array'));
    if (JSONArray == null) {
        JSONArray = JSON.parse("[]");
    }
    JSONArray.push(getJSONReloadElement(url, time));
    setCookie('json-array', JSON.stringify(JSONArray), 1);
}
function setCookie(name, value, days) {

    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    function escape(s) {
        return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
    }

    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
}

function getRandomTimeInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Including Dialog Popup
function includeDialogPopup() {
    const URL = 'reload-elements/dialog-reload.html';
    fetch(URL)
        .then(res => res.text())
        .then(text => {
            const div = document.createElement('div'); // is a node
            div.innerHTML = text;
            document.body.appendChild(div);

        })
        .catch(err => console.log(err));

}

function openSettingsPopup(url, time, time_min, time_max) {
    const dialog = document.getElementById('dialog');
    if(url.includes("search-engine.php&query=")){
        url = url.replace("search-engine.php&query=", "");
    }
    document.getElementById('input_url').value = url;

    const mRandomTimeCheckbox = document.getElementById('checkbox-random-time');
    const mFixedTimeCheckbox = document.getElementById('checkbox-fixed-time');
    const mInputTimeMin = document.getElementById('input_time_min');
    const mInputTimeMax = document.getElementById('input_time_max') ;
    const mInputTimeFixed = document.getElementById('input_time') ;
    if (time_max != null && time_min != null) {
        mInputTimeMax.hidden = false;
        mInputTimeMin.hidden = false;
        mInputTimeMax.value = time_max;
        mInputTimeMin.value = time_min;
        mRandomTimeCheckbox.checked = true;
    } else {
        mInputTimeFixed.hidden = false;
        mInputTimeFixed.value = time;
        mFixedTimeCheckbox.checked = true;
    }
    mRandomTimeCheckbox.addEventListener('change', function() {
        mFixedTimeCheckbox.checked = !this.checked;
        mInputTimeMax.hidden = !this.checked ;
        mInputTimeMin.hidden = !this.checked;

        mInputTimeFixed.hidden = this.checked;
        mInputTimeFixed.value = null;

    });
    mFixedTimeCheckbox.addEventListener('change', function() {
        mRandomTimeCheckbox.checked = !this.checked;
        mInputTimeFixed.hidden = !this.checked;

        mInputTimeMax.hidden = this.checked;
        mInputTimeMin.hidden = this.checked;
        mInputTimeMax.value =  null;
        mInputTimeMin.value = null;

    });

    dialog.showModal();
}

function saveSettingsAndCloseSettingsPopup(url, fixedTimeInterval, timeMin, timeMax) {
    const urlSwitch = new URL(window.location.href);
    const search_params = new URL(urlSwitch).searchParams;
    search_params.set('url', encodeURI(url));
    if (document.getElementById('checkbox-random-time').checked) {
        search_params.set('time-max', timeMax);
        search_params.set('time-min', timeMin);
        search_params.delete('time');
    } else if (document.getElementById('checkbox-fixed-time').checked) {
        search_params.set('time', fixedTimeInterval);
        search_params.delete('time-max');
        search_params.delete('time-min');
    } else {
        search_params.set('time', "30");
    }

    urlSwitch.search = search_params.toString();
    window.open(urlSwitch.toString(), '_self');
    closeSettingsPopup();

}
function closeSettingsPopup() {
    console.log("Open Popup");
    const dialog = document.getElementById('dialog');
    dialog.close();
}
