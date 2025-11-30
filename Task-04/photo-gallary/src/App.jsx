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
                <img src={product.images?.[0]}/>
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
