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

module.exports = chainObservers
