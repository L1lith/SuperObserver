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
function chainObservers(parent, filters, callback, observerList=[]) {
	const filter = filters[0]
  filters = filters.slice(1)
	const observer = new SuperObserver(parent, filter)
  observerList.push(observer)
  observer.observe((action, nodes) => {
    if (filters.length > 0) {
      nodes.forEach(node => chainObservers(node, filters, callback, observerList))
		} else {
      callback(action, nodes)
		}
	})
  return observerList
}

module.exports = allowChainSuperObservers
