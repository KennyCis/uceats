import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";

function HomePage() {
  const mockProducts = [
    { id: 1, name: "Super Burger", price: 5.50 },
    { id: 2, name: "Salchipapa", price: 3.00 },
    { id: 3, name: "Cola Zero", price: 1.50 },
    { id: 4, name: "Club Sandwich", price: 4.25 },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
      <Sidebar />
      
      <div style={{ marginLeft: "250px" }}> 
        <Header />
        
        <main style={{ padding: "40px 80px" }}>
          
          {/*Text */}
          <div style={{ marginBottom: "30px" }}>
            <h1 style={{ margin: 0, color: "var(--primary-dark)", fontSize: "28px" }}>Products Management</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "5px" }}>Manage your bar menu items</p>
          </div>

          {/* GRID*/}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", 
            gap: "25px" 
          }}>
            
            {/*card add */}
            <ProductCard variant="add" />

            {/*cards products*/}
            {mockProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}

          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;