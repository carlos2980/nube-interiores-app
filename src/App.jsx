const productos = [
  {
    nombre: "Lambrín WPC Premium",
    precio: "$850 m2",
    imagen:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    nombre: "Papel Tapiz Elegante",
    precio: "$1250 rollo",
    imagen:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  },
  {
    nombre: "Piso SPC Nogal",
    precio: "$620 m2",
    imagen:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>Nube Interiores</h1>
        <p>Catálogo premium de acabados</p>
      </div>

      <div className="productos">
        {productos.map((producto, index) => (
          <div className="card" key={index}>
            <img src={producto.imagen} alt={producto.nombre} />
            <div className="card-content">
              <h2>{producto.nombre}</h2>
              <p className="precio">{producto.precio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
