import productsReducer from "./productsSlice";
import { fetchProducts, updateProduct, deleteProduct } from "./productsThunk";

export { fetchProducts, updateProduct, deleteProduct };
export default productsReducer;
