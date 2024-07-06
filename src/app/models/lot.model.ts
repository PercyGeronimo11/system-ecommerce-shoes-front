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
    categoryId: number;
    productId: number;
    lotTotalCost: number;
    lotProductsAmount: number;
    proName: string;
    proDescription: string;
    proUnitPrice: number;
    proSizePlatform: string ;
    proSizeTacon: string;
  }