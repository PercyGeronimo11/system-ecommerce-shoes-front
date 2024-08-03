export interface PromoDetailResp {
  id: number;
  proName: string;
}

export interface PromoCompleteResp {
  id: number;
  promPercentage: number;
  promStartdate: Date; // Asumiendo que Date se convierte a string en el front-end
  promEnddate: Date;
  promDescription: string;
  promUrlImage: string;
  promoDetail: PromoDetailResp[];
  promStatus: boolean;
}
