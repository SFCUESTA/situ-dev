import Hero from "./components/Hero";
import Footer from "./components/Footer";
import QuienesSomos from "./components/QuienesSomos";
import ProyectosArquitectonicos from "./components/ProyectosArquitectonicos";
import Catalog from "./components/Catalog";
import Navbar from "./components/Navbar"; // Import the new Navbar

export default function Home() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    return (
        <main
            className="min-h-screen bg-fixed bg-center  bg-repeat-round"
            style={{backgroundImage: `url(${basePath}/img/texture_background.png)`}}
        >
            <Navbar currentPage="home"/> {/* Use the new Navbar and pass the current page identifier */}
            <Hero/>
            <QuienesSomos/>
            <Catalog/>
            <ProyectosArquitectonicos/>
            <Footer/>
        </main>
    );
}