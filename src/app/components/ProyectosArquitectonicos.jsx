'use client';

import {useState, useEffect} from 'react';
import {motion} from "motion/react";
import {Carousel, Card} from '@/components/ui/apple-cards-carousel';

export default function ProyectosArquitectonicos() {
    const [carouselItems, setCarouselItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`${basePath}/data/projects/proyectos.json`) // MODIFIED
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error('Fetched data is not an array:', data);
                    throw new Error('Project data is not in the expected format.');
                }

                const items = data.map((proyecto, index) => {
                    // Assuming proyecto.imagen is a string like "projects/image.jpg"
                    // and does not start with "/"
                    const imagePath = String(proyecto.imagen || 'default-project-image.png'); // Fallback image
                    return (
                        <Card
                            key={proyecto.id || index} // Ensure key is always unique
                            index={index}
                            layout={true}
                            card={{
                                id: proyecto.id,
                                title: proyecto.nombre,
                                category: proyecto.ubicacion,
                                year: proyecto.año,
                                description: proyecto.descripcion,
                                src: `${basePath}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`, // MODIFIED
                                content: (
                                    <>
                                        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg mb-6">
                                            {proyecto.descripcion}
                                        </p>
                                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                            <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Detalles
                                                del Proyecto:</h4>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                <strong>Año:</strong> {proyecto.año}
                                            </p>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                                <strong>Ubicación:</strong> {proyecto.ubicacion}
                                            </p>
                                        </div>
                                    </>
                                ),
                            }}
                        />
                    );
                });
                setCarouselItems(items);
            })
            .catch(fetchError => {
                console.error('Error loading projects:', fetchError);
                setError(fetchError.message || 'Failed to load projects.');
                setCarouselItems([]); // Ensure items is an empty array on error
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [basePath]); // Added basePath to dependency array

    return (
        <section className="py-16 bg-white/90" id="proyectos">
            <div className="container mx-auto px-4">
                <div className="text-center mb-3">
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-[var(--fondo-primario)] to-[var(--fondo-secundario)] bg-clip-text text-transparent"
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false, amount: 0.2}}
                        transition={{duration: 0.6, ease: "easeOut"}}
                    >
                        Proyectos Arquitectónicos
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl text-[var(--texto-subtitulo)] max-w-2xl mx-auto"
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false, amount: 0.2}}
                        transition={{duration: 0.6, delay: 0.2, ease: "easeOut"}}
                    >
                        Descubre nuestros proyectos destacados
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
                        <p>No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde.</p>
                    </div>
                ) : carouselItems.length > 0 ? (
                    <Carousel items={carouselItems} initialScroll={0}/>
                ) : (
                    <p className="text-center text-[var(--texto-subtitulo)] py-10">
                        No hay proyectos para mostrar en este momento.
                    </p>
                )}
            </div>
        </section>
    );
}