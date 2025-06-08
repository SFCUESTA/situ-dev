import Hero from "./components/Hero";
import Footer from "./components/Footer";
import QuienesSomos from "./components/QuienesSomos";
import ProyectosArquitectonicos from "./components/ProyectosArquitectonicos";
import Catalog from "./components/Catalog";
import Navbar from "./components/Navbar"; // Import the new Navbar

export default function Home() {
    return (
        <main
            className="min-h-screen bg-[url('/img/texture_background.png')] bg-fixed bg-center  bg-repeat-round"
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