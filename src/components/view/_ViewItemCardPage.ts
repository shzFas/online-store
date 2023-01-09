import CustomElement from '../utils/_createCustomElement';
import { IitemDATA } from '../typingTS/_interfaces';
import { createElement } from '../utils/utils';
import { IBascetLocalStorage} from '../typingTS/_interfaces';

class ViewItemCardPage {
  customElement: CustomElement;
  pageMainItemCard: HTMLElement;
  itemCardImagePhotoImg: HTMLElement;
  cardBtnButtonAdd: HTMLElement;
  cardBtnButtonBuy: HTMLElement;
  startServerProduct: IitemDATA;
  BascetLocalStorage: IBascetLocalStorage[];
  EVENT: { [x: string]: Event }
  constructor(product: IitemDATA) {
    const readlocalStorage = localStorage.getItem('BascetLocalStorage')
    if (readlocalStorage) {
      this.BascetLocalStorage = JSON.parse(readlocalStorage)
    } else {
      this.BascetLocalStorage = []
    }
    this.startServerProduct = product;
    this.customElement = new CustomElement();
    this.pageMainItemCard = this.customElement.createElement('div', { className: 'page-main-itemCard _main-container' });
    this.itemCardImagePhotoImg = this.customElement.createElement('img', { className: 'itemCard__imagePhoto-img' });
    this.cardBtnButtonAdd = this.customElement.createElement('button', { className: 'card__btn-button _btn button-add', textContent: 'Добавить в корзину' });
    this.cardBtnButtonBuy = this.customElement.createElement('button', { className: 'card__btn-button _btn button-buy', textContent: 'Купить сейчас' });
    this.EVENT = {
      clickOnProductAddInBascetMain: new Event('clickOnProductAddInBascetMain', { bubbles: true }),
      clickOnProductAddInBascetBuy: new Event('clickOnProductAddInBascetBuy', { bubbles: true }),
    }
    this.listenersCardPage();
  }

  listenersCardPage() {
    this.cardBtnButtonAdd.addEventListener('click', (e) => {
      this.cardBtnButtonAdd.dispatchEvent(this.EVENT.clickOnProductAddInBascetMain);
      this.addProductForButton(e);
    });
    this.cardBtnButtonBuy.addEventListener('click', () => {
      this.cardBtnButtonBuy.dispatchEvent(this.EVENT.clickOnProductAddInBascetMain)
      this.cardBtnButtonBuy.dispatchEvent(this.EVENT.clickOnProductAddInBascetBuy)
    })
  }

  create(product: IitemDATA = this.startServerProduct) {
    this.pageMainItemCard.innerHTML = ''
    this.updateBascetFROMLocalStorage();
    this.customElement.addChildren(this.pageMainItemCard, [this.renderCardBlock(product)]);
    return this.pageMainItemCard
  }

