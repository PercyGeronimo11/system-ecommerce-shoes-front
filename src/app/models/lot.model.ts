export interface Lot {
    id: number;
    category: {
      id: number;
      name: string;
      description: string;
      status: boolean;
    };
    product: {
      id: number;
      name: string;
    };
    lotTotalCost: number;
    lotProductsAmount: number;
    proName: string;
    proDescription: string;
    proUnitPrice: number;
    proSizePlatform: string ;
    proSizeTacon: string;
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