'use client';

import {motion} from "motion/react";
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    // Define the paths and animation details for your pattern SVGs.
    const patternConfigs = [
        {
            src: '/img/p1_detail_white.svg',
            size: '200px',
            duration: 75, // Slightly adjusted duration
            animationProps: {
                backgroundPosition: ['0% 0%', '200px 200px'], // Scrolls diagonally
                rotate: [0, 4], // Gentle clockwise rotation
                scale: [1, 1], // No scaling for this one
            }
        },
        {
            src: '/img/p2_detail_white.svg',
            size: '250px',
            duration: 90, // Slightly adjusted duration
            animationProps: {
                backgroundPosition: ['0% 0%', '-250px 250px'], // Scrolls in another direction
                rotate: [0, -5], // Gentle counter-clockwise rotation
                scale: [1, 1.015, 1], // Subtle pulse effect
            }
        },
        {
            src: '/img/p3_detail_white.svg',
            size: '180px',
            duration: 100, // Slightly adjusted duration
            animationProps: {
                backgroundPosition: ['0% 0%', '180px -180px'], // Different diagonal scroll
                rotate: [0, 3], // Slower clockwise rotation
                scale: [1, 1], // No scaling
            }
        },
        {
            src: '/img/p4_detail_white.svg',
            size: '220px',
            duration: 110, // Slightly adjusted duration
            animationProps: {
                backgroundPosition: ['0% 0%', '-220px -220px'], // Yet another scroll direction
                rotate: [0, -3.5], // Slower counter-clockwise rotation
                scale: [1, 1.01, 1], // Another subtle pulse, slightly different
            }
        },
    ];

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Gradient background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-[var(--fondo-primario)] to-[var(--fondo-secundario)]"
                aria-hidden="true"
            />

            {/* Animated Tiled SVG Background Layers */}
            {patternConfigs.map((pattern, index) => (
                <motion.div
                    key={`pattern-${index}`}
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `url(${pattern.src})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: pattern.size,
                    }}
                    animate={pattern.animationProps}
                    transition={{
                        duration: pattern.duration,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'loop',
                    }}
                    aria-hidden="true"
                />
            ))}

            {/* Content container */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Text content */}
                    <div className="md:w-1/2 text-white">
                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}} // Changed from animate
                            viewport={{once: false, amount: 0.3}} // Added viewport
                            transition={{duration: 0.7}}
                        >
                            Diseño Orgánico y Minimalista
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl mb-8 max-w-lg"
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}} // Changed from animate
                            viewport={{once: false, amount: 0.3}} // Added viewport
                            transition={{duration: 0.7, delay: 0.2}}
                        >
                            Productos artesanales con materiales sostenibles, diseñados para integrarse perfectamente en
                            tu espacio.
                        </motion.p>

                        <Link href="/catalog">
                            <motion.button
                                className="bg-white text-[var(--texto-titulo)] px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors"
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}} // Changed from animate
                                viewport={{once: false, amount: 0.3}} // Added viewport
                                transition={{duration: 0.7, delay: 0.4}}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                Ver Catálogo
                            </motion.button>
                        </Link>
                    </div>

                    {/* Animated SVG Logo */}
                    <div className="md:w-1/2 flex justify-center">
                        <motion.div
                            initial={{opacity: 0, scale: 0.8, rotate: -5}}
                            whileInView={{opacity: 1, scale: 1, rotate: 0}} // Changed from animate
                            viewport={{once: false, amount: 0.3}} // Added viewport
                            transition={{duration: 0.8, delay: 0.3}}
                            whileHover={{scale: 1.05, rotate: 5}}
                        >
                            <Image
                                src="/img/logo_no_text_white.svg"
                                alt="Situ Logo"
                                width={400}
                                height={400}
                                className="w-full max-w-md"
                                priority
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Decorative wave at the bottom */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-16 bg-white"
                style={{
                    clipPath: 'path("M0,20% C12.5%,0% 25%,0% 37.5%,20% S62.5%,40% 75%,20% S87.5%,0% 100%,20% L100%,100% L0,100% Z")'
                }}
                initial={{opacity: 0}}
                whileInView={{opacity: 0.1}} // Changed from animate
                viewport={{once: false, amount: 0.1}} // Added viewport, amount 0.1 for early trigger
                transition={{duration: 1, delay: 0.5}}
                aria-hidden="true"
            />
        </section>
    );
}