
export interface ProductModel {
  id: number;
  category: {
    id: number;
    cat_name: string;
    description: string;
    status: boolean;
  };
  proName: string;
  proDescription: string;
  proUnitPrice: number;
  proUnitCost: number;
  proSizePlatform: string | null;
  proSizeTacon: string | null;
  proColor: string | null;
  proSize: string | null;
  proStock: number;
  proUrlImage: String;
}

export interface ProductCreateReq {
  id: number;
  catId: number;
  proName: string;
  proDescription: string;
  proUnitPrice: number;
  proSizePlatform: string ;
  proSizeTacon: string;
}

