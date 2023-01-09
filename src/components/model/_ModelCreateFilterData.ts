import { IitemDATA, IFilter } from '../typingTS/_interfaces'
import { numberArrayObject } from '../typingTS/_type';
import CreateBaseDate from "./_CreateBaseData"

class CreateFilterData {
  private readonly _baseData: CreateBaseDate;
  private readonly _startCategoryArray: string[];
  private _startCategoryData: numberArrayObject;
  protected _filtredCategoryData: numberArrayObject;
  private readonly _startBrandArray: string[];
  private _startBrandData: numberArrayObject;
  protected _filtredBrandData: numberArrayObject;
  private readonly _startServerData: IitemDATA[];
  private _filtredData: IitemDATA[];
  protected _FILTER: IFilter;
  private readonly _startServerFILTER: IFilter;
  protected readonly _startPriceOfFILTER: number[];
  protected readonly _startStockOfFILTER: number[];
  _FILTERpriceTEXT: number[];
  _FILTERstockTEXT: number[];
  protected readonly _startSearchOfFILTER: string[];
  protected readonly _priceOfFILTER: number[];
  protected readonly _stockOfFILTER: number[];
  protected readonly _searchOfFILTER: string[];

  constructor() {
    this._baseData = new CreateBaseDate();
    this._startCategoryArray = this.baseData.category;
    this._startBrandArray = this.baseData.brand;
    this._startServerData = this.baseData.data;
    this._filtredData = this.baseData.data;
    this._startServerFILTER =
    {
      "category": [],
      "brand": [],
      "price": this.baseData.price,
      "stock": this.baseData.stock,
      "search": [''],
      "sort": [''],
      "view": ['Big'],
    };
    this._FILTER = JSON.parse(JSON.stringify(this._startServerFILTER))
    this._FILTERpriceTEXT = [...this.baseData.price]
    this._FILTERstockTEXT = [...this.baseData.stock],
    this._startPriceOfFILTER = this._startServerFILTER.price
    this._startStockOfFILTER = this._startServerFILTER.stock
    this._startSearchOfFILTER = this._startServerFILTER.search
    this._priceOfFILTER = this._FILTER.price
    this._stockOfFILTER = this._FILTER.stock
    this._searchOfFILTER = this._FILTER.search
    this._startCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category");
    this._filtredCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category", this.filtredData);
    this._startBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand");
    this._filtredBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand", this.filtredData);

  }
  public get baseData() {
    return this._baseData
  }
  public get sortOfFILTER() {
    return this._FILTER.sort
  }
  public get viewOfFILTER() {
    return this._FILTER.view
  }

  setSortOfFILTER(data: string = this.startServerFILTER.sort[0]) {
    this._FILTER.sort[0] = data;
  }

  updateFiltredData(): IitemDATA[] {
    let resultfilterData: IitemDATA[] = this.startServerData.slice()
    resultfilterData = resultfilterData.filter((product) => {
      if (this.FILTER.category.length === 0) return true
      if (this.FILTER.category.includes(product.category)) return true
      return false
    })
    resultfilterData = resultfilterData.filter((product) => {
      if (this.FILTER.brand.length === 0) return true
      if (this.FILTER.brand.includes(product.brand)) return true
      return false
    })
    resultfilterData = resultfilterData.filter((product) => {
      this.FILTER.price.sort((a, b) => a - b)
      if ((this.FILTER.price[1] - this.FILTER.price[0]) === (this.startServerFILTER.price[1] - this.startServerFILTER.price[0])) return true
      if (this.FILTER.price[0] <= product.price && product.price <= this.FILTER.price[1]) {
        return true
      }
      return false
    })

    resultfilterData = resultfilterData.filter((product) => {
      this.FILTER.stock.sort((a, b) => a - b)
      if ((this.FILTER.stock[1] - this.FILTER.stock[0]) === (this.startServerFILTER.stock[1] - this.startServerFILTER.stock[0])) return true
      if (this.FILTER.stock[0] <= product.stock && product.stock <= this.FILTER.stock[1]) {
        return true
      }
      return false
    })

    resultfilterData = resultfilterData.filter((product) => {
      const text = this.FILTER.search[0]
      if (text === '') return true
      if (product.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        product.description.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        product.price.toString().includes(text) ||
        product.discountPercentage.toString().includes(text) ||
        product.rating.toString().includes(text) ||
        product.stock.toString().includes(text) ||
        product.brand.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        product.category.toLocaleLowerCase().includes(text.toLocaleLowerCase())
      ) { return true }
      return false
    })

    if (this.FILTER.sort[0] === "SortABC" || this.FILTER.sort[0] === "") {
      resultfilterData.sort((product1, product2) => product1.title.toLowerCase() > product2.title.toLowerCase() ? 1 : -1)
    }
    if (this.FILTER.sort[0] === "SortCBA") {
      resultfilterData.sort((product1, product2) => product1.title.toLowerCase() > product2.title.toLowerCase() ? -1 : 1)
    }
    if (this.FILTER.sort[0] === "SortByPriceLow") {
      resultfilterData.sort((product1, product2) => product1.price - product2.price)
    }
    if (this.FILTER.sort[0] === "SortByPriceUp") {
      resultfilterData.sort((product1, product2) => product2.price - product1.price)
    }
    if (this.FILTER.sort[0] === "SortByRatingLow") {
      resultfilterData.sort((product1, product2) => product1.rating - product2.rating)
    }
    if (this.FILTER.sort[0] === "SortByRatingUp") {
      resultfilterData.sort((product1, product2) => product2.rating - product1.rating)
    }
    this._filtredData = resultfilterData
    return this._filtredData
  }