  renderCardBlock(product: IitemDATA = this.startServerProduct): HTMLElement {
    this.updateBascetFROMLocalStorage();
    const mainItemCard = this.customElement.createElement('section', { className: 'main-itemCard _container itemCard' })
    this.customElement.addChildren(this.pageMainItemCard, [mainItemCard]);
    const itemCardCrumbs = this.customElement.createElement('div', { className: 'itemCard__crumbs crumbs' });
    const itemCardMain = this.customElement.createElement('div', { className: 'itemCard__main' })
    this.customElement.addChildren(mainItemCard, [itemCardCrumbs, itemCardMain]);
    const crumbsOne = this.customElement.createElement('p', { className: 'crumbs__one', textContent: 'Store' });
    const paragraf1 = this.customElement.createElement('p', { textContent: '>>' });
    const crumbsTwo = this.customElement.createElement('p', { className: 'crumbs__two', textContent: `${product.category}` });
    const paragraf2 = this.customElement.createElement('p', { textContent: '>>' });
    const crumbsThree = this.customElement.createElement('p', { className: 'crumbs__three', textContent: `${product.brand}` });
    const paragraf3 = this.customElement.createElement('p', { textContent: '>>' });
    const crumbsFour = this.customElement.createElement('p', { className: 'crumbs__four', textContent: `${product.title}` });
    this.customElement.addChildren(itemCardCrumbs, [crumbsOne, paragraf1, crumbsTwo, paragraf2, crumbsThree, paragraf3, crumbsFour]);
    const itemCardName = this.customElement.createElement('h3', { className: 'itemCard__name', textContent: `${product.title}` });
    const itemCardContainer = this.customElement.createElement('div', { className: 'itemCard__container' });
    this.customElement.addChildren(itemCardMain, [itemCardName, itemCardContainer]);
    const itemCardBlock1 = this.customElement.createElement('div', { className: 'itemCard__block1' });
    const itemCardBlock2 = this.customElement.createElement('div', { className: 'itemCard__block2' });
    this.customElement.addChildren(itemCardContainer, [itemCardBlock1, itemCardBlock2]);
    const itemCardGalery = this.customElement.createElement('div', { className: 'itemCard__galery' });
    const itemCardMainPhoto = this.customElement.createElement('div', { className: 'itemCard__mainPhoto' });
    this.customElement.addChildren(itemCardBlock1, [itemCardGalery, itemCardMainPhoto]);
    for (const key in product.images) {
      const itemCardImage = this.itemFilterCheckbox(product.images[key]);
      itemCardImage.addEventListener('mouseover', (e) => this.changeItemCardImagePhotoImg(e))
      this.customElement.addChildren(itemCardGalery, [itemCardImage]);
    }
    const itemCardImagePhoto = this.customElement.createElement('div', { className: 'itemCard__imagePhoto' });
    this.itemCardImagePhotoImg.setAttribute('src', product.images[0])
    this.customElement.addChildren(itemCardImagePhoto, [this.itemCardImagePhotoImg]);
    this.customElement.addChildren(itemCardMainPhoto, [itemCardImagePhoto]);
    const itemCardInformation = this.customElement.createElement('div', { className: 'itemCard__information' });
    const itemCardSummary = this.customElement.createElement('div', { className: 'itemCard__summary' });
    this.customElement.addChildren(itemCardBlock2, [itemCardInformation, itemCardSummary]);
    const itemCardDataDescription = this.customElement.createElement('p', {
      className: 'itemCard-data__description',
      textContent: `Description: ${product.description}`
    });
    const itemCardDataDiscount = this.customElement.createElement('p', {
      className: 'itemCard-data__discount',
      textContent: `Discount: ${product.discountPercentage}`
    });
    const itemCardDataRating = this.customElement.createElement('p', {
      className: 'itemCard-data__rating',
      textContent: `Rating: ${product.rating}`
    });
    const itemCardDataStock = this.customElement.createElement('p', {
      className: 'itemCard-data__stock',
      textContent: `Stock: ${product.stock}`
    });
    const itemCardDataBrand = this.customElement.createElement('p', {
      className: 'itemCard-data__brand',
      textContent: `Description: ${product.brand}`
    });
    const itemCardDataCategory = this.customElement.createElement('p', {
      className: 'itemCard-data__category',
      textContent: `Category: ${product.category}`
    });
    this.customElement.addChildren(itemCardInformation, [itemCardDataDescription, itemCardDataDiscount,
      itemCardDataRating, itemCardDataStock, itemCardDataBrand, itemCardDataCategory
    ]);
    const itemCardDataPrice = this.customElement.createElement('p', {
      className: 'itemCard-data__price', textContent: `Цена: $ ${product.price}`
    });
    this.cardBtnButtonAdd.setAttribute('id', `button-add|${product.id}`);
    this.cardBtnButtonBuy.setAttribute('id', `button-buy|${product.id}`);
    this.checkProductForButton(this.cardBtnButtonAdd);
    this.customElement.addChildren(itemCardSummary, [itemCardDataPrice, this.cardBtnButtonAdd, this.cardBtnButtonBuy]);
    return mainItemCard
  }

  itemFilterCheckbox(src: string): HTMLElement {
    const temp = `<div class="itemCard__imageGalery">
    <img class="itemCard__imageGalery-img" src="${src}">
    </div>`
    return createElement(temp)
  }

  changeItemCardImagePhotoImg(e: Event) {
    const target = e.target as HTMLElement
    if (target) {
      const newSrc = target.getAttribute('src')
      if (newSrc) this.itemCardImagePhotoImg.setAttribute('src', newSrc)
    }
  }

  updateBascetFROMLocalStorage() {
    const readlocalStorage = localStorage.getItem('BascetLocalStorage')
    if (readlocalStorage) {
      this.BascetLocalStorage = JSON.parse(readlocalStorage)
    } else {
      this.BascetLocalStorage = []
    }
  }

  addProductForButton(event: Event) {
    this.updateBascetFROMLocalStorage();
    const target = event.target as HTMLElement;
    const taretId = +target.id.split('|')[1];
    if (!this.BascetLocalStorage.length) {
      target.classList.remove('red-bg');
      target.textContent = 'Добавить в корзину';
    }
    this.BascetLocalStorage.forEach((item) => {
      if (item.id === taretId) {
        target.classList.add('red-bg');
        target.textContent = 'Удалить из корзины';
      } else {
        target.classList.remove('red-bg');
        target.textContent = 'Добавить в корзину';
      }
    })
  }

  checkProductForButton(button: HTMLElement) {
    this.updateBascetFROMLocalStorage();
    if (this.BascetLocalStorage.length === 0) {
      button.classList.remove('red-bg');
      button.textContent = 'Добавить в корзину';
      return
    }
    const ButtonId = +button.id.split('|')[1];
    for (let i = 0; i < this.BascetLocalStorage.length; i++) {
      if (this.BascetLocalStorage[i].id === ButtonId) {
        button.classList.add('red-bg');
        button.textContent = 'Удалить из корзины';
        return
      } else {
        button.classList.remove('red-bg');
        button.textContent = 'Добавить в корзину';
      }
    }
  }
}

export default ViewItemCardPage