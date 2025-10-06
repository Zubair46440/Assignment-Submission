import useFetch from "./Hook.js/useFetch";
import "./App.css";

export default function App() {
  const {
    data: products,
    loader,
    error,
  } = useFetch("https://api.escuelajs.co/api/v1/products");

  if (loader) {
    return (
      <div className="loader">
        <h1>Loading Please Wait ...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h1>Error: {error}</h1>
        <p>Please Cheak your Internet Connection</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Products Gallary</h1>
      </header>

      <main className="main-content">
        <div className="product-grid">
          {products &&
            products.slice(0, 35).map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={
                    product.images?.[0] ||
                    "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                />

                <div className="product-info">
                  <h2>{product.title}</h2>
                  <p className="category">{product.category?.name}</p>
                  <p className="price">${product.price}</p>
                  <button> View Product</button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
