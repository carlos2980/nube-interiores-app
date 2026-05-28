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
  Share2,
  MessageCircle,
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
];

function formatPrice(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value || 0));
}

export default function NubeInterioresApp() {
  const [tab, setTab] = useState("inicio");
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoActivo, setProductoActivo] = useState(null);
  const [ancho, setAncho] = useState(2.8);
  const [alto, setAlto] = useState(2.6);
  const [incluirInstalacion, setIncluirInstalacion] = useState(true);

  useEffect(() => {
    obtenerProductos();
  }, []);

  async function obtenerProductos() {
    const { data, error } = await supabase
      .from("Productos")
      .select("*")
      .eq("activo", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
      return;
    }

    setProductos(data || []);

    if (data && data.length > 0) {
      setProductoActivo(data[0]);
    }
  }

  const categorias = useMemo(() => {
    const cats = productos.map((p) => p.categoria).filter(Boolean);
    return ["Todas", ...new Set(cats)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideCategoria =
        categoria === "Todas" || producto.categoria === categoria;

      const texto = `${producto.nombre} ${producto.categoria} ${producto.codigo}`.toLowerCase();

      return coincideCategoria && texto.includes(busqueda.toLowerCase());
    });
  }, [productos, categoria, busqueda]);

  const productoActual = productoActivo || productos[0];

  const m2 =
    Math.max(Number(ancho) || 0, 0) * Math.max(Number(alto) || 0, 0);

  const material = productoActual ? m2 * Number(productoActual.precio || 0) : 0;

  const instalacion =
    productoActual && incluirInstalacion
      ? m2 * Number(productoActual.instalacion || 0)
      : 0;

  const total = material + instalacion;

  const mensajeWhatsapp = encodeURIComponent(
    productoActual
      ? `Hola, quiero cotizar con Nube Interiores:\n\nProducto: ${productoActual.nombre}\nCódigo: ${productoActual.codigo}\nMedida: ${ancho} m x ${alto} m\nTotal m²: ${m2.toFixed(
          2
        )} m²\nMaterial: ${formatPrice(material)}\nInstalación: ${
          incluirInstal
