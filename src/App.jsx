import React, { useMemo, useState } from "react";
import {
  Search,
  Home,
  Grid2X2,
  Calculator,
  FileText,
  User,
  ShoppingCart,
  ArrowLeft,
  Share2,
  MessageCircle,
} from "lucide-react";

const productos = [
  {
    id: 1,
    categoria: "Lambrín",
    nombre: "Lambrín WPC Roble Natural",
    codigo: "LAM-WPC-001",
    precio: 850,
    instalacion: 180,
    unidad: "m²",
    imagen:
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "Lambrín decorativo tipo WPC, ideal para muros interiores y exteriores. Acabado premium tipo madera natural.",
  },
  {
    id: 2,
    categoria: "Papel Tapiz",
    nombre: "Papel Tapiz Textura Beige",
    codigo: "PT-002",
    precio: 1250,
    instalacion: 350,
    unidad: "rollo",
    imagen:
      "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "Papel tapiz elegante en tono beige con textura sutil. Ideal para recámaras, salas y muros decorativos.",
  },
  {
    id: 3,
    categoria: "SPC / PVC",
    nombre: "Piso SPC Nogal Claro",
    codigo: "SPC-003",
    precio: 620,
    instalacion: 160,
    unidad: "m²",
    imagen:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "Piso SPC resistente al agua, acabado madera nogal claro, perfecto para interiores modernos.",
  },
  {
    id: 4,
    categoria: "Cortinas",
    nombre: "Cortina Hotelera Premium",
    codigo: "COR-004",
    precio: 980,
    instalacion: 220,
    unidad: "m²",
    imagen:
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "Cortina tipo hotelera con caída elegante. Se cotiza por medida del claro o muro.",
  },
  {
    id: 5,
    categoria: "Follaje",
    nombre: "Follaje Artificial Tropical",
    codigo: "FOL-005",
    precio: 690,
    instalacion: 150,
    unidad: "m²",
    imagen:
      "https://images.unsplash.com/photo-1530482817083-29ae4b92ff15?q=80&w=1200&auto=format&fit=crop",
    descripcion:
      "Follaje artificial decorativo para muros verdes, terrazas, locales y espacios comerciales.",
  },
];

const categorias = ["Todas", ...new Set(productos.map((p) => p.categoria))];

