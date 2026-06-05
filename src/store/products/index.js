import productsReducer from "./productsSlice";
import { fetchProducts, updateProduct, deleteProduct, addProduct } from "./productsThunk";

export { fetchProducts, updateProduct, deleteProduct, addProduct };
export default productsReducer;
