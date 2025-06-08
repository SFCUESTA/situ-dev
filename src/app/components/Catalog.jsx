'use client';

import {useState, useEffect} from 'react';
import {motion} from "motion/react";
import {InfiniteMovingCards} from '@/components/ui/infinite-moving-cards';
import Link from 'next/link'; // Import Link for the button

export default function Catalog() {
    const [carouselItems, setCarouselItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch('/data/products/products.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('Fetched product data is not an array:', data);
                    throw new Error('Product data is not in the expected format.');
                }

                const items = data.map(product => ({
                    name: product.nombre,
                    imageSrc: product.fotos[0],
                    title: "",
                }));
                setCarouselItems(items);
            })
            .catch(fetchError => {
                console.error('Error loading products:', fetchError);
                setError(fetchError.message || 'Failed to load products.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <section className="py-16 bg-white/90 " id="catalogo">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 md:mb-20">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-[var(--fondo-primario)] to-[var(--fondo-secundario)] bg-clip-text text-transparent"
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false, amount: 0.2}} // Changed once to false, added amount
                        transition={{duration: 0.6, ease: "easeOut"}}
                    >
                        Nuestro Catálogo
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl text-[var(--texto-subtitulo)] max-w-2xl mx-auto"
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false, amount: 0.2}} // Changed once to false, added amount
                        transition={{duration: 0.6, delay: 0.2, ease: "easeOut"}}
                    >
                        Descubre nuestra colección de productos artesanales, diseñados con materiales sostenibles y un
                        enfoque minimalista.
                    </motion.p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--fondo-primario)]"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-10">
                        <p className="text-xl font-semibold">Oops! Algo salió mal.</p>
                        <p>Error: {error}</p>
                        <p>No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.</p>
                    </div>
                ) : carouselItems.length > 0 ? (
                    <>
                        <InfiniteMovingCards
                            items={carouselItems}
                            direction="right"
                            speed="normal"
                            pauseOnHover={true}
                        />
                        <div className="mt-12 text-center">
                            <Link
                                href="/catalog"
                                className="inline-block bg-[var(--fondo-primario)] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[var(--fondo-secundario)] transition-colors duration-300 text-lg shadow-md hover:shadow-lg"
                            >
                                Ver Catálogo Completo
                            </Link>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-[var(--texto-subtitulo)] py-10">
                        No hay productos para mostrar en este momento.
                    </p>
                )}
            </div>
        </section>
    );
}