export interface LotModel {
    id: number;
    product: {
      id: number;
      proName: string;
      category: {
        id: number;
        catName: string;
      };
    };
    lotTotalCost: number;
    lotQuantityProducts: number;
  }
  
  
  export interface LotCreateReq {
    productId: number;
    lotQuantityProducts: number;
    lotDetail: LotDetailCreateReq[];
    lotTotalCost: number;
  }

 export interface LotDetailCreateReq{
    name: String;
    detPriceUnit: number;
    detQuantity: number;
    detSubTotal: number;
  }

  export interface materialForm{
    id:number;
    name: string;
    quantity: number;
    priceUnit: number;
    subTotal: number;
  }