  updateFILTER_Price_Stock(data: IitemDATA[] = this.filtredData) {
    const price: number[] = []
    const stock: number[] = []
    if (data.length === 0) {
      this._FILTERpriceTEXT = new Array(2).fill(0)
      this._FILTERstockTEXT = new Array(2).fill(0)
    } else if (data.length === 1) {
      this._FILTERpriceTEXT = new Array(2).fill(data[0].price)
      this._FILTERstockTEXT = new Array(2).fill(data[0].stock)
    } else {
      this._FILTERpriceTEXT = data.reduce((res, product) => {
        res.push(product.price)
        return res
      }, price).sort((a, b) => a - b)
        .filter((item, index, arr) => index === 0 || index === (arr.length - 1))
      this._FILTERstockTEXT = data.reduce((res, product) => {
        res.push(product.stock)
        return res
      }, stock).sort((a, b) => a - b)
        .filter((item, index, arr) => index === 0 || index === (arr.length - 1))
    }
  }

  setFILTERCategory(data: string) {
    const index = this._FILTER.category.indexOf(data);
    if (index !== -1) {
      this._FILTER.category.splice(index, 1);
    } else {
      this._FILTER.category.push(data)
    }

  }

  setFILTERBrand(data: string) {
    const index = this._FILTER.brand.indexOf(data);
    if (index !== -1) {
      this._FILTER.brand.splice(index, 1);
    } else {
      this._FILTER.brand.push(data)
    }
  }

  setPriceOfFILTER(data: number[] = this.startServerFILTER.price) {
    this._FILTER.price = data;
  }
  setStockOfFILTER(data: number[] = this.startServerFILTER.stock) {
    this._FILTER.stock = [...data];
  }
  setSearchOfFILTER(data: string = this.startServerFILTER.search[0]) {
    this._FILTER.search[0] = data;
  }
  setViewOfFILTER(data: string = this.startServerFILTER.view[0]) {
    if (data === 'Small') { this._FILTER.view[0] = 'Small' } else {
      this._FILTER.view[0] = this.startServerFILTER.view[0].toString();
    }
  }
  setFILTER(filter: IFilter) {
    this.FILTER.brand = [...filter.brand]
    this.FILTER.category = [...filter.category]
    this.FILTER.price = filter.price.length ? [...filter.price] : [...this.baseData.price]
    this.FILTER.stock = filter.stock.length ? [...filter.stock] : [...this.baseData.stock]
    this.FILTER.search = filter.search.length ? [...filter.search] : ['']
    this.FILTER.sort = filter.sort.length ? [...filter.sort] : ['']
    this.FILTER.view = filter.sort.length ? [...filter.view] : ['Big']
  }

  public get startCategoryArray() {
    return this._startCategoryArray
  }

  public get startBrandArray() {
    return this._startBrandArray
  }

  public get startCategoryData() {
    this._startCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category");
    return this._startCategoryData
  }

  public get filtredCategoryData() {
    this._filtredCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category", this.filtredData);
    return this._filtredCategoryData
  }
  public get startBrandData() {
    this._startBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand");
    return this._startBrandData
  }

  public get filtredBrandData() {
    this._filtredBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand", this.filtredData);
    return this._filtredBrandData
  }

  public get startServerData() {
    return this._startServerData
  }

  public get filtredData() {
    this.updateFiltredData();
    return this._filtredData
  }

  public get startServerFILTER() {
    return this._startServerFILTER
  }

  public get FILTER() {
    return this._FILTER
  }

  public get startPriceOfFILTER() {
    return this._startServerFILTER.price
  }

  public get startStockOfFILTER() {
    return this._startServerFILTER.stock
  }

  public get startSearchOfFILTER() {
    return this._startServerFILTER.search
  }

  public get priceOfFILTER() {
    return this._FILTER.price
  }
  public get stockOfFILTER() {
    return this._FILTER.stock
  }
  public get searchOfFILTER() {
    return this._FILTER.search
  }

  private getCategoryAndBrandData(obj: string[],
    key: "brand" | "category",
    filtredData: IitemDATA[] = this.startServerData,
    filter = this._FILTER) {
    const result: numberArrayObject = {}
    obj.forEach((categoryValue) => {
      filtredData.forEach((product) => {
        if (!result[categoryValue]) result[categoryValue] = [0, 0, 0]
        if (product[key] === categoryValue) result[categoryValue][0] += 1
      })
    })
    obj.forEach((categoryValue) => {
      this.startServerData.forEach((product) => {
        if (!result[categoryValue]) result[categoryValue] = [0, 0, 0]
        if (product[key] === categoryValue) result[categoryValue][1] += 1
      })
    })
    filter.category.forEach((item) => {
      if (result[item]) {
        result[item][2] += 1
      }
    })
    filter.brand.forEach((item) => {
      if (result[item]) {
        result[item][2] += 1
      }
    })
    return result
  }

  clearFILTER() {
    this._FILTER.category = []
    this._FILTER.brand = []
    this._FILTER.price = [...this.baseData.price],
    this._FILTER.stock = [...this.baseData.stock],
    this._FILTER.search = ['']
    this._FILTER.sort = ['']
    this._FILTER.view = ['Big']
    this.updateFiltredData()
  }
}

export default CreateFilterData