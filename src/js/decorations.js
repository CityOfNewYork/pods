/**
 * @module pods/decorations
 */

import pods from './pods'
import nyc from 'nyc-lib/nyc'

const decorations = {
  extendFeature() {
    this.setId(this.get('DOECode'))
  },
  getName() {
    return this.get('PODSiteName')
  },
  getAddress1() {
    return this.get('Address')
  },
  getCityStateZip() {
    return `${this.get('Borough')}, NY ${this.get('ZIP')}`
  },
  detailsHtml() {
    const open = new Date(this.get('OpeningTime'))
    const update = new Date(this.get('LatestDate'))
    return $('<ul></ul>')
      .append(`<li><b>Status:</b> ${this.get('Ops_status')}</li>`)
      .append(`<li><b>Opens:</b> ${open.toLocaleDateString()} ${open.toLocaleTimeString()}`) 
      .append(`<li><b>Wait time:</b> ${this.get('wait_time')} minutes</li>`)
      .append(`<li><b>Last update:</b> ${update.toLocaleDateString()} ${update.toLocaleTimeString()}`) 
  }
}

export default decorations