import logo from "./logo.png";
import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Home,
  Grid2X2,
  Calculator,
  FileText,
  User,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "./supabase";

const categoriasVisuales = [
  { nombre: "Cortinas", imagen: "/categorias/cortinas.png" },
  { nombre: "Persianas", imagen: "/categorias/persianas.png" },
  { nombre: "Lambrín Interior", imagen: "/categorias/lambrin-interior.png" },
  { nombre: "Lambrín Exterior", imagen: "/categorias/lambrin-exterior.png" },
  { nombre: "Placas PVC", imagen: "/categorias/placas-pvc.png" },
  { nombre: "Plafón PVC", imagen: "/categorias/plafon-pvc.png" },
  { nombre: "Vigas WPC", imagen: "/categorias/vigas-wpc.png" },
  { nombre: "Follaje Artificial", imagen: "/categorias/follaje-artificial.png" },
  { nombre: "Pasto Artificial", imagen: "/categorias/pasto-artificial.png" },
  { nombre: "Wall Cladding", imagen: "/categorias/wall-cladding.png" },
  { nombre: "Papel Tapiz", imagen: "/categorias/papel-tapiz.png" },
  { nombre: "Vegetación Artificial", imagen: "/categorias/vegetacion-artificial.png" },
  { nombre: "Pisos SPC", imagen: "/categorias/piso-spc.png" },
];

const categorias = ["Todas", ...categoriasVisuales.map((c) => c.nombre)];

function formatPrice(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value || 0));
}

function getImagen(producto) {
  return producto?.imagen_url || "/categorias/lambrin-interior.png";
}
function getImagenes(producto) {
  return [
    producto?.imagen_url,
    producto?.imagen_2,
    producto?.imagen_3,
    producto?.imagen_4,
    producto?.imagen_5,
    producto?.imagen_6,
  ].filter(Boolean);
}
export default function App() {
  const [tab, setTab] = useState("inicio");
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
const [productoActivo, setProductoActivo] = useState(null);

const [modelos, setModelos] = useState([]);
const [modeloActivo, setModeloActivo] = useState(null);

const [medidas, setMedidas] = useState({
  ancho: "1",
  alto: "1",
});

const productoMostrado = modeloActivo || productoActivo;
  const [incluirInstalacion, setIncluirInstalacion] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {

  let respuesta = await supabase
    .from("Productos")
    .select("*")
    .eq("activo", true);

  if (respuesta.error) {
    respuesta = await supabase
      .from("productos")
      .select("*")
      .eq("activo", true);
  }

  if (!respuesta.error) {
    setProductos(respuesta.data || []);
  }
}
   async function cargarModelos(productoId) {
  const { data, error } = await supabase
    .from("Modelos")
    .select("*")
    .eq("producto_id", productoId)
    .eq("activo", true);

  if (error) {
    console.error("Error cargando modelos:", error);
    return;
  }

  setModelos(data || []);
}

    if (respuesta.error) {
      console.error("Error cargando productos:", respuesta.error);
      return;
    }

    const data = respuesta.data || [];
    setProductos(data);

    if (data.length > 0) {
      setProductoActivo(data[0]);
    }
  }

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideCategoria =
        categoria === "Todas" || producto.categoria === categoria;

      const texto = [
        producto.nombre || "",
        producto.codigo || "",
        producto.categoria || "",
      ]
        .join(" ")
        .toLowerCase();

      return coincideCategoria && texto.includes(busqueda.toLowerCase());
    });
  }, [productos, categoria, busqueda]);

  const producto = productoActivo || productosFiltrados[0] || productos[0] || null;
const productoCalculo = productoMostrado || producto;

  const anchoNumero = parseFloat(medidas.ancho) || 0;
const altoNumero = parseFloat(medidas.alto) || 0;
const areaActual = anchoNumero * altoNumero;

