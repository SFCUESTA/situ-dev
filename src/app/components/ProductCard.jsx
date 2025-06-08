'use client';

import {useState, useEffect} from 'react';
import {motion} from "motion/react";
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/solid'; // Using Heroicons for arrows

export default function ProductCard({product}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isImageAreaHovered, setIsImageAreaHovered] = useState(false); // For showing controls

    // Fallback for product data if it's not fully loaded or malformed
    if (!product || !product.nombre) {
        return <div className="h-[28rem] bg-gray-100 rounded-lg shadow-md animate-pulse"></div>;
    }

    const {nombre, descripcion, fotos = [], colores = []} = product;
    const hasMultipleImages = fotos && fotos.length > 1;

    // Auto-cycle through images when hovered over the image area (isHovered)
    useEffect(() => {
        if (!isHovered || !hasMultipleImages || !isImageAreaHovered) { // Only auto-cycle if image area is hovered
            // If not hovering image area, but multiple images exist, keep current index
            // If no multiple images, reset to 0
            if (!hasMultipleImages) setCurrentImageIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === (fotos.length - 1) ? 0 : prevIndex + 1
            );
        }, 2500); // Change image every 2.5 seconds for auto-cycle

        return () => clearInterval(interval);
    }, [isHovered, hasMultipleImages, fotos.length, isImageAreaHovered]);


    const goToPreviousImage = (e) => {
        e.stopPropagation(); // Prevent card hover effects if clicking button
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? fotos.length - 1 : prevIndex - 1
        );
    };

    const goToNextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) =>
            prevIndex === fotos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };


    return (
        <motion.div
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-[28rem]"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            onMouseEnter={() => setIsHovered(true)} // General card hover
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div
                className="relative h-64 w-full overflow-hidden bg-slate-50"
                onMouseEnter={() => {
                    if (hasMultipleImages) setIsImageAreaHovered(true);
                }}
                onMouseLeave={() => {
                    if (hasMultipleImages) setIsImageAreaHovered(false);
                }}
            >
                {fotos.length > 0 ? (
                    fotos.map((foto, index) => (
                        <motion.img
                            key={foto || `product-image-${index}-${product.id}`}
                            src={foto}
                            alt={`${nombre} - imagen ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{opacity: 0}}
                            animate={{opacity: index === currentImageIndex ? 1 : 0}}
                            transition={{duration: 0.3}}
                        />
                    ))
                ) : (
                    <div
                        className="absolute inset-0 w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth="1">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                    </div>
                )}

                {/* Image Navigation Controls */}
                {hasMultipleImages && isImageAreaHovered && (
                    <>
                        {/* Previous Button */}
                        <button
                            onClick={goToPreviousImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-opacity duration-200"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="h-5 w-5"/>
                        </button>
                        {/* Next Button */}
                        <button
                            onClick={goToNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-opacity duration-200"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="h-5 w-5"/>
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                {hasMultipleImages && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex space-x-1.5">
                        {fotos.map((_, index) => (
                            <button
                                key={`dot-${index}-${product.id}`}
                                onClick={() => goToImage(index)}
                                className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow overflow-hidden">
                <h3 className="text-[var(--texto-titulo)] text-lg font-semibold mb-2 leading-tight">
                    {nombre}
                </h3>

                <div className="text-sm text-gray-600 mb-3 flex-grow overflow-y-auto">
                    <p>{descripcion}</p>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-200">
                    <p className="text-xs text-gray-500 mb-1.5">Colores disponibles:</p>
                    {colores.length > 0 ? (
                        <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                            {colores.map((item) => (
                                <span
                                    key={`${item.color}-${product.id}`}
                                    className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-full"
                                >
                        <span>{item.color}:</span>
                        <span className="font-semibold ml-1">${item.precio.toFixed(2)}</span>
                      </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500">No hay variaciones de color.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}