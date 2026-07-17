"use client";

import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clipboard,
  Leaf,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  CSSProperties,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  formatPrice,
  Product,
  ProductCategory,
  products,
  STORE,
} from "./products";

type Filter = "Todos" | ProductCategory;
type Sort = "Destacados" | "Menor precio" | "Mayor precio";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function BottlePlaceholder({ accent }: { accent: string }) {
  return (
    <div
      className="bottle-art"
      style={{ "--bottle-accent": accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="bottle-cap" />
      <span className="bottle-neck" />
      <span className="bottle-body">
        <span className="bottle-label">ESENCIA</span>
      </span>
      <span className="bottle-shadow" />
    </div>
  );
}

function ProductVisual({ product }: { product: Product }) {
  if (product.image) {
    return (
      <Image
        src={`${basePath}${product.image}`}
        alt={`${product.brand} ${product.name}`}
        fill
        sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
        className="product-photo"
        unoptimized
      />
    );
  }

  return <BottlePlaceholder accent={product.accent} />;
}

export default function Home() {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [sort, setSort] = useState<Sort>("Destacados");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedCart = window.localStorage.getItem("esencia-cart");
    if (!savedCart) return;
    const timer = window.setTimeout(() => {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        window.localStorage.removeItem("esencia-cart");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("esencia-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.classList.toggle(
      "no-scroll",
      cartOpen || menuOpen || Boolean(selectedProduct),
    );
    return () => document.body.classList.remove("no-scroll");
  }, [cartOpen, menuOpen, selectedProduct]);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesFilter = filter === "Todos" || product.category === filter;
      const searchable = [
        product.name,
        product.brand,
        product.category,
        ...product.notes,
      ]
        .join(" ")
        .toLowerCase();
      return matchesFilter && searchable.includes(normalized);
    });

    if (sort === "Menor precio") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "Mayor precio") return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [filter, search, sort]);

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => cart[product.id])
        .map((product) => ({ ...product, quantity: cart[product.id] })),
    [cart],
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function addToCart(product: Product) {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }));
    showToast(`${product.name} se agregó a tu bolsa`);
  }

  function updateQuantity(id: number, difference: number) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] ?? 0) + difference;
      if (quantity <= 0) delete next[id];
      else next[id] = quantity;
      return next;
    });
  }

  function removeFromCart(id: number) {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function scrollToCatalog(nextFilter?: Filter) {
    if (nextFilter) setFilter(nextFilter);
    setMenuOpen(false);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  function focusSearch() {
    scrollToCatalog();
    window.setTimeout(() => searchRef.current?.focus(), 550);
  }

  async function copyOrder() {
    if (!cartItems.length) return;
    const lines = cartItems.map(
      (item) =>
        `${item.quantity} × ${item.brand} ${item.name} — ${formatPrice(
          item.quantity * item.price,
        )}`,
    );
    const order = [
      `Hola, quiero hacer este pedido en ${STORE.name}:`,
      "",
      ...lines,
      "",
      `Total: ${formatPrice(cartTotal)}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(order);
      showToast("Pedido copiado. Ya podés enviarlo por WhatsApp.");
    } catch {
      showToast("No se pudo copiar el pedido.");
    }
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="ESENCIA, ir al inicio">
          ESENCIA
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <button onClick={() => scrollToCatalog("Todos")}>Colecciones</button>
          <button onClick={() => scrollToCatalog("Para él")}>Para él</button>
          <button onClick={() => scrollToCatalog("Para ella")}>Para ella</button>
        </nav>

        <div className="header-actions">
          <button className="icon-button" onClick={focusSearch} aria-label="Buscar perfumes">
            <Search size={22} strokeWidth={1.6} />
          </button>
          <button
            className="icon-button cart-button"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir bolsa, ${cartCount} productos`}
          >
            <ShoppingBag size={23} strokeWidth={1.6} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button
            className="icon-button menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={24} strokeWidth={1.6} />
          </button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Nueva colección</p>
          <h1>Tu esencia,<br />tu historia</h1>
          <p className="hero-text">
            Perfumes originales que acompañan cada momento y dejan una impresión
            inolvidable.
          </p>
          <button className="primary-button" onClick={() => scrollToCatalog("Todos")}>
            Explorar colección <ArrowRight size={19} />
          </button>
          <div className="shipping-note">
            <Truck size={27} strokeWidth={1.5} />
            <span>{STORE.shippingMessage}</span>
          </div>
        </div>

        <div className="hero-image" aria-label="Colección de perfumes ESENCIA">
          <Image
            src={`${basePath}/esencia-hero.png`}
            alt="Tres frascos de perfume sobre piedra clara con ramas de olivo"
            fill
            priority
            unoptimized
            sizes="(max-width: 800px) 100vw, 58vw"
          />
          <span className="hero-image-label">Selección 2026</span>
        </div>
      </section>

      <section className="benefits" id="envios" aria-label="Beneficios de la tienda">
        <article>
          <PackageCheck size={26} strokeWidth={1.5} />
          <div><strong>Envíos nacionales</strong><span>Recibí tu pedido donde estés</span></div>
        </article>
        <article>
          <ShieldCheck size={26} strokeWidth={1.5} />
          <div><strong>Compra segura</strong><span>Atención antes y después de comprar</span></div>
        </article>
        <article>
          <Sparkles size={26} strokeWidth={1.5} />
          <div><strong>Perfumes seleccionados</strong><span>Aromas para cada estilo</span></div>
        </article>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Nuestra selección</p>
            <h2>Encontrá tu próximo aroma</h2>
          </div>
          <p>
            Explorá la colección y elegí el perfume que mejor acompañe tu estilo.
          </p>
        </div>

        <div className="catalog-tools">
          <div className="filters" role="group" aria-label="Filtrar productos">
            {(["Todos", "Para ella", "Para él", "Unisex"] as Filter[]).map(
              (item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <div className="search-sort">
            <label className="search-field">
              <Search size={18} strokeWidth={1.7} />
              <input
                ref={searchRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar perfume"
                aria-label="Buscar perfume"
              />
              {search && (
                <button onClick={() => setSearch("")} aria-label="Borrar búsqueda">
                  <X size={16} />
                </button>
              )}
            </label>
            <label className="sort-field">
              <span className="sr-only">Ordenar productos</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
                <option>Destacados</option>
                <option>Menor precio</option>
                <option>Mayor precio</option>
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </label>
          </div>
        </div>

        {filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <button
                  className="product-visual"
                  onClick={() => setSelectedProduct(product)}
                  aria-label={`Ver ${product.name}`}
                >
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                  <ProductVisual product={product} />
                  <span className="quick-view">Vista rápida</span>
                </button>
                <div className="product-info">
                  <div>
                    <p className="product-brand">{product.brand}</p>
                    <button onClick={() => setSelectedProduct(product)}>
                      <h3>{product.name}</h3>
                    </button>
                    <p className="product-meta">{product.category} · {product.size}</p>
                  </div>
                  <div className="product-price-row">
                    <div className="product-price">
                      <strong>{formatPrice(product.price)}</strong>
                      {product.previousPrice && <del>{formatPrice(product.previousPrice)}</del>}
                    </div>
                    <button
                      className="add-button"
                      onClick={() => addToCart(product)}
                      aria-label={`Agregar ${product.name} a la bolsa`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <Search size={30} strokeWidth={1.4} />
            <h3>No encontramos ese perfume</h3>
            <p>Probá otra búsqueda o mirá toda la colección.</p>
            <button onClick={() => { setSearch(""); setFilter("Todos"); }}>
              Ver todos los perfumes
            </button>
          </div>
        )}
      </section>

      <section className="story-section">
        <div className="story-mark"><Leaf size={34} strokeWidth={1.3} /></div>
        <p className="eyebrow">Más que un perfume</p>
        <h2>El aroma correcto convierte un momento en un recuerdo.</h2>
        <p>
          Descubrí fragancias pensadas para acompañarte todos los días, regalar o
          guardar para una ocasión especial.
        </p>
        <button onClick={() => scrollToCatalog("Todos")}>
          Conocer la colección <ArrowRight size={18} />
        </button>
      </section>

      <section className="newsletter-section">
        <div>
          <p className="eyebrow">Novedades ESENCIA</p>
          <h2>Recibí lanzamientos y ofertas especiales.</h2>
        </div>
        {subscribed ? (
          <p className="success-message"><Check size={19} /> ¡Listo! Te agregamos a la lista.</p>
        ) : (
          <form onSubmit={subscribe}>
            <label className="sr-only" htmlFor="newsletter-email">Correo electrónico</label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Tu correo electrónico"
            />
            <button type="submit">Suscribirme <ArrowRight size={18} /></button>
          </form>
        )}
      </section>

      <footer>
        <div className="footer-brand">
          <a className="brand" href="#inicio">ESENCIA</a>
          <p>Perfumes para contar tu historia.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Colecciones</strong>
            <button onClick={() => scrollToCatalog("Para ella")}>Para ella</button>
            <button onClick={() => scrollToCatalog("Para él")}>Para él</button>
            <button onClick={() => scrollToCatalog("Unisex")}>Unisex</button>
          </div>
          <div>
            <strong>Ayuda</strong>
            <a href="#envios">Envíos</a>
            <button onClick={() => setCartOpen(true)}>Mi bolsa</button>
            <a href="mailto:ventas@tutienda.com">Contacto</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ESENCIA.</span>
          <span>Hecho para tu tienda de perfumes.</span>
        </div>
      </footer>

      <aside className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="drawer-header">
          <span className="brand">ESENCIA</span>
          <button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
            <X size={24} />
          </button>
        </div>
        <nav>
          <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
          <button onClick={() => scrollToCatalog("Todos")}>Colecciones</button>
          <button onClick={() => scrollToCatalog("Para él")}>Para él</button>
          <button onClick={() => scrollToCatalog("Para ella")}>Para ella</button>
        </nav>
        <p><Truck size={20} /> {STORE.shippingMessage}</p>
      </aside>

      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Tu selección</p>
            <h2>Mi bolsa <span>({cartCount})</span></h2>
          </div>
          <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Cerrar bolsa">
            <X size={24} />
          </button>
        </div>

        {cartItems.length ? (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-image"><ProductVisual product={item} /></div>
                  <div className="cart-item-info">
                    <p>{item.brand}</p>
                    <h3>{item.name}</h3>
                    <span>{item.size} · {item.category}</span>
                    <div className="cart-item-bottom">
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, -1)} aria-label="Quitar una unidad">
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} aria-label="Agregar una unidad">
                          <Plus size={14} />
                        </button>
                      </div>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.id)} aria-label={`Eliminar ${item.name}`}>
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div>
              <p>El costo de envío se confirma al realizar tu pedido.</p>
              <button className="checkout-button" onClick={copyOrder}>
                <Clipboard size={18} /> Copiar pedido
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <ShoppingBag size={42} strokeWidth={1.2} />
            <h3>Tu bolsa está vacía</h3>
            <p>Agregá un perfume y aparecerá aquí.</p>
            <button onClick={() => { setCartOpen(false); scrollToCatalog("Todos"); }}>
              Ver colección
            </button>
          </div>
        )}
      </aside>

      {selectedProduct && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <button className="modal-backdrop" onClick={() => setSelectedProduct(null)} aria-label="Cerrar detalle" />
          <article className="product-modal">
            <button className="modal-close icon-button" onClick={() => setSelectedProduct(null)} aria-label="Cerrar">
              <X size={23} />
            </button>
            <div className="modal-visual"><ProductVisual product={selectedProduct} /></div>
            <div className="modal-content">
              <p className="product-brand">{selectedProduct.brand}</p>
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <p className="modal-category">{selectedProduct.category} · {selectedProduct.size}</p>
              <p className="modal-description">{selectedProduct.description}</p>
              <div className="notes">
                {selectedProduct.notes.map((note) => <span key={note}>{note}</span>)}
              </div>
              <div className="modal-price">
                <strong>{formatPrice(selectedProduct.price)}</strong>
                {selectedProduct.previousPrice && <del>{formatPrice(selectedProduct.previousPrice)}</del>}
              </div>
              <button className="primary-button" onClick={() => addToCart(selectedProduct)}>
                Agregar a la bolsa <ShoppingBag size={18} />
              </button>
              <p className="modal-shipping"><Truck size={18} /> {STORE.shippingMessage}</p>
            </div>
          </article>
        </div>
      )}

      {(cartOpen || menuOpen) && (
        <button
          className="page-overlay"
          onClick={() => { setCartOpen(false); setMenuOpen(false); }}
          aria-label="Cerrar panel"
        />
      )}

      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        <Check size={17} /> {toast}
      </div>
    </main>
  );
}
