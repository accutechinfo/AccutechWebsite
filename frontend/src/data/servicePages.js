import advance_accounting from "./advance_accounting.json";
import bulk_drug_trading from "./bulk_drug_trading.json";
import fmcg_distribution from "./fmcg_distribution.json";
import food_manufacturing from "./food_manufacturing.json";
import general_trading from "./general_trading.json";
import pharma_manufacturing from "./pharma_manufacturing.json";
import pharma_pcd from "./pharma_pcd.json";
export const servicePages = {
  "advance-accounting": { ...advance_accounting, title: "Advance Accounting ERP Software" },
  "bulk-drug-trading": { ...bulk_drug_trading, title: "Bulk Drug Trading ERP Software" },
  "fmcg-distribution": { ...fmcg_distribution, title: "FMCG Distribution ERP Software" },
  "food-manufacturing": { ...food_manufacturing, title: "Food Manufacturing ERP Software" },
  "general-trading": { ...general_trading, title: "General Trading ERP Software" },
  "pharma-manufacturing": { ...pharma_manufacturing, title: "Pharma Manufacturing ERP Software" },
  "pharma-pcd": { ...pharma_pcd, title: "Pharma PCD ERP Software" },
};
