const chainObservers = require('./chainObservers')

function allowChainSuperObservers(parent, filter, options) {
  if (!Array.isArray(filter)) {
    return new SuperObserver(parent, filter, options)
  } else {
    const fakeObserver = {}
    fakeObserver.__proto__ = SuperObserver.prototype
    fakeObserver.disconnect = ()=>{
      if (Array.isArray(fakeObserver.observers)) {
        fakeObserver.observers.forEach(observer => observer.disconnect())
        fakeObserver.observers = null
      }
    }
    fakeObserver.isConnected = ()=>Array.isArray(fakeObserver.observers)
    fakeObserver.observe = callback => {
      fakeObserver.disconnect()
      fakeObserver.observers = chainObservers(parent, filter, callback)
    }
    return fakeObserver
  }
}

module.exports = allowChainSuperObservers
