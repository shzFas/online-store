import CustomElement from '../utils/_createCustomElement';
import basket from '../../assets/img/png/basket.png';

class ViewHeader {
  headerTotalPrice: HTMLElement
  headerBasket: HTMLElement
  headerBasketCount: HTMLElement
  logoTitle: HTMLElement
  customElement: CustomElement
  EVENT: { [x: string]: Event }
  constructor() {
    this.customElement = new CustomElement();
    this.headerTotalPrice = this.customElement.createElement('span', { className: 'header__total-span', textContent: '0' });
    this.headerBasket = this.customElement.createElement('div', { className: 'header__basket' });
    this.headerBasketCount = this.customElement.createElement('span', { className: 'header__basket-count', textContent: '0' });
    this.logoTitle = this.customElement.createElement('h1', { className: 'logo__title', textContent: 'Store' });
    this.headerListeners();
    this.EVENT = {
      clickOnBacket: new Event('clickOnBacket', { bubbles: true }),
      clickOnLogo: new Event('clickOnLogo', { bubbles: true })
    }
  }
  create() {
    const headerContainer = this.customElement.createElement('section', { className: 'header _container' });
    const headerLogo = this.customElement.createElement('a', { className: 'header__logo logo', href: '#' });
    const headerTotal = this.customElement.createElement('p', { className: 'header__total', textContent: 'Total: $' });
    this.customElement.addChildren(headerContainer, [headerLogo, headerTotal, this.headerBasket])
    this.customElement.addChildren(headerLogo, [this.logoTitle]);
    this.customElement.addChildren(headerTotal, [this.headerTotalPrice]);
    const headerBasketImg = this.customElement.createElement('img', { src: basket });
    this.headerBasket.innerHTML = ''
    this.customElement.addChildren(this.headerBasket, [headerBasketImg, this.headerBasketCount]);
    return headerContainer
  }
  updateHeaderBasketCount(count: number = 0) {
    this.headerBasketCount.textContent = count.toString()
  }
  updateHeaderTotalPrice(count: number = 0) {
    this.headerTotalPrice.textContent = count.toString()
  }
  headerListeners() {
    this.headerBasket.addEventListener('click', () => {
      this.headerBasket.dispatchEvent(this.EVENT.clickOnBacket)
    })
    this.logoTitle.addEventListener('click', (e) => {
      e.preventDefault()
      this.logoTitle.dispatchEvent(this.EVENT.clickOnLogo)
    })
  }
}

export default ViewHeader