const rendimientoCaja = Number(productoCalculo?.rendimiento_caja_m2 || 6.49);
const precioCaja = Number(productoCalculo?.precio_caja || productoCalculo?.precio || 0);
const cajasActuales = areaActual > 0 ? Math.ceil(areaActual / rendimientoCaja) : 0;
const esPapelTapiz = productoCalculo?.tipo_calculo === "papel-tapiz_rollo";

const anchoRollo = Number(productoCalculo?.ancho_pieza_m || 0.53);
const largoRollo = Number(productoCalculo?.largo_pieza_m || 10.05);
const precioRollo = Number(productoCalculo?.precio_rollo || producto?.precio || 0);

const pliegosPorRollo =
  esPapelTapiz && altoNumero > 0
    ? Math.floor(largoRollo / altoNumero)
    : 0;

const anchoCubiertoPorRollo = pliegosPorRollo * anchoRollo;

const rollosActuales =
  esPapelTapiz && anchoCubiertoPorRollo > 0
    ? Math.ceil(anchoNumero / anchoCubiertoPorRollo)
    : 0;
const calculo = {
  area: areaActual,
  rendimientoCaja,

  cajas:
    productoCalculo?.tipo_calculo === "lambrin_caja"
      ? cajasActuales
      : null,

  rollos:
    productoCalculo?.tipo_calculo === "papel-tapiz_rollo"
      ? rollosActuales
      : null,

  totalMaterial:
    productoCalculo?.tipo_calculo === "lambrin_caja"
      ? cajasActuales * precioCaja
      : productoCalculo?.tipo_calculo === "papel-tapiz_rollo"
      ? rollosActuales * precioRollo
      : areaActual * Number(productoCalculo?.precio || 0),
};
  const material = calculo.totalMaterial || 0;

console.log("TIPO:", productoCalculo?.tipo_calculo);

const instalacion = incluirInstalacion
  ? productoCalculo?.tipo_calculo === "papel-tapiz_rollo"
    ? rollosActuales * Number(productoCalculo?.instalacion || 0)
    : areaActual * Number(productoCalculo?.instalacion || 0)
  : 0;

