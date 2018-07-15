class SuperObserver {
	constructor(parent, filter, options={}) {
		if (typeof options != 'object' || options === null) throw 'Invalid Options'
		this.options = options
		this.parent = parent
		this.filter = filter;
    ['observe', 'disconnect', 'isConnected'].forEach(prop => this[prop] = this[prop].bind(this))
	}
	observe(callback, deep=false){
		this.disconnect()
		this.observer = new MutationObserver(records => {
			records.forEach(record => {
				const {addedNodes, removedNodes} = record
				const added = [...addedNodes].filter(this.filter)
				const removed = [...removedNodes].filter(this.filter)
				if (added.length > 0) callback('added', added)
				if (removed.length > 0) callback('removed', removed)
			})
		})
		this.observer.observe(this.parent, {childList: true, subtree: deep === true})
		const added = [...(deep === true ? this.parent.getElementsByTagName('*') : this.parent.children)].filter(this.filter)
		if (added.length > 0) callback('added', added)
	}
  isConnected() {
    return typeof this.observe == 'object' && this.observe !== null
  }
	disconnect(){
		if (typeof this.observer == 'object' && this.observer !== null) {
			this.observer.disconnect()
			this.observer = null
		}
	}
}

module.exports = SuperObserver
