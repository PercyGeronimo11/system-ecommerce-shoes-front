
export interface Product {
  id: number;
  category: {
    id: number;
    name: string;
    description: string;
    status: boolean;
  };
  proName: string;
  proDescription: string;
  proUnitPrice: string;
  proSizePlatform: string | null;
  proSizeTacon: string | null;
}



