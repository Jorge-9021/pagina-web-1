# ESENCIA — tienda de perfumes

Página de catálogo para perfumes, lista para publicar en GitHub Pages.

## Colocar tus productos

1. Abrí `app/products.ts`.
2. Cambiá el nombre, marca, categoría, tamaño, precio, notas y descripción.
3. Guardá las fotografías dentro de `public/productos/`.
4. En cada producto, escribí la ruta de la foto. Ejemplo:

```ts
image: "/productos/perfume-1.png",
```

Si `image` queda vacío, la página muestra automáticamente una botella elegante
de ejemplo. La tienda incluye filtros, buscador, vista rápida, carrito guardado
en el navegador y una opción para copiar el pedido.

## Usarla en tu computadora

```bash
npm install
npm run dev
```

## Publicarla en GitHub Pages

El proyecto ya incluye la automatización necesaria. En el repositorio de GitHub,
abrí **Settings → Pages** y elegí **GitHub Actions** como fuente. Cada cambio que
subás a la rama `main` actualizará la página automáticamente.