const total = material + instalacion;
function enviarWhatsApp() {
  const mensaje = `
Hola, me interesa el siguiente producto:

Producto: ${producto?.nombre}
Código: ${producto?.codigo}

Medidas:
Ancho: ${anchoNumero} m
Alto: ${altoNumero} m

${
  producto?.tipo_calculo === "papel-tapiz_rollo"
    ? `Rollos: ${rollosActuales}`
    : `Cantidad: ${calculo.cajas || areaActual.toFixed(2)}`
}

Material: ${formatPrice(material)}
Instalación: ${formatPrice(instalacion)}
Total: ${formatPrice(total)}

Enviado desde la App de Nube Interiores.
`;

  window.open(
    `https://wa.me/526862321867?text=${encodeURIComponent(mensaje)}`,
    "_blank"
  );
}
  return (
    <div className="min-h-screen bg-[#f5f2eb] flex justify-center py-6 px-3">
      <div className="w-full max-w-sm bg-[#fcfbf8] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#e8e1d5] relative min-h-[780px]">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (tab === "producto") setTab("catalogo");
            }}
            className="p-2"
          >
            {tab === "producto" ? <ArrowLeft size={22} /> : <Grid2X2 size={22} />}
          </button>

          <h1 className="font-semibold text-lg">Nube Interiores</h1>
          <ShoppingCart size={22} />
        </div>

        <main className="px-5 pb-28">
          {tab === "inicio" && (
            <section className="space-y-6">
              <div className="text-center pt-4">
                <img src="/logo.png" alt="Nube Interiores" className="w-44 mx-auto" />
                <h2 className="text-3xl font-bold mt-6">¡Bienvenido!</h2>
                <p className="text-neutral-500 mt-1">
                  Inspírate, elige y cotiza tus acabados.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#f1ece3] rounded-[22px] px-5 py-4">
                <Search size={20} />
                <input
                  className="bg-transparent outline-none w-full"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {categoriasVisuales.map((cat) => (
                  <button
                    key={cat.nombre}
                    onClick={() => {
                      setCategoria(cat.nombre);
                      setProductoActivo(null);
                      setTab("catalogo");
                    }}
                  >
                    <div className="w-full aspect-square rounded-full overflow-hidden bg-[#eadfce] shadow-lg">
                      <img
                        src={cat.imagen}
                        alt={cat.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] mt-2">{cat.nombre}</p>
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
                  <p className="text-white/90 text-base mt-2">con acabados premium.</p>
                  <button
                    onClick={() => setTab("catalogo")}
                    className="mt-5 bg-white text-black rounded-2xl px-6 py-3 text-sm font-semibold w-fit shadow-lg"
                  >
                    Ver catálogo
                  </button>
                </div>
              </div>
            </section>
          )}

          {tab === "catalogo" && (
            <section className="space-y-5">
              <div className="flex gap-2 overflow-x-auto">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoria(cat);
                      setProductoActivo(null);
                    }}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                      categoria === cat ? "bg-black text-white" : "bg-[#f1ece3]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {productosFiltrados.map((productoItem) => (
                  <button
                    key={productoItem.id}
                    onClick={() => {
  setProductoActivo(productoItem);
  setModeloActivo(null);

  if (productoItem.nombre === "Cat-Textura") {
    cargarModelos(productoItem.id);
    setTab("modelos");
  } else {
    setTab("producto");
  }
}}
                    className="rounded-3xl overflow-hidden border border-[#e5ddd0] bg-white shadow-md"
                  >
                    <img
                      src={getImagen(productoItem)}
                      alt={productoItem.nombre}
                      className="w-full h-32 object-cover"
                    />

                    <div className="p-3 text-left">
                      <h3 className="font-semibold text-sm">{productoItem.nombre}</h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatPrice(productoItem.precio_caja || productoItem.precio)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
{tab === "modelos" && productoActivo && (
  <section className="space-y-5">

    <div>
      <h2 className="text-2xl font-bold">
  {productoMostrado.nombre}
</h2>

      <p className="text-sm text-neutral-500">
  {productoMostrado.codigo}
</p>
    </div>

    <div className="grid grid-cols-2 gap-3">

      {modelos.map((modelo) => (
        <button
          key={modelo.id}
          onClick={() => {
            setModeloActivo(modelo);
            setTab("producto");
          }}
          className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#e5ddd0]"
        >
          <img
            src={modelo.imagen_url}
            alt={modelo.nombre}
            className="w-full h-32 object-cover"
          />

          <div className="p-3 text-left">
            <p className="font-semibold">
              {modelo.codigo}
            </p>
          </div>
        </button>
      ))}

    </div>

  </section>
)}
          {tab === "producto" && productoMostrado && (
            <section className="space-y-5">
             <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2">
  {getImagenes(productoMostrado).map((imagen, index) => (
    <img
      key={index}
      src={imagen}
      alt={`${productoMostrado.nombre} ${index + 1}`}
      className="w-full h-72 object-cover rounded-3xl flex-shrink-0 snap-center"
    />
  ))}
</div>

<div>
  <h2 className="text-2xl font-bold">{productoMostrado.nombre}</h2>
  <p className="text-sm text-neutral-500">{productoMostrado.codigo}</p>
</div>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">
                  {formatPrice(productoMostrado.precio_caja || productoMostrado.precio)}
                  <span className="text-sm font-normal"> / {productoMostrado.unidad}</span>
                </p>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  Disponible
                </span>
              </div>

              <div className="bg-white border border-[#e5ddd0] rounded-2xl p-4 shadow-sm">
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {productoMostrado.descripcion}
                </p>
              </div>

              {productoMostrado.tipo_calculo === "lambrin_caja" && (
                <div className="bg-[#f3ecdf] rounded-2xl p-4 text-sm space-y-1">
                  <p>
                    <strong>Piezas por caja:</strong> {productoMostrado.piezas_caja}
                  </p>
                  <p>
                    <strong>Rendimiento:</strong> {productoMostrado.rendimiento_caja_m2} m²
                  </p>
                </div>
              )}

              <button
                onClick={() => setTab("cotizador")}
                className="w-full bg-black text-white rounded-2xl py-4 font-semibold"
              >
                Cotizar este producto
              </button>
            </section>
          )}

          {tab === "cotizador" && producto && (
            <section className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-[#e5ddd0] p-3">
                  <label className="text-xs text-neutral-500">Ancho</label>
                  <input
  type="number"
  step="0.01"
  value={medidas.ancho}
  onChange={(e) => {
    const valor = e.target.value;
    setMedidas((prev) => ({
      ...prev,
      ancho: valor,
    }));
  }}
  className="w-full text-lg font-semibold outline-none"
/>
                </div>

                <div className="bg-white rounded-2xl border border-[#e5ddd0] p-3">
                  <label className="text-xs text-neutral-500">Alto</label>
                 <input
  type="number"
  step="0.01"
  value={medidas.alto}
  onChange={(e) => {
  const valor = e.target.value;
  setMedidas((prev) => ({
    ...prev,
    alto: valor,
  }));
}}
  className="w-full text-lg font-semibold outline-none"
/>
                </div>
              </div>

              <div className="bg-white border border-[#e5ddd0] rounded-3xl p-5 shadow-sm space-y-2">
  <div className="flex justify-between">
    <span>Área</span>
    <strong>{areaActual.toFixed(2)} m²</strong>
  </div>

  <div className="flex justify-between">
  <span>
    {producto?.tipo_calculo === "papel-tapiz_rollo"
      ? "Rollos necesarios"
      : "Cajas necesarias"}
  </span>

  <strong>
  {producto?.tipo_calculo === "papel-tapiz_rollo"
    ? `${rollosActuales} rollo${rollosActuales === 1 ? "" : "s"}`
    : `${cajasActuales} caja${cajasActuales === 1 ? "" : "s"}`
  }
</strong>
</div>
</div>

              <label className="flex items-center justify-between bg-white border border-[#e5ddd0] rounded-2xl p-4">
                <span className="font-semibold text-sm">Incluir instalación</span>
                <input
                  type="checkbox"
                  checked={incluirInstalacion}
                  onChange={(e) => setIncluirInstalacion(e.target.checked)}
                />
              </label>

              <div className="bg-[#f3ecdf] rounded-3xl p-5 space-y-2">
                <div className="flex justify-between">
                  <span>Material</span>
                  <strong>{formatPrice(material)}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Instalación</span>
                  <strong>{formatPrice(instalacion)}</strong>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>
              <div className="bg-[#f3ecdf] rounded-3xl p-5 space-y-2">
</div>

<button
  onClick={enviarWhatsApp}
  className="w-full bg-[#25D366] text-white font-semibold py-4 rounded-2xl mt-4 shadow-md"
>
  💬 Solicitar cotización por WhatsApp
</button>

</section>
)}
</main>

        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#e5ddd0] px-4 py-4 grid grid-cols-5">
          <button onClick={() => setTab("inicio")} className="flex flex-col items-center text-xs">
            <Home size={20} />
            Inicio
          </button>

          <button onClick={() => setTab("catalogo")} className="flex flex-col items-center text-xs">
            <Grid2X2 size={20} />
            Catálogo
          </button>

          <button onClick={() => setTab("cotizador")} className="flex flex-col items-center text-xs">
            <Calculator size={20} />
            Cotizar
          </button>

          <button className="flex flex-col items-center text-xs">
            <FileText size={20} />
            Resumen
          </button>

          <button className="flex flex-col items-center text-xs">
            <User size={20} />
            Perfil
          </button>
        </nav>
      </div>
    </div>
  );
}