function formatPrice(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export default function NubeInterioresApp() {
  const [tab, setTab] = useState("inicio");
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productoActivo, setProductoActivo] = useState(productos[0]);
  const [ancho, setAncho] = useState(2.8);
  const [alto, setAlto] = useState(2.6);
  const [incluirInstalacion, setIncluirInstalacion] = useState(true);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideCategoria =
        categoria === "Todas" || producto.categoria === categoria;
      const texto = `${producto.nombre} ${producto.categoria} ${producto.codigo}`.toLowerCase();
      return coincideCategoria && texto.includes(busqueda.toLowerCase());
    });
  }, [categoria, busqueda]);

  const m2 = Math.max(Number(ancho) || 0, 0) * Math.max(Number(alto) || 0, 0);
  const material = m2 * productoActivo.precio;
  const instalacion = incluirInstalacion ? m2 * productoActivo.instalacion : 0;
  const total = material + instalacion;

  const mensajeWhatsapp = encodeURIComponent(
    `Hola, quiero cotizar con Nube Interiores:\n\nProducto: ${productoActivo.nombre}\nCódigo: ${productoActivo.codigo}\nMedida: ${ancho} m x ${alto} m\nTotal m²: ${m2.toFixed(
      2
    )} m²\nMaterial: ${formatPrice(material)}\nInstalación: ${
      incluirInstalacion ? formatPrice(instalacion) : "No incluida"
    }\nTotal estimado: ${formatPrice(total)}`
  );

  return (
    <div className="min-h-screen bg-[#f5f2eb] flex justify-center py-6 px-3">
      <div className="w-full max-w-sm bg-[#fcfbf8] min-h-[780px] rounded-[2.8rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-[#e8e1d5] relative">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          {tab === "producto" ? (
            <button
              onClick={() => setTab("catalogo")}
              className="p-2 rounded-full hover:bg-[#f1ece3] transition-all"
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <button className="p-2 rounded-full hover:bg-[#f1ece3] transition-all">
              <Grid2X2 size={22} />
            </button>
          )}

          <div className="font-semibold text-lg">
            {tab === "inicio"
              ? "Nube Interiores"
              : tab === "catalogo"
              ? "Catálogo"
              : tab === "cotizador"
              ? "Cotizador"
              : tab === "resumen"
              ? "Cotización"
              : "Producto"}
          </div>

          <button className="relative p-2 rounded-full hover:bg-[#f1ece3] transition-all">
            <ShoppingCart size={22} />
            <span className="absolute top-1 right-1 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </button>
        </div>

        <main className="px-5 pb-28">
          {tab === "inicio" && (
            <section className="space-y-6">
              <div className="text-center pt-4">
                <div className="mx-auto w-28 h-20 rounded-[2rem] border-2 border-black flex items-center justify-center text-4xl font-light bg-white shadow-sm">
                  ☁
                </div>

                <h1 className="text-5xl tracking-[0.45em] font-extralight mt-5 text-[#1d1d1d]">
                  NUBE
                </h1>

                <p className="tracking-[0.55em] text-[11px] text-[#8c8477] mt-1">
                  INTERIORES
                </p>

                <h2 className="text-3xl font-bold mt-7">¡Bienvenido!</h2>
                <p className="text-neutral-500 text-base mt-1">
                  Inspírate, elige y cotiza tus acabados.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#f1ece3] rounded-[22px] px-5 py-4 shadow-inner">
                <Search size={20} className="text-neutral-500" />
                <input
                  className="bg-transparent outline-none text-sm w-full placeholder:text-neutral-400"
                  placeholder="Buscar productos, colores, categorías..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {categorias
                  .filter((c) => c !== "Todas")
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategoria(cat);
                        setTab("catalogo");
                      }}
                      className="text-center transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-full aspect-square rounded-full bg-[#e8dfd0] flex items-center justify-center text-xl shadow-md">
                        ▥
                      </div>
                      <p className="text-[11px] mt-2 truncate">{cat}</p>
                    </button>
                  ))}
              </div>

              <div className="rounded-[34px] overflow-hidden relative h-64 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop"
                  className="w-full h-full object-cover"
                  alt="Interior premium"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-white text-3xl font-bold leading-tight">
                    Transforma tus espacios
                  </h3>
                  <p className="text-white/90 text-base mt-2">
                    con acabados premium.
                  </p>
                  <button
                    onClick={() => setTab("catalogo")}
                    className="mt-5 bg-white text-black rounded-2xl px-6 py-3 text-sm font-semibold w-fit shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    Ver catálogo
                  </button>
                </div>
              </div>
            </section>
          )}

          {tab === "catalogo" && (
            <section className="space-y-5">
              <div className="flex items-center gap-3 bg-[#f1ece3] rounded-[22px] px-5 py-4 shadow-inner">
                <Search size={20} className="text-neutral-500" />
                <input
                  className="bg-transparent outline-none text-sm w-full placeholder:text-neutral-400"
                  placeholder="Buscar acabados..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoria(cat)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                      categoria === cat
                        ? "bg-black text-white shadow-md"
                        : "bg-[#f1ece3] text-black"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {productosFiltrados.map((producto) => (
                  <button
                    key={producto.id}
                    onClick={() => {
                      setProductoActivo(producto);
                      setTab("producto");
                    }}
                    className="text-left rounded-3xl overflow-hidden border border-[#e5ddd0] bg-white shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <img
                      src={producto.imagen}
                      className="h-28 w-full object-cover"
                      alt={producto.nombre}
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm leading-tight">
                        {producto.nombre}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatPrice(producto.precio)} / {producto.unidad}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {tab === "producto" && (
            <section className="-mx-5">
              <img
                src={productoActivo.imagen}
                className="w-full h-72 object-cover"
                alt={productoActivo.nombre}
              />

              <div className="px-5 pt-5 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {productoActivo.nombre}
                  </h1>
                  <p className="text-neutral-500 text-sm">
                    {productoActivo.codigo}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">
                    {formatPrice(productoActivo.precio)}{" "}
                    <span className="text-sm font-normal">
                      / {productoActivo.unidad}
                    </span>
                  </p>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    Disponible
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold">Descripción</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {productoActivo.descripcion}
                  </p>
                </div>

                <button
                  onClick={() => setTab("cotizador")}
                  className="w-full bg-black text-white rounded-2xl py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  Cotizar este producto
                </button>
              </div>
            </section>
          )}

          {tab === "cotizador" && (
            <section className="space-y-5">
              <div>
                <label className="font-semibold text-sm">
                  Selecciona un producto
                </label>
                <select
                  className="mt-2 w-full border border-[#e5ddd0] rounded-2xl p-3 bg-white"
                  value={productoActivo.id}
                  onChange={(e) =>
                    setProductoActivo(
                      productos.find((p) => p.id === Number(e.target.value))
                    )
                  }
                >
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white border border-[#e5ddd0] rounded-2xl p-3 flex gap-3 shadow-sm">
                <img
                  src={productoActivo.imagen}
                  className="w-20 h-20 rounded-xl object-cover"
                  alt={productoActivo.nombre}
                />
                <div>
                  <h3 className="font-semibold text-sm">
                    {productoActivo.nombre}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {formatPrice(productoActivo.precio)} /{" "}
                    {productoActivo.unidad}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Instalación: {formatPrice(productoActivo.instalacion)} / m²
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">
                  ¿Cuánto necesitas?
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#e5ddd0] rounded-2xl p-3 bg-white">
                    <label className="text-xs text-neutral-500">
                      Ancho en metros
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full outline-none text-lg font-semibold mt-1"
                      value={ancho}
                      onChange={(e) => setAncho(e.target.value)}
                    />
                  </div>

                  <div className="border border-[#e5ddd0] rounded-2xl p-3 bg-white">
                    <label className="text-xs text-neutral-500">
                      Alto en metros
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full outline-none text-lg font-semibold mt-1"
                      value={alto}
                      onChange={(e) => setAlto(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center justify-between bg-white border border-[#e5ddd0] rounded-2xl p-4 shadow-sm">
                <span className="font-semibold text-sm">
                  Incluir instalación
                </span>
                <input
                  type="checkbox"
                  checked={incluirInstalacion}
                  onChange={(e) => setIncluirInstalacion(e.target.checked)}
                />
              </label>

              <div className="bg-[#f3ecdf] rounded-3xl p-5 space-y-2 shadow-inner">
                <div className="flex justify-between text-sm">
                  <span>Total m²</span>
                  <strong>{m2.toFixed(2)} m²</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Material</span>
                  <strong>{formatPrice(material)}</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Instalación</span>
                  <strong>{formatPrice(instalacion)}</strong>
                </div>
                <div className="border-t border-[#d8cfc0] pt-3 flex justify-between text-lg">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>

              <button
                onClick={() => setTab("resumen")}
                className="w-full bg-black text-white rounded-2xl py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Ver resumen
              </button>
            </section>
          )}

          {tab === "resumen" && (
            <section className="space-y-5">
              <h2 className="text-xl font-bold">Resumen de tu cotización</h2>

              <div className="bg-white border border-[#e5ddd0] rounded-3xl p-4 shadow-md flex gap-3">
                <img
                  src={productoActivo.imagen}
                  className="w-20 h-20 rounded-2xl object-cover"
                  alt={productoActivo.nombre}
                />
                <div>
                  <h3 className="font-semibold text-sm">
                    {productoActivo.nombre}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {m2.toFixed(2)} m² ×{" "}
                    {formatPrice(productoActivo.precio)}
                  </p>
                  <p className="font-bold mt-2">{formatPrice(material)}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Materiales</span>
                  <strong>{formatPrice(material)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Instalación estimada</span>
                  <strong>{formatPrice(instalacion)}</strong>
                </div>
                <div className="flex justify-between text-lg border-t pt-3">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>

              <div className="bg-[#f3ecdf] rounded-3xl p-5 text-center shadow-inner">
                <p className="text-sm text-neutral-500">Total estimado</p>
                <p className="text-3xl font-bold">{formatPrice(total)}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Precios sujetos a confirmación.
                </p>
              </div>

              <a
                href={`https://wa.me/?text=${mensajeWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-black text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <MessageCircle size={20} /> Enviar por WhatsApp
              </a>

              <button className="w-full border border-black text-black rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-black hover:text-white">
                <Share2 size={20} /> Guardar cotización
              </button>
            </section>
          )}
        </main>

        <nav className="absolute bottom-0 left-0 right-0 bg-[#fcfbf8]/95 backdrop-blur-md border-t border-[#e5ddd0] px-4 py-4 grid grid-cols-5 gap-1">
          <NavButton
            active={tab === "inicio"}
            icon={<Home size={20} />}
            label="Inicio"
            onClick={() => setTab("inicio")}
          />
          <NavButton
            active={tab === "catalogo" || tab === "producto"}
            icon={<Grid2X2 size={20} />}
            label="Catálogo"
            onClick={() => setTab("catalogo")}
          />
          <NavButton
            active={tab === "cotizador"}
            icon={<Calculator size={20} />}
            label="Cotizar"
            onClick={() => setTab("cotizador")}
          />
          <NavButton
            active={tab === "resumen"}
            icon={<FileText size={20} />}
            label="Resumen"
            onClick={() => setTab("resumen")}
          />
          <NavButton
            active={false}
            icon={<User size={20} />}
            label="Perfil"
            onClick={() => alert("Perfil próximamente")}
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-[11px] transition-all ${
        active ? "text-black font-bold" : "text-neutral-400"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
