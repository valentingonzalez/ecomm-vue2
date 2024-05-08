class Messenger {
  constructor(targetOrigin, targetWindow, handlersContext) {
    this.validOrigin = targetOrigin;
    this.targetWin = targetWindow;
    this.context = handlersContext;
    window.addEventListener('message', this.messageHandler.bind(this), false);
  }
  getObjectByName(objectName) {
    if (!objectName) {
      return null;
    }
    var namespaces = objectName.split('.');
    let currentObj = this.context;
    for(let namespace of namespaces) {
      currentObj = currentObj[namespace];
    }
    return currentObj;
  }

  messageHandler(event) {
    if(event.origin == this.validOrigin) {
    let func = this.getObjectByName(event.data.action);
    if(func) {
      let proms;
      if(Array.isArray(event.data.params)) {
        proms = func(...event.data.params);
      } else {
        proms = func(event.data.params);
      }
      if(proms && proms.then) {
        proms.then((response) => {
          this.sendMessage(event.data.success, response);
        }).catch((error) => {
          this.sendMessage(event.data.fail, error);
        });
      }
    }
  }
}
sendMessage (targetAction, parameters, handlerName = null) {
  if(targetAction) {
    var payload = {
      action: targetAction,
      params: parameters
    };
    let responseHandler = this.getObjectByName(handlerName);
    if(responseHandler) {
      if(responseHandler.success) {
        payload.success = `${handlerName}.success`;
      }
      if(responseHandler.fail) {
        payload.fail = `${handlerName}.fail`;
      }
    }
    this.targetWin.postMessage(payload, this.validOrigin);
    }
  }
}

export default Messenger;