'use client';

import {useState, useEffect} from 'react';
import {motion} from "motion/react";
// import Link from 'next/link'; // Unused import
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
// import Image from "next/image"; // Unused import
import Navbar from '../components/Navbar';
import {Filter as FilterIcon, X as XIcon, ChevronDown, ChevronUp} from 'lucide-react';

export default function CatalogPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`${basePath}/data/products/products.json`) // MODIFIED
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(rawData => {
                if (!Array.isArray(rawData)) {
                    console.error('Fetched data is not an array:', rawData);
                    throw new Error('Product data is not in the expected format.');
                }

                // Prepend basePath to image paths within the product data
                // Assuming product.fotos is an array of strings (image paths)
                // and each path is relative like "images/product/image.jpg"
                const processedData = rawData.map(product => {
                    const newFotos = product.fotos && Array.isArray(product.fotos)
                        ? product.fotos.map(fotoPath => {
                            // Ensure fotoPath is a string and doesn't have a leading slash
                            // if basePath is to be prepended.
                            const path = String(fotoPath);
                            return `${basePath}/${path.startsWith('/') ? path.substring(1) : path}`;
                        })
                        : product.fotos; // Keep as is if not an array or undefined

                    // If you have other specific image fields, process them similarly:
                    // const newMainImage = product.imagenPrincipal
                    //    ? `${basePath}/${String(product.imagenPrincipal).startsWith('/') ? String(product.imagenPrincipal).substring(1) : String(product.imagenPrincipal)}`
                    //    : product.imagenPrincipal;

                    return {
                        ...product,
                        fotos: newFotos,
                        // imagenPrincipal: newMainImage, // Example
                    };
                });

                setProducts(processedData);

                const colorNames = new Set();
                const categoryNames = new Set();

                processedData.forEach(product => {
                    if (product && Array.isArray(product.colores)) {
                        product.colores.forEach(colorObj => colorNames.add(colorObj.color));
                    }
                    if (product && typeof product.categoria === 'string' && product.categoria.trim() !== '') {
                        categoryNames.add(product.categoria);
                    }
                });
                setAvailableColors(Array.from(colorNames).sort());
                setAvailableCategories(Array.from(categoryNames).sort());
            })
            .catch(fetchError => {
                console.error('Error loading products:', fetchError);
                setError(fetchError.message || 'Failed to load products.');
                setProducts([]); // Ensure products is an empty array on error
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [basePath]); // Added basePath to dependency array

    useEffect(() => {
        const filtered = products.filter(product => {
            const productName = product && typeof product.nombre === 'string' ? product.nombre : '';
            const productDescription = product && typeof product.descripcion === 'string' ? product.descripcion : '';
            const productActualColorNames = product && Array.isArray(product.colores)
                ? product.colores.map(cObj => cObj.color)
                : [];
            const productCategory = product && typeof product.categoria === 'string' ? product.categoria : '';

            const matchesSearch =
                searchTerm === '' ||
                productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                productDescription.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesColors =
                selectedColors.length === 0 ||
                productActualColorNames.some(pcn => selectedColors.includes(pcn));

            const matchesCategories =
                selectedCategories.length === 0 ||
                (productCategory && selectedCategories.includes(productCategory));

            return matchesSearch && matchesColors && matchesCategories;
        });

        setFilteredProducts(filtered);

        const groupProducts = (productsToGroup) => {
            return productsToGroup.reduce((acc, product) => {
                const category = (product.categoria && product.categoria.trim() !== '') ? product.categoria : 'Otros';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(product);
                return acc;
            }, {});
        };
        setGroupedProducts(groupProducts(filtered));

    }, [searchTerm, selectedColors, selectedCategories, products]);

    const handleColorToggle = (colorName) => {
        setSelectedColors(prevSelectedColors =>
            prevSelectedColors.includes(colorName)
                ? prevSelectedColors.filter(c => c !== colorName)
                : [...prevSelectedColors, colorName]
        );
    };

    const handleCategoryToggle = (categoryName) => {
        setSelectedCategories(prevSelectedCategories =>
            prevSelectedCategories.includes(categoryName)
                ? prevSelectedCategories.filter(c => c !== categoryName)
                : [...prevSelectedCategories, categoryName]
        );
    };

    return (
        <main className="min-h-screen bg-white dark:bg-slate-900">
            <Navbar currentPage="catalog"/>
            {/* Updated Filter Section */}
            <section className="py-8 bg-slate-50 dark:bg-slate-800/50">
                <div className="container mx-auto px-4">
                    {/* Search Input - Always Visible */}
                    <div className="mb-6">
                        <label htmlFor="search"
                               className="block text-[var(--texto-titulo)] dark:text-slate-200 font-medium mb-2">
                            Buscar productos
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Nombre o descripción..."
                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-600 text-[var(--texto-titulo)] dark:text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--fondo-primario)] dark:focus:ring-[var(--fondo-accent)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Toggle Button - Visible on all screen sizes */}
                    <div className="mb-4">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 px-4 py-3 bg-[var(--fondo-primario)] text-white font-semibold rounded-lg shadow-md hover:bg-[var(--fondo-secundario)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--fondo-primario)] transition-all duration-150 ease-in-out"
                            aria-expanded={isFilterOpen}
                            aria-controls="collapsible-filter-panel"
                        >
                            <FilterIcon size={20}/>
                            <span>{isFilterOpen ? 'Ocultar Filtros Avanzados' : 'Mostrar Filtros Avanzados'}</span>
                            {isFilterOpen ? <ChevronUp size={20} className="ml-1"/> :
                                <ChevronDown size={20} className="ml-1"/>}
                        </button>
                    </div>

                    {/* Collapsible Filters Container (Color & Category) */}
                    <div
                        id="collapsible-filter-panel"
                        className={`
                            ${isFilterOpen ? 'block animate-fadeIn' : 'hidden'}
                            bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg
                        `}
                    >
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* Color Filters */}
                            <div className="flex-grow md:flex-grow-0 md:w-1/2 lg:w-auto">
                                <h3 className="text-[var(--texto-titulo)] dark:text-slate-200 font-medium mb-3">
                                    Filtrar por color
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableColors.map((colorName) => (
                                        <button
                                            key={colorName}
                                            type="button"
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ease-in-out
                                                ${
                                                selectedColors.includes(colorName)
                                                    ? 'bg-[var(--fondo-primario)] text-white ring-2 ring-offset-1 ring-[var(--fondo-primario)] dark:ring-offset-slate-700'
                                                    : 'bg-slate-200 dark:bg-slate-600 text-[var(--texto-subtitulo)] dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                                            }`}
                                            onClick={() => handleColorToggle(colorName)}
                                        >
                                            {colorName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filters */}
                            <div className="flex-grow md:flex-grow-0 md:w-1/2 lg:w-auto">
                                <h3 className="text-[var(--texto-titulo)] dark:text-slate-200 font-medium mb-3">
                                    Filtrar por categoría
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableCategories.map((categoryName) => (
                                        <button
                                            key={categoryName}
                                            type="button"
                                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ease-in-out
                                                ${
                                                selectedCategories.includes(categoryName)
                                                    ? 'bg-[var(--fondo-primario)] text-white ring-2 ring-offset-1 ring-[var(--fondo-primario)] dark:ring-offset-slate-700'
                                                    : 'bg-slate-200 dark:bg-slate-600 text-[var(--texto-subtitulo)] dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                                            }`}
                                            onClick={() => handleCategoryToggle(categoryName)}
                                        >
                                            {categoryName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <motion.h1
                            className="text-3xl font-bold text-[var(--texto-titulo)] dark:text-slate-100 mb-2"
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            viewport={{once: false, amount: 0.2}}
                            transition={{duration: 0.5}}
                        >
                            Nuestro Catálogo
                        </motion.h1>
                        {!isLoading && !error && (
                            <motion.p
                                className="text-[var(--texto-subtitulo)] dark:text-slate-400"
                                initial={{opacity: 0, y: 10}}
                                whileInView={{opacity: 1, y: 0}}
                                viewport={{once: false, amount: 0.2}}
                                transition={{duration: 0.5, delay: 0.1}}
                            >
                                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                            </motion.p>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--fondo-primario)]"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 dark:text-red-400 py-10">
                            <p className="text-xl font-semibold">Oops! Algo salió mal.</p>
                            <p>Error: {error}</p>
                            <p>No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <p className="col-span-full text-center text-[var(--texto-subtitulo)] dark:text-slate-400 py-10">
                            No se encontraron productos que coincidan con tu búsqueda.
                        </p>
                    ) : (
                        Object.entries(groupedProducts)
                            .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB))
                            .map(([category, productsInCategory]) => {
                                if (productsInCategory.length === 0) {
                                    return null;
                                }
                                return (
                                    <div key={category} className="mb-12">
                                        <motion.h2
                                            className="text-2xl font-semibold text-[var(--texto-titulo)] dark:text-slate-100 mb-6 border-b-2 border-[var(--fondo-primario)] pb-2"
                                            initial={{opacity: 0, x: -20}}
                                            whileInView={{opacity: 1, x: 0}}
                                            viewport={{once: false, amount: 0.2}}
                                            transition={{duration: 0.5}}
                                        >
                                            {category}
                                        </motion.h2>
                                        <div
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"> {/* Adjusted grid for responsiveness */}
                                            {productsInCategory.map((product, index) => (
                                                <motion.div
                                                    key={product.id || `product-${category}-${index}`}
                                                    initial={{opacity: 0, y: 20}}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    viewport={{once: false, amount: 0.1}}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: index * 0.05
                                                    }}
                                                >
                                                    <ProductCard product={product}/>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                    )}
                </div>
            </section>
            <Footer/>
        </main>
    );
}