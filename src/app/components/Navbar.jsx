'use client';

import Link from 'next/link';
import Image from 'next/image';
import {motion} from 'motion/react';
import {useState, useEffect} from 'react';
// For a more robust active link detection, you might prefer usePathname:
// import { usePathname } from 'next/navigation';

export default function Navbar({currentPage = ''}) {
    const [isScrolled, setIsScrolled] = useState(false);
    // const pathname = usePathname(); // Alternative for active link

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const logoPath = "img/logo_wtext_horizontal_white.svg"; // Relative path from public folder
    const texturePath = "img/texture_background.png"; // Relative path for texture

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20); // Consider navbar "scrolled" after 20px
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial scroll position
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClasses = "font-semibold text-sm md:text-base hover:text-gray-200 transition-colors duration-200";
    const activeLinkClasses = "underline underline-offset-4 decoration-[var(--fondo-accent)] decoration-2";

    // Helper to construct full asset paths
    const getAssetPath = (relativePath) => {
        const path = String(relativePath);
        return `${basePath}/${path.startsWith('/') ? path.substring(1) : path}`;
    };

    return (
        <motion.header
            className="sticky top-0 z-50 text-white"
            animate={{
                boxShadow: isScrolled ? '0 4px 10px -2px rgba(0,0,0,0.15)' : 'none', // Subtle shadow when scrolled
                paddingTop: isScrolled ? '0.65rem' : '1rem', // py-2.5 vs py-4
                paddingBottom: isScrolled ? '0.65rem' : '1rem',
            }}
            transition={{duration: 0.3, ease: "easeOut"}}
        >
            {/* Background Layers */}
            <div
                className="absolute inset-0 bg-repeat bg-center " // Very subtle texture
                style={{backgroundImage: `url(${getAssetPath(texturePath)})`}} // MODIFIED for texture
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 bg-gradient-to-r from-[var(--fondo-primario)] to-[var(--fondo-secundario)] opacity-95" // Main color, slightly transparent
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 flex justify-between items-center relative z-10">
                <motion.div
                    whileHover={{scale: 1.03}}
                    transition={{type: 'spring', stiffness: 400, damping: 10}}
                >
                    <Link href="/" className="block"> {/* Added block for better layout control of Image */}
                        <Image
                            src={getAssetPath(logoPath)} // MODIFIED for logo
                            alt="Situ Logo"
                            width={isScrolled ? 135 : 150} // Slightly smaller logo when scrolled
                            height={isScrolled ? 30 : 34} // Adjusted height proportionally for a horizontal logo
                            className="transition-all duration-300 ease-out" // For width/height transition
                            priority // Important for LCP
                        />
                    </Link>
                </motion.div>
                <nav>
                    <ul className="flex space-x-5 md:space-x-7 items-center">
                        <li>
                            <motion.div whileHover={{y: -2}} transition={{type: 'spring', stiffness: 300}}>
                                <Link
                                    href="/"
                                    className={`${navLinkClasses} ${currentPage === 'home' || /*pathname === '/'*/ '' ? activeLinkClasses : ''}`}
                                >
                                    Inicio
                                </Link>
                            </motion.div>
                        </li>
                        <li>
                            <motion.div whileHover={{y: -2}} transition={{type: 'spring', stiffness: 300}}>
                                <Link
                                    href="/catalog"
                                    className={`${navLinkClasses} ${currentPage === 'catalog' || /*pathname === '/catalog'*/ '' ? activeLinkClasses : ''}`}
                                >
                                    Catálogo
                                </Link>
                            </motion.div>
                        </li>
                        {/* You can add more links here following the same pattern */}
                        {/* Example:
            <li>
              <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Link href="/#quienes-somos" className={navLinkClasses}>
                  Quiénes Somos
                </Link>
              </motion.div>
            </li>
            */}
                    </ul>
                </nav>
            </div>
        </motion.header>
    );
}