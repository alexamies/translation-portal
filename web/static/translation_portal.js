import ChineseDict from '/dist/index.js'

// Application JavaScript demonstrating use of the ChineseDict module

// Use the dictionary
update_status('dict-status', 'Loading dictionary');
new ChineseDict('dist/words.json', 'p', 'dict-dialog', 'proper', onerror);
update_status('dict-status', 'Dictionary loaded');

function onerror(httpStatus) {
  console.log(`Translation Portal error ${httpStatus}`);
  const div = document.getElementById('dict-status');
  if (httpStatus === 401 && div) {
    statusDiv.innerHTML = 'Please login again.' +
                '<input type="button" value="Refresh" ' +
                'onclick="sessionRefreshClicked();"/>';
  }
}

function update_status(status_id, message) {
  const div = document.getElementById(status_id);
  if (div) {
    div.innerHTML = message;
    return div;
  }
}  

// For GCP Identity Aware Proxy 
// See https://cloud.google.com/iap/docs/sessions-howto
var iapSessionRefreshWindow = null;

function sessionRefreshClicked() {
  if (iapSessionRefreshWindow == null) {
    iapSessionRefreshWindow = window.open("/_gcp_iap/do_session_refresh");
    window.setTimeout(checkSessionRefresh, 500);
  }
  return false;
}

function checkSessionRefresh() {
  if (iapSessionRefreshWindow != null && !iapSessionRefreshWindow.closed) {
    fetch('/favicon.ico').then(function(response) {
      if (response.status === 401) {
        window.setTimeout(checkSessionRefresh, 500);
      } else {
        iapSessionRefreshWindow.close();
        iapSessionRefreshWindow = null;
      }
    });
  } else {
    iapSessionRefreshWindow = null;
  }
}