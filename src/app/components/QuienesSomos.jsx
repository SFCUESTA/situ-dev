'use client';

import {motion} from "motion/react"; // Correct import for Motion One's React components

export default function QuienesSomos() {
    const cardVariants = {
        offscreen: {
            opacity: 0,
            y: 30,
            scale: 0.95,
        },
        onscreen: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring", // Using a spring animation for a more natural feel
                bounce: 0.4,
                duration: 0.8,
            },
        },
    };

    const listItemVariants = {
        offscreen: {
            opacity: 0,
            x: -20,
        },
        onscreen: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                bounce: 0.3,
                duration: 0.6,
            },
        },
    };

    return (
        <section className="py-20 md:py-28 bg-white/90" id="quienes-somos"> {/* Increased padding */}
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 md:mb-20"> {/* Increased margin bottom */}
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-[var(--fondo-primario)] to-[var(--fondo-secundario)] bg-clip-text text-transparent"
                        initial={{opacity: 0, y: 30}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false, amount: 0.2}} // Changed once to false, added amount
                        transition={{duration: 0.6, ease: "easeOut"}}
                    >
                        Quiénes Somos
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl text-[var(--texto-subtitulo)] max-w-2xl mx-auto"
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: false, amount: 0.2}} // Changed once to false, added amount
                        transition={{duration: 0.6, delay: 0.2, ease: "easeOut"}}
                    >
                        Conoce nuestra historia y filosofía de diseño
                    </motion.p>
                </div>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"> {/* Increased gap, items-start */}
                    <motion.div
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{once: false, amount: 0.3}} // Changed once to false
                        variants={cardVariants}
                        className="bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 rounded-2xl shadow-xl border border-slate-200/80" // Softer gradient, larger radius, distinct shadow
                    >
                        <h3 className="text-2xl md:text-3xl font-semibold mb-5 text-[var(--texto-titulo)]">Nuestra
                            Misión</h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            En Situ, nos dedicamos a crear productos que armonizan con el entorno natural y el espacio
                            habitado.
                            Nuestra misión es diseñar piezas que no solo sean funcionales, sino que también aporten
                            belleza y
                            tranquilidad a los espacios donde habitan nuestros clientes.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Trabajamos con materiales sostenibles y procesos respetuosos con el medio ambiente,
                            buscando siempre el equilibrio entre la estética, la funcionalidad y la responsabilidad
                            ecológica.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{once: false, amount: 0.3}} // Changed once to false
                        variants={{ // Custom transition for this card to add a slight delay
                            ...cardVariants,
                            onscreen: {
                                ...cardVariants.onscreen,
                                transition: {...cardVariants.onscreen.transition, delay: 0.2}
                            }
                        }}
                        className="bg-gradient-to-tl from-[var(--fondo-primario)]/5 via-white to-[var(--fondo-primario)]/10 p-8 rounded-2xl shadow-xl border border-[var(--fondo-primario)]/20" // Themed subtle gradient
                    >
                        <h3 className="text-2xl md:text-3xl font-semibold mb-5 text-[var(--texto-titulo)]">Nuestros
                            Valores</h3>
                        <ul className="space-y-5">
                            {[
                                {
                                    title: "Sostenibilidad",
                                    text: "Utilizamos materiales ecológicos y procesos que minimizan el impacto ambiental."
                                },
                                {
                                    title: "Artesanía",
                                    text: "Valoramos el trabajo manual y las técnicas tradicionales que aportan carácter único a cada pieza."
                                },
                                {
                                    title: "Minimalismo",
                                    text: "Creemos en la belleza de lo esencial, eliminando lo superfluo para destacar lo importante."
                                },
                                {
                                    title: "Integración",
                                    text: "Diseñamos productos que se integran armoniosamente en cualquier espacio."
                                },
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-start"
                                    initial="offscreen"
                                    whileInView="onscreen"
                                    viewport={{once: false, amount: 0.5}} // Changed once to false
                                    variants={listItemVariants}
                                    custom={index} // Can be used in variants if needed, e.g. for stagger
                                    transition={{
                                        delay: 0.4 + index * 0.15,
                                        type: "spring",
                                        bounce: 0.3,
                                        duration: 0.6
                                    }} // Staggered delay
                                >
                                    <span
                                        className="text-2xl text-[var(--fondo-primario)] mr-3 mt-0.5 leading-none flex-shrink-0">•</span>
                                    <p className="text-gray-700 leading-relaxed">
                                        <span
                                            className="font-semibold text-[var(--texto-titulo)]">{item.title}:</span> {item.text}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}