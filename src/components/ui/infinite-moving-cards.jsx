"use client";

import {cn} from "@/lib/utils";
import React, {useEffect, useState, useRef} from "react";
import {motion, useAnimate} from "motion/react";

export const InfiniteMovingCards = ({
                                        items,
                                        direction = "left",
                                        speed = "fast",
                                        pauseOnHover = true,
                                        className,
                                    }) => {
    const containerRef = useRef(null);
    const [scope, animateMotion] = useAnimate();

    const [isReady, setIsReady] = useState(false);
    const [currentAnimation, setCurrentAnimation] = useState(null);

    useEffect(() => {
        if (scope.current && items && items.length > 0) {
            const scroller = scope.current;
            Array.from(scroller.querySelectorAll('[data-cloned="true"]')).forEach(
                (node) => node.remove()
            );
            const originalNodes = Array.from(scroller.children);
            originalNodes.forEach((itemNode) => {
                const duplicatedItem = itemNode.cloneNode(true);
                if (duplicatedItem.id) {
                    duplicatedItem.removeAttribute("id");
                }
                duplicatedItem.dataset.cloned = "true";
                scroller.appendChild(duplicatedItem);
            });
            setIsReady(true);
        } else {
            if (scope.current) {
                Array.from(scope.current.querySelectorAll('[data-cloned="true"]')).forEach(
                    (node) => node.remove()
                );
            }
            setIsReady(false);
        }
    }, [items, scope]);

    useEffect(() => {
        if (isReady && scope.current && items && items.length > 0) {
            const scroller = scope.current;
            if (scroller.scrollWidth === 0) { /* ... */
            }
            const singleSetWidth = scroller.scrollWidth / 2;
            if (singleSetWidth === 0 || isNaN(singleSetWidth)) {
                if (currentAnimation) {
                    currentAnimation.stop();
                    setCurrentAnimation(null);
                }
                return;
            }
            if (currentAnimation) {
                currentAnimation.stop();
            }
            const getAnimationDuration = (s) => {
                if (s === "fast") return 20;
                if (s === "normal") return 40;
                return 80;
            };
            const initialX = direction === "left" ? 0 : -singleSetWidth;
            const targetX = direction === "left" ? -singleSetWidth : 0;
            animateMotion(scroller, {x: initialX}, {duration: 0});
            const anim = animateMotion(
                scroller,
                {x: [initialX, targetX]},
                {
                    duration: getAnimationDuration(speed),
                    ease: "linear",
                    repeat: Infinity,
                }
            );
            setCurrentAnimation(anim);
            return () => anim.stop();
        } else if (currentAnimation) {
            currentAnimation.stop();
            setCurrentAnimation(null);
        }
    }, [isReady, items, direction, speed, scope, animateMotion]);

    const handleMouseEnter = () => {
        if (pauseOnHover && currentAnimation) currentAnimation.pause();
    };
    const handleMouseLeave = () => {
        if (pauseOnHover && currentAnimation) currentAnimation.play();
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.ul
                ref={scope}
                className={cn(
                    "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        key={item.name && typeof item.name === 'string' ? `${item.name}-${idx}` : `item-${idx}-${item.imageSrc}`} // Added imageSrc for more robust key
                        className="relative w-[300px] h-80 md:w-[380px] md:h-96 shrink-0 overflow-hidden rounded-2xl shadow-lg" // Adjusted size and added shadow
                        style={{
                            backgroundImage: `url(${item.imageSrc || '/data/products/img/placeholder.png'})`, // Fallback image
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Gradient Overlay */}
                        <div
                            className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
                            aria-hidden="true"
                        />

                        {/* Content Wrapper */}
                        <div className="relative z-20 flex h-full flex-col justify-end p-6 text-white">
                            {item.name && (
                                <h3 className="text-xl font-semibold leading-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.5)]">
                                    {item.name}
                                </h3>
                            )}
                            {item.title && ( // Conditionally render title if it exists
                                <p className="mt-1 text-sm text-gray-200 [text-shadow:_0_1px_2px_rgb(0_0_0_/_0.4)]">
                                    {item.title}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </motion.ul>
        </div>
    );
};