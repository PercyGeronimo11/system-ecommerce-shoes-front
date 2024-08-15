
export interface ProductModel {
  id: number;
  category: {
    id: number;
    catName: string;
    description: string;
    status: boolean;
  };
  proName: string;
  proDescription: string;
  proUnitPrice: number;
  precioDescuento: number;
  proUnitCost: number;
  proSizePlatform: string | null;
  proSizeTaco: string | null;
  proColor: string | null;
  proSize: string | null;
  proStock: number;
  proUrlImage: String;

  name: string;
  size: number;
  price: number;
  quantity: number; // Asegúrate de que esto está presente
  image: String;
}
export interface ProductoForm {
  id: number;
  category: {
    id: number;
    catName: string;
    description: string;
    status: boolean;
  };
  proName: string;
  proDescription: string;
  proUnitPrice: number;
  proUnitCost: number;
  proSizePlatform: string | null;
  proSizeTaco: string | null;
  proColor: string | null;
  proSize: string | null;
  proStock: number;
  proUrlImage: String;
}
 export interface ProductCreateReq {
  id: number;
  proName:String;
}


//Para edit
export interface PromoCreateReq {
  promPercentage: number;
  promStartdate: Date;
  promEnddate: Date;
  promDescription: String;
  promUrlImage: String;
  promStatus: boolean;
  promDetail: PromoDetailCreateReq[];
}

export interface PromoDetailCreateReq{
  id: number;
  proName: String;
}




