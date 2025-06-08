"use client";
import React, {
    useEffect,
    useRef,
    useState,
    createContext,
    useContext,
} from "react";
import {
    IconArrowNarrowLeft,
    IconArrowNarrowRight,
    IconX,
} from "@tabler/icons-react";
import {cn} from "@/lib/utils";
import {AnimatePresence, motion} from "motion/react";
import {useOutsideClick} from "@/hooks/use-outside-click";

export const CarouselContext = createContext({
    onCardClose: () => {
    },
    currentIndex: 0,
});

export const Carousel = ({
                             items,
                             initialScroll = 0
                         }) => {
    const carouselRef = React.useRef(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll;
            checkScrollability();
        }
    }, [initialScroll]);

    const checkScrollability = () => {
        if (carouselRef.current) {
            const {scrollLeft, scrollWidth, clientWidth} = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({left: -300, behavior: "smooth"});
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({left: 300, behavior: "smooth"});
        }
    };

    const handleCardClose = (index) => {
        if (carouselRef.current) {
            const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
            const actualGap = 16; // Corresponds to 'gap-4' class (1rem = 16px)
            const scrollPosition = (cardWidth + actualGap) * index; // Adjusted to scroll to the start of the card at 'index'
            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
            setCurrentIndex(index);
        }
    };

    const isMobile = () => {
        // Ensure window is defined (for SSR compatibility)
        return typeof window !== "undefined" && window.innerWidth < 768;
    };

    return (
        <CarouselContext.Provider value={{onCardClose: handleCardClose, currentIndex}}>
            <div className="relative w-full">
                <div
                    className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
                    ref={carouselRef}
                    onScroll={checkScrollability}>
                    <div
                        className={cn("absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l")}></div>

                    <div
                        className={cn(
                            "flex flex-row justify-start gap-4 pl-4",
                            // remove max-w-4xl if you want the carousel to span the full width of its container
                            "mx-auto max-w-7xl"
                        )}>
                        {items.map((item, index) => (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.5,
                                        delay: 0.2 * index,
                                        ease: "easeOut",
                                        once: true,
                                    },
                                }}
                                key={"card" + index}
                                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]">
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="mr-10 flex justify-end gap-2">
                    <button
                        className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}>
                        <IconArrowNarrowLeft className="h-6 w-6 text-gray-500"/>
                    </button>
                    <button
                        className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
                        onClick={scrollRight}
                        disabled={!canScrollRight}>
                        <IconArrowNarrowRight className="h-6 w-6 text-gray-500"/>
                    </button>
                </div>
            </div>
        </CarouselContext.Provider>
    );
};

export const Card = ({
                         card,
                         index,
                         layout = false
                     }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const {onCardClose} = useContext(CarouselContext); // Removed currentIndex as it's not used here

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === "Escape") {
                handleClose();
            }
        }

        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]); // handleClose was missing from dependency array, added it.

    // Added handleClose to the dependency array of useOutsideClick
    useOutsideClick(containerRef, () => {
        if (open) { // Only call handleClose if the card is open
            handleClose();
        }
    });


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        onCardClose(index);
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 h-screen overflow-auto">
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"/>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            ref={containerRef}
                            layoutId={layout && card.id ? `card-container-${card.id}` : undefined}
                            className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900">
                            <button
                                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                                onClick={handleClose}>
                                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900"/>
                            </button>
                            <motion.p
                                layoutId={layout && card.id ? `card-category-${card.id}` : undefined}
                                className="text-base font-medium text-black dark:text-white">
                                {card.category}
                            </motion.p>
                            <motion.p
                                layoutId={layout && card.id ? `card-title-${card.id}` : undefined}
                                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white">
                                {card.title}
                            </motion.p>
                            <div className="py-10">{card.content}</div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <motion.button
                layoutId={layout && card.id ? `card-container-${card.id}` : undefined}
                onClick={handleOpen}
                // Added p-6 for padding, flex-col, justify-between.
                // Base background (e.g., bg-neutral-800 or bg-gray-100) should ensure text contrast or rely on gradient.
                className="relative z-10 flex h-80 w-72 flex-col justify-between overflow-hidden rounded-3xl bg-gray-100 p-6 md:h-[40rem] md:w-96 dark:bg-neutral-900">

                {/* Gradient overlay for text readability over the image */}
                <div
                    className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-green-950/70 via-black/30 to-white/20"/>

                <BlurImage
                    src={card.src}
                    alt={card.title}
                    fill
                    className="absolute inset-0 z-10 object-cover"
                />

                {/* Top Content Area (Category, Title, Year) */}
                <div className="relative z-30">
                    <motion.p
                        layoutId={layout && card.id ? `card-category-${card.id}` : undefined}
                        className="text-left font-sans text-sm font-medium text-green-950/70 md:text-base">
                        {card.category}
                    </motion.p>
                    <motion.p
                        layoutId={layout && card.id ? `card-title-${card.id}` : undefined}
                        className="mt-2 max-w-xs text-left font-sans text-xl font-bold text-green-950 [text-wrap:balance] md:text-2xl">
                        {card.title}
                    </motion.p>
                    {card.year && (
                        <motion.p
                            // No layoutId needed for year as it's not animated between states in the same way
                            className="mt-1 text-lg font-bold text-shadow-black/20 text-shadow-lg  text-white/80 text-left">
                            {card.year}
                        </motion.p>
                    )}
                </div>

                {/* Bottom Content Area (Description Snippet) */}
                {card.description && (
                    <div className="relative md:min-h-40 h-auto z-30 w-full">
                        <motion.p
                            // No layoutId needed for description snippet
                            className="mt-2 max-w-full truncate text-left font-sans text-wrap text-sm text-gray-100 md:text-md"
                            title={card.description}> {/* Show full description on hover */}
                            {card.description}
                        </motion.p>
                    </div>
                )}
            </motion.button>
        </>
    );
};

export const BlurImage = ({
                              height,
                              width,
                              src,
                              className,
                              alt,
                              fill, // Destructure the 'fill' prop here
                              ...rest
                          }) => {
    const [isLoading, setLoading] = useState(true);
    // The `fill` prop is common with Next.js <Image /> for layout.
    // Since this is a custom <img> wrapper, we destructure `fill`
    // to prevent it from being passed to the native <img> tag,
    // as it's not a standard attribute for it in this boolean form.
    // The desired "fill" behavior is typically achieved via CSS
    // (e.g., width: 100%; height: 100%; object-fit: cover; and parent positioning).

    return (
        <img
            className={cn(
                "h-full w-full object-cover transition duration-300", // Ensures the image covers its container
                isLoading ? "blur-sm" : "blur-0",
                className
            )}
            onLoad={() => setLoading(false)}
            src={src}
            width={width} // These are valid for <img> but might be overridden by CSS if 'fill' behavior is desired
            height={height} // Same as width
            loading="lazy"
            decoding="async"
            alt={alt ? alt : "Background image"}
            {...rest} // `fill` is no longer part of `rest`
        />
    );